"use client";

import { ReactNode } from "react";

interface SpatialCanvasProps {
  children: ReactNode;
  className?: string;
}

export function SpatialCanvas({ children, className = "" }: SpatialCanvasProps) {
  return (
    <div className={`perspective-container ${className}`}>
      <div className="spatial-depth">{children}</div>
    </div>
  );
}
