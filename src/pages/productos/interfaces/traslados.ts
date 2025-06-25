import { Sede } from "@/pages/configuracion/maestros/interfaces/sedes";

export interface Traslado {
  id_traslado: number;
  acta_id: number;
  fecha_traslado: Date | null;
  motivo: string;
  observaciones: string;
  responsable_salida_id: number;
  responsable_entrada_id: number;
  tipo: string;
  usuarios: {
    id_usuario: number;
    nombre: string;
  };
  sucursal_destino_id: number;
  sucursales: {
    id_sucursal: number;
    nombre: string;
    sedes: Sede;
  };
  equipos: {
    id_equipo: number;
    perifericos: number[];
  }[];
  perifericos_directos: {
    id_periferico: number;
    nombre: string;
  }[];
  impresoras: {
    id_impresora: number;
    nombre: string;
  }[];
  usuarios_traslados_responsable_salida_idTousuarios: {
    id_usuario: number;
    nombre: string;
  };
  usuarios_traslados_responsable_entrada_idTousuarios: {
    id_usuario: number;
    nombre: string;
  }
}
