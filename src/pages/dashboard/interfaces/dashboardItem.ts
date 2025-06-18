export const mantenimientosData = [
  { name: 'Al día', value: 75, color: '#4ade80' },
  { name: 'Próximos', value: 15, color: '#fbbf24' },
  { name: 'Vencidos', value: 10, color: '#f87171' },
];

export const tonerData = [
  { name: 'Disponibles', value: 85, color: '#4ade80' },
  { name: 'Alerta', value: 15, color: '#f87171' },
];

export const sedesData = [
  { name: 'Sede A', cantidad: 150 },
  { name: 'Sede B', cantidad: 120 },
  { name: 'Sede C', cantidad: 80 },
  { name: 'Sede D', cantidad: 65 },
];

export const rendimientoTonerData = [
  { name: 'Ene', rendimiento: 85 },
  { name: 'Feb', rendimiento: 82 },
  { name: 'Mar', rendimiento: 78 },
  { name: 'Abr', rendimiento: 90 },
  { name: 'May', rendimiento: 92 },
  { name: 'Jun', rendimiento: 87 },
];

export const incidentesData = [
  { name: 'Ene', hardware: 25, software: 15 },
  { name: 'Feb', hardware: 18, software: 22 },
  { name: 'Mar', hardware: 22, software: 19 },
  { name: 'Abr', hardware: 15, software: 25 },
  { name: 'May', hardware: 20, software: 18 },
  { name: 'Jun', hardware: 12, software: 14 },
];

export const serviciosActivosData = [
  { name: 'Office 365', valor: 230 },
  { name: 'Adobe CC', valor: 85 },
  { name: 'Antivirus', valor: 350 },
  { name: 'Desarrollo', valor: 40 },
  { name: 'ERP', valor: 125 },
];

export const tiempoRespuestaData = [
  { name: 'Ene', tiempo: 4.5 },
  { name: 'Feb', tiempo: 3.8 },
  { name: 'Mar', tiempo: 4.2 },
  { name: 'Abr', tiempo: 3.5 },
  { name: 'May', tiempo: 3.2 },
  { name: 'Jun', tiempo: 2.8 },
];

export const solicitudesData = [
  { name: 'Hardware', value: 35, color: '#3b82f6' },
  { name: 'Software', value: 25, color: '#8b5cf6' },
  { name: 'Red', value: 15, color: '#f43f5e' },
  { name: 'Otros', value: 25, color: '#f97316' },
];

export const rendimientoEquiposData = [
  { nombre: 'Laptops HP', rendimiento: 85 },
  { nombre: 'Laptops Dell', rendimiento: 92 },
  { nombre: 'Desktops HP', rendimiento: 78 },
  { nombre: 'Desktops Dell', rendimiento: 90 },
  { nombre: 'Servidores', rendimiento: 95 },
];

export type DashboardItem = {
  id: string;
  order: number;
  title: string;
  size: 'small' | 'large';
  component?: JSX.Element;
  chartType?: 'bar' | 'pie' | 'line' | 'area';
  data?: any[];
  tab?: string;
};