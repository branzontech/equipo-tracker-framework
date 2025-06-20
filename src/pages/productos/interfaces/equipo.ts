import { devoluciones } from './../../../../node_modules/.prisma/client/index.d';
import { Categoria } from "@/pages/configuracion/maestros/interfaces/categorias";
import { Marca } from "@/pages/configuracion/maestros/interfaces/marcas";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";
import { Prestamo } from "./prestamo";
import { Traslado } from "./traslados";
import { Mantenimiento } from "@/pages/mantenimientos/interfaces/mantenimiento";
import { Devolucion } from './devoluciones';

export interface Equipo {
  sedes: string;
  id_equipo: number;
  nombre_equipo: string;
  nro_serie: string;
  modelo: string;
  marca_id: Marca | number;
  marcas: Marca | null;
  categoria_id: Categoria | number;
  categorias: Categoria | string;
  tipo_activo: string;
  fecha_registro: string;
  sucursal_id: Sucursal | number;
  sucursales: Sucursal | null;
  garantia_fecha_fin: string;
  estado_actual: string;
  observaciones?: string;
  motivo: string;

  // PRESTAMO O TRASLADOS O MANTENIMIENTOS
  trazabilidad?: {
    prestamo_equipos?: {
      prestamos: Prestamo;
    }[];
    traslados_equipos?: {
      traslados: Traslado;
    }[];
    mantenimientos?: Mantenimiento[];
    devoluciones?: Devolucion[];
  };

  // Información Técnica
  especificaciones?: {
    procesador: string;
    memoria_ram: string;
    almacenamiento: string;
    tarjeta_grafica?: string;
    pantalla?: string;
    sistema_operativo?: string;
    bateria?: string;
    puertos?: string;
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
    proveedor: string;
  };

  // Información administrativa
  administrativa?: {
    codigo_inventario: string;
    centro_coste: string;
    autorizado_por: string;
    fecha_activacion: string;
    estado_contable: string;
    valor_depreciado: number;
    vida_util_restante: string;
  };

  perifericos: Perifericos | null;
}
