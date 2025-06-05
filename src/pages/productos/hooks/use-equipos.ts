import { useState } from "react";
import { Equipo } from "../interfaces/equipo";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEquipo } from "@/api/axios/equipo.api";

export const useEquipos = () => {
  const [equipo, setEquipo] = useState<Equipo[]>([]);
  const [newEquipo, setNewEquipo] = useState<Equipo>({
    id_equipo: 0,
    nombre_equipo: "",
    nro_serie: "",
    modelo: "",
    marca_id: 0,
    categoria_id: 0,
    sucursal_id: 0,
    estado_actual: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    tipo_activo: "",
    garantia_fecha_fin: "",
    observaciones: "",
    especificaciones: {
      procesador: "",
      memoria_ram: "",
      almacenamiento: "",
      tarjeta_grafica: "",
      pantalla: "",
      sistema_operativo: "",
      bateria: "",
      puertos: "",
    },
    seguridad: {
      nivel_acceso: "",
      software_seguridad: "",
      cifrado_disco: "",
      politicas_aplicadas: [],
    },
    adquisicion: {
      orden_compra: "",
      fecha_compra: "",
      precio_compra: 0,
      forma_pago: "",
      plazo_pago: "",
      numero_factura: "",
      proveedor: "",
    },
    informacionAdministrativa: {
      codigo_inventario: "",
      centro_coste: "",
      autorizado_por: "",
      fecha_activacion: "",
      estado_contable: "",
      valor_depreciado: 0,
      vida_util_restante: "",
    },
  });
  const navigate = useNavigate();

  const formSchema = z.object({
    // Información Básica
    nombre_equipo: z.string().min(1, "El nombre del equipo es requerido"),
    nro_serie: z.string().min(1, "El número de serie es requerido"),
    modelo: z.string().min(1, "El modelo es requerido"),
    numeroActivoFijo: z
      .string()
      .min(1, "El número de activo fijo es requerido"),
    marca: z.string().min(1, "La marca es requerida"),
    ubicacion_id: z.string().min(1, "La ubicación es requerida"),
    categoria: z.string().min(1, "La categoría es requerida"),
    fecha_registro: z.string().min(1, "La fecha de registro es requerida"),
    tipo_activo: z.string().min(1, "El tipo de activo es requerido"),
    garantia_fecha_fin: z.date().optional(),
    observaciones: z.string().optional(),
    // imagen: z.any(),

    // Especificaciones Técnicas
    procesador: z.string().min(1, "El procesador es requerido"),
    memoria_ram: z.string().min(1, "La memoria RAM es requerida"),
    almacenamiento: z.string().min(1, "El almacenamiento es requerido"),
    tarjeta_grafica: z.string().min(1, "La tarjeta gráfica es requerida"),
    pantalla: z.string().min(1, "La pantalla es requerida"),
    sistema_operativo: z.string().min(1, "El sistema operativo es requerido"),
    bateria: z.string().min(1, "La batería es requerida"),
    puertos: z.string().min(1, "Los puertos es requeridos"),

    // Seguridad
    nivel_acceso: z.string().min(1, "El nivel de acceso es requerido"),
    software_seguridad: z
      .string()
      .min(1, "El software de seguridad es requerido"),
    cifrado_disco: z.string().min(1, "El cifrado de disco es requerido"),
    politicas_aplicadas: z
      .array(z.string())
      .min(1, "Debe seleccionar al menos una política"),

    // Información de Adquisición
    orden_compra: z.string().min(1, "El orden de compra es requerido"),
    fecha_compra: z.string().min(1, "La fecha de compra es requerida"),
    precio_compra: z.number().min(1, "El precio de compra es requerido"),
    forma_pago: z.string().min(1, "El forma de pago es requerido"),
    plazo_pago: z.string().min(1, "El plazo de pago es requerido"),
    numero_factura: z.string().min(1, "El número de factura es requerido"),
    proveedor: z.string().min(1, "El proveedor es requerido"),

    // Información Administrativa
    codigo_inventario: z
      .string()
      .min(1, "El código de inventario es requerido"),
    centro_coste: z.string().min(1, "El centro de coste es requerido"),
    autorizado_por: z.string().min(1, "El autorizado por es requerido"),
    fecha_activacion: z.string().min(1, "La fecha de activación es requerida"),
    estado_contable: z.string().min(1, "El estado contable es requerido"),
    valor_depreciado: z
      .number()
      .min(0, "El valor depreciado debe ser positivo"),
    vida_util_restante: z.string().min(1, "La vida útil restante es requerida"),

    // Mantenimiento
    // frecuenciaMantenimiento: z.string(),
    // ultimaFechaMantenimiento: z.date().optional(),
    // proximaFechaMantenimiento: z.date().optional(),
    // proveedorServicio: z.string().optional(),

    // Documentación Relacionada
    // manualUsuario: z.any().optional(),
    // manualServicio: z.any().optional(),
    // certificados: z.any().optional(),
    // polizasSeguro: z.any().optional(),
    // documentosGarantia: z.any().optional(),
    // fotosAdicionales: z.any().optional(),

    // Campos Personalizables
    // tags: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...newEquipo,
      fecha_registro: new Date().toISOString().split("T")[0],
      garantia_fecha_fin: null,
      imagen: null,
    },
  });

  const handleVolver = () => {
    navigate("/productos/lista");
  };

  const handleSubmit = async (data: Equipo) => {
    const dataSend = {
      ...data,
      fecha_registro: new Date(data.fecha_registro).toISOString(),
    };

    const response = await createEquipo(dataSend);
    if (response.success) {
      alert("Equipo creado exitosamente");
      window.location.reload();
      // navigate("/productos/lista");
    } else {
      throw new Error("Error al crear el equipo");
    }
  };

  const formatNumber = (value: number | string) => {
    const num = typeof value === "number" ? value.toString() : value;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return {
    equipo,
    setEquipo,
    newEquipo,
    setNewEquipo,
    handleVolver,
    form,
    handleSubmit,
    formatNumber
  };
};
