"use client";
import { FC, useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const AlertModal: FC<AlertModalProps> = ({
  onConfirm,
  onClose,
  isLoading,
  isOpen,
}: AlertModalProps) => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;
  return (
    <Modal
      isOpen={isOpen}
      title="are you sure"
      description="this action can't be undone"
      onClose={onClose}
    >
      <div className="flex justify-end p-2 space-x-1">
        <Button
          disabled={isLoading}
          onClick={onConfirm}
          variant={"destructive"}
        >
          Confirm
        </Button>
        <Button disabled={isLoading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
export default AlertModal;
