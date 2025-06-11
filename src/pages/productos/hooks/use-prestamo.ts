import { useEffect, useState } from "react";
import { Prestamo } from "../interfaces/prestamo";
import { create, getAll, saveSign } from "@/api/axios/prestamo.api";
import { toast } from "sonner";
import { useEquipos } from "./use-equipos";
import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import { Equipo } from "../interfaces/equipo";

export const usePrestamo = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const { getInfoEquipo } = useEquipos();
  const [newPrestamo, setNewPrestamo] = useState<Prestamo>({
    id_prestamo: 0,
    acta_id: 0,
    responsable_salida_id: 0,
    responsable_entrada_id: 0,
    fecha_salida: new Date(),
    fecha_retorno: new Date(),
    estado: "",
    descripcion: "",
    equipos: [],
  });
  const [haBuscado, setHaBuscado] = useState(false);
  const [accesorios, setAccesorios] = useState<Perifericos[]>([]);
  const [equipo, setEquipo] = useState<Equipo[]>([
    {
      id_equipo: Date.now(),
      nombre_equipo: "",
      nro_serie: "",
      modelo: "",
      marca_id: 0,
      marcas: null,
      categoria_id: 0,
      categorias: null,
      tipo_activo: "",
      fecha_registro: "",
      sucursal_id: 0,
      sucursales: null,
      garantia_fecha_fin: "",
      estado_actual: "",
      perifericos: null,
    },
  ]);

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
    firma_salida: string
  ) => {
    if (!prestamo.fecha_salida) {
      toast.error("Debe ingresar una fecha de salida");
      return;
    }

    if (!prestamo.fecha_retorno) {
      toast.error("Debe ingresar una fecha de retorno");
      return;
    }

    if (!prestamo.estado) {
      toast.error("Debe ingresar un estado");
      return;
    }

    console.log("prestamo:", prestamo);

    try {
      await saveSign_(
        firma_entrega,
        firma_salida,
        prestamo.responsable_salida_id,
        prestamo.responsable_entrada_id
      );
      const response = await create(prestamo);
      if (response.success) {
        toast.success(response.message || "Prestamo creado exitosamente");
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      }
      return response;
    } catch (error) {
      toast.error(error.message || "Error al crear el prestamo");
    }
  };

  const saveSign_ = async (
    firma_entrega: string,
    firma_salida: string,
    responsable_salida_id: number,
    responsable_entrada_id: number
  ) => {
    if (!firma_entrega || !firma_salida) {
      toast.error("Debe ingresar una firma");
      return;
    }
    try {
      const response = await saveSign(
        firma_entrega,
        firma_salida,
        responsable_salida_id,
        responsable_entrada_id
      );
      return response;
    } catch (error) {
      toast.error(error.message || "Error al guardar la firma");
    }
  };

  const buscarEquipo = async (serial: string) => {
    try {
      const data = await getInfoEquipo(serial);

      if (data && data.id_equipo) {
        const idEquipo = data.id_equipo;
        setNewPrestamo((prev) => ({
          ...prev,
          equipos: [
            ...prev.equipos,
            {
              id_equipo: idEquipo,
              perifericos: (data.perifericos || []).map((p) => p.id_periferico),
            },
          ],
        }));

        setEquipo([data]);
        setHaBuscado(true);
        setAccesorios(data.perifericos || []);
      } else {
        toast.error("No se encontró el equipo.");
        setHaBuscado(false);
        setEquipo([]);
        setAccesorios([]);
      }
    } catch (error) {
      toast.error("No se encontró el equipo.");
      setHaBuscado(false);
      setAccesorios([]);
    }
  };

  return {
    prestamos,
    newPrestamo,
    setNewPrestamo,
    addPrestamo,
    saveSign_,
    buscarEquipo,
    haBuscado,
    accesorios,
    equipo,
    setEquipo,
  };
};
