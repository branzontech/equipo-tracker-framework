// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ImpresoraForm from "./ImpresoraForm";
// import { Label } from "@/components/ui/label";
// import { useImpresora } from "../hooks/use-impresora";
// import { useToners } from "../hooks/use-toners";

// export default function EditExistenciaTonerImpresora() {
//   const { create, newToner, setNewToner } = useToners();
//   const { impresora } = useImpresora();

//   return (
//     <>
//       <ImpresoraForm />
//       <div className="p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Editar Toner</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={(e: React.FormEvent) => {
//                 e.preventDefault();
//                 create(newToner);
//               }}
//               className="space-y-6"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="modelo">Modelo</Label>
//                   <Input
//                     id="nombre"
//                     autoComplete="off"
//                     value={newToner.modelo || ""}
//                     onChange={(e) => {
//                       setNewToner({ ...newToner, modelo: e.target.value });
//                     }}
//                     placeholder="Ej: TN-760"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="modeloImpresora">Modelo de Impresora</Label>
//                   <Select
//                     value={newToner.impresoras[0]?.toString() || ""}
//                     onValueChange={(value) =>
//                       setNewToner({
//                         ...newToner,
//                         impresoras: [parseInt(value)],
//                       })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Seleccione un modelo" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {impresora.map((impresora) => (
//                         <SelectItem
//                           key={impresora.id_impresora}
//                           value={impresora.id_impresora.toString()}
//                         >
//                           {impresora.modelo} - {impresora.serial}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="color">Color</Label>
//                   <Select
//                     value={newToner.color || ""}
//                     onValueChange={(value) =>
//                       setNewToner({ ...newToner, color: value })
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Seleccione un color" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Negro">Negro</SelectItem>
//                       <SelectItem value="Cyan">Cyan</SelectItem>
//                       <SelectItem value="Magenta">Magenta</SelectItem>
//                       <SelectItem value="Amarillo">Amarillo</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="stockDisponible">Stock Disponible</Label>
//                   <Input
//                     type="number"
//                     value={newToner.stock_actual || 0}
//                     onChange={(e) =>
//                       setNewToner({
//                         ...newToner,
//                         stock_actual: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="stock_minimo_alerta">
//                     Alerta de Stock Mínimo
//                   </Label>
//                   <Input
//                     type="number"
//                     value={newToner.stock_minimo_alerta || 0}
//                     onChange={(e) =>
//                       setNewToner({
//                         ...newToner,
//                         stock_minimo_alerta: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="cantidad">Cantidad</Label>
//                   <Input
//                     type="number"
//                     value={newToner.cantidad || 0}
//                     onChange={(e) =>
//                       setNewToner({
//                         ...newToner,
//                         cantidad: Number(e.target.value),
//                       })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <Button type="submit">Registrar Toner</Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   );
// }
