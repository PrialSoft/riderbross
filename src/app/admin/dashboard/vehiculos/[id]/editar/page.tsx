import { redirect } from 'next/navigation';

export default async function EditarVehiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/dashboard/vehiculos?edit=${encodeURIComponent(id)}`);
}


