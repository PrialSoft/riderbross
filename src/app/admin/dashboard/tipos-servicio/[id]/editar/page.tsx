import { redirect } from 'next/navigation';

export default async function EditarTipoServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/dashboard/tipos-servicio?edit=${encodeURIComponent(id)}`);
}


