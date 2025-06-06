
export interface Toner {
  id_toner: number;
  modelo: string;
  color: string;
  cantidad: number;
  compatible_con: string;
  stock_actual: number;
  stock_minimo_alerta: number;
}