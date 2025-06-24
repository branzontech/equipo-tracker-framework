import { Perifericos } from './../../configuracion/maestros/interfaces/periferico';
import { Equipo } from "./equipo";

export interface Acta {
  id_acta: number;
  tipo: string | null;
  fecha: Date | string;

  prestamos: {
    id_prestamo: number;
    fecha_salida: Date | null;
    fecha_retorno: Date | null;
    descripcion: string | null;
    estado: string | null;
    usuarios_prestamos_responsable_salida_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    usuarios_prestamos_responsable_entrada_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    prestamo_equipos: {
      id: number;
      equipos: Equipo | null;
      prestamo_perifericos: {
        id: number;
        perifericos: {
          id_periferico: number;
          nombre: string;
        } | null;
      }[];
    }[];
    prestamo_perifericos_directos: {
      id: number;
      perifericos: Perifericos | null;
    }[];
  }[];

  bajas: {
    id_baja: number;
    fecha_baja: Date | null;
    observaciones_adicionales: string | null;
    estado: string | null;
    usuarios_bajas_responsable_autorizacion_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    usuarios_bajas_responsable_solicitud_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    bajas_equipos: {
      id: number;
      motivos: string | null;
      equipos: Equipo | null;
    }[];
  }[];

  traslados: {
    id_traslado: number;
    fecha_traslado: Date | null;
    motivo: string | null;
    observaciones: string | null;
    estado: string | null;
    usuarios_traslados_responsable_salida_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    usuarios_traslados_responsable_entrada_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    sucursales: {
      id_sucursal: number;
      nombre: string;
      sedes: {
        id_sede: number;
        nombre: string;
        regional: string | null;
      } | null;
    } | null;
    traslados_equipos: {
      id: number;
      equipos: Equipo | null;
      traslados_perifericos: {
        id: number;
        perifericos: {
          id_periferico: number;
          nombre: string;
        } | null;
      }[];
    }[];
  }[];

  devoluciones: {
    id_devolucion: number;
    fecha_devolucion: Date | null;
    motivo: string | null;
    estado_equipo: string | null;
    observaciones: string | null;
    estado: string | null;

    usuarios_devoluciones_usuario_entrega_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;
    usuarios_devoluciones_usuario_recibe_idTousuarios: {
      id_usuario: number;
      nombre: string;
      firma: string;
    } | null;

    prestamos: {
      id_prestamo: number;
      prestamo_equipos: {
        id: number;
        equipos: Equipo | null;
        prestamo_perifericos: {
          id: number;
          perifericos: {
            id_periferico: number;
            nombre: string;
          } | null;
        }[];
      }[];
    } | null;

    traslados: {
      id_traslado: number;
      traslados_equipos: {
        id: number;
        equipos: Equipo | null;
        traslados_perifericos: {
          id: number;
          perifericos: {
            id_periferico: number;
            nombre: string;
          } | null;
        }[];
      }[];
      sucursales: {
        id_sucursal: number;
        nombre: string;
        sedes: {
          id_sede: number;
          nombre: string;
          regional: string | null;
        } | null;
      } | null;
    } | null;
  }[];
}
