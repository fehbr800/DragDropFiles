import { useRef, useState } from "react";
import DraggableText, { DraggableSignatory } from "./DraggableText";
import { PDFDocument } from "pdf-lib";
import { blobToURL } from "@/utils/utils";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid'; 
import { TrashIcon } from "@heroicons/react/24/outline";


export default function SignatoryForm({ addSignatory }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      const newSignatory = {
        id: uuidv4(), 
        name,
        email
      };
      addSignatory(newSignatory);
      setName('');
      setEmail('');
    } else {
      console.error('Por favor, preencha todos os campos');
    }
  };

  return (
    <div className="flex flex-col rounded shadow-md">
      <form className="flex flex-col items-center justify-center gap-2 px-8 py-4" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input className="px-2 py-2 mx-2 border border-gray-300 rounded-lg" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input 
            className="px-2 py-2 mx-2 border border-gray-300 rounded-lg"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <button className="px-4 py-2 my-2 text-white transition duration-150 ease-out bg-indigo-500 rounded-lg hover:bg-indigo-600" type="submit">Adicionar Signatário</button>
      </form>
    </div>
  );
}






export function SignatoryContainer({ signatories, onClick, textInputVisible, documentRef, setTextInputVisible, pdf, pageNum, pageDetails, setPosition, setPdf, position, onDelete  }) {
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  console.log(signatories)
  
  const handleSignatoryClick = (signatory) => {
    setSelectedSignatory(signatory);
    if (onClick) onClick();
  };

  const handleDeleteSignatory = (index) => {
    if (onDelete) onDelete(index);
  };


  const handleDigitalSignature = (signatory) => {
    signatory.signatureType = 'Assinatura Digital';
  };

  const handleInitials = (signatory) => {
    signatory.signatureType = 'Rubrica';
  };

  const remainingSlots = 5 - signatories.length;
  const isLimitReached = remainingSlots <= 0;

  return (
<div className="grid grid-cols-1 gap-4">
  {isLimitReached && (
    <div className="p-4 text-red-800 bg-red-200 rounded-lg">
      Limite de 5 signatários atingido. Não é possível adicionar mais. {signatories.length} / 5
    </div>
  )}
  <div className="flex justify-end">
     Assinantes disponiveis {signatories.length}/5
  </div>
  {signatories.map((signatory, index) => (
    <div key={index} className="relative p-4 bg-white rounded-lg shadow-md cursor-pointer" onClick={() => handleSignatoryClick(signatory)}>
      <div className="flex items-center justify-center">
        <div className="text-lg font-semibold text-center">Assinante {index + 1}</div>
        <button className="absolute top-0 mt-1 mr-1 text-red-400 right-1 hover:text-red-600 focus:outline-none" onClick={() => handleDeleteSignatory(index)}>
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="text-lg font-semibold">{signatory.name}</div>
      <div className="text-lg font-semibold">{signatory.email}</div>
      <div className="flex w-full gap-4">
      <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md hover:bg-gray-100 ${signatory.signatureType === 'Assinatura Digital' ? 'bg-gray-200' : ''}`} onClick={() => handleDigitalSignature(signatory)}>Assinatura Digital</button>
      <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md hover:bg-gray-100 ${signatory.signatureType === 'Rubrica' ? 'bg-gray-200' : ''}`} onClick={() => handleInitials(signatory)}>Rubrica</button>
      </div>
    </div>
  ))}

{selectedSignatory && (
        <DraggableSignatory
          index={signatories.indexOf(selectedSignatory)}
          initialText={
            textInputVisible && selectedSignatory === 'date'
              ? dayjs().format('MM/d/YYYY')
              : null
          }
          signatory={selectedSignatory}
          onCancel={() => setSelectedSignatory(null)}
          onEnd={setPosition}
          onSet={async (name) => {
            if (selectedSignatory ) {
              const { originalHeight, originalWidth } = pageDetails;
              const scale = originalWidth / documentRef.current.clientWidth;

              const y =
                documentRef.current.clientHeight -
                (position.y +
                  (220 * scale) -
                  position.offsetY -
                  documentRef.current.offsetTop);
              const x =
                position.x -
                16 -
                position.offsetX -
                documentRef.current.offsetLeft;

              const newY =
                (y * originalHeight) / documentRef.current.clientHeight;
              const newX =
                (x * originalWidth) / documentRef.current.clientWidth;


              const pdfDoc = await PDFDocument.load(pdf);

              const pages = pdfDoc.getPages();
              const firstPage = pages[pageNum];
             
              firstPage.drawText(name, {
                x: newX,
                y: newY,
                size: 20 * scale,
                });

              const pdfBytes = await pdfDoc.save();
              const blob = new Blob([new Uint8Array(pdfBytes)]);

              const URL = await blobToURL(blob);
              setPdf(URL);
              setPosition(null);
            
              setSelectedSignatory(null);
            }
          }}
        />
)}
</div>
  );
}