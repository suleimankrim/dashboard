"use client";
import { useModelStore } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function Home() {
  const onOpen = useModelStore((state) => state.onOpen);
  const isOpen = useModelStore((state) => state.isOpen);
  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return null;
}
