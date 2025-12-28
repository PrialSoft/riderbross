'use server';

import { createClient } from '@/lib/supabase/server';

export async function createTipoServicio(input: {
  nombre: string;
  referencia: string | null;
  idcategoriaservicio: number | null;
}) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const nombre = input.nombre.trim();
  if (!nombre) throw new Error('El nombre es obligatorio');

  const { error } = await supabase.from('tiposservicio').insert({
    nombre,
    referencia: input.referencia?.trim() || null,
    idcategoriaservicio: input.idcategoriaservicio ?? null,
  });

  if (error) throw new Error(error.message);
}

export async function updateTipoServicio(id: number, input: {
  nombre: string;
  referencia: string | null;
  idcategoriaservicio: number | null;
}) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const nombre = input.nombre.trim();
  if (!nombre) throw new Error('El nombre es obligatorio');

  const { error } = await supabase
    .from('tiposservicio')
    .update({
      nombre,
      referencia: input.referencia?.trim() || null,
      idcategoriaservicio: input.idcategoriaservicio ?? null,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}


