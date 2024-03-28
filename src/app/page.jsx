'use client'
import DropZoneComponent, { DragOnDropFilesRender } from "@/components/DragDrop";
import StepsNavigation from "@/components/StepsNavigation";
import RenderFile from "./renderFile/page";
import { useState } from "react";
import DraggableSignature from "@/components/CanvaDrag";






export default function Home() {
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });

  const handlePositionChange = (newPosition) => {
    setSignaturePosition(newPosition);
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-24 gap-11">
<DraggableSignature onSignaturesChange={handlePositionChange} />
<div className="signature-info">
        Posição X: {signaturePosition.x}, Posição Y: {signaturePosition.y}
      </div>

      <div className="p-4 rounded-lg shadow">
       <DragOnDropFilesRender/>
      </div>
    </main>
  );
}
