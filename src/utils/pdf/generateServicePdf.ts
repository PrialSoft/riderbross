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
    
    // Asegurar que idtiposservicio sea number | null
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

    let estados: { descripcion: string } | null = null;
    if (detalle.estados) {
      if (Array.isArray(detalle.estados)) {
        estados = (detalle.estados[0] as unknown as { descripcion: string }) || null;
      } else {
        estados = (detalle.estados as unknown) as typeof estados;
      }
    }

    return {
      idtiposervicio: idtiposservicioValue,
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

  // Generar PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  // Nota sobre fuentes en jsPDF:
  // jsPDF no tiene Montserrat por defecto. Para usar Montserrat real, necesitarías:
  // 1. Archivos .ttf de Montserrat convertidos a base64
  // 2. Usar doc.addFileToVFS() y doc.addFont()
  // Por ahora, usaremos 'helvetica' que es la fuente más similar disponible
  // Reemplazamos 'montserrat' por 'helvetica' en todas las llamadas a setFont

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
  
  // Función para optimizar imagen manteniendo transparencia (PNG) o comprimiendo (JPEG)
  const optimizeImage = (img: HTMLImageElement, maxDimension: number, quality: number = 0.8, preserveTransparency: boolean = false): string | null => {
    try {
      if (typeof document === 'undefined') return null;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Calcular dimensiones manteniendo proporción
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Si necesitamos preservar transparencia, usar PNG
      if (preserveTransparency) {
        ctx.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL('image/png');
      } else {
        // Para logo, usar JPEG con mejor calidad
        ctx.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', quality);
      }
    } catch (error) {
      console.warn('Error al optimizar imagen:', error);
      return null;
    }
  };

  // Cargar y agregar logo (optimizado)
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
      // Optimizar imagen antes de agregar (alta calidad para logo)
      const optimizedLogo = optimizeImage(logoImg, 200, 0.95, false);
      if (optimizedLogo) {
        doc.addImage(optimizedLogo, 'JPEG', margin, yPos, logoWidth, logoHeight);
      } else {
        // Fallback: usar imagen original
        doc.addImage(logoImg, 'PNG', margin, yPos, logoWidth, logoHeight);
      }
    }
  } catch (error) {
    console.warn('Error al cargar el logo:', error);
  }

  // Título centrado (en blanco sobre fondo oscuro) - un poco más abajo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE SERVICIO TÉCNICO', pageWidth / 2, yPos + 16, { align: 'center' });
  
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
  // Línea superior: CLIENTE, EMAIL, TEL
  // Línea inferior: DOMINIO, MARCA, MODELO, KM ACTUAL
  const clienteVehiculoStartY = yPos;
  let currentY = clienteVehiculoStartY;
  
  doc.setFontSize(10);
  let xPos = margin;
  
  // Línea superior: CLIENTE, EMAIL, TEL
  if (servicioCompleto.cliente) {
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENTE:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const clienteText = `${servicioCompleto.cliente.apellidos}, ${servicioCompleto.cliente.nombres}`;
    doc.text(clienteText.substring(0, 22), xPos + 20, currentY);
    xPos += 70; // Espacio para siguiente campo
  }
  
  // EMAIL
  if (servicioCompleto.cliente?.email) {
    doc.setFont('helvetica', 'bold');
    doc.text('EMAIL:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const emailText = servicioCompleto.cliente.email.substring(0, 22);
    doc.text(emailText, xPos + 18, currentY);
    xPos += 65; // Espacio para siguiente campo
  }
  
  // TEL
  if (servicioCompleto.cliente?.telefono) {
    doc.setFont('helvetica', 'bold');
    doc.text('TEL:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const telText = servicioCompleto.cliente.telefono.toString();
    doc.text(telText, xPos + 12, currentY);
  }
  
  currentY += 6; // Espacio entre líneas
  xPos = margin;
  
  // Línea inferior: DOMINIO, MARCA, MODELO, KM ACTUAL
  if (servicioCompleto.vehiculo) {
    // DOMINIO
    doc.setFont('helvetica', 'bold');
    doc.text('DOMINIO:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const dominioText = formatPatente(servicioCompleto.vehiculo.patente);
    doc.text(dominioText, xPos + 22, currentY);
    xPos += 45;
    
    // MARCA
    doc.setFont('helvetica', 'bold');
    doc.text('MARCA:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const marcaText = (servicioCompleto.vehiculo.marcas?.descripcion || '—').substring(0, 12);
    doc.text(marcaText, xPos + 18, currentY);
    xPos += 45;
    
    // MODELO
    doc.setFont('helvetica', 'bold');
    doc.text('MODELO:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const modeloText = (servicioCompleto.vehiculo.modelo || '—').substring(0, 12);
    doc.text(modeloText, xPos + 20, currentY);
    xPos += 45;
    
    // KM ACTUAL
    doc.setFont('helvetica', 'bold');
    doc.text('KM ACTUAL:', xPos, currentY);
    doc.setFont('helvetica', 'normal');
    const kmActual = servicioCompleto.servicio.kmservicio
      ? servicioCompleto.servicio.kmservicio?.toLocaleString('es-AR')
      : '—';
    const kmText = kmActual.substring(0, 10);
    doc.text(kmText, xPos + 28, currentY);
  }
  
  // Actualizar yPos al final de la cabecera
  yPos = currentY + 2;

  // Borde separador antes de la nota general
  doc.setDrawColor(...colorGrayDark);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6; // Aumentar espacio después de la línea gris para separar el texto

  // Nota general
  doc.setFontSize(9);
  doc.setTextColor(...colorGray);
  const notaTexto = 'Por favor, prestá atención a nuestras recomendaciones y recorda realizar los mantenimientos preventivos una vez cumplida la cantidad de kilómetros remarcados en rojo.';
  const palabraRojo = 'rojo';
  const indiceRojo = notaTexto.toLowerCase().indexOf(palabraRojo);
  
  if (indiceRojo !== -1) {
    // Dividir el texto en partes: antes de "rojo", "rojo", y después
    const textoAntes = notaTexto.substring(0, indiceRojo);
    const textoRojo = notaTexto.substring(indiceRojo, indiceRojo + palabraRojo.length);
    const textoDespues = notaTexto.substring(indiceRojo + palabraRojo.length);
    
    // Construir el texto completo con marcador especial para "rojo"
    // Usaremos un enfoque más simple: dibujar parte por parte
    let currentY = yPos;
    const lineHeight = 4;
    const maxWidth = pageWidth - 2 * margin;
    
    // Dibujar texto antes de "rojo" en gris
    if (textoAntes.trim()) {
      const linesAntes = doc.splitTextToSize(textoAntes, maxWidth);
      for (let i = 0; i < linesAntes.length; i++) {
        doc.text(linesAntes[i], margin, currentY);
        if (i < linesAntes.length - 1) {
          currentY += lineHeight;
        }
      }
    }
    
    // Calcular posición X donde termina el texto anterior (última línea)
    const ultimaLineaAntes = textoAntes.trim() 
      ? doc.splitTextToSize(textoAntes, maxWidth).slice(-1)[0] 
      : '';
    const xPosRojo = margin + (ultimaLineaAntes ? doc.getTextWidth(ultimaLineaAntes) : 0);
    
    // Verificar si "rojo" cabe en la misma línea
    const textWidthRojo = doc.getTextWidth(textoRojo);
    const espacioDisponible = pageWidth - margin - xPosRojo;
    
    if (textWidthRojo <= espacioDisponible && ultimaLineaAntes) {
      // Dibujar "rojo" en rojo en la misma línea
      doc.setTextColor(...colorRed);
      doc.text(textoRojo, xPosRojo, currentY);
      doc.setTextColor(...colorGray);
      
      // Dibujar texto después en la misma línea o nueva línea
      if (textoDespues.trim()) {
        const xPosDespues = xPosRojo + textWidthRojo;
        const textWidthDespues = doc.getTextWidth(textoDespues);
        if (xPosDespues + textWidthDespues <= pageWidth - margin) {
          doc.text(textoDespues, xPosDespues, currentY);
        } else {
          currentY += lineHeight;
          const linesDespues = doc.splitTextToSize(textoDespues, maxWidth);
          doc.text(linesDespues[0], margin, currentY);
        }
      }
    } else {
      // "rojo" no cabe en la misma línea, ir a nueva línea
      currentY += lineHeight;
      doc.setTextColor(...colorRed);
      doc.text(textoRojo, margin, currentY);
      doc.setTextColor(...colorGray);
      
      // Dibujar texto después
      if (textoDespues.trim()) {
        const xPosDespues = margin + textWidthRojo;
        const textWidthDespues = doc.getTextWidth(textoDespues);
        if (xPosDespues + textWidthDespues <= pageWidth - margin) {
          doc.text(textoDespues, xPosDespues, currentY);
        } else {
          currentY += lineHeight;
          const linesDespues = doc.splitTextToSize(textoDespues, maxWidth);
          for (const line of linesDespues) {
            doc.text(line, margin, currentY);
            currentY += lineHeight;
          }
          currentY -= lineHeight; // Ajustar última línea
        }
      }
    }
    
    yPos = currentY + 6;
  } else {
    // Si no se encuentra "rojo", dibujar el texto completo en gris (fallback)
    doc.text(notaTexto, margin, yPos, { maxWidth: pageWidth - 2 * margin });
    yPos += 10;
  }
  
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

  // Encabezados de tabla se mostrarán dentro de cada categoría
  // Redimensionar columnas: Servicios (1/3), Comentario (todo el ancho posible), Próximo+Estado (1/3 compartido)
  const availableWidth = pageWidth - 2 * margin;
  const servicioWidth = availableWidth / 3;  // 1/3 para servicios
  const proximoEstadoWidth = availableWidth / 3;  // 1/3 para Próximo + Estado
  const comentarioWidth = availableWidth - servicioWidth - proximoEstadoWidth;  // Resto para comentario
  
  const colWidths = {
    servicio: servicioWidth,
    comentario: comentarioWidth,      // Ocupa todo el ancho posible
    proximo: proximoEstadoWidth / 2,   // Mitad del último tercio
    estado: proximoEstadoWidth / 2,    // Mitad del último tercio
  };
  const startX = margin;

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
    // Determinar qué columnas mostrar para esta categoría
    const tieneProximo = detalles.some(d => d.proximoenkm !== null);
    
    // Verificar si hay espacio suficiente para la cabecera + al menos una fila de datos
    // Altura necesaria: cabecera (6) + espacio después (6) + altura mínima de fila (8) = 20
    const espacioNecesario = 20;
    if (yPos + espacioNecesario > pageHeight - 30) {
      // No hay espacio suficiente, crear nueva página antes de dibujar la cabecera
      doc.addPage();
      yPos = margin;
    }
    
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
      
      // Nombre de categoría y encabezados de columna en la misma línea
      // Distribución: NOMBRE DEL SERVICIO (1/3), COMENTARIO (1/3), PRÓXIMO + ESTADO (1/3 compartido)
      let headerX = margin;
      doc.text(categoriaNombre.toUpperCase(), headerX, yPos);
      headerX += colWidths.servicio; // NOMBRE DEL SERVICIO ocupa 1/3
      
      doc.text('COMENTARIO', headerX, yPos);
      headerX += colWidths.comentario; // COMENTARIO ocupa 1/3
      
      // PRÓXIMO y ESTADO comparten el último 1/3
      // Calcular posición de PRÓXIMO para alinearlo con los datos (centrado en su columna)
      if (tieneProximo) {
        const proximoHeaderX = startX + colWidths.servicio + colWidths.comentario + (colWidths.proximo / 2);
        doc.text('PRÓXIMO', proximoHeaderX, yPos, { align: 'center' });
      }
      
      // ESTADO al margen derecho, alineado a la derecha
      const estadoHeaderRightX = pageWidth - margin;
      doc.text('ESTADO', estadoHeaderRightX, yPos, { align: 'right' });
      
      doc.setTextColor(...colorBlack); // Restaurar color negro
      
      yPos += 6; // Aumentar espacio entre headers y el primer registro para evitar que se encime
      doc.setFont('helvetica', 'normal');
    } else {
      // Si solo hay una categoría, mostrar encabezados aquí
      // Distribución: NOMBRE DEL SERVICIO (1/3), COMENTARIO (1/3), PRÓXIMO + ESTADO (1/3 compartido)
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      let headerX = margin;
      
      // NOMBRE DEL SERVICIO (1/3) - aunque no se muestre el título, se reserva el espacio
      headerX += colWidths.servicio;
      
      doc.text('COMENTARIO', headerX, yPos);
      headerX += colWidths.comentario; // COMENTARIO ocupa 1/3
      
      // PRÓXIMO y ESTADO comparten el último 1/3
      // Calcular posición de PRÓXIMO para alinearlo con los datos (centrado en su columna)
      if (tieneProximo) {
        const proximoHeaderX = startX + colWidths.servicio + colWidths.comentario + (colWidths.proximo / 2);
        doc.text('PRÓXIMO', proximoHeaderX, yPos, { align: 'center' });
      }
      
      // ESTADO al margen derecho, alineado a la derecha
      const estadoHeaderRightX = pageWidth - margin;
      doc.text('ESTADO', estadoHeaderRightX, yPos, { align: 'right' });
      
      yPos += 6; // Aumentar espacio entre headers y el primer registro para evitar que se encime
      doc.setFont('helvetica', 'normal');
    }

    detalles.forEach((detalle, detalleIndex) => {
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
      
      // SERVICIOS APLICADOS: Nombre + (Referencia) si existe
      let servicioTexto = nombreServicio;
      if (referencia && referencia.trim()) {
        // Limpiar la referencia de paréntesis existentes para evitar dobles paréntesis
        let referenciaLimpia = referencia.trim();
        // Remover paréntesis al inicio y final si existen
        if (referenciaLimpia.startsWith('(') && referenciaLimpia.endsWith(')')) {
          referenciaLimpia = referenciaLimpia.slice(1, -1).trim();
        }
        servicioTexto += ` (${referenciaLimpia})`;
      }
      const lines = doc.splitTextToSize(servicioTexto, colWidths.servicio - 2);
      const numLines = lines.length;
      const lineHeight = 3.5; // Altura entre líneas
      
      // Dibujar todas las líneas del servicio (alineado a la izquierda)
      lines.forEach((line: string, index: number) => {
        doc.text(line, xPos, yPos + (index * lineHeight), { align: 'left' });
      });
      
      xPos += colWidths.servicio;
      
      // Comentario (si existe) - puede ocupar múltiples líneas también, alineado a la izquierda
      // Orden: Servicios (1/3), Comentario (1/3), Próximo (1/6), Estado (1/6)
      let comentarioLines: string[] = [''];
      if (comentario && comentario.trim()) {
        // Cambiar color a gris oscuro para el comentario
        doc.setTextColor(90, 90, 90); // Gris oscuro
        comentarioLines = doc.splitTextToSize(comentario.trim(), colWidths.comentario - 2);
        comentarioLines.forEach((line: string, index: number) => {
          doc.text(line, xPos, yPos + (index * lineHeight), {
            align: 'left',
            maxWidth: colWidths.comentario - 2,
          });
        });
        // Restaurar color negro
        doc.setTextColor(...colorBlack);
      }
      xPos += colWidths.comentario;
      
      // Próximo en KM (solo si la categoría tiene este campo) - en rojo, centrado
      // Calcular posición para alinearlo con el header
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
        // Si no hay PRÓXIMO, reservar el espacio igual
        xPos += colWidths.proximo;
      }
      
      // Estado - esfera de color al margen derecho, centrada verticalmente
      // Colores según el estado: OK = verde, Regular = naranja, Malo = rojo
      const estadoRightX = pageWidth - margin - 2; // Un poco más a la izquierda para centrar la esfera
      const estadoLower = estado.toLowerCase();
      const sphereRadius = 0.9; // Radio de la esfera (90% del tamaño anterior)
      const sphereY = yPos - 1.5; // Centrar verticalmente con el texto
      
      let estadoColor: [number, number, number] = [0, 0, 0]; // Negro por defecto
      if (estadoLower.includes('ok')) {
        estadoColor = [76, 175, 80]; // Verde
      } else if (estadoLower.includes('regular')) {
        estadoColor = [255, 152, 0]; // Naranja
      } else if (estadoLower.includes('malo')) {
        estadoColor = [200, 50, 45]; // Rojo más oscuro
      }
      
      // Dibujar esfera de color
      doc.setFillColor(...estadoColor);
      doc.circle(estadoRightX, sphereY, sphereRadius, 'F');

      // Calcular la altura de la fila según la altura máxima (servicio o comentario)
      const maxLinesInRow = Math.max(numLines, comentarioLines.length);
      const rowHeight = maxLinesInRow > 1 ? 5 + ((maxLinesInRow - 1) * lineHeight) : 5;
      
      // Calcular la altura real del contenido (basada en las líneas de texto)
      // El texto se dibuja empezando en yPos, y cada línea adicional está a lineHeight (3.5) de distancia
      // La altura real del contenido es: primera línea (3.5) + líneas adicionales (lineHeight cada una)
      // Para 1 línea: 3.5, para 2 líneas: 3.5 + 3.5 = 7, para N líneas: N * 3.5
      const alturaRealContenido = maxLinesInRow * 0.5;
      
      // Línea sutil y delgada entre cada fila para ayudar a la lectura
      // Dibujar la línea justo después del contenido real del texto
      // Dibujar para TODOS los detalles, incluyendo el primero y el último
      const lineaY = yPos + alturaRealContenido + 0.5; // Justo después del contenido real + pequeño espacio
      doc.setDrawColor(220, 220, 220); // Gris muy claro y sutil
      doc.setLineWidth(0.1); // Línea muy delgada
      doc.line(margin, lineaY, pageWidth - margin, lineaY);
      
      // Incrementar yPos para la siguiente fila
      yPos += rowHeight;
    });
  });

  // Observaciones - después de todos los servicios (con mismo estilo que categorías)
  if (servicioCompleto.servicio.comentario) {
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    yPos += 8;
    
    // Título de OBSERVACIONES con gradiente de fondo (igual que categorías)
    const observacionesX = margin - 2;
    const observacionesY = yPos - 4;
    const observacionesWidth = pageWidth - 2 * margin + 4;
    const observacionesHeight = 6;
    
    drawGradient(
      observacionesX,
      observacionesY,
      observacionesWidth,
      observacionesHeight,
      colorBgSecondary, // Izquierda: --bg-secondary (#470707)
      colorBgPrimary    // Derecha: --bg-primary (#04000C)
    );
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255); // Texto blanco sobre fondo con gradiente
    doc.text('OBSERVACIONES', margin, yPos);
    doc.setTextColor(...colorBlack); // Restaurar color negro
    
    // Más espacio entre el header y el contenido (sin border bottom)
    yPos += 8; // Aumentado de 4 a 8 para más espacio
    doc.setFontSize(7.5); // Mismo tamaño que los servicios y detalles
    doc.setFont('helvetica', 'normal');
    doc.text(servicioCompleto.servicio.comentario, margin, yPos, {
      maxWidth: pageWidth - 2 * margin,
    });
    yPos += 10;
  }

  // Footer - se agregará al final de la última página con gradiente como las categorías
  const footerHeight = 20;
  const footerY = pageHeight - footerHeight;
  const footerX = 0;
  const footerWidth = pageWidth;
  
  // Aplicar gradiente de fondo al footer (igual que las categorías)
  drawGradient(
    footerX,
    footerY,
    footerWidth,
    footerHeight,
    colorBgSecondary, // Izquierda: --bg-secondary (#470707)
    colorBgPrimary    // Derecha: --bg-primary (#04000C)
  );
  
  // Cargar y agregar icono de Instagram blanco con RIDER.BROSS y URL en la misma línea
  try {
    // Crear un icono de Instagram simple en blanco usando SVG o buscar imagen
    // Por ahora, usaremos un círculo blanco como placeholder para Instagram
    // En producción, deberías tener un archivo de icono de Instagram blanco
    const instagramIcon = new Image();
    instagramIcon.crossOrigin = 'anonymous';
    // Intentar cargar desde una URL de icono de Instagram blanco o usar un SVG
    // Por ahora, crearemos un icono simple
    instagramIcon.src = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" stroke-width="2" fill="none"/>
        <circle cx="12" cy="12" r="4" stroke="white" stroke-width="2" fill="none"/>
        <circle cx="17" cy="7" r="1" fill="white"/>
      </svg>
    `);
    
    await new Promise<void>((resolve) => {
      instagramIcon.onload = () => resolve();
      instagramIcon.onerror = () => {
        console.warn('No se pudo cargar el icono de Instagram, usando texto');
        resolve();
      };
    });

      const iconWidth = 7; // Aún más chico
      const iconHeight = 7; // Aún más chico
    const iconX = margin;
    const iconY = footerY + (footerHeight - iconHeight) / 2;
    
    if (instagramIcon.complete && instagramIcon.naturalWidth > 0) {
      // Optimizar imagen manteniendo transparencia
      const optimizedIcon = optimizeImage(instagramIcon, 50, 1.0, true);
      if (optimizedIcon) {
        doc.addImage(optimizedIcon, 'PNG', iconX, iconY, iconWidth, iconHeight);
      } else {
        doc.addImage(instagramIcon, 'PNG', iconX, iconY, iconWidth, iconHeight);
      }
    }
    
    // Nombre "RIDER.BROSS" a la derecha del icono en la misma línea (texto blanco sobre fondo con gradiente)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text('RIDER.BROSS', iconX + iconWidth + 5, iconY + iconHeight / 2 + 2);
    
    // URL del sitio web a la derecha en la misma línea (texto blanco, solo www.riderbross.com en mayúscula)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255); // Texto blanco
    doc.text('WWW.RIDERBROSS.COM', pageWidth - margin, iconY + iconHeight / 2 + 2, { align: 'right' });
  } catch (error) {
    console.warn('Error al cargar el icono de Instagram:', error);
  }

  // Guardar PDF
  const patente = servicioCompleto.vehiculo?.patente
    ? formatPatente(servicioCompleto.vehiculo.patente)
    : 'N/A';
  const safePatente = patente.replace(/[^a-zA-Z0-9_-]+/g, '_');
  
  // Formatear fecha como DD/MM/AA (usando guiones para el nombre de archivo)
  const fechaArchivo = servicioCompleto.servicio.fechaservicio
    ? dayjs(servicioCompleto.servicio.fechaservicio).format('DD-MM-YY')
    : 'N/A';
  
  doc.save(`${safePatente}_${fechaArchivo}.pdf`);
}

