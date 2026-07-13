'use server';

import { createClient } from '@/lib/supabase/server';
import { toPascalCaseName } from '@/utils/nombre';

export async function createCliente(input: {
  nombres: string;
  apellidos: string;
  email: string;
  dni?: number;
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

  const nombres = toPascalCaseName(input.nombres);
  const apellidos = toPascalCaseName(input.apellidos);
  const email = input.email.trim().toLowerCase();

  if (!nombres) throw new Error('Nombres es obligatorio');
  if (!apellidos) throw new Error('Apellidos es obligatorio');
  if (!email) throw new Error('Email es obligatorio');
  // DNI debe ser un número válido (0 si no se proporciona)
  const dniValue = input.dni ?? 0;
  if (!Number.isFinite(dniValue) || dniValue < 0) {
    throw new Error('DNI inválido');
  }
  if (input.telefono === null) throw new Error('Teléfono es obligatorio');
  if (!Number.isFinite(input.telefono) || input.telefono <= 0) throw new Error('Teléfono inválido');

  const { error } = await supabase.from('clientes').insert({
    nombres,
    apellidos,
    email,
    dni: dniValue,
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
    dni?: number;
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

  const nombres = toPascalCaseName(input.nombres);
  const apellidos = toPascalCaseName(input.apellidos);
  const email = input.email.trim().toLowerCase();

  if (!nombres) throw new Error('Nombres es obligatorio');
  if (!apellidos) throw new Error('Apellidos es obligatorio');
  if (!email) throw new Error('Email es obligatorio');
  // DNI debe ser un número válido (0 si no se proporciona)
  const dniValue = input.dni ?? 0;
  if (!Number.isFinite(dniValue) || dniValue < 0) {
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
      dni: dniValue,
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

export async function deleteCliente(id: number) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  if (!Number.isFinite(id) || id <= 0) throw new Error('ID inválido');

  // Verificar si el cliente tiene vehículos relacionados
  const { data: vehiculos, error: vehiculosError } = await supabase
    .from('vehiculo')
    .select('id, patente')
    .eq('idcliente', id);

  if (vehiculosError) throw new Error('Error al verificar vehículos relacionados');

  if (vehiculos && vehiculos.length > 0) {
    const patentes = vehiculos.map((v) => v.patente).join(', ');
    throw new Error(
      `No se puede eliminar el cliente porque tiene ${vehiculos.length} vehículo(s) relacionado(s): ${patentes}. Por favor, elimine o reasigne los vehículos primero.`
    );
  }

  // Eliminar el cliente
  const { error } = await supabase.from('clientes').delete().eq('id', id);

  if (error) throw new Error(error.message);
}


