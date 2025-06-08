import { Impresora } from "./impresora";

export interface Toner {
  id_toner: number;
  modelo: string;
  color: string;
  cantidad: number;
  stock_actual: number;
  stock_minimo_alerta: number;
  impresoras: number[];
}
