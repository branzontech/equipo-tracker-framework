// Tipo para contratos de proveedores
export type ContratoProveedor = {
  id: string;
  nombre: string;
  empresa: string;
  tipoServicio: string;
  contacto: string;
  telefono: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
export const proveedoresEjemplo: ContratoProveedor[] = [
  {
    id: '1',
    nombre: 'Mantenimiento de Servidores',
    empresa: 'Dell',
    tipoServicio: 'Mantenimiento preventivo y correctivo',
    contacto: 'Juan Pérez',
    telefono: '555-1234',
    fechaInicio: '2023-03-15',
    fechaFin: '2024-03-14',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Soporte Técnico 24/7',
    empresa: 'TechSupport Inc',
    tipoServicio: 'Soporte técnico',
    contacto: 'Ana López',
    telefono: '555-5678',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-06-30',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Instalación Red de Datos',
    empresa: 'Networking Solutions',
    tipoServicio: 'Instalación y configuración',
    contacto: 'Carlos Ruiz',
    telefono: '555-9012',
    fechaInicio: '2023-05-20',
    fechaFin: '2023-11-19',
    estado: 'inactivo',
  },
];