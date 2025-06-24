import { useEffect, useState } from "react";
import { Prestamo } from "../interfaces/prestamo";
import { create, getAll, saveSign } from "@/api/axios/prestamo.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "@/hooks/use-global";

export const usePrestamo = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [newPrestamo, setNewPrestamo] = useState<Prestamo>({
    id_prestamo: 0,
    tipo: "",
    acta_id: 0,
    actas: null,
    responsable_salida_id: 0,
    responsable_entrada_id: 0,
    fecha_salida: null,
    fecha_retorno: null,
    estado: "Vigente",
    descripcion: "",
    equipos: [],
    usuarios_prestamos_responsable_salida_idTousuarios: {
      id_usuario: 0,
      nombre: "",
    },
  });
  const [responsableRecibeInput, setResponsableRecibeInput] = useState(null);
  const { equipo, accesorios, haBuscado, buscarEquipo, saveSign_ } =
    useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrestamos = async () => {
      const prestamos = await getAll();
      setPrestamos(prestamos);
    };
    fetchPrestamos();
  }, []);

  const addPrestamo = async (
    prestamo: Prestamo,
    firma_entrega: string,
    firma_salida: string,
    nombreInput: string
  ) => {
    if (!prestamo.fecha_salida) {
      toast.error("Debe ingresar una fecha de salida", {
        icon: icons.error,
      });
      return;
    }

    if (!prestamo.fecha_retorno) {
      toast.error("Debe ingresar una fecha de retorno", {
        icon: icons.error,
      });
      return;
    }

    if (!nombreInput) {
      toast.error("Debe ingresar un nombre de usuario", {
        icon: icons.error,
      });
      return;
    }

    if (!prestamo.equipos.length) {
      toast.error("Debe agregar al menos un equipo", {
        icon: icons.error,
      });
      return;
    }

    if (!prestamo.descripcion) {
      toast.error("Debe ingresar una descripcion", {
        icon: icons.error,
      });
      return;
    }

    if (!prestamo.responsable_entrada_id) {
      toast.error("Debe seleccionar un responsable de salida", {
        icon: icons.error,
      });
      return;
    }

    if (!prestamo.responsable_salida_id) {
      toast.error("Debe seleccionar un responsable de entrada", {
        icon: icons.error,
      });
      return;
    }

    try {
      await saveSign_(
        firma_entrega,
        firma_salida,
        prestamo.responsable_salida_id,
        prestamo.responsable_entrada_id
      );
      const response = await create(prestamo);
      if (response.success) {
        toast.success(response.message || "Prestamo creado exitosamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          navigate("/productos/actas");
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el prestamo", {
        icon: icons.error,
      });
    }
  };

  const buscarEquipoPrestamo = async (serial: string) => {
    const data = await buscarEquipo(serial);
    if (data && data.id_equipo) {
      setNewPrestamo((prev) => ({
        ...prev,
        equipos: [
          ...prev.equipos,
          {
            id_equipo: data.id_equipo,
            perifericos: Array.isArray(data.perifericos)
              ? data.perifericos.map((p) => p.id_periferico)
              : [],
          },
        ],
      }));
    }
  };

  return {
    prestamos,
    newPrestamo,
    setNewPrestamo,
    addPrestamo,
    buscarEquipo: buscarEquipoPrestamo,
    equipo,
    accesorios,
    haBuscado,
    responsableRecibeInput,
    setResponsableRecibeInput,
  };
};
