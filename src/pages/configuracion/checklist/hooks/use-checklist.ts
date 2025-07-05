import { useEffect, useState } from "react";
import { Checklist } from "../interface/checklist";
import { createChecklist, getChecklist } from "@/api/axios/checklist.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import Cookies from "js-cookie";

export const useChecklist = () => {
  const [checklist, setChecklist] = useState<Checklist[]>([]);
  const [newCheckList, setNewCheckList] = useState<Checklist>({
    id_plantilla: 0,
    nombre: "",
    tipo_equipo: "",
    tipo_calificacion: "ESTRELLAS",
    campos: [],
    creado_por: "",
    usuarios: {
      id_usuario: 0,
      nombre: "",
    },
  });

  useEffect(() => {
    const fetchChecklist = async () => {
      const res = await getChecklist();
      setChecklist(res);
    };
    fetchChecklist();
  }, []);

  const create = async (data: Checklist) => {
    const UserId = Cookies.get("userId");

    const dataSend = {
      ...data,
      creado_por: UserId,
    };

    const res = await createChecklist(dataSend);
    if (res.success) {
      toast.success("Plantilla creada correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("Error al crear la plantilla", {
        icon: icons.error,
      });
    }
  };

  return {
    checklist,
    newCheckList,
    setNewCheckList,
    create,
  };
};
