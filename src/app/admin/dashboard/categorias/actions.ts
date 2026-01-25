'use server';

import { createClient } from '@/lib/supabase/server';

export async function createCategoria(input: { nombre: string; orden?: number }) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const nombre = input.nombre.trim().toUpperCase();
  if (!nombre) throw new Error('El nombre es obligatorio');

  // Verificar si ya existe una categoría con el mismo nombre
  const { data: existing } = await supabase
    .from('categoriasservicio')
    .select('id')
    .eq('nombre', nombre)
    .maybeSingle();

  if (existing) {
    throw new Error('Ya existe una categoría con ese nombre');
  }

  const { error } = await supabase.from('categoriasservicio').insert({
    nombre,
    orden: input.orden ?? 0,
  });

  if (error) throw new Error(error.message);
}

export async function updateCategoria(id: number, input: { nombre: string; orden?: number }) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  const nombre = input.nombre.trim().toUpperCase();
  if (!nombre) throw new Error('El nombre es obligatorio');

  // Verificar si ya existe otra categoría con el mismo nombre
  const { data: existing } = await supabase
    .from('categoriasservicio')
    .select('id')
    .eq('nombre', nombre)
    .neq('id', id)
    .maybeSingle();

  if (existing) {
    throw new Error('Ya existe una categoría con ese nombre');
  }

  const { error } = await supabase
    .from('categoriasservicio')
    .update({ 
      nombre,
      orden: input.orden ?? 0,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteCategoria(id: number) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('No autorizado');

  // Verificar si hay tipos de servicio usando esta categoría
  const { data: tiposServicio } = await supabase
    .from('tiposservicio')
    .select('id')
    .eq('idcategoriaservicio', id)
    .limit(1);

  if (tiposServicio && tiposServicio.length > 0) {
    throw new Error('No se puede eliminar la categoría porque está siendo utilizada por tipos de servicio');
  }

  const { error } = await supabase.from('categoriasservicio').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

