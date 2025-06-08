// ConfirmDialog.tsx
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

type ConfirmDialogProps = {
  title?: string;
  message?: string;
  onConfirm: () => Promise<void> | void; 
  confirmLabel?: string;
  cancelLabel?: string;
  closeOnClickOutside?: boolean;
};

export function ConfirmDialog({
  title = "¿Está seguro?",
  message = "Esta acción no se puede deshacer.",
  onConfirm,
  confirmLabel = "Sí",
  cancelLabel = "Cancelar",
  closeOnClickOutside = false,
}: ConfirmDialogProps) {
  return confirmAlert({
    title,
    message,
    closeOnClickOutside,
    buttons: [
      {
        label: confirmLabel,
        onClick: async () => {
          await onConfirm();
        },
      },
      {
        label: cancelLabel,
        onClick: () => {},
      },
    ],
  });
}