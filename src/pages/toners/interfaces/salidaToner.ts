import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";
import { Toner } from "./toners";
import { Impresora } from "./impresora";
import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";

export interface SalidaToner {
  id_movimiento: number;
  toner_id: number;
  cantidad: number;
  fecha: Date;
  impresora_destino_id: number;
  usuario_id: number;
  usuario_id_retira: number;
  sucursal_id: number;
  observaciones: string;
  impresora_origen_id: number;
  impresoras_salidatoners_impresora_origen_idToimpresoras: Impresora;
  toner: Toner;
  sucursales: Sucursal;
  impresoras: Impresora;
  usuarios_salidatoners_usuario_retiro_idTousuarios: Usuario;
  usuarios: Usuario;
}
