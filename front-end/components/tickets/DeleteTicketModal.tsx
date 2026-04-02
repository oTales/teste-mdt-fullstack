'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteTicketModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteTicketModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Excluir Ticket</DialogTitle>
          <DialogDescription className="text-text-secondary pt-2">
            Tem certeza que deseja excluir este ticket? Esta ação não pode ser desfeita e todos os dados associados a ele serão perdidos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

