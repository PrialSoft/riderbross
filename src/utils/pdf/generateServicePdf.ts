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
    tiposservicio: {
      nombre: string;
      categoriasservicio: {
        nombre: string;
        orden: number;
      } | null;
    } | null;
  }>;
}

export async function generateServicePdf(servicioId: number): Promise<void> {
  // Obtener todos los datos del servicio
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
      tiposservicio (
        nombre,
        categoriasservicio (
          nombre,
          orden
        )
      )
    `
    )
    .eq('idservicio', servicioId);

  const detalles = ((detallesData as unknown[]) ?? []).map((d: unknown) => {
    const detalle = d as {
      idtiposservicio?: number | null;
      proximoenkm?: number | null;
      comentario?: string | null;
      tiposservicio?: unknown;
    };
    
    // Asegurar que idtiposservicio sea number | null
    const idtiposservicioValue: number | null = 
      typeof detalle.idtiposservicio === 'number' ? detalle.idtiposservicio : null;
    let tiposservicio: {
      nombre: string;
      categoriasservicio: { nombre: string; orden: number } | null;
    } | null = null;
    if (detalle.tiposservicio) {
      if (Array.isArray(detalle.tiposservicio)) {
        tiposservicio = (detalle.tiposservicio[0] as unknown as {
          nombre: string;
          categoriasservicio: { nombre: string; orden: number } | null;
        }) || null;
      } else {
        tiposservicio = (detalle.tiposservicio as unknown) as typeof tiposservicio;
      }
      
      // Normalizar categoriasservicio dentro de tiposservicio
      if (tiposservicio?.categoriasservicio) {
        if (Array.isArray(tiposservicio.categoriasservicio)) {
          tiposservicio.categoriasservicio = tiposservicio.categoriasservicio[0] || null;
        }
        // Asegurar que orden tenga un valor por defecto
        if (tiposservicio.categoriasservicio && typeof tiposservicio.categoriasservicio.orden !== 'number') {
          tiposservicio.categoriasservicio.orden = 0;
        }
      }
    }

    return {
      idtiposervicio: idtiposservicioValue,
      proximoenkm: detalle.proximoenkm ?? null,
      comentario: detalle.comentario ?? null,
      tiposservicio: tiposservicio ?? null,
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

  // Generar PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  // Colores
  const colorRed: [number, number, number] = [139, 26, 26];
  const colorBlack: [number, number, number] = [0, 0, 0];
  const colorGray: [number, number, number] = [128, 128, 128];
  const colorGrayDark: [number, number, number] = [150, 150, 150]; // Gris oscuro para border bottom de categorías
  const colorBgPrimary: [number, number, number] = [4, 0, 12]; // #04000C --bg-primary
  const colorBgSecondary: [number, number, number] = [71, 7, 7]; // #470707 --bg-secondary

  // Header con fondo y borde
  const headerHeight = 35;
  const headerStartY = yPos;
  
  // Fondo del header (desde arriba de todo)
  doc.setFillColor(...colorBgPrimary);
  doc.rect(0, 0, pageWidth, headerHeight + 5, 'F');
  
  // Cargar y agregar logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/images/Logo.png';
    
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => {
        console.warn('No se pudo cargar el logo, continuando sin él');
        resolve();
      };
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const logoWidth = 30;
      const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;
      doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
    }
  } catch (error) {
    console.warn('Error al cargar el logo:', error);
  }

  // Título centrado (en blanco sobre fondo oscuro)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE SERVICIO TÉCNICO', pageWidth / 2, yPos + 12, { align: 'center' });
  
  // Fecha a la derecha (en blanco sobre fondo oscuro)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const fecha = servicioCompleto.servicio.fechaservicio
    ? dayjs(servicioCompleto.servicio.fechaservicio).format('DD/MM/YYYY')
    : '—';
  doc.text(fecha, pageWidth - margin, yPos + 12, { align: 'right' });
  
  // Restaurar color de texto y avanzar posición
  doc.setTextColor(...colorBlack);
  yPos = headerStartY + headerHeight + 8; // Separar más la sección de datos del cliente

  // Información del cliente y vehículo en la cabecera
  const clienteVehiculoStartY = yPos;
  let headerY = clienteVehiculoStartY;
  
  // Columna izquierda: Cliente
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

  // Columna derecha: Vehículo
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
    vehiculoY += 5;

    // Marca, Modelo y KM Actual en una sola línea (ajustado para no salir de márgenes)
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
    // Asegurar que no salga del margen derecho
    const maxX = pageWidth - margin - 5;
    if (xPos < maxX) {
      doc.text(kmActual.substring(0, 12), xPos, vehiculoY);
    }
    vehiculoY += 5;
  }

  // Actualizar yPos al final de la cabecera (la mayor altura entre cliente y vehículo)
  yPos = Math.max(headerY, vehiculoY) + 5;

  // Nota general
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
  const categoriasConOrden = new Map<string, number>(); // Para almacenar el orden de cada categoría
  
  servicioCompleto.detalles.forEach((detalle) => {
    const categoriaNombre =
      detalle.tiposservicio?.categoriasservicio?.nombre || 'Sin Categoría';
    const categoriaOrden = detalle.tiposservicio?.categoriasservicio?.orden ?? 9999; // Sin categoría al final
    
    if (!detallesPorCategoria.has(categoriaNombre)) {
      detallesPorCategoria.set(categoriaNombre, []);
      categoriasConOrden.set(categoriaNombre, categoriaOrden);
    }
    detallesPorCategoria.get(categoriaNombre)!.push(detalle);
  });

  // Ordenar las categorías por el campo orden
  const categoriasOrdenadas = Array.from(detallesPorCategoria.entries()).sort((a, b) => {
    const ordenA = categoriasConOrden.get(a[0]) ?? 9999;
    const ordenB = categoriasConOrden.get(b[0]) ?? 9999;
    if (ordenA !== ordenB) {
      return ordenA - ordenB;
    }
    // Si tienen el mismo orden, ordenar por nombre
    return a[0].localeCompare(b[0], 'es');
  });

  // Borde separador antes de SERVICIOS APLICADOS
  doc.setDrawColor(...colorGrayDark);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // Borde separador antes de SERVICIOS APLICADOS
  doc.setDrawColor(...colorGrayDark);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // Tabla de servicios aplicados
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIOS APLICADOS', margin, yPos);
  yPos += 6;

  // Encabezados de tabla
  const colWidths = {
    servicio: 75,
    adm: 12,
    esc: 12,
    luz: 12,
    proximo: 28,
    comentario: 45,
  };
  const startX = margin;
  let xPos = startX;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIOS APLICADOS', xPos, yPos);
  xPos += colWidths.servicio;
  doc.text('ADM', xPos, yPos);
  xPos += colWidths.adm;
  doc.text('ESC', xPos, yPos);
  xPos += colWidths.esc;
  doc.text('LUZ', xPos, yPos);
  xPos += colWidths.luz;
  doc.text('PRÓXIMO', xPos, yPos);
  xPos += colWidths.proximo;
  doc.text('COMENTARIO', xPos, yPos);
  yPos += 5;

  // Línea separadora
  doc.setDrawColor(...colorBlack);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 3;

  // Función para dibujar gradiente horizontal
  const drawGradient = (
    x: number,
    y: number,
    width: number,
    height: number,
    colorStart: [number, number, number],
    colorEnd: [number, number, number]
  ) => {
    const steps = 50; // Número de pasos para el gradiente
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

  // Filas de servicios
  doc.setFont('helvetica', 'normal');
  categoriasOrdenadas.forEach(([categoriaNombre, detalles]) => {
    // Título de categoría con gradiente de fondo
    if (categoriasOrdenadas.length > 1) {
      // Gradiente de --bg-secondary (izquierda) a --bg-primary (derecha)
      const categoriaX = margin - 2;
      const categoriaY = yPos - 4;
      const categoriaWidth = pageWidth - 2 * margin + 4;
      const categoriaHeight = 6;
      
      drawGradient(
        categoriaX,
        categoriaY,
        categoriaWidth,
        categoriaHeight,
        colorBgSecondary, // Izquierda: --bg-secondary (#470707)
        colorBgPrimary    // Derecha: --bg-primary (#04000C)
      );
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255); // Texto blanco sobre fondo con gradiente
      doc.text(categoriaNombre.toUpperCase(), margin, yPos);
      doc.setTextColor(...colorBlack); // Restaurar color negro
      
      // Border bottom oscuro
      const categoriaBorderY = yPos + 2;
      doc.setDrawColor(...colorGrayDark);
      doc.setLineWidth(0.8);
      doc.line(margin - 2, categoriaBorderY, pageWidth - margin + 2, categoriaBorderY);
      
      yPos += 4;
      doc.setFont('helvetica', 'normal');
    }

    detalles.forEach((detalle) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      const nombreServicio = detalle.tiposservicio?.nombre || '—';
      const proximo = detalle.proximoenkm
        ? detalle.proximoenkm.toLocaleString('es-AR')
        : '—';
      const comentario = detalle.comentario || 'OK';

      xPos = startX;
      doc.setFontSize(7.5);
      // Servicio aplicado
      const lines = doc.splitTextToSize(nombreServicio, colWidths.servicio - 2);
      doc.text(lines[0] || nombreServicio.substring(0, 40), xPos, yPos);
      if (lines.length > 1) {
        doc.text(lines[1], xPos, yPos + 3.5);
      }
      xPos += colWidths.servicio;
      doc.text('', xPos, yPos); // ADM (vacío por ahora)
      xPos += colWidths.adm;
      doc.text('', xPos, yPos); // ESC (vacío por ahora)
      xPos += colWidths.esc;
      doc.text('', xPos, yPos); // LUZ (vacío por ahora, puede tener valores como "0,65")
      xPos += colWidths.luz;
      // Próximo en rojo
      doc.setTextColor(...colorRed);
      doc.setFontSize(7.5);
      const proximoText = proximo.length > 12 ? proximo.substring(0, 12) : proximo;
      doc.text(proximoText, xPos, yPos, {
        maxWidth: colWidths.proximo - 2,
      });
      doc.setTextColor(...colorBlack);
      xPos += colWidths.proximo;
      doc.text(comentario.substring(0, 30), xPos, yPos, {
        maxWidth: colWidths.comentario - 2,
      });

      yPos += 5;
    });
  });



  // Observaciones
  if (servicioCompleto.servicio.comentario) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVACIONES', margin, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(servicioCompleto.servicio.comentario, margin, yPos, {
      maxWidth: pageWidth - 2 * margin,
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  
  // Cargar y agregar imagen de redes sociales
  try {
    const redesImg = new Image();
    redesImg.crossOrigin = 'anonymous';
    redesImg.src = '/images/Redes.png';
    
    await new Promise<void>((resolve) => {
      redesImg.onload = () => resolve();
      redesImg.onerror = () => {
        console.warn('No se pudo cargar la imagen de redes, continuando sin ella');
        resolve();
      };
    });

    if (redesImg.complete && redesImg.naturalWidth > 0) {
      const redesWidth = 80;
      const redesHeight = (redesImg.naturalHeight / redesImg.naturalWidth) * redesWidth;
      const redesX = pageWidth / 2 - redesWidth / 2;
      const redesY = footerY - redesHeight - 2;
      doc.addImage(redesImg, 'PNG', redesX, redesY, redesWidth, redesHeight);
    }
  } catch (error) {
    console.warn('Error al cargar la imagen de redes:', error);
  }
  
  doc.setFontSize(8);
  doc.setTextColor(...colorGray);
  doc.text(
    '¡Muchas gracias por elegirnos, te esperamos la próxima!',
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }
  );

  // Guardar PDF
  const patente = servicioCompleto.vehiculo?.patente
    ? formatPatente(servicioCompleto.vehiculo.patente)
    : 'N/A';
  const safePatente = patente.replace(/[^a-zA-Z0-9_-]+/g, '_');
  doc.save(`servicio-${servicioCompleto.servicio.id}-${safePatente}.pdf`);
}

