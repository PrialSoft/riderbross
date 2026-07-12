import type { SupabaseClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import dayjs from '@/lib/dayjs';
import { formatPatente } from '@/utils/patente';

const SERVICE_PDF_FONT_FAMILY = 'Montserrat';
const SERVICE_PDF_FONT_REGULAR_FILE = 'Montserrat_400Regular.ttf';
const SERVICE_PDF_FONT_BOLD_FILE = 'Montserrat_700Bold.ttf';

export const SERVICE_PDF_FONT_URLS = {
  regular: `/fonts/montserrat/${SERVICE_PDF_FONT_REGULAR_FILE}`,
  bold: `/fonts/montserrat/${SERVICE_PDF_FONT_BOLD_FILE}`,
} as const;

export interface ServicePdfFonts {
  regularBase64: string;
  boldBase64: string;
}

export interface ServicioCompleto {
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

export function getServicePdfFilename(servicioCompleto: ServicioCompleto): string {
  const patente = servicioCompleto.vehiculo?.patente
    ? formatPatente(servicioCompleto.vehiculo.patente)
    : 'N/A';
  const safePatente = patente.replace(/[^a-zA-Z0-9_-]+/g, '_');
  const fechaArchivo = servicioCompleto.servicio.fechaservicio
    ? dayjs(servicioCompleto.servicio.fechaservicio).format('DD-MM-YY')
    : 'N/A';
  return `${safePatente}_${fechaArchivo}.pdf`;
}

export async function fetchServicioCompletoForPdf(
  supabase: SupabaseClient,
  servicioId: number
): Promise<ServicioCompleto> {
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

  // Detalles del servicio: join manual de tipos/categorías/estados
  // (mismo enfoque robusto que ServicioForm; no depende del nested PostgREST).
  const { data: detallesData } = await supabase
    .from('detallesservicio')
    .select('idtiposervicio, proximoenkm, comentario, idestado')
    .eq('idservicio', servicioId);

  const detallesRaw = (detallesData as Array<{
    idtiposervicio?: number | null;
    proximoenkm?: number | null;
    comentario?: string | null;
    idestado?: number | null;
  }>) ?? [];

  const tipoIds = Array.from(
    new Set(
      detallesRaw
        .map((d) => d.idtiposervicio)
        .filter((id): id is number => typeof id === 'number')
    )
  );
  const estadoIds = Array.from(
    new Set(
      detallesRaw
        .map((d) => d.idestado)
        .filter((id): id is number => typeof id === 'number')
    )
  );

  const tiposById = new Map<
    number,
    {
      nombre: string;
      referencia: string | null;
      idcategoriaservicio: number | null;
    }
  >();
  const categoriasById = new Map<number, { nombre: string; orden: number }>();
  const estadosById = new Map<number, { descripcion: string }>();

  if (tipoIds.length > 0) {
    const { data: tiposData } = await supabase
      .from('tiposservicio')
      .select('id, nombre, referencia, idcategoriaservicio')
      .in('id', tipoIds);

    ((tiposData as Array<{
      id: number;
      nombre: string;
      referencia: string | null;
      idcategoriaservicio: number | null;
    }>) ?? []).forEach((t) => {
      tiposById.set(t.id, {
        nombre: t.nombre,
        referencia: t.referencia ?? null,
        idcategoriaservicio: t.idcategoriaservicio ?? null,
      });
    });

    const categoriaIds = Array.from(
      new Set(
        Array.from(tiposById.values())
          .map((t) => t.idcategoriaservicio)
          .filter((id): id is number => typeof id === 'number')
      )
    );

    if (categoriaIds.length > 0) {
      const { data: catsData } = await supabase
        .from('categoriasservicio')
        .select('id, nombre, orden')
        .in('id', categoriaIds);

      ((catsData as Array<{ id: number; nombre: string; orden: number | null }>) ?? []).forEach(
        (c) => {
          categoriasById.set(c.id, {
            nombre: c.nombre,
            orden: typeof c.orden === 'number' ? c.orden : 0,
          });
        }
      );
    }
  }

  if (estadoIds.length > 0) {
    const { data: estadosData } = await supabase
      .from('estados')
      .select('id, descripcion')
      .in('id', estadoIds);

    ((estadosData as Array<{ id: number; descripcion: string }>) ?? []).forEach((e) => {
      estadosById.set(e.id, { descripcion: e.descripcion });
    });
  }

  const detalles: ServicioCompleto['detalles'] = detallesRaw.map((detalle) => {
    const idtiposervicioValue =
      typeof detalle.idtiposervicio === 'number' ? detalle.idtiposervicio : null;
    const idestadoValue = typeof detalle.idestado === 'number' ? detalle.idestado : null;

    const tipo = idtiposervicioValue !== null ? tiposById.get(idtiposervicioValue) : undefined;
    const categoria =
      tipo?.idcategoriaservicio != null
        ? categoriasById.get(tipo.idcategoriaservicio) ?? null
        : null;

    return {
      idtiposervicio: idtiposervicioValue,
      proximoenkm: detalle.proximoenkm ?? null,
      comentario: detalle.comentario ?? null,
      idestado: idestadoValue,
      tiposservicio: tipo
        ? {
            nombre: tipo.nombre,
            referencia: tipo.referencia,
            categoriasservicio: categoria,
          }
        : null,
      estados: idestadoValue !== null ? estadosById.get(idestadoValue) ?? null : null,
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

  return servicioCompleto;
}

/** jsPDF con compresión de streams (reduce tamaño del archivo). */
export function createServiceJsPdf(): jsPDF {
  return new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
}

export function registerServicePdfFonts(doc: jsPDF, fonts: ServicePdfFonts): void {
  doc.addFileToVFS(SERVICE_PDF_FONT_REGULAR_FILE, fonts.regularBase64);
  doc.addFont(SERVICE_PDF_FONT_REGULAR_FILE, SERVICE_PDF_FONT_FAMILY, 'normal');
  doc.addFileToVFS(SERVICE_PDF_FONT_BOLD_FILE, fonts.boldBase64);
  doc.addFont(SERVICE_PDF_FONT_BOLD_FILE, SERVICE_PDF_FONT_FAMILY, 'bold');
  setServicePdfFont(doc, 'normal');
}

function setServicePdfFont(doc: jsPDF, style: 'normal' | 'bold'): void {
  doc.setFont(SERVICE_PDF_FONT_FAMILY, style);
}

/** Una sola línea; si no entra, recorta con elipsis (fuente ya en Montserrat normal). */
function truncateTextToMaxWidth(doc: jsPDF, text: string, maxWidth: number): string {
  if (maxWidth <= 0) return '';
  setServicePdfFont(doc, 'normal');
  if (doc.getTextWidth(text) <= maxWidth) return text;
  const ellipsis = '…';
  let len = text.length;
  while (len > 0) {
    const candidate = text.slice(0, len) + ellipsis;
    if (doc.getTextWidth(candidate) <= maxWidth) return candidate;
    len -= 1;
  }
  return doc.getTextWidth(ellipsis) <= maxWidth ? ellipsis : '';
}

function normalizePdfCategoryName(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

function isSistemaIluminacionCategory(nombre: string): boolean {
  return normalizePdfCategoryName(nombre).includes('SISTEMA DE ILUMINACION');
}

function buildServicioTexto(nombreServicio: string, referencia: string | null | undefined): string {
  let servicioTexto = nombreServicio;
  if (referencia?.trim()) {
    let referenciaLimpia = referencia.trim();
    if (referenciaLimpia.startsWith('(') && referenciaLimpia.endsWith(')')) {
      referenciaLimpia = referenciaLimpia.slice(1, -1).trim();
    }
    servicioTexto += ` (${referenciaLimpia})`;
  }
  return servicioTexto;
}

function getEstadoSphereColor(
  estado: string,
  colorOk: [number, number, number],
  colorRegular: [number, number, number],
  colorMalo: [number, number, number]
): [number, number, number] {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('bueno') || estadoLower.includes('ok')) return colorOk;
  if (estadoLower.includes('regular')) return colorRegular;
  if (estadoLower.includes('malo')) return colorMalo;
  return [0, 0, 0];
}

function addLogoToPdf(
  doc: jsPDF,
  logoDataUrl: string | null,
  margin: number,
  headerHeight: number
): void {
  if (!logoDataUrl) return;
  try {
    const fmt =
      logoDataUrl.includes('image/jpeg') || logoDataUrl.includes('image/jpg') ? 'JPEG' : 'PNG';
    const props = doc.getImageProperties(logoDataUrl);
    const logoWidth = 30;
    const logoHeight = (props.height / props.width) * logoWidth;
    const logoY = Math.max(0, (headerHeight - logoHeight) / 2);
    doc.addImage(logoDataUrl, fmt, margin, logoY, logoWidth, logoHeight);
  } catch {
    /* logo opcional */
  }
}

/** Mismo trazo que el SVG del informe (válido en Node y en el navegador). */
function drawInstagramIconVector(doc: jsPDF, iconX: number, iconY: number, size: number): void {
  const u = size / 24;
  doc.setDrawColor(255, 255, 255);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.35);
  doc.roundedRect(iconX + 2 * u, iconY + 2 * u, 20 * u, 20 * u, 5 * u, 5 * u, 'S');
  doc.circle(iconX + 12 * u, iconY + 12 * u, 4 * u, 'S');
  doc.circle(iconX + 17 * u, iconY + 7 * u, 1 * u, 'F');
}

/** Dibuja el informe completo; usado al descargar PDF y al adjuntar en email. */
export function drawServicePdfContent(
  doc: jsPDF,
  servicioCompleto: ServicioCompleto,
  logoDataUrl: string | null
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  setServicePdfFont(doc, 'normal');

  // Colores
  const colorRed: [number, number, number] = [139, 26, 26];
  const colorBlack: [number, number, number] = [0, 0, 0];
  const colorGray: [number, number, number] = [128, 128, 128];
  const colorGrayDark: [number, number, number] = [150, 150, 150]; // Gris oscuro para border bottom de categorías
  const colorBgPrimary: [number, number, number] = [4, 0, 12]; // #04000C --bg-primary
  const colorBgDark: [number, number, number] = [30, 42, 53]; // #1E2A35 --bg-dark
  const colorEstadoOk: [number, number, number] = [76, 175, 80];
  const colorEstadoRegular: [number, number, number] = [255, 193, 7];
  const colorEstadoMalo: [number, number, number] = [200, 50, 45];

  // Header con fondo y borde
  const headerHeight = 35 * 0.8; // 20% menos de altura
  const headerStartY = yPos;
  
  // Fondo del header: gradiente L→R (--bg-primary → --bg-dark)
  const headerBgHeight = headerHeight + 5;
  const headerGradientSteps = 60;
  const headerStepWidth = pageWidth / headerGradientSteps;
  for (let i = 0; i < headerGradientSteps; i++) {
    const ratio = i / (headerGradientSteps - 1);
    const r = Math.round(colorBgPrimary[0] + (colorBgDark[0] - colorBgPrimary[0]) * ratio);
    const g = Math.round(colorBgPrimary[1] + (colorBgDark[1] - colorBgPrimary[1]) * ratio);
    const b = Math.round(colorBgPrimary[2] + (colorBgDark[2] - colorBgPrimary[2]) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(i * headerStepWidth, 0, headerStepWidth + 0.2, headerBgHeight, 'F');
  }
  
  addLogoToPdf(doc, logoDataUrl, margin, headerBgHeight);

  // Título alineado a la derecha + fecha debajo, bloque centrado verticalmente
  const fecha = servicioCompleto.servicio.fechaservicio
    ? dayjs(servicioCompleto.servicio.fechaservicio).format('DD/MM/YYYY')
    : '—';
  const titleText = 'INFORME DE SERVICIO TÉCNICO';
  const titleLineHeight = 6;
  const dateLineHeight = 4.5;
  const titleDateGap = 1.5;
  const textBlockHeight = titleLineHeight + titleDateGap + dateLineHeight;
  const textBlockTop = (headerBgHeight - textBlockHeight) / 2;
  const titleBaselineY = textBlockTop + titleLineHeight * 0.78;
  const dateBaselineY = textBlockTop + titleLineHeight + titleDateGap + dateLineHeight * 0.78;

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  setServicePdfFont(doc, 'bold');
  doc.text(titleText, pageWidth - margin, titleBaselineY, { align: 'right' });

  doc.setFontSize(10);
  setServicePdfFont(doc, 'normal');
  doc.text(fecha, pageWidth - margin, dateBaselineY, { align: 'right' });
  
  // Restaurar color de texto y avanzar posición
  doc.setTextColor(...colorBlack);
  yPos = headerStartY + headerHeight + 8; // Separar más la sección de datos del cliente

  // Información del cliente y vehículo en la cabecera
  // Una sola línea: reserva fija para TEL (~12 cifras); el resto se reparte a medias entre CLIENTE y EMAIL.
  const clienteVehiculoStartY = yPos;
  let currentY = clienteVehiculoStartY;

  doc.setFontSize(10);

  if (servicioCompleto.cliente) {
    const c = servicioCompleto.cliente;
    const inner = pageWidth - 2 * margin;
    const y = currentY;
    const hasEmail = Boolean(c.email?.trim());
    const telStr = c.telefono != null ? String(c.telefono) : '';

    setServicePdfFont(doc, 'bold');
    const telLabelW = doc.getTextWidth('TEL: ');
    setServicePdfFont(doc, 'normal');
    const telNumRefW = Math.max(doc.getTextWidth(telStr), doc.getTextWidth('0'.repeat(12)));
    const telReserve =
      c.telefono != null ? telLabelW + telNumRefW + 4 : 0;

    const pairW = inner - telReserve;

    setServicePdfFont(doc, 'bold');
    const labelCliente = 'CLIENTE:';
    doc.text(labelCliente, margin, y);
    const wLabelCliente = doc.getTextWidth(labelCliente);

    if (hasEmail) {
      const colW = pairW / 2;
      const maxClienteVal = colW - wLabelCliente - 2;
      const clienteFull = `${c.apellidos}, ${c.nombres}`;
      setServicePdfFont(doc, 'normal');
      doc.text(truncateTextToMaxWidth(doc, clienteFull, maxClienteVal), margin + wLabelCliente + 1, y);

      const xEmail = margin + colW;
      setServicePdfFont(doc, 'bold');
      const labelEmail = 'EMAIL:';
      doc.text(labelEmail, xEmail, y);
      const wLabelEmail = doc.getTextWidth(labelEmail);
      setServicePdfFont(doc, 'normal');
      const maxEmailVal = colW - wLabelEmail - 2;
      doc.text(truncateTextToMaxWidth(doc, c.email!.trim(), maxEmailVal), xEmail + wLabelEmail + 1, y);
    } else {
      const maxClienteVal = pairW - wLabelCliente - 2;
      setServicePdfFont(doc, 'normal');
      doc.text(
        truncateTextToMaxWidth(doc, `${c.apellidos}, ${c.nombres}`, maxClienteVal),
        margin + wLabelCliente + 1,
        y
      );
    }

    if (c.telefono != null) {
      setServicePdfFont(doc, 'bold');
      const tw = doc.getTextWidth('TEL: ');
      setServicePdfFont(doc, 'normal');
      const nw = doc.getTextWidth(telStr);
      const xTel = pageWidth - margin - tw - nw;
      setServicePdfFont(doc, 'bold');
      doc.text('TEL:', xTel, y);
      setServicePdfFont(doc, 'normal');
      doc.text(telStr, xTel + tw + 0.5, y);
    }

    currentY += 6;
  }

  let xPos = margin;
  
  // Línea inferior: DOMINIO, MARCA, MODELO, KM ACTUAL
  if (servicioCompleto.vehiculo) {
    // DOMINIO
    setServicePdfFont(doc, 'bold');
    doc.text('DOMINIO:', xPos, currentY);
    setServicePdfFont(doc, 'normal');
    const dominioText = formatPatente(servicioCompleto.vehiculo.patente);
    doc.text(dominioText, xPos + 22, currentY);
    xPos += 45;
    
    // MARCA
    setServicePdfFont(doc, 'bold');
    doc.text('MARCA:', xPos, currentY);
    setServicePdfFont(doc, 'normal');
    const marcaText = (servicioCompleto.vehiculo.marcas?.descripcion || '—').substring(0, 12);
    doc.text(marcaText, xPos + 18, currentY);
    xPos += 45;
    
    // MODELO
    setServicePdfFont(doc, 'bold');
    doc.text('MODELO:', xPos, currentY);
    setServicePdfFont(doc, 'normal');
    const modeloText = (servicioCompleto.vehiculo.modelo || '—').substring(0, 12);
    doc.text(modeloText, xPos + 20, currentY);
    xPos += 45;
    
    // KM ACTUAL
    setServicePdfFont(doc, 'bold');
    doc.text('KM ACTUAL:', xPos, currentY);
    setServicePdfFont(doc, 'normal');
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
  doc.setLineWidth(0.4); // Mitad del grosor anterior (0.8)
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6; // Aumentar espacio después de la línea gris para separar el texto

  // Nota general
  doc.setFontSize(9);
  doc.setTextColor(...colorBlack);
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
    
    // Dibujar texto antes de "rojo" en negro
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
      doc.setTextColor(...colorBlack);
      
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
      doc.setTextColor(...colorBlack);
      
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
    // Si no se encuentra "rojo", dibujar el texto completo en negro (fallback)
    doc.text(notaTexto, margin, yPos, { maxWidth: pageWidth - 2 * margin });
    yPos += 10;
  }
  
  // Referencia de colores de estado antes del detalle de servicios
  setServicePdfFont(doc, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...colorBlack);
  const legendY = yPos;
  const legendCircleY = legendY - 1.4;
  const legendItems: Array<{ label: string; color: [number, number, number] }> = [
    { label: 'Bueno', color: colorEstadoOk },
    { label: 'Regular', color: colorEstadoRegular },
    { label: 'Malo', color: colorEstadoMalo },
  ];
  const legendWidth = legendItems.reduce((total, item, index) => {
    const itemWidth = 1.1 * 2 + 3 + doc.getTextWidth(item.label);
    const separatorWidth = index < legendItems.length - 1 ? 7 : 0;
    return total + itemWidth + separatorWidth;
  }, 0);
  let legendX = pageWidth - margin - legendWidth;

  legendItems.forEach((item, index) => {
    doc.setFillColor(...item.color);
    doc.circle(legendX, legendCircleY, 1.1, 'F');
    legendX += 3;
    doc.text(item.label, legendX, legendY);
    legendX += doc.getTextWidth(item.label) + 3;
    if (index < legendItems.length - 1) {
      doc.setTextColor(...colorGray);
      doc.text('|', legendX, legendY);
      doc.setTextColor(...colorBlack);
      legendX += 4;
    }
  });
  yPos += 7;

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

  const drawCategoryHeaderBar = (titulo: string, showTableHeaders: boolean, tieneProximo: boolean) => {
    const categoriaX = margin - 2;
    const categoriaY = yPos - 4;
    const categoriaWidth = pageWidth - 2 * margin + 4;
    const categoriaHeight = 6;

    doc.setFillColor(...colorBgDark); // --bg-dark (#1E2A35)
    doc.rect(categoriaX, categoriaY, categoriaWidth, categoriaHeight, 'F');

    setServicePdfFont(doc, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(titulo.toUpperCase(), margin, yPos);

    if (showTableHeaders) {
      let headerX = margin + colWidths.servicio;
      doc.text('COMENTARIO', headerX, yPos);
      headerX += colWidths.comentario;

      if (tieneProximo) {
        const proximoHeaderX =
          startX + colWidths.servicio + colWidths.comentario + colWidths.proximo / 2;
        doc.text('PRÓXIMO', proximoHeaderX, yPos, { align: 'center' });
      }

      doc.text('ESTADO', pageWidth - margin, yPos, { align: 'right' });
    }

    doc.setTextColor(...colorBlack);
    yPos += 6;
    setServicePdfFont(doc, 'normal');
  };

  const drawIluminacionItemCell = (
    detalle: ServicioCompleto['detalles'][number],
    cellX: number,
    cellWidth: number,
    rowY: number,
    textColor: [number, number, number] = colorBlack
  ) => {
    const nombreServicio = detalle.tiposservicio?.nombre || '—';
    const referencia = detalle.tiposservicio?.referencia || null;
    const estado = detalle.estados?.descripcion || '—';
    const servicioTexto = buildServicioTexto(nombreServicio, referencia);
    const sphereRadius = 0.9;
    const sphereX = cellX + cellWidth - 2;
    const sphereY = rowY - 1.5;
    const textMaxWidth = cellWidth - 7;

    setServicePdfFont(doc, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textColor);
    doc.text(truncateTextToMaxWidth(doc, servicioTexto, textMaxWidth), cellX, rowY);

    doc.setFillColor(
      ...getEstadoSphereColor(estado, colorEstadoOk, colorEstadoRegular, colorEstadoMalo)
    );
    doc.circle(sphereX, sphereY, sphereRadius, 'F');
  };

  const colorZebraWhite: [number, number, number] = [255, 255, 255];
  const colorZebraAlt: [number, number, number] = [236, 240, 243]; // Gris-azulado muy claro (contraste suave con blanco)
  const colorZebraTextOnDark: [number, number, number] = colorBlack;
  const colorComentarioOnDark: [number, number, number] = [90, 90, 90];
  const colorComentarioOnLight: [number, number, number] = [90, 90, 90];

  const drawZebraRowBackground = (rowTop: number, rowHeight: number, isAlt: boolean) => {
    doc.setFillColor(...(isAlt ? colorZebraAlt : colorZebraWhite));
    doc.rect(margin, rowTop, pageWidth - 2 * margin, rowHeight, 'F');
  };

  // Filas de servicios
  setServicePdfFont(doc, 'normal');
  categoriasOrdenadas.forEach(([categoriaNombre, detalles]) => {
    // SISTEMA DE ILUMINACIÓN: 2 columnas de hasta 5 ítems, cada uno con su estado.
    if (isSistemaIluminacionCategory(categoriaNombre)) {
      const itemsPerColumn = 5;
      const itemsPerBlock = itemsPerColumn * 2;
      const columnGap = 8;
      const columnWidth = (availableWidth - columnGap) / 2;
      const leftColumnX = margin;
      const rightColumnX = margin + columnWidth + columnGap;
      const rowHeight = 5;
      const blockRowsHeight = itemsPerColumn * rowHeight;
      const headerHeight = 6;

      for (let offset = 0; offset < detalles.length; offset += itemsPerBlock) {
        const needsHeader = offset === 0;
        const espacioNecesario = (needsHeader ? headerHeight : 0) + blockRowsHeight + 4;
        if (yPos + espacioNecesario > pageHeight - 30) {
          doc.addPage();
          yPos = margin;
        }

        if (needsHeader) {
          drawCategoryHeaderBar(categoriaNombre, false, false);
        }

        const blockItems = detalles.slice(offset, offset + itemsPerBlock);
        const leftItems = blockItems.slice(0, itemsPerColumn);
        const rightItems = blockItems.slice(itemsPerColumn, itemsPerBlock);
        const rowsInBlock = Math.max(leftItems.length, rightItems.length);

        for (let row = 0; row < rowsInBlock; row++) {
          const isDark = row % 2 === 1;
          const rowTop = yPos - 3.5;
          drawZebraRowBackground(rowTop, rowHeight, isDark);

          const rowY = yPos;
          const leftItem = leftItems[row];
          const rightItem = rightItems[row];
          const rowTextColor = isDark ? colorZebraTextOnDark : colorBlack;

          if (leftItem) {
            drawIluminacionItemCell(leftItem, leftColumnX, columnWidth, rowY, rowTextColor);
          }
          if (rightItem) {
            drawIluminacionItemCell(rightItem, rightColumnX, columnWidth, rowY, rowTextColor);
          }

          yPos += rowHeight;
        }
      }

      return;
    }

    // Determinar qué columnas mostrar para esta categoría
    const tieneProximo = detalles.some((d) => d.proximoenkm !== null);

    // Verificar si hay espacio suficiente para la cabecera + al menos una fila de datos
    // Altura necesaria: cabecera (6) + espacio después (6) + altura mínima de fila (8) = 20
    const espacioNecesario = 20;
    if (yPos + espacioNecesario > pageHeight - 30) {
      // No hay espacio suficiente, crear nueva página antes de dibujar la cabecera
      doc.addPage();
      yPos = margin;
    }

    // Título de categoría con gradiente de fondo (siempre, aunque haya una sola)
    drawCategoryHeaderBar(categoriaNombre, true, tieneProximo);

    detalles.forEach((detalle, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      const isDark = index % 2 === 1;
      const nombreServicio = detalle.tiposservicio?.nombre || '—';
      const referencia = detalle.tiposservicio?.referencia || null;
      const proximo = detalle.proximoenkm
        ? detalle.proximoenkm.toLocaleString('es-AR')
        : null;
      const comentario = detalle.comentario || null;
      const estado = detalle.estados?.descripcion || '—';

      const lineHeight = 3.5;
      doc.setFontSize(7.5);
      const servicioTexto = buildServicioTexto(nombreServicio, referencia);
      const lines = doc.splitTextToSize(servicioTexto, colWidths.servicio - 2);
      const numLines = lines.length;

      let comentarioLines: string[] = [''];
      if (comentario && comentario.trim()) {
        comentarioLines = doc.splitTextToSize(comentario.trim(), colWidths.comentario - 2);
      }

      const maxLinesInRow = Math.max(numLines, comentarioLines.length);
      const rowHeight = maxLinesInRow > 1 ? 5 + (maxLinesInRow - 1) * lineHeight : 5;
      const rowTop = yPos - 3.5;
      drawZebraRowBackground(rowTop, rowHeight, isDark);

      let xPos = startX;
      doc.setFontSize(7.5);
      doc.setTextColor(...(isDark ? colorZebraTextOnDark : colorBlack));

      lines.forEach((line: string, lineIndex: number) => {
        doc.text(line, xPos, yPos + lineIndex * lineHeight, { align: 'left' });
      });

      xPos += colWidths.servicio;

      if (comentario && comentario.trim()) {
        doc.setTextColor(...(isDark ? colorComentarioOnDark : colorComentarioOnLight));
        comentarioLines.forEach((line: string, lineIndex: number) => {
          doc.text(line, xPos, yPos + lineIndex * lineHeight, {
            align: 'left',
            maxWidth: colWidths.comentario - 2,
          });
        });
        doc.setTextColor(...(isDark ? colorZebraTextOnDark : colorBlack));
      }
      xPos += colWidths.comentario;

      if (tieneProximo) {
        const proximoCenterX =
          startX + colWidths.servicio + colWidths.comentario + colWidths.proximo / 2;
        if (proximo) {
          doc.setTextColor(...colorRed);
          const proximoText = proximo.length > 12 ? proximo.substring(0, 12) : proximo;
          doc.text(proximoText, proximoCenterX, yPos, {
            align: 'center',
            maxWidth: colWidths.proximo - 2,
          });
          doc.setTextColor(...(isDark ? colorZebraTextOnDark : colorBlack));
        }
        xPos += colWidths.proximo;
      } else {
        xPos += colWidths.proximo;
      }

      // Estado - esfera de color al margen derecho, centrada verticalmente
      const estadoRightX = pageWidth - margin - 2;
      const sphereRadius = 0.9;
      const sphereY = yPos - 1.5;
      const estadoColor = getEstadoSphereColor(
        estado,
        colorEstadoOk,
        colorEstadoRegular,
        colorEstadoMalo
      );

      doc.setFillColor(...estadoColor);
      doc.circle(estadoRightX, sphereY, sphereRadius, 'F');

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
    
    // Título de OBSERVACIONES con fondo --bg-dark (igual que categorías)
    const observacionesX = margin - 2;
    const observacionesY = yPos - 4;
    const observacionesWidth = pageWidth - 2 * margin + 4;
    const observacionesHeight = 6;
    
    doc.setFillColor(...colorBgDark); // --bg-dark (#1E2A35)
    doc.rect(observacionesX, observacionesY, observacionesWidth, observacionesHeight, 'F');
    
    setServicePdfFont(doc, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255); // Texto blanco sobre fondo oscuro
    doc.text('OBSERVACIONES', margin, yPos);
    doc.setTextColor(...colorBlack); // Restaurar color negro
    
    // Más espacio entre el header y el contenido (sin border bottom)
    yPos += 8; // Aumentado de 4 a 8 para más espacio
    doc.setFontSize(7.5); // Mismo tamaño que los servicios y detalles
    setServicePdfFont(doc, 'normal');
    doc.text(servicioCompleto.servicio.comentario, margin, yPos, {
      maxWidth: pageWidth - 2 * margin,
    });
    yPos += 10;
  }

  // Footer - se agregará al final de la última página con el mismo fondo del encabezado
  const footerHeight = 20 * (2 / 3); // ~13.3mm (1/3 menos de altura)
  const footerY = pageHeight - footerHeight;
  
  doc.setFillColor(...colorBgPrimary);
  doc.rect(0, footerY, pageWidth, footerHeight, 'F');
  
  try {
    const footerCenterY = footerY + footerHeight / 2;
    const footerTextY = footerCenterY + 1;
    const iconSize = 3.6;
    const iconTextGap = 2.5;
    const separatorGap = 5;
    const separatorHeight = 8.5;
    const labelText = 'RIDER.BROSS';
    const webText = 'www.riderbross.com';
    const webLetterSpacing = 0.35;

    setServicePdfFont(doc, 'bold');
    doc.setFontSize(8);
    const labelWidth = doc.getTextWidth(labelText);
    setServicePdfFont(doc, 'normal');
    doc.setFontSize(8);
    const webWidth =
      doc.getTextWidth(webText) + Math.max(0, webText.length - 1) * webLetterSpacing;

    const footerContentWidth = iconSize + iconTextGap + labelWidth + separatorGap * 2 + webWidth;
    const contentStartX = pageWidth / 2 - footerContentWidth / 2;
    const iconX = contentStartX;
    const iconY = footerCenterY - iconSize / 2;
    const labelX = iconX + iconSize + iconTextGap;
    const separatorX = labelX + labelWidth + separatorGap;
    const webX = separatorX + separatorGap;

    // Resplandor radial más difuminado y celeste alrededor de los ítems centrales.
    const glowColor: [number, number, number] = [140, 210, 255];
    for (let i = 0; i < 96; i++) {
      const ratio = i / 95;
      const glow = Math.pow(ratio, 1.55) * 0.14;
      const r = Math.round(colorBgPrimary[0] + (glowColor[0] - colorBgPrimary[0]) * glow);
      const g = Math.round(colorBgPrimary[1] + (glowColor[1] - colorBgPrimary[1]) * glow);
      const b = Math.round(colorBgPrimary[2] + (glowColor[2] - colorBgPrimary[2]) * glow);
      const radiusX = 102 - ratio * 58;
      const radiusY = 7.4 - ratio * 4.6;
      doc.setFillColor(r, g, b);
      doc.ellipse(pageWidth / 2, footerCenterY, radiusX, radiusY, 'F');
    }

    drawInstagramIconVector(doc, iconX, iconY - 0.1, iconSize);

    // Nombre "RIDER.BROSS" a la derecha del icono en la misma línea.
    doc.setFontSize(8);
    setServicePdfFont(doc, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(labelText, labelX, footerTextY);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.25);
    doc.line(
      separatorX,
      footerCenterY - separatorHeight / 2,
      separatorX,
      footerCenterY + separatorHeight / 2
    );
    
    // URL del sitio web a la derecha del separador.
    doc.setFontSize(8);
    setServicePdfFont(doc, 'normal');
    doc.setTextColor(255, 255, 255);
    let webCharX = webX;
    for (const char of webText) {
      doc.text(char, webCharX, footerTextY);
      webCharX += doc.getTextWidth(char) + webLetterSpacing;
    }
  } catch (error) {
    console.warn('Error al dibujar el pie de página:', error);
  }

  // Numeración de páginas en el margen inferior derecho (todas las páginas)
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    setServicePdfFont(doc, 'normal');
    doc.setFontSize(8);
    const pageLabel = `${page} / ${totalPages}`;

    if (page === totalPages) {
      // Última página: sobre el footer oscuro
      doc.setTextColor(255, 255, 255);
      doc.text(pageLabel, pageWidth - margin, footerY + footerHeight / 2 + 1, { align: 'right' });
    } else {
      doc.setTextColor(...colorBlack);
      doc.text(pageLabel, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }
  }
}

