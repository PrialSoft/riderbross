'use server';

import { createClient } from '@/lib/supabase/server';

export async function createVehiculo(input: {
  patente: string;
  idmarca: number | null;
  modelo: string | null;
  anio: string | null; // YYYY-MM-DD
  kmactual: number | null;
  idcliente: number | null;
  commentarioprivado?: string | null;
}) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const patente = input.patente.trim().toUpperCase();
  if (!patente) throw new Error('Patente es obligatoria');

  const { error } = await supabase.from('vehiculo').insert({
    patente,
    idmarca: input.idmarca ?? null,
    modelo: input.modelo?.trim() || null,
    anio: input.anio || null,
    kmactual: input.kmactual ?? 0,
    idcliente: input.idcliente ?? null,
    commentarioprivado: input.commentarioprivado?.trim() || null,
  });

  if (error) throw new Error(error.message);
}

export async function updateVehiculo(
  id: number,
  input: {
    patente: string;
    idmarca: number | null;
    modelo: string | null;
    anio: string | null; // YYYY-MM-DD
    kmactual: number | null;
    idcliente: number | null;
    commentarioprivado?: string | null;
  }
) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  if (!Number.isFinite(id) || id <= 0) throw new Error('ID inválido');

  const patente = input.patente.trim().toUpperCase();
  if (!patente) throw new Error('Patente es obligatoria');

  const { error } = await supabase
    .from('vehiculo')
    .update({
      patente,
      idmarca: input.idmarca ?? null,
      modelo: input.modelo?.trim() || null,
      anio: input.anio || null,
      kmactual: input.kmactual ?? 0,
      idcliente: input.idcliente ?? null,
      commentarioprivado: input.commentarioprivado?.trim() || null,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}


