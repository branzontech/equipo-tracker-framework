import { useEffect, useState } from "react";
import { Devolucion } from "../interfaces/devoluciones";
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
  const [equiposEnMovimiento, setEquiposEnMovimiento] = useState<Equipo[]>([]);
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
  });

  useEffect(() => {
    const fetchDevoluciones = async () => {
      const devoluciones = await getDevoluciones();
      const { prestamos, traslados } = await getEquiposEnMovimiento();
      const combinados = [...prestamos, ...traslados];

      setEquiposEnMovimiento(combinados);
      setDevoluciones(devoluciones);
    };

    fetchDevoluciones();
  }, []);

  const handleSubmit = async (data: Devolucion) => {
    try {
      const devolucionCreated = await create(data);
      if (devolucionCreated.success) {
        toast.success(devolucionCreated.message || "Devolución creada exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/productos/actas");
          window.location.reload();
        }, 4500);
      } else {
        toast.error(devolucionCreated.message || "Error al crear la devolución", {
          icon: icons.error,
        });
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
    handleSubmit
  };
};
