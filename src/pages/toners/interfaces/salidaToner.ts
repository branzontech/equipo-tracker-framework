export interface SalidaToner {
  id_movimiento: number;
  toner_id: number;
  cantidad: number;
  fecha: Date;
  impresora_destino_id: number;
  usuario_id: number;
  sucursal_id: number;
  observaciones: string;
}
