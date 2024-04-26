import { useEffect, useMemo, useRef, useState } from "react";
import DraggableText, { DraggableSignatory } from "./DraggableText";
import { PDFDocument } from "pdf-lib";
import { blobToURL } from "@/utils/utils";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid'; 
import { TrashIcon } from "@heroicons/react/24/outline";


export default function SignatoryForm({ addSignatory, signatories }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    }
    setIsDisabled(!(name && email) || signatories.length === 5); 
  };

  return (
    <div className="flex flex-col rounded shadow-md">
      <form className="flex flex-col items-center justify-center gap-2 px-8 py-4" onSubmit={handleSubmit}>
      <label>
          Nome:
          <input 
            className="px-2 py-2 mx-2 border border-gray-300 rounded-lg" 
            type="text" 
            name="name"
            value={name} 
            onChange={handleInputChange} 
          />
        </label>
        <label>
          Email:
          <input 
            className="px-2 py-2 mx-2 border border-gray-300 rounded-lg" 
            type="email" 
            name="email"
            value={email} 
            onChange={handleInputChange} 
          />
        </label>
        <button 
          className={`px-4 py-2 my-2 text-white transition duration-150 ease-out bg-indigo-500 rounded-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`} 
          type="submit"
          disabled={isDisabled}
        >Adicionar Signatário</button>
      </form>
    </div>
  );
}






export function SignatoryContainer({
  signatories,
  onClick,
  textInputVisible,
  documentRef,
  setTextInputVisible,
  pdf,
  pageNum,
  pageDetails,
  setPosition,
  setPdf,
  position,
  onDelete
}) {
  const [selectedSignatories, setSelectedSignatories] = useState([]);
  const [signatoryPositions, setSignatoryPositions] = useState({});

  const handleSignatoryClick = (signatory) => {
    const isSelected = selectedSignatories.some((selected) => selected.id === signatory.id);
    if (isSelected) {
      setSelectedSignatories(selectedSignatories.filter((selected) => selected.id !== signatory.id));
    } else {
      setSelectedSignatories([...selectedSignatories, signatory]);
    }
    if (onClick) onClick();
  };

  const handleSetPosition = async (id, newPosition) => {
    setSignatoryPositions((prevPositions) => ({
      ...prevPositions,
      [id]: newPosition,
    }));
  };

  useEffect(() => {
    setSelectedSignatories([]);
  }, [pageNum]);

  const memoizedSignatoryPositions = useMemo(() => {
    // Calcular as posições das assinaturas apenas quando necessário
    const positions = {};
    Object.keys(signatoryPositions).forEach((id) => {
      if (id in signatoryPositions) {
        positions[id] = signatoryPositions[id];
      }
    });
    return positions;
  }, [signatoryPositions]);

  useEffect(() => {
    // Atualiza as posições das assinaturas ao mudar de página
    if (memoizedSignatoryPositions) {
      Object.keys(memoizedSignatoryPositions).forEach((id) => {
        setPosition(id, memoizedSignatoryPositions[id]);
      });
    }
  }, [pageNum, memoizedSignatoryPositions, setPosition]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {signatories.map((signatory, index) => (
        <div key={index} className="relative p-4 bg-white rounded-lg shadow-md cursor-pointer" onClick={() => handleSignatoryClick(signatory)}>
          <div className="flex items-center justify-center">
            <div className="text-lg font-semibold text-center">Assinante {index + 1}</div>
            <button className="absolute top-0 mt-1 mr-1 text-red-400 right-1 hover:text-red-600 focus:outline-none" onClick={() => onDelete(signatory.id)}>
              X
            </button>
          </div>
          <div className="text-lg font-normal">{signatory.name}</div>
          <div className="text-lg font-normal">{signatory.email}</div>
        </div>
      ))}
      {selectedSignatories.map((selectedSignatory) => (
        <DraggableSignatory
          key={selectedSignatory.id}
          pageDetails={pageDetails}
          documentRef={documentRef}
          position={memoizedSignatoryPositions[selectedSignatory.id] || { x: 0, y: 0 }}
          signatory={selectedSignatory}
          onCancel={() => setSelectedSignatories(selectedSignatories.filter((selected) => selected.id !== selectedSignatory.id))}
          onEnd={(e, data) => handleSetPosition(selectedSignatory.id, { x: data.x, y: data.y })}
        />
      ))}
    </div>
  );
}