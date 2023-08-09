"use client";
import React, { FC, useEffect, useState } from "react";
import StoreModal from "@/components/modal/store-modal";

const ModalProvider: FC = () => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);
  if (!mount) return null;

  return <StoreModal />;
};
export default ModalProvider;
