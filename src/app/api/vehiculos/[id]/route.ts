import { NextRequest, NextResponse } from 'next/server';
import { deleteVehiculo } from '@/app/admin/dashboard/_actions/vehiculos';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehiculoId = parseInt(id, 10);

    if (isNaN(vehiculoId) || vehiculoId <= 0) {
      return NextResponse.json(
        { success: false, error: 'ID de vehículo inválido' },
        { status: 400 }
      );
    }

    await deleteVehiculo(vehiculoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}










