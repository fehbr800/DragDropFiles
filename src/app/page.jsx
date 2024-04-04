'use client'
import DropZoneComponent, { DragOnDropFilesRender } from "@/components/DragDrop";
import StepsNavigation from "@/components/StepsNavigation";
import RenderFile from "./renderFile/page";
import { useState } from "react";
import DraggableSignature, { SignatoriesList, SignatureForm } from "@/components/CanvaDrag";
import { DndProvider } from "react-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";






export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfSignatures, setPdfSignatures] = useState([]);

  const handlePdfSignaturesSubmit = (newSignatures) => {
    console.log('Assinaturas enviadas para o PDF:', newSignatures);
    setPdfSignatures(newSignatures); // Atualizamos as assinaturas no PDF
  };

  // Função para lidar com o envio das assinaturas do formulário para o componente DraggableSignature
  const handleSubmitSignature = (signature) => {
    const updatedSignatures = [...pdfSignatures, { ...signature, x: 0, y: 0 }];
    setPdfSignatures(updatedSignatures);
  };

  
  return (
  
      <main className="flex justify-center min-h-screen p-8 mx-auto gap-11">
        <div className="flex flex-col gap-5">
          <SignatureForm onSubmit={handleSubmitSignature} />
          {/* <SignatoriesList signatories={pdfSignatures} setSignatures={setPdfSignatures} /> */}
        </div>
        <div className="p-4 rounded-lg shadow">
          {pdfFile ? (
            <DropZoneComponent pdfFile={pdfFile} signatures={pdfSignatures} />
          ) : (
            <div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
              />
            </div>
          )}
        </div>
      </main>

  );
}