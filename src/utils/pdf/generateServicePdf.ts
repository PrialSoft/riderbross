import { supabase } from '@/lib/supabase/client';
import {
  createServiceJsPdf,
  drawServicePdfContent,
  fetchServicioCompletoForPdf,
  getServicePdfFilename,
  registerServicePdfFonts,
  SERVICE_PDF_FONT_URLS,
  type ServicePdfFonts,
} from '@/utils/pdf/servicePdfDocument';

/** Máx. lado del logo en px al rasterizar: evita incrustar PNG enormes (PDF de descarga hinchado). */
const LOGO_MAX_PX = 420;

async function loadLogoDataUrlBrowser(): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/images/Logo.png';
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
    });
    if (!logoImg.complete || logoImg.naturalWidth <= 0) return null;
    const iw = logoImg.naturalWidth;
    const ih = logoImg.naturalHeight;
    const scale = Math.min(1, LOGO_MAX_PX / Math.max(iw, ih));
    const tw = Math.max(1, Math.round(iw * scale));
    const th = Math.max(1, Math.round(ih * scale));
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(logoImg, 0, 0, tw, th);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

async function loadFontBase64Browser(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la fuente del PDF: ${url}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadServicePdfFontsBrowser(): Promise<ServicePdfFonts> {
  const [regularBase64, boldBase64] = await Promise.all([
    loadFontBase64Browser(SERVICE_PDF_FONT_URLS.regular),
    loadFontBase64Browser(SERVICE_PDF_FONT_URLS.bold),
  ]);

  return { regularBase64, boldBase64 };
}

export async function generateServicePdf(servicioId: number): Promise<void> {
  const servicioCompleto = await fetchServicioCompletoForPdf(supabase, servicioId);
  const [logoDataUrl, fonts] = await Promise.all([
    loadLogoDataUrlBrowser(),
    loadServicePdfFontsBrowser(),
  ]);
  const doc = createServiceJsPdf();
  registerServicePdfFonts(doc, fonts);
  drawServicePdfContent(doc, servicioCompleto, logoDataUrl);
  doc.save(getServicePdfFilename(servicioCompleto));
}
