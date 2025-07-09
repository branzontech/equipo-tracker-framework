import { useEffect, useState } from "react";
import { Checklist, ChecklistRespuestaData } from "../interface/checklist";
import {
  createChecklist,
  disableChecklist,
  enableChecklist,
  getChecklist,
  getChecklistById,
  updateChecklist,
} from "@/api/axios/checklist.api";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";
import Cookies from "js-cookie";
import { finalizeChecklistResponse } from "@/api/axios/mante.api";

export const useChecklist = () => {
  const [checklist, setChecklist] = useState<Checklist[]>([]);
  const [newCheckList, setNewCheckList] = useState<Checklist>({
    id_plantilla: 0,
    nombre: "",
    tipo_equipo: "",
    tipo_calificacion: undefined,
    campos: [],
    creado_por: "",
    usuarios: {
      id_usuario: 0,
      nombre: "",
    },
    estado: "Habilitado",
  });
  const [checklistData, setChecklistData] = useState<ChecklistRespuestaData>({
    mantenimientoId: 0,
    plantillaId: 0,
    tecnicoId: 0,
    respuestas: {},
    calificacion: undefined,
    observaciones: "",
    fechaRealizacion: undefined,
  });
  const [checklistCompleted, setChecklistCompleted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchChecklist = async () => {
      const res = await getChecklist();
      setChecklist(res);
    };
    fetchChecklist();
  }, []);

  const create = async (data: Checklist) => {
    const UserId = Cookies.get("userId");

    if (!data.tipo_equipo) {
      toast.error("Debe seleccionar un tipo de equipo", {
        icon: icons.error,
      });
      return;
    }

    if (!data.tipo_calificacion) {
      toast.error("Debe seleccionar un tipo de calificación", {
        icon: icons.error,
      });
      return;
    }

    if (!data.nombre) {
      toast.error("Debe ingresar un nombre para la plantilla", {
        icon: icons.error,
      });
      return;
    }

    const dataSend = {
      ...data,
      creado_por: UserId,
    };

    try {
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
    } catch (error) {
      toast.error("Error al crear la plantilla", {
        icon: icons.error,
      });
    }
  };

  const finalizarChecklist = async (
    calificacion: number,
    observaciones: string,
    fechaRealizacion: Date,
    mantenimientoId: number
  ) => {
    const data = {
      mantenimientoId,
      observaciones,
      calificacion,
      fechaRealizacion,
    };

    const res = await finalizeChecklistResponse(data);

    if (res.success) {
      toast.success("Checklist finalizada correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("Error al guardar la respuesta", {
        icon: icons.error,
      });
    }
  };

  const getByID = async (id: number) => {
    const res = await getChecklistById(id);
    setNewCheckList(res);
  };

  const update = async (id: number, data: Checklist) => {
    const UserId = Cookies.get("userId");

    if (!data.tipo_equipo) {
      toast.error("Debe seleccionar un tipo de equipo", {
        icon: icons.error,
      });
      return;
    }

    if (!data.tipo_calificacion) {
      toast.error("Debe seleccionar un tipo de calificación", {
        icon: icons.error,
      });
      return;
    }

    if (!data.nombre) {
      toast.error("Debe ingresar un nombre para la plantilla", {
        icon: icons.error,
      });
      return;
    }

    data.creado_por = UserId;

    try {
      const res = await updateChecklist(id, data);
      if (res.success) {
        toast.success("Plantilla actualizada correctamente", {
          icon: icons.success,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      } else {
        toast.error("Error al actualizar la plantilla", {
          icon: icons.error,
        });
      }
    } catch (error) {
      toast.error("Error al actualizar la plantilla", {
        icon: icons.error,
      });
    }
  };

  const handleOpenEditModal = (id: number) => {
    setSelectedChecklistId(id);
    setShowEditModal(true);
  };

  const disable = async (id: number) => {
    const res = await disableChecklist(id);
    if (res.success) {
      toast.success("Checklist deshabilitada correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("Error al deshabilitar la plantilla de chequeo", {
        icon: icons.error,
      });
    }
  };

  const enable = async (id: number) => {
    const res = await enableChecklist(id);
    if (res.success) {
      toast.success("Checklist habilitada correctamente", {
        icon: icons.success,
      });
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    } else {
      toast.error("Error al habilitar la plantilla de chequeo", {
        icon: icons.error,
      });
    }
  };

  return {
    checklist,
    newCheckList,
    setNewCheckList,
    create,
    checklistData,
    setChecklistData,
    finalizarChecklist,
    checklistCompleted,
    setChecklistCompleted,
    getByID,
    update,
    showEditModal,
    handleOpenEditModal,
    selectedChecklistId,    
    setShowEditModal, 
    setSelectedChecklistId,
    disable,
    enable
  };
};
