import { supabase } from '@/lib/supabase/client';
import {
  createServiceJsPdf,
  drawServicePdfContent,
  fetchServicioCompletoForPdf,
  getServicePdfFilename,
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

export async function generateServicePdf(servicioId: number): Promise<void> {
  const servicioCompleto = await fetchServicioCompletoForPdf(supabase, servicioId);
  const logoDataUrl = await loadLogoDataUrlBrowser();
  const doc = createServiceJsPdf();
  drawServicePdfContent(doc, servicioCompleto, logoDataUrl);
  doc.save(getServicePdfFilename(servicioCompleto));
}
