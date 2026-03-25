import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase/client';
import {
  drawServicePdfContent,
  fetchServicioCompletoForPdf,
  getServicePdfFilename,
} from '@/utils/pdf/servicePdfDocument';

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
    const canvas = document.createElement('canvas');
    canvas.width = logoImg.naturalWidth;
    canvas.height = logoImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(logoImg, 0, 0);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

export async function generateServicePdf(servicioId: number): Promise<void> {
  const servicioCompleto = await fetchServicioCompletoForPdf(supabase, servicioId);
  const logoDataUrl = await loadLogoDataUrlBrowser();
  const doc = new jsPDF();
  drawServicePdfContent(doc, servicioCompleto, logoDataUrl);
  doc.save(getServicePdfFilename(servicioCompleto));
}
