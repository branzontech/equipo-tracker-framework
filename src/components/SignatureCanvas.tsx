import { useState, useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { X, Save, RotateCcw } from "lucide-react";
import { SignatureCanvasProps } from "@/components/interfaces/signatureCanvasProps";

const SignatureCanvas = ({
  value,
  onChange,
  label,
  readOnly = false,
}: SignatureCanvasProps) => {
  const [open, setOpen] = useState(false);
  const signatureRef = useRef<SignaturePad>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null); 
  }, [value]);

  // Clear signature
  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  // Save signature
  const handleSave = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataURL = signatureRef.current.toDataURL("image/png");
      onChange(dataURL);
      setPreview(dataURL);
      setOpen(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <div className="text-sm font-medium">{label}</div>}

      {preview ? (
        <div className="relative border rounded-md p-2">
          <img
            src={preview}
            alt="Signature"
            className="h-24 object-contain mx-auto"
          />
          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => {
                setPreview(null);
                onChange("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : open ? (
        <div className="border rounded-md p-4 bg-white">
          <div className="border border-dashed border-gray-300 mb-4 bg-gray-50">
            <SignaturePad
              ref={signatureRef}
              canvasProps={{
                className: "w-full h-48",
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      ) : (
        !readOnly && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(true)}
            className="w-full border-dashed"
          >
            Añadir firma
          </Button>
        )
      )}
    </div>
  );
};

export default SignatureCanvas;
