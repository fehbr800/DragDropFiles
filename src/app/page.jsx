'use client'
import DropZoneComponent from "@/components/DragDrop";
import { useState } from "react";
import { SignatureForm } from "@/components/CanvaDrag";







export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfSignatures, setPdfSignatures] = useState([]);



  const handleSubmitSignature = (signature) => {
    const updatedSignatures = [...pdfSignatures, { ...signature, x: 0, y: 0 }];
    setPdfSignatures(updatedSignatures);
  };

  const handleDrop = (acceptedFiles) => {
    setPdfFile(acceptedFiles[0]);
    setPdfSignatures([]); 
  };

  return (
    <main className="flex justify-center min-h-screen p-8 mx-auto gap-11">
      <div className="flex flex-col gap-5">
      {pdfFile &&  <SignatureForm onSubmit={handleSubmitSignature} />}
      </div>
      <div className="p-4 rounded-lg shadow">
        <DropZoneComponent pdfFile={pdfFile} signatures={pdfSignatures} onDrop={handleDrop} />
      </div>
    </main>
  );
}