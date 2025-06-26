import { Impresora } from "./impresora";
import { Toner } from "./toners";

export interface TonerImpresora {
  toner_id: number;
  impresora_id: number;
  toner: Toner;
  impresoras: Impresora;
}