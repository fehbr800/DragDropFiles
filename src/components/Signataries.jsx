import { useEffect, useRef, useState } from "react";
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






export function SignatoryContainer({ signatories, onClick, textInputVisible, documentRef, setTextInputVisible, pdf, pageNum, pageDetails, setPosition, setPdf, position, onDelete }) {
  const [selectedSignatories, setSelectedSignatories] = useState([]);
  const [signatoryPositions, setSignatoryPositions] = useState({});
  const [currentPage, setCurrentPage] = useState(pageNum);
  const [selectedSignatureType, setSelectedSignatureType] = useState(null);

  const getCurrentPagePositions = () => {
    return signatoryPositions[currentPage] || {};
  };

  const handleSignatoryClick = (signatory) => {
    const isSelected = selectedSignatories.some((selected) => selected.name === signatory.name);
    if (isSelected) {
      setSelectedSignatories(selectedSignatories.filter((selected) => selected.name !== signatory.name));
    } else {
      setSelectedSignatories([...selectedSignatories, signatory]);
    }
    if (onClick) onClick();
  };

  const saveSignatoryPositions = (positions) => {
    setSignatoryPositions((prevPositions) => ({
      ...prevPositions,
      [currentPage]: positions,
    }));

    localStorage.setItem('signatoryPositions', JSON.stringify(signatoryPositions));
  };

  const handleDeleteSignatory = (name) => {
    setSelectedSignatories((prevSignatories) =>
      prevSignatories.filter((selected) => selected.name !== name)
    );
  };

  const handleDigitalSignature = (signatory) => {
    setSelectedSignatories((prevSignatories) => {
      const updatedSignatories = prevSignatories.map((prevSignatory) => {
        if (prevSignatory.name === signatory.name) {
          return { ...prevSignatory, signatureType: 'Assinatura Digital' };
        }
        return prevSignatory;
      });
      return updatedSignatories;
    });
    setSelectedSignatureType('Assinatura Digital');
  };

  const handleInitials = (signatory) => {
    setSelectedSignatories((prevSignatories) => {
      const updatedSignatories = prevSignatories.map((prevSignatory) => {
        if (prevSignatory.name === signatory.name) {
          return { ...prevSignatory, signatureType: 'Rubrica' };
        }
        return prevSignatory;
      });
      return updatedSignatories;
    });
    setSelectedSignatureType('Rubrica');
  };

  const handleSetPosition = (name, newPosition) => {
    const currentPagePositions = getCurrentPagePositions();
    const updatedPositions = {
      ...currentPagePositions,
      [name]: newPosition,
    };
    saveSignatoryPositions(updatedPositions);
  };

  const removeSignatoryPosition = (name, index) => {
    setSignatoryPositions((prevPositions) => {
      const updatedPositions = { ...prevPositions };
      if (updatedPositions[currentPage] && updatedPositions[currentPage][name]) {
        updatedPositions[currentPage][name].splice(index, 1);
      }
      return updatedPositions;
    });
  };

  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem('signatoryPositions')) || {};
    setSignatoryPositions(savedPositions);
  }, []);

  useEffect(() => {
    setCurrentPage(pageNum);
  }, [pageNum]);

  useEffect(() => {
    setSelectedSignatories([]);
  }, [pageNum]);

  const remainingSlots = 5 - signatories.length;
  const isLimitReached = remainingSlots <= 0;
  const currentPagePositions = getCurrentPagePositions();

  return (
    <div className="grid grid-cols-1 gap-4">
      
      {isLimitReached && (
        <div className="p-4 text-red-800 bg-red-200 rounded-lg">
          Limite de 5 signatários atingido. Não é possível adicionar mais. {signatories.length} / 5
        </div>
      )}
      <div className="flex justify-end">Assinantes disponíveis {signatories.length}/5</div>
      {signatories.map((signatory, index) => (
        <div key={index} className="relative p-4 bg-white rounded-lg shadow-md cursor-pointer" onClick={() => handleSignatoryClick(signatory)}>
          <div className="flex items-center justify-center">
            <div className="text-lg font-semibold text-center">Assinante {index + 1}</div>
            <button className="absolute top-0 mt-1 mr-1 text-red-400 right-1 hover:text-red-600 focus:outline-none" onClick={() => handleDeleteSignatory(signatory.id)}>
              X
            </button>
          </div>
          <div className="text-lg font-normal">{signatory.name}</div>
          <div className="text-lg font-normal">{signatory.email}</div>
          <div className="flex w-full gap-4">
            <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md hover:bg-gray-100 ${signatory.signatureType === 'Assinatura Digital' ? 'bg-gray-200' : ''}`} onClick={() => handleDigitalSignature(signatory)}>Assinatura Digital</button>
            <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md hover:bg-gray-100 ${signatory.signatureType === 'Rubrica' ? 'bg-gray-200' : ''}`} onClick={() => handleInitials(signatory)}>Rubrica</button>
          </div>
        </div>
      ))}
      {selectedSignatories.map((selectedSignatory, index) => (
     <DraggableSignatory
     key={selectedSignatory.id}
     index={index}
     initialText={textInputVisible && selectedSignatory === 'date' ? dayjs().format('MM/d/YYYY') : null}
     pageDetails={pageDetails}
     documentRef={documentRef}
     setPosition={setPosition}
     position={getCurrentPagePositions()[selectedSignatory.name] || { x: 0, y: 0 }} 
     signatory={selectedSignatory}
     onCancel={() => setSelectedSignatories(selectedSignatories.filter((selected) => selected.name !== selectedSignatory.name))}
     onEnd={(e, data) => {
       if (currentPage === pageNum) {
         setPosition(selectedSignatory, e, data);
       }
     }}
     onSet={handleSetPosition}
     onRemove={removeSignatoryPosition}
     selectedSignatureType={selectedSignatureType} 
   />
      ))}
    </div>
  );
}
