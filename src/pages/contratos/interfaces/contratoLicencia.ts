// Tipo para contratos de licencia
export type ContratoLicencia = {
  id: string;
  nombre: string;
  empresa: string;
  tipoLicencia: string;
  usuarios: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
};

// Datos de ejemplo
export const licenciasEjemplo: ContratoLicencia[] = [
  {
    id: '1',
    nombre: 'Microsoft Office 365',
    empresa: 'Microsoft',
    tipoLicencia: 'Suscripción Anual',
    usuarios: 100,
    fechaInicio: '2023-01-01',
    fechaFin: '2024-12-31',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Adobe Creative Cloud',
    empresa: 'Adobe',
    tipoLicencia: 'Suscripción Anual',
    usuarios: 25,
    fechaInicio: '2023-02-15',
    fechaFin: '2024-02-14',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'Antivirus Corporativo',
    empresa: 'Norton',
    tipoLicencia: 'Perpetua',
    usuarios: 200,
    fechaInicio: '2023-03-10',
    fechaFin: '2024-03-09',
    estado: 'pendiente',
  },
];