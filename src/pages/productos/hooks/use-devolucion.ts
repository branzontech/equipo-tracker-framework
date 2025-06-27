import { useEffect, useState } from "react";
import { Devolucion, EquipoEnMovimientoBase } from "../interfaces/devoluciones";
import {
  create,
  getDevoluciones,
  getEquiposEnMovimiento,
} from "@/api/axios/devolucion.api";
import { Equipo } from "../interfaces/equipo";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { useNavigate } from "react-router-dom";

export const useDevolucion = () => {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const navigate = useNavigate();
  const [equiposEnMovimiento, setEquiposEnMovimiento] = useState<
    EquipoEnMovimientoBase[]
  >([]);
  const [equiposTrasladoEnMovimiento, setEquiposTrasladoEnMovimiento] =
    useState<EquipoEnMovimientoBase[]>([]);
  const [newDevo, setNewDevo] = useState<Devolucion>({
    equipo_id: 0,
    prestamo_id: 0,
    id_devolucion: 0,
    estado_equipo: "",
    traslado_id: 0,
    fecha_devolucion: null,
    motivo: "",
    usuario_recibe_id: 0,
    observaciones: "",
    usuario_entrega_id: 0,
    usuarios_devoluciones_usuario_entrega_idTousuarios: {
      id: 0,
      nombre: "",
    },
    usuarios_devoluciones_usuario_recibe_idTousuarios: {
      id: 0,
      nombre: "",
    },
    tipo: "EQUIPO",
  });

  useEffect(() => {
    const fetchDevoluciones = async () => {
      const devoluciones = await getDevoluciones();
      const {
        prestamos,
        prestamos_directos,
        impresoras,
        traslados,
        traslados_directos,
        traslados_impresoras,
      } = await getEquiposEnMovimiento();
      

      const equiposConTipo: EquipoEnMovimientoBase[] = prestamos.map((e) => ({
        uId: `PRESTAMO-EQUIPO-${e.id_equipo}`,
        id: e.id_equipo,
        tipo: "EQUIPO",
        nombre: e.nombre_equipo,
        serial: e.nro_serie,
        equipo: e,
        origin: "PRESTAMO"
      }));

      const perifericosConTipo: EquipoEnMovimientoBase[] =
        prestamos_directos.map((p) => ({
          uId: `PRESTAMO-PERIFERICO-${p.perifericos.id_periferico}`,
          id: p.perifericos.id_periferico,
          tipo: "PERIFERICO",
          nombre: p.perifericos.nombre,
          serial: p.perifericos.serial,
          periferico: p,
          origin: "PRESTAMO"
        }));

      const impresorasConTipo: EquipoEnMovimientoBase[] = impresoras.map(
        (i) => ({
          uId: `PRESTAMO-IMPRESORA-${i.impresoras.id_impresora}`,
          id: i.impresoras.id_impresora,
          tipo: "IMPRESORA",
          nombre: i.impresoras.nombre,
          serial: i.impresoras.serial,
          impresora: i,
          origin: "PRESTAMO"
        })
      );

      const equipoTraslado: EquipoEnMovimientoBase[] = traslados.map((e) => ({
        uId: `TRASLADO-EQUIPO-${e.id_equipo}`,
        id: e.id_equipo,
        tipo: "EQUIPO",
        nombre: e.nombre_equipo,
        serial: e.nro_serie,
        equipo: e,
        origin: "TRASLADO"
      }));

      const perifericosTraslado: EquipoEnMovimientoBase[] =
        traslados_directos.map((p) => ({
          uId: `TRASLADO-PERIFERICO-${p.perifericos.id_periferico}`,
          id: p.perifericos.id_periferico,
          tipo: "PERIFERICO",
          nombre: p.perifericos.nombre,
          serial: p.perifericos.serial,
          periferico: p,
          origin: "TRASLADO"
        }));

      const impresorasTraslado: EquipoEnMovimientoBase[] = traslados_impresoras.map(
        (i) => ({
          uId: `TRASLADO-IMPRESORA-${i.impresoras.id_impresora}`,
          id: i.impresoras.id_impresora,
          tipo: "IMPRESORA",
          nombre: i.impresoras.nombre,
          serial: i.impresoras.serial,
          impresora: i,
          origin: "TRASLADO"
        })
      );

      const combinados = [
        ...equiposConTipo,
        ...perifericosConTipo,
        ...impresorasConTipo,
      ];

      const combinadosTraslado = [
        ...equipoTraslado,
        ...perifericosTraslado,
        ...impresorasTraslado,
      ];

      setEquiposEnMovimiento(combinados);
      setEquiposTrasladoEnMovimiento(combinadosTraslado);
      setDevoluciones(devoluciones);
    };

    fetchDevoluciones();
  }, []);

  const handleSubmit = async (data: Devolucion) => {
    if (!data.equipo_id) {
      toast.error("Debe seleccionar un equipo", {
        icon: icons.error,
      });
      return;
    }

    if (!data.fecha_devolucion) {
      toast.error("Debe seleccionar una fecha de devolución", {
        icon: icons.error,
      });
      return;
    }

    if (!data.motivo) {
      toast.error("Debe seleccionar un motivo", {
        icon: icons.error,
      });
      return;
    }

    if (!data.estado_equipo) {
      toast.error("Debe seleccionar el estado del equipo", {
        icon: icons.error,
      });
      return;
    }

    if (!data.observaciones) {
      toast.error("Debe ingresar observaciones", {
        icon: icons.error,
      });
      return;
    }

    if (!data.usuario_recibe_id) {
      toast.error("Debe seleccionar un usuario que recibe", {
        icon: icons.error,
      });
      return;
    }

    if (!data.usuario_entrega_id) {
      toast.error("Debe seleccionar un usuario que entrega", {
        icon: icons.error,
      });
      return;
    }

    try {
      const devolucionCreated = await create(data);
      if (devolucionCreated.success) {
        toast.success(
          devolucionCreated.message || "Devolución creada exitosamente",
          {
            icon: icons.success,
          }
        );
        setTimeout(() => {
          navigate("/productos/actas");
          window.location.reload();
        }, 4500);
      } else {
        toast.error(
          devolucionCreated.message || "Error al crear la devolución",
          {
            icon: icons.error,
          }
        );
      }
    } catch (error) {
      toast.error(error.message || "Error al crear la devolución", {
        icon: icons.error,
      });
    }
  };

  return {
    devoluciones,
    equiposEnMovimiento,
    newDevo,
    setNewDevo,
    setDevoluciones,
    setEquiposEnMovimiento,
    handleSubmit,
    equiposTrasladoEnMovimiento,
  };
};
