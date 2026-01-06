'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Capitaliza la primera letra de un texto y convierte el resto a minúsculas
 * @param text - Texto a capitalizar
 * @returns Texto con primera letra mayúscula y resto minúsculas
 */
function capitalizeFirst(text: string): string {
  if (!text || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export async function createCliente(input: {
  nombres: string;
  apellidos: string;
  email: string;
  dni?: number | null;
  telefono: number | null;
  idprovincia: number | null;
  localidad: string | null;
  direccion: string | null;
  fechanacimiento: string | null; // YYYY-MM-DD
  comentarioPrivado?: string | null;
}) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const nombres = capitalizeFirst(input.nombres.trim());
  const apellidos = capitalizeFirst(input.apellidos.trim());
  const email = input.email.trim().toLowerCase();

  if (!nombres) throw new Error('Nombres es obligatorio');
  if (!apellidos) throw new Error('Apellidos es obligatorio');
  if (!email) throw new Error('Email es obligatorio');
  // DNI es opcional, pero si se proporciona debe ser válido
  if (input.dni !== null && input.dni !== undefined && (!Number.isFinite(input.dni) || input.dni <= 0)) {
    throw new Error('DNI inválido');
  }
  if (input.telefono === null) throw new Error('Teléfono es obligatorio');
  if (!Number.isFinite(input.telefono) || input.telefono <= 0) throw new Error('Teléfono inválido');

  const { error } = await supabase.from('clientes').insert({
    nombres,
    apellidos,
    email,
    dni: input.dni ?? null,
    telefono: input.telefono,
    idprovincia: input.idprovincia ?? null,
    localidad: input.localidad?.trim() || null,
    direccion: input.direccion?.trim() || null,
    fechanacimiento: input.fechanacimiento || null,
    comentarioPrivado: input.comentarioPrivado?.trim() || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateCliente(
  id: number,
  input: {
    nombres: string;
    apellidos: string;
    email: string;
    dni?: number | null;
    telefono: number | null;
    idprovincia: number | null;
    localidad: string | null;
    direccion: string | null;
    fechanacimiento: string | null; // YYYY-MM-DD
    comentarioPrivado?: string | null;
  }
) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  if (!Number.isFinite(id) || id <= 0) throw new Error('ID inválido');

  const nombres = capitalizeFirst(input.nombres.trim());
  const apellidos = capitalizeFirst(input.apellidos.trim());
  const email = input.email.trim().toLowerCase();

  if (!nombres) throw new Error('Nombres es obligatorio');
  if (!apellidos) throw new Error('Apellidos es obligatorio');
  if (!email) throw new Error('Email es obligatorio');
  // DNI es opcional, pero si se proporciona debe ser válido
  if (input.dni !== null && input.dni !== undefined && (!Number.isFinite(input.dni) || input.dni <= 0)) {
    throw new Error('DNI inválido');
  }
  if (input.telefono === null) throw new Error('Teléfono es obligatorio');
  if (!Number.isFinite(input.telefono) || input.telefono <= 0) throw new Error('Teléfono inválido');

  const { error } = await supabase
    .from('clientes')
    .update({
      nombres,
      apellidos,
      email,
      dni: input.dni ?? null,
      telefono: input.telefono,
      idprovincia: input.idprovincia ?? null,
      localidad: input.localidad?.trim() || null,
      direccion: input.direccion?.trim() || null,
      fechanacimiento: input.fechanacimiento || null,
      comentarioPrivado: input.comentarioPrivado?.trim() || null,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}


