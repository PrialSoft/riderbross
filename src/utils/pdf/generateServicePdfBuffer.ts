import { readFile } from 'fs/promises';
import path from 'path';
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

async function loadLogoDataUrlServer(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'Logo.png');
    const buf = await readFile(filePath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

function getPublicFilePath(publicUrl: string): string {
  return path.join(process.cwd(), 'public', publicUrl.replace(/^\//, ''));
}

async function loadServicePdfFontsServer(): Promise<ServicePdfFonts> {
  const [regular, bold] = await Promise.all([
    readFile(getPublicFilePath(SERVICE_PDF_FONT_URLS.regular)),
    readFile(getPublicFilePath(SERVICE_PDF_FONT_URLS.bold)),
  ]);

  return {
    regularBase64: regular.toString('base64'),
    boldBase64: bold.toString('base64'),
  };
}

export async function generateServicePdfBuffer(
  servicioId: number
): Promise<{ buffer: Buffer; filename: string }> {
  const servicioCompleto = await fetchServicioCompletoForPdf(supabase, servicioId);
  const [logoDataUrl, fonts] = await Promise.all([
    loadLogoDataUrlServer(),
    loadServicePdfFontsServer(),
  ]);
  const doc = createServiceJsPdf();
  registerServicePdfFonts(doc, fonts);
  drawServicePdfContent(doc, servicioCompleto, logoDataUrl);
  const pdfOutput = doc.output('arraybuffer');
  return {
    buffer: Buffer.from(pdfOutput),
    filename: getServicePdfFilename(servicioCompleto),
  };
}
