
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pen, RotateCcw } from "lucide-react";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignaturePad({ onSave, open, onOpenChange }: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureData = signatureRef.current.toDataURL();
      onSave(signatureData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen className="w-5 h-5" />
            Firma Digital
          </DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: "signature-canvas w-full h-40 border rounded",
            }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={clearSignature}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
          <Button onClick={saveSignature}>
            Guardar Firma
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
