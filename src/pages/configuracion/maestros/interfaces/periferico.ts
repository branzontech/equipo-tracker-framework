export interface Periferico {
  id: number;
  descripcion: string;
  estado: "Activo" | "Inactivo";
  serial?: string;
  marca?: string;
  campoPersonalizado?: {
    nombre: string;
    valor: string;
  };
  observacion?: string;
}