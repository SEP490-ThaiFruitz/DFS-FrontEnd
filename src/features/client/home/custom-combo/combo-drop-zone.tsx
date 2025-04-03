"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface ComboDropZoneProps {
  children: ReactNode;
}

export function ComboDropZone({ children }: ComboDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "combo-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? "ring-2 ring-green-500 bg-green-50" : ""
      } rounded-lg transition-all`}
    >
      {children}
    </div>
  );
}
