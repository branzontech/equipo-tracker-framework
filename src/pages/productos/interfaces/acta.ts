
export interface Acta {
  id_acta: number;
  tipo: string;
  fecha: Date;
  descripcion: string;
  estado: string;
  usuario_firma_id: number;
  pdf_generado: string;
}