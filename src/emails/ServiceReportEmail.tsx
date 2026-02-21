import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface ServiceReportEmailProps {
  patente: string;
  clienteNombre?: string;
}

export const ServiceReportEmail = ({ patente, clienteNombre }: ServiceReportEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={heading}>RiderBross</Heading>
          </Section>
          <Section style={content}>
            <Text style={greeting}>
              ¡Hola {clienteNombre ? clienteNombre.split(',')[1]?.trim() || clienteNombre : 'Rider'}!
            </Text>
            <Text style={paragraph}>
              Adjuntamos el informe técnico de tu moto con patente <strong>{patente}</strong>.
            </Text>
            <Text style={paragraph}>
              En este documento encontrarás todos los detalles del servicio realizado, incluyendo:
            </Text>
            <ul style={list}>
              <li>Servicios aplicados</li>
              <li>Checklist de sistemas (batería, iluminación, transmisión, ruedas, frenos)</li>
              <li>Observaciones y recomendaciones técnicas</li>
              <li>Próximos mantenimientos recomendados</li>
            </ul>
            <Text style={paragraph}>
            Este informe está pensado para acompañar el cuidado de tu moto! Tené en cuenta los kilómetros indicados y las especificaciones del manual del fabricante para planificar los próximos servicios y mantener tu moto siempre en óptimas condiciones. 🪽
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              Gracias por confiar en <strong>RiderBross</strong>.
            </Text>
            <Text style={footerSmall}>
              www.riderbross.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#04000C',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  backgroundColor: '#04000C',
  padding: '20px',
  textAlign: 'center' as const,
};

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'Montserrat, sans-serif',
};

const content = {
  padding: '20px',
  backgroundColor: '#ffffff',
};

const greeting = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#333333',
  marginBottom: '16px',
};

const list = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#333333',
  marginLeft: '20px',
  marginBottom: '16px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#333333',
  textAlign: 'center' as const,
  marginTop: '20px',
};

const footerSmall = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#888888',
  textAlign: 'center' as const,
  marginTop: '8px',
};

export default ServiceReportEmail;








