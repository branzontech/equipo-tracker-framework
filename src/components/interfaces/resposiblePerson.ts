export interface ResponsiblePerson {
  id: string;
  name: string;
  department: string;
  position: string;
  firma_entrega?: string | null;
  firma_recibe?: string | null;
}
