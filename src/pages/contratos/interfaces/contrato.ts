export interface Contrato {
  id_contrato: number;
  nombre: string;
  descripcion: string;
  empresa_nombre: string;
  tipo_contrato: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: string;

  DocumentoContrato: {
    id_documento: number;
    id_contrato: Contrato | number;
    nombre_documento: string;
    tipo_documento: string;
    archivo:  File | string | null;
    fecha_subida: Date;
  };
}