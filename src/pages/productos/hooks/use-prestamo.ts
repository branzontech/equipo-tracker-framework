import { useEffect, useState } from "react";
import { Prestamo } from "../interfaces/prestamo";
import { create, getAll } from "@/api/axios/prestamo.api";
import { toast } from "sonner";

export const usePrestamo = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [newPrestamo, setNewPrestamo] = useState<Prestamo>({
    id_prestamo: 0,
    acta_id: 0,
    equipo_id: 0,
    responsable_salida_id: 0,
    responsable_entrada_id: 0,
    ubicacion_destino_id: 0,
    fecha_salida: new Date(),
    fecha_retorno: new Date(),
    estado: "",
    firma_entrega: "",
    firma_recibe: "",
  });

  useEffect(() => {
    const fetchPrestamos = async () => {
      const prestamos = await getAll();
      setPrestamos(prestamos);
    };
    fetchPrestamos();
  }, []);

  const addPrestamo = async (prestamo: Prestamo) => {
    if (!prestamo.fecha_salida) {
      toast.error("Debe ingresar una fecha de salida");
      return;
    }

    try {
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

  return {
    prestamos,
    newPrestamo,
    setNewPrestamo,
    addPrestamo,
  };
};
