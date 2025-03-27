
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type ProductType = {
  id: string;
  name: string;
  description?: string;
};

interface ProductTypeSelectorProps {
  productTypes: ProductType[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export function ProductTypeSelector({ 
  productTypes, 
  defaultValue, 
  onChange 
}: ProductTypeSelectorProps) {
  const [selected, setSelected] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (defaultValue && !selected) {
      setSelected(defaultValue);
    }
  }, [defaultValue, selected]);

  const handleChange = (value: string) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="product-type">Tipo de Producto</Label>
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger id="product-type" className="w-full">
          <SelectValue placeholder="Seleccione el tipo de producto" />
        </SelectTrigger>
        <SelectContent>
          {productTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
