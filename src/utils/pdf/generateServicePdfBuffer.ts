import jsPDF from 'jspdf';
import dayjs from '@/lib/dayjs';
import { formatPatente } from '@/utils/patente';
import { supabase } from '@/lib/supabase/client';

interface ServicioCompleto {
  servicio: {
    id: number;
    fechaservicio: string | null;
    kmservicio: number | null;
    comentario: string | null;
  };
  cliente: {
    apellidos: string;
    nombres: string;
    telefono: number | null;
    email: string | null;
  } | null;
  vehiculo: {
    patente: string;
    modelo: string | null;
    kmactual: number | null;
    marcas: {
      descripcion: string;
    } | null;
  } | null;
  detalles: Array<{
    idtiposervicio: number | null;
    proximoenkm: number | null;
    comentario: string | null;
    idestado: number | null;
    tiposservicio: {
      nombre: string;
      referencia: string | null;
      categoriasservicio: {
        nombre: string;
        orden: number;
      } | null;
    } | null;
    estados: {
      descripcion: string;
    } | null;
  }>;
}

export async function generateServicePdfBuffer(servicioId: number): Promise<Buffer> {
  // Obtener todos los datos del servicio (misma lógica que generateServicePdf)
  const { data: servicioData, error: servicioError } = await supabase
    .from('servicios')
    .select('id, fechaservicio, kmservicio, comentario, idvehiculo, idcliente')
    .eq('id', servicioId)
    .single();

  if (servicioError || !servicioData) {
    throw new Error('No se pudo obtener el servicio');
  }

  const vehiculoId = (servicioData as { idvehiculo?: number | null }).idvehiculo;
  const clienteId = (servicioData as { idcliente?: number | null }).idcliente;

  // Obtener vehículo y marca
  let vehiculo = null;
  if (vehiculoId) {
    const { data: vehiculoData } = await supabase
      .from('vehiculo')
      .select('id, patente, modelo, kmactual, idmarca')
      .eq('id', vehiculoId)
      .single();

    if (vehiculoData) {
      const marcaId = (vehiculoData as { idmarca?: number | null }).idmarca;
      let marca = null;
      if (marcaId) {
        const { data: marcaData } = await supabase
          .from('marcas')
          .select('id, descripcion')
          .eq('id', marcaId)
          .single();
        marca = marcaData;
      }

      vehiculo = {
        patente: vehiculoData.patente,
        modelo: vehiculoData.modelo,
        kmactual: vehiculoData.kmactual,
        marcas: marca ? { descripcion: marca.descripcion } : null,
      };
    }
  }

  // Obtener cliente
  let cliente = null;
  if (clienteId) {
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('id, apellidos, nombres, telefono, email')
      .eq('id', clienteId)
      .single();
    cliente = clienteData;
  }

  // Obtener detalles del servicio con tipos y categorías
  const { data: detallesData } = await supabase
    .from('detallesservicio')
    .select(
      `
      idtiposervicio,
      proximoenkm,
      comentario,
      idestado,
      tiposservicio (
        nombre,
        referencia,
        categoriasservicio (
          nombre,
          orden
        )
      ),
      estados (
        descripcion
      )
    `
    )
    .eq('idservicio', servicioId);

  const detalles = ((detallesData as unknown[]) ?? []).map((d: unknown) => {
    const detalle = d as {
      idtiposservicio?: number | null;
      proximoenkm?: number | null;
      comentario?: string | null;
      idestado?: number | null;
      tiposservicio?: unknown;
      estados?: unknown;
    };
    
    const idtiposservicioValue: number | null = 
      typeof detalle.idtiposservicio === 'number' ? detalle.idtiposservicio : null;
    let tiposservicio: {
      nombre: string;
      referencia: string | null;
      categoriasservicio: { nombre: string; orden: number } | null;
    } | null = null;
    if (detalle.tiposservicio) {
      if (Array.isArray(detalle.tiposservicio)) {
        tiposservicio = (detalle.tiposservicio[0] as unknown as {
          nombre: string;
          referencia: string | null;
          categoriasservicio: { nombre: string; orden: number } | null;
        }) || null;
      } else {
        tiposservicio = (detalle.tiposservicio as unknown) as typeof tiposservicio;
      }
      
      if (tiposservicio?.categoriasservicio) {
        if (Array.isArray(tiposservicio.categoriasservicio)) {
          tiposservicio.categoriasservicio = tiposservicio.categoriasservicio[0] || null;
        }
        if (tiposservicio.categoriasservicio && typeof tiposservicio.categoriasservicio.orden !== 'number') {
          tiposservicio.categoriasservicio.orden = 0;
        }
      }
    }

    let estados: { descripcion: string } | null = null;
    if (detalle.estados) {
      if (Array.isArray(detalle.estados)) {
        estados = (detalle.estados[0] as unknown as { descripcion: string }) || null;
      } else {
        estados = (detalle.estados as unknown) as typeof estados;
      }
    }

    return {
      idtiposservicio: idtiposservicioValue,
      proximoenkm: detalle.proximoenkm ?? null,
      comentario: detalle.comentario ?? null,
      idestado: detalle.idestado ?? null,
      tiposservicio: tiposservicio ?? null,
      estados: estados ?? null,
    };
  });

  const servicioCompleto: ServicioCompleto = {
    servicio: {
      id: servicioData.id,
      fechaservicio: servicioData.fechaservicio ?? null,
      kmservicio: servicioData.kmservicio ?? null,
      comentario: servicioData.comentario ?? null,
    },
    cliente,
    vehiculo,
    detalles,
  };

  // Generar PDF (reutilizar la lógica de generateServicePdf pero sin guardar)
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  const colorRed: [number, number, number] = [139, 26, 26];
  const colorBlack: [number, number, number] = [0, 0, 0];
  const colorGray: [number, number, number] = [128, 128, 128];
  const colorGrayDark: [number, number, number] = [150, 150, 150];
  const colorBgPrimary: [number, number, number] = [4, 0, 12];
  const colorBgSecondary: [number, number, number] = [71, 7, 7];

  // Header
  const headerHeight = 35;
  const headerStartY = yPos;
  
  doc.setFillColor(...colorBgPrimary);
  doc.rect(0, 0, pageWidth, headerHeight + 5, 'F');
  
  // Logo - omitido en versión servidor para evitar dependencias de navegador
  // El logo se puede agregar después si se necesita usando una librería como canvas o sharp

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE SERVICIO TÉCNICO', pageWidth / 2, yPos + 16, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const fecha = servicioCompleto.servicio.fechaservicio
    ? dayjs(servicioCompleto.servicio.fechaservicio).format('DD/MM/YYYY')
    : '—';
  doc.text(fecha, pageWidth - margin, yPos + 12, { align: 'right' });
  
  doc.setTextColor(...colorBlack);
  yPos = headerStartY + headerHeight + 8;

  // Información del cliente y vehículo
  const clienteVehiculoStartY = yPos;
  let headerY = clienteVehiculoStartY;
  
  if (servicioCompleto.cliente) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE:', margin, headerY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${servicioCompleto.cliente.apellidos}, ${servicioCompleto.cliente.nombres}`,
      margin + 25,
      headerY
    );
    headerY += 5;
  }

  const vehiculoStartX = pageWidth / 2 + 10;
  let vehiculoY = clienteVehiculoStartY;
  
  if (servicioCompleto.vehiculo) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PATENTE:', vehiculoStartX, vehiculoY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      formatPatente(servicioCompleto.vehiculo.patente),
      vehiculoStartX + 25,
      vehiculoY
    );
    vehiculoY += 8;

    let xPos = margin;
    
    doc.setFont('helvetica', 'bold');
    doc.text('MARCA VEHÍCULO:', xPos, vehiculoY);
    doc.setFont('helvetica', 'normal');
    xPos += 40;
    const marcaText = (servicioCompleto.vehiculo.marcas?.descripcion || '—').substring(0, 15);
    doc.text(marcaText, xPos, vehiculoY);
    xPos += 40;

    doc.setFont('helvetica', 'bold');
    doc.text('MODELO:', xPos, vehiculoY);
    doc.setFont('helvetica', 'normal');
    xPos += 22;
    const modeloText = (servicioCompleto.vehiculo.modelo || '—').substring(0, 15);
    doc.text(modeloText, xPos, vehiculoY);
    xPos += 40;

    doc.setFont('helvetica', 'bold');
    doc.text('KM ACTUAL:', xPos, vehiculoY);
    doc.setFont('helvetica', 'normal');
    xPos += 28;
    const kmActual = servicioCompleto.vehiculo.kmactual
      ? servicioCompleto.vehiculo.kmactual.toLocaleString('es-AR')
      : '—';
    const maxX = pageWidth - margin - 5;
    if (xPos < maxX) {
      doc.text(kmActual.substring(0, 12), xPos, vehiculoY);
    }
    vehiculoY += 5;
  }

  yPos = Math.max(headerY, vehiculoY) + 2;

  doc.setDrawColor(...colorGrayDark);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  doc.setFontSize(9);
  doc.setTextColor(...colorGray);
  doc.text(
    'Por favor, prestá atención a nuestras recomendaciones y recorda realizar los mantenimientos preventivos una vez cumplida la cantidad de kilómetros remarcados en rojo.',
    margin,
    yPos,
    { maxWidth: pageWidth - 2 * margin }
  );
  yPos += 10;
  doc.setTextColor(...colorBlack);

  // Agrupar detalles por categoría
  const detallesPorCategoria = new Map<string, typeof servicioCompleto.detalles>();
  const categoriasConOrden = new Map<string, number>();
  
  servicioCompleto.detalles.forEach((detalle) => {
    const categoriaNombre =
      detalle.tiposservicio?.categoriasservicio?.nombre || 'Sin Categoría';
    const categoriaOrden = detalle.tiposservicio?.categoriasservicio?.orden ?? 9999;
    
    if (!detallesPorCategoria.has(categoriaNombre)) {
      detallesPorCategoria.set(categoriaNombre, []);
      categoriasConOrden.set(categoriaNombre, categoriaOrden);
    }
    detallesPorCategoria.get(categoriaNombre)!.push(detalle);
  });

  const categoriasOrdenadas = Array.from(detallesPorCategoria.entries()).sort((a, b) => {
    const ordenA = categoriasConOrden.get(a[0]) ?? 9999;
    const ordenB = categoriasConOrden.get(b[0]) ?? 9999;
    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }
    return a[0].localeCompare(b[0], 'es');
  });

  const availableWidth = pageWidth - 2 * margin;
  const servicioWidth = availableWidth / 3;
  const proximoEstadoWidth = availableWidth / 3;
  const comentarioWidth = availableWidth - servicioWidth - proximoEstadoWidth;
  
  const colWidths = {
    servicio: servicioWidth,
    comentario: comentarioWidth,
    proximo: proximoEstadoWidth / 2,
    estado: proximoEstadoWidth / 2,
  };
  const startX = margin;

  const drawGradient = (
    x: number,
    y: number,
    width: number,
    height: number,
    colorStart: [number, number, number],
    colorEnd: [number, number, number]
  ) => {
    const steps = 50;
    const stepWidth = width / steps;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(colorStart[0] + (colorEnd[0] - colorStart[0]) * ratio);
      const g = Math.round(colorStart[1] + (colorEnd[1] - colorStart[1]) * ratio);
      const b = Math.round(colorStart[2] + (colorEnd[2] - colorStart[2]) * ratio);
      
      doc.setFillColor(r, g, b);
      doc.rect(x + i * stepWidth, y, stepWidth, height, 'F');
    }
  };

  doc.setFont('helvetica', 'normal');
  categoriasOrdenadas.forEach(([categoriaNombre, detalles]) => {
    const tieneProximo = detalles.some(d => d.proximoenkm !== null);
    
    const espacioNecesario = 20;
    if (yPos + espacioNecesario > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }
    
    if (categoriasOrdenadas.length > 1) {
      const categoriaX = margin - 2;
      const categoriaY = yPos - 4;
      const categoriaWidth = pageWidth - 2 * margin + 4;
      const categoriaHeight = 6;
      
      drawGradient(
        categoriaX,
        categoriaY,
        categoriaWidth,
        categoriaHeight,
        colorBgSecondary,
        colorBgPrimary
      );
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      
      let headerX = margin;
      doc.text(categoriaNombre.toUpperCase(), headerX, yPos);
      headerX += colWidths.servicio;
      
      doc.text('COMENTARIO', headerX, yPos);
      headerX += colWidths.comentario;
      
      if (tieneProximo) {
        const proximoHeaderX = startX + colWidths.servicio + colWidths.comentario + (colWidths.proximo / 2);
        doc.text('PRÓXIMO', proximoHeaderX, yPos, { align: 'center' });
      }
      
      const estadoHeaderRightX = pageWidth - margin;
      doc.text('ESTADO', estadoHeaderRightX, yPos, { align: 'right' });
      
      doc.setTextColor(...colorBlack);
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
    } else {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      let headerX = margin;
      
      headerX += colWidths.servicio;
      
      doc.text('COMENTARIO', headerX, yPos);
      headerX += colWidths.comentario;
      
      if (tieneProximo) {
        const proximoHeaderX = startX + colWidths.servicio + colWidths.comentario + (colWidths.proximo / 2);
        doc.text('PRÓXIMO', proximoHeaderX, yPos, { align: 'center' });
      }
      
      const estadoHeaderRightX = pageWidth - margin;
      doc.text('ESTADO', estadoHeaderRightX, yPos, { align: 'right' });
      
      yPos += 6;
      doc.setFont('helvetica', 'normal');
    }

    detalles.forEach((detalle) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      const nombreServicio = detalle.tiposservicio?.nombre || '—';
      const referencia = detalle.tiposservicio?.referencia || null;
      const proximo = detalle.proximoenkm
        ? detalle.proximoenkm.toLocaleString('es-AR')
        : null;
      const comentario = detalle.comentario || null;
      const estado = detalle.estados?.descripcion || '—';

      let xPos = startX;
      doc.setFontSize(7.5);
      doc.setTextColor(...colorBlack);
      
      let servicioTexto = nombreServicio;
      if (referencia && referencia.trim()) {
        let referenciaLimpia = referencia.trim();
        if (referenciaLimpia.startsWith('(') && referenciaLimpia.endsWith(')')) {
          referenciaLimpia = referenciaLimpia.slice(1, -1).trim();
        }
        servicioTexto += ` (${referenciaLimpia})`;
      }
      const lines = doc.splitTextToSize(servicioTexto, colWidths.servicio - 2);
      const numLines = lines.length;
      const lineHeight = 3.5;
      
      lines.forEach((line: string, index: number) => {
        doc.text(line, xPos, yPos + (index * lineHeight), { align: 'left' });
      });
      
      xPos += colWidths.servicio;
      
      let comentarioLines: string[] = [''];
      if (comentario && comentario.trim()) {
        comentarioLines = doc.splitTextToSize(comentario.trim(), colWidths.comentario - 2);
        comentarioLines.forEach((line: string, index: number) => {
          doc.text(line, xPos, yPos + (index * lineHeight), {
            align: 'left',
            maxWidth: colWidths.comentario - 2,
          });
        });
      }
      xPos += colWidths.comentario;
      
      if (tieneProximo) {
        const proximoCenterX = startX + colWidths.servicio + colWidths.comentario + (colWidths.proximo / 2);
        if (proximo) {
          doc.setTextColor(...colorRed);
          const proximoText = proximo.length > 12 ? proximo.substring(0, 12) : proximo;
          doc.text(proximoText, proximoCenterX, yPos, {
            align: 'center',
            maxWidth: colWidths.proximo - 2,
          });
          doc.setTextColor(...colorBlack);
        }
        xPos += colWidths.proximo;
      } else {
        xPos += colWidths.proximo;
      }
      
      const estadoRightX = pageWidth - margin;
      const estadoLower = estado.toLowerCase();
      if (estadoLower.includes('ok')) {
        doc.setTextColor(76, 175, 80);
      } else if (estadoLower.includes('regular')) {
        doc.setTextColor(255, 193, 7);
      } else if (estadoLower.includes('malo')) {
        doc.setTextColor(244, 67, 54);
      } else {
        doc.setTextColor(...colorBlack);
      }
      doc.text(estado.substring(0, 20), estadoRightX, yPos, {
        align: 'right',
        maxWidth: colWidths.estado - 2,
      });
      doc.setTextColor(...colorBlack);

      const maxLinesInRow = Math.max(numLines, comentarioLines.length);
      const rowHeight = maxLinesInRow > 1 ? 5 + ((maxLinesInRow - 1) * lineHeight) : 5;
      
      const alturaRealContenido = maxLinesInRow * 0.5;
      
      const lineaY = yPos + alturaRealContenido + 0.5;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(margin, lineaY, pageWidth - margin, lineaY);
      
      yPos += rowHeight;
    });
  });

  if (servicioCompleto.servicio.comentario) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 8;
    
    const observacionesX = margin - 2;
    const observacionesY = yPos - 4;
    const observacionesWidth = pageWidth - 2 * margin + 4;
    const observacionesHeight = 6;
    
    drawGradient(
      observacionesX,
      observacionesY,
      observacionesWidth,
      observacionesHeight,
      colorBgSecondary,
      colorBgPrimary
    );
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('OBSERVACIONES', margin, yPos);
    doc.setTextColor(...colorBlack);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(servicioCompleto.servicio.comentario, margin, yPos, {
      maxWidth: pageWidth - 2 * margin,
    });
    yPos += 10;
  }

  // Footer
  const footerHeight = 20;
  const footerY = pageHeight - footerHeight;
  const footerX = 0;
  const footerWidth = pageWidth;
  
  drawGradient(
    footerX,
    footerY,
    footerWidth,
    footerHeight,
    colorBgSecondary,
    colorBgPrimary
  );
  
  // Footer text sin icono (versión servidor)
  try {
    const iconX = margin;
    const iconY = footerY + (footerHeight - 7) / 2;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('RIDER.BROSS', iconX, iconY + 3);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('WWW.RIDERBROSS.COM', pageWidth - margin, iconY + 3, { align: 'right' });
  } catch (error) {
    console.warn('Error al agregar footer:', error);
  }

  // Retornar como Buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

