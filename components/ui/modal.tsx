import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  description,
  title,
}: ModalProps) => {
  function onChange(open: boolean) {
    if (!open) {
      onClose();
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div> {children} </div>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
