// Tipo para los contratos
export type Contrato = {
  id: string;
  nombre: string;
  empresa: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  descripcion: string;
};

// Datos de ejemplo
export const contratosEjemplo: Contrato[] = [
  {
    id: '1',
    nombre: 'Contrato de Licencia Microsoft Office',
    empresa: 'Microsoft',
    tipo: 'licencia',
    fechaInicio: '2023-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
    descripcion: 'Licencia para 100 usuarios de Microsoft Office 365'
  },
  {
    id: '2',
    nombre: 'Contrato Mantenimiento Servidores',
    empresa: 'Dell',
    tipo: 'proveedores',
    fechaInicio: '2023-03-15',
    fechaFin: '2024-03-14',
    estado: 'activo',
    descripcion: 'Mantenimiento preventivo y correctivo para servidores'
  },
  {
    id: '3',
    nombre: 'Licencia ERP Empresarial',
    empresa: 'SAP',
    tipo: 'software',
    fechaInicio: '2022-05-10',
    fechaFin: '2023-05-09',
    estado: 'inactivo',
    descripcion: 'Sistema ERP para gestión empresarial'
  },
  {
    id: '4',
    nombre: 'Contrato Soporte Técnico',
    empresa: 'TechSupport Inc',
    tipo: 'proveedores',
    fechaInicio: '2023-07-01',
    fechaFin: '2024-06-30',
    estado: 'activo',
    descripcion: 'Soporte técnico 24/7 para infraestructura TI'
  },
  {
    id: '5',
    nombre: 'Licencia Antivirus Corporativo',
    empresa: 'Norton',
    tipo: 'licencia',
    fechaInicio: '2023-02-01',
    fechaFin: '2024-01-31',
    estado: 'pendiente',
    descripcion: 'Protección antivirus para 200 equipos'
  },
];