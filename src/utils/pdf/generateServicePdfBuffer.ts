import { readFile } from 'fs/promises';
import path from 'path';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase/client';
import {
  drawServicePdfContent,
  fetchServicioCompletoForPdf,
  getServicePdfFilename,
} from '@/utils/pdf/servicePdfDocument';

async function loadLogoDataUrlServer(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'Logo.png');
    const buf = await readFile(filePath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function generateServicePdfBuffer(
  servicioId: number
): Promise<{ buffer: Buffer; filename: string }> {
  const servicioCompleto = await fetchServicioCompletoForPdf(supabase, servicioId);
  const logoDataUrl = await loadLogoDataUrlServer();
  const doc = new jsPDF();
  drawServicePdfContent(doc, servicioCompleto, logoDataUrl);
  const pdfOutput = doc.output('arraybuffer');
  return {
    buffer: Buffer.from(pdfOutput),
    filename: getServicePdfFilename(servicioCompleto),
  };
}
