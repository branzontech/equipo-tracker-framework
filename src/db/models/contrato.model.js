import { prisma } from "../../../prisma/prismaCliente.js";

export const contratoModel = {
  async findAll() {
    const contratos = await prisma.contrato.findMany({
      select: {
        id_contrato: true,
        nombre: true,
        empresa_nombre: true,
        tipo_contrato: true,
        fecha_inicio: true,
        fecha_fin: true,
        estado: true,
        descripcion: true,
        documentocontrato: true,
      },
    });
    return contratos;
  },
  async create(contrato) {
    const data = {
      nombre: contrato.nombre,
      empresa_nombre: contrato.empresa_nombre,
      tipo_contrato: contrato.tipo_contrato,
      fecha_inicio: new Date(contrato.fecha_inicio),
      fecha_fin: new Date(contrato.fecha_fin),
      estado: contrato.estado,
      descripcion: contrato.descripcion,
    };

    // Solo incluye el documento si viene incluido
    if (contrato.DocumentoContrato?.archivo) {
      data.documentocontrato = {
        create: [
          {
            nombre_documento: contrato.DocumentoContrato.nombre_documento,
            tipo_documento: contrato.DocumentoContrato.tipo_documento,
            archivo: Buffer.from(contrato.DocumentoContrato.archivo, "base64"),
            fecha_subida: new Date(contrato.DocumentoContrato.fecha_subida),
          },
        ],
      };
    }

    return await prisma.contrato.create({ data });
  },
};
