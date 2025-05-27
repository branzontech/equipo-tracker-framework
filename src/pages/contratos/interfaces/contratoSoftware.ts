// Tipo para contratos de software
export type ContratoSoftware = {
  id: string;
  nombre: string;
  empresa: string;
  tipoSoftware: string;
  version: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
export const softwareEjemplo: ContratoSoftware[] = [
  {
    id: '1',
    nombre: 'Sistema ERP Empresarial',
    empresa: 'SAP',
    tipoSoftware: 'ERP',
    version: '2023.1',
    fechaInicio: '2023-01-15',
    fechaFin: '2024-01-14',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Sistema de Gestión de Proyectos',
    empresa: 'Atlassian',
    tipoSoftware: 'Gestión de Proyectos',
    version: '10.5',
    fechaInicio: '2023-04-01',
    fechaFin: '2024-03-31',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Software de Contabilidad',
    empresa: 'Contasoft',
    tipoSoftware: 'Contabilidad',
    version: '2023',
    fechaInicio: '2022-11-10',
    fechaFin: '2023-11-09',
    estado: 'pendiente',
  },
];