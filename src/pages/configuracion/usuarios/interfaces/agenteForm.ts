type NivelAcceso = "Tecnico" | "Administrador" | "Analista" | "Auxiliar" | "Auditor";

export interface AgenteForm {
  nombre: string;
  email: string;
  password: string;
  cargo: string;
  telefono: string;
  nivelAcceso: NivelAcceso;
  sede: string;
  bodegas: string[];
  areas: string[];
}