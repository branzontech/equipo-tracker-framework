import { Usuario } from "./../../configuracion/usuarios/interfaces/usuarios";
import { Categoria } from "@/pages/configuracion/maestros/interfaces/categorias";
import { Marca } from "@/pages/configuracion/maestros/interfaces/marcas";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";
import { Prestamo } from "./prestamo";
import { Traslado } from "./traslados";
import { Mantenimiento } from "@/pages/mantenimientos/interfaces/mantenimiento";
import { Devolucion } from "./devoluciones";
import { Proveedor } from "@/pages/configuracion/maestros/interfaces/proveedor";

export interface HistorialEquipo {
  id_historial: number;
  evento: string;
  fecha_evento: string;
  descripcion: string;
  usuarios: {
    id_usuario: number;
    nombre: string;
  };
}

export interface Equipo {
  sedes: string;
  id_equipo: number;
  nombre_equipo: string;
  nro_serie: string;
  modelo: string;
  marca_id: Marca | number;
  marcas: string | null;
  categoria_id: Categoria | number;
  categorias: Categoria | null;
  tipo_activo: string;
  fecha_registro: string;
  observaciones?: string;
  tags: string[];
  motivo: string;
  imagen: string;
  usuario_id: string;

  prestamo_equipos?: {
    prestamos: Prestamo;
  }[];

  traslados_equipos?: {
    traslados: Traslado;
  }[];

  trazabilidad?: {
    prestamo_equipos?: {
      prestamos: Prestamo;
    }[];
    traslados_equipos?: {
      traslados: Traslado;
    }[];
    mantenimiento_detalle?: {
      mantenimientos: Mantenimiento;
    }[];
    devoluciones?: Devolucion[];
    historial?: HistorialEquipo[];
  };

  // Información Técnica
  especificaciones?: {
    procesador: string;
    memoria_ram: string;
    almacenamiento: string;
    tipo_discoduro?: string;
    pantalla?: string;
    tarjeta_grafica?: string;
    sistema_operativo?: string;
    bateria?: string;
    puertos?: string;
    tienecargador?: boolean;
    serialcargador?: string;
  };

  // Seguridad
  seguridad?: {
    nivel_acceso: string;
    software_seguridad?: string;
    cifrado_disco?: string;
    politicas_aplicadas?: string[];
  };

  // Adquisición
  adquisicion?: {
    orden_compra: string;
    fecha_compra: string;
    precio_compra: number;
    forma_pago: string;
    plazo_pago: string;
    numero_factura: string;
    proveedores: Proveedor;
    proveedor_id: Proveedor | number;
    inicio_garantia: string;
    garantia_fecha_fin: string;
  };

  // Estado y Ubicación
  estado_ubicacion?: {
    estado_actual: string;
    sucursal_id: Sucursal | number;
    sucursales: Sucursal | null;
    departamento: string;
    responsable_id: number;
    usuarios: Usuario;
    disponibilidad: string;
    condicion_fisica: string;
  };

  // Información administrativa
  administrativa?: {
    codigo_inventario: string;
    centro_coste: string;
    autorizado_por_id: string;
    usuarios: Usuario;
    fecha_activacion: string;
    estado_contable: string;
    valor_depreciado: number;
    vida_util_restante: string;
  };

  mantenimiento?: {
    frecuencia_mantenimiento: string;
    ultima_fecha_mantenimiento: string;
    proveedor_servicio_id: number;
    proveedores: Proveedor;
  };

  // Documentos Relacionados
  archivosequipo?: {
    id_archivo: number;
    nombre_archivo: string;
    tipo_archivo: string;
    contenido: string;
    archivo: {
      content: string;
      nombre: string;
      tipo: string;
    };
  }[];

  perifericos: Perifericos | null;
}
