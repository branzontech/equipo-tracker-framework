export interface Proveedor {
  id_proveedor: number;
  tipo_proveedor: string;
  nombre: string;
  identificacion: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  sitio_web?: string;
}