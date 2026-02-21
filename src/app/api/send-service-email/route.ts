import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ServiceReportEmail } from '@/emails/ServiceReportEmail';
import { generateServicePdfBuffer } from '@/utils/pdf/generateServicePdfBuffer';
import { formatPatente } from '@/utils/patente';

// Validar que la API key esté configurada
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error('ERROR: RESEND_API_KEY no está configurada en las variables de entorno');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    // Validar que Resend esté configurado
    if (!resend || !resendApiKey) {
      const isProduction = process.env.NODE_ENV === 'production';
      const errorMessage = isProduction
        ? 'RESEND_API_KEY no está configurada. Por favor, agrega la variable de entorno RESEND_API_KEY en tu plataforma de hosting (Vercel, Netlify, etc.)'
        : 'RESEND_API_KEY no está configurada. Por favor, agrega RESEND_API_KEY en tu archivo .env.local';
      
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { servicioId, emails, patente, clienteNombre } = body;

    if (!servicioId || !emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos: servicioId y emails' },
        { status: 400 }
      );
    }

    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter((email: string) => emailRegex.test(email.trim()));
    
    if (validEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionaron emails válidos' },
        { status: 400 }
      );
    }

    // Generar PDF como buffer
    const pdfBuffer = await generateServicePdfBuffer(servicioId);

    // Renderizar template de email
    const emailHtml = await render(
      ServiceReportEmail({
        patente: patente ? formatPatente(patente) : 'N/A',
        clienteNombre,
      })
    );

    // Enviar email con Resend
    const patenteFormatted = patente ? formatPatente(patente) : 'N/A';
    const safePatente = patenteFormatted.replace(/[^a-zA-Z0-9_-]+/g, '_');

    const { data, error } = await resend.emails.send({
      from: 'RiderBross <info@riderbross.com>',
      to: validEmails,
      subject: `Informe de Servicio Técnico - Patente ${patenteFormatted}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Informe_RiderBross_${safePatente}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (error) {
      console.error('Error al enviar email con Resend:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Error al enviar el email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en send-service-email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

