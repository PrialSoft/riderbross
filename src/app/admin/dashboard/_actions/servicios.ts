'use server';

import { createClient } from '@/lib/supabase/server';

export async function createServicio(input: {
  idvehiculo: number;
  fechaservicio: string; // YYYY-MM-DD
  kmservicio: number;
  calificacion: number | null;
  comentario: string | null;
  fotoservicioBase64?: string | null; // base64 sin prefijo (data:...)
  detalles?: Array<{
    idtiposervicio: number | null;
    proximoenkm: number | null;
    comentario: string | null;
    idestado: number | null;
    recomendacion: string | null;
  }>;
}) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  if (!Number.isFinite(input.idvehiculo) || input.idvehiculo <= 0) throw new Error('Vehículo inválido');
  if (!input.fechaservicio) throw new Error('Fecha de servicio es obligatoria');
  if (!Number.isFinite(input.kmservicio) || input.kmservicio <= 0) throw new Error('KM inválido');
  if (input.calificacion !== null && (input.calificacion < 1 || input.calificacion > 5)) {
    throw new Error('Calificación inválida');
  }

  // idcliente: lo tomamos del vehículo seleccionado para mantener consistencia
  const { data: vehiculo, error: vehiculoErr } = await supabase
    .from('vehiculo')
    .select('idcliente')
    .eq('id', input.idvehiculo)
    .maybeSingle();

  if (vehiculoErr) throw new Error(vehiculoErr.message);

  const fotoHex =
    input.fotoservicioBase64 === undefined
      ? null
      : input.fotoservicioBase64 === null
        ? null
        : `\\x${Buffer.from(input.fotoservicioBase64, 'base64').toString('hex')}`;

  const { data: servicioRow, error } = await supabase
    .from('servicios')
    .insert({
      idvehiculo: input.idvehiculo,
      idcliente: vehiculo?.idcliente ?? null,
      fechaservicio: input.fechaservicio,
      kmservicio: input.kmservicio,
      calificacion: input.calificacion ?? null,
      comentario: input.comentario?.trim() || null,
      fotoservicio: fotoHex,
    })
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!servicioRow?.id) throw new Error('No se pudo crear el servicio');

  const detalles = (input.detalles ?? [])
    .map((d) => ({
      idservicio: servicioRow.id,
      idtiposervicio: d.idtiposervicio ?? null,
      proximoenkm: d.proximoenkm ?? null,
      comentario: d.comentario?.trim() || null,
      idestado: d.idestado ?? null,
      recomendacion: d.recomendacion?.trim() || null,
    }))
    .filter(
      (d) =>
        d.idtiposervicio !== null ||
        d.proximoenkm !== null ||
        d.idestado !== null ||
        (d.comentario && d.comentario.length > 0) ||
        (d.recomendacion && d.recomendacion.length > 0)
    );

  if (detalles.length > 0) {
    if (detalles.length > 200) throw new Error('Demasiados detalles (máx. 200)');

    const { error: detErr } = await supabase.from('detallesservicio').insert(detalles);
    if (detErr) throw new Error(detErr.message);
  }
}

export async function updateServicio(
  id: number,
  input: {
    idvehiculo: number;
    fechaservicio: string; // YYYY-MM-DD
    kmservicio: number;
    calificacion: number | null;
    comentario: string | null;
    fotoservicioBase64?: string | null; // undefined = no tocar, null = limpiar, string = set
    detalles?: Array<{
      idtiposervicio: number | null;
      proximoenkm: number | null;
      comentario: string | null;
      idestado: number | null;
      recomendacion: string | null;
    }>;
  }
) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  if (!Number.isFinite(id) || id <= 0) throw new Error('ID inválido');
  if (!Number.isFinite(input.idvehiculo) || input.idvehiculo <= 0) throw new Error('Vehículo inválido');
  if (!input.fechaservicio) throw new Error('Fecha de servicio es obligatoria');
  if (!Number.isFinite(input.kmservicio) || input.kmservicio <= 0) throw new Error('KM inválido');
  if (input.calificacion !== null && (input.calificacion < 1 || input.calificacion > 5)) {
    throw new Error('Calificación inválida');
  }

  const { data: vehiculo, error: vehiculoErr } = await supabase
    .from('vehiculo')
    .select('idcliente')
    .eq('id', input.idvehiculo)
    .maybeSingle();

  if (vehiculoErr) throw new Error(vehiculoErr.message);

  const updatePayload: Record<string, unknown> = {
    idvehiculo: input.idvehiculo,
    idcliente: vehiculo?.idcliente ?? null,
    fechaservicio: input.fechaservicio,
    kmservicio: input.kmservicio,
    calificacion: input.calificacion ?? null,
    comentario: input.comentario?.trim() || null,
  };

  if (input.fotoservicioBase64 !== undefined) {
    updatePayload.fotoservicio =
      input.fotoservicioBase64 === null
        ? null
        : `\\x${Buffer.from(input.fotoservicioBase64, 'base64').toString('hex')}`;
  }

  const { error } = await supabase.from('servicios').update(updatePayload).eq('id', id);

  if (error) throw new Error(error.message);

  // Reemplazar detalles (simple y robusto para un editor masivo)
  const { error: delErr } = await supabase.from('detallesservicio').delete().eq('idservicio', id);
  if (delErr) throw new Error(delErr.message);

  const detalles = (input.detalles ?? [])
    .map((d) => ({
      idservicio: id,
      idtiposervicio: d.idtiposervicio ?? null,
      proximoenkm: d.proximoenkm ?? null,
      comentario: d.comentario?.trim() || null,
      idestado: d.idestado ?? null,
      recomendacion: d.recomendacion?.trim() || null,
    }))
    .filter(
      (d) =>
        d.idtiposervicio !== null ||
        d.proximoenkm !== null ||
        d.idestado !== null ||
        (d.comentario && d.comentario.length > 0) ||
        (d.recomendacion && d.recomendacion.length > 0)
    );

  if (detalles.length > 0) {
    if (detalles.length > 200) throw new Error('Demasiados detalles (máx. 200)');
    const { error: detErr } = await supabase.from('detallesservicio').insert(detalles);
    if (detErr) throw new Error(detErr.message);
  }
}


