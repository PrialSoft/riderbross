-- RiderBross - Migration
-- Agregar idcliente a servicios y relacionarlo con clientes
-- Nota: En Postgres sin comillas, los nombres quedan en minúscula (servicios, clientes, vehiculo, etc).

alter table if exists public.servicios
  add column if not exists idcliente int;

-- Backfill: si el servicio ya tiene vehículo, tomar el cliente desde el vehículo
update public.servicios s
set idcliente = v.idcliente
from public.vehiculo v
where s.idvehiculo = v.id
  and s.idcliente is null;

-- FK: cada servicio pertenece a un cliente
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'servicios_idcliente_fkey'
      and conrelid = 'public.servicios'::regclass
  ) then
    alter table public.servicios
      add constraint servicios_idcliente_fkey
      foreign key (idcliente) references public.clientes(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_servicios_idcliente on public.servicios(idcliente);

-- Nota: No agregamos UNIQUE(idcliente) porque un cliente puede tener múltiples servicios (1:N).


