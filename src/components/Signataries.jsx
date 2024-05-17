import { useCallback, useEffect, useRef, useState } from "react";
import DraggableText, { DraggableSignatory } from "./DraggableText";
import { PDFDocument } from "pdf-lib";
import { blobToURL } from "@/utils/utils";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid'; 
import { TrashIcon } from "@heroicons/react/24/outline";
import { Reorder } from 'framer-motion';


export default function SignatoryForm({ addSignatory, signatories }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      const sequence = signatories.length + 1;
      const newSignatory = {
        id: uuidv4(), 
        sequence,
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
        >Adicionar Assinante</button>
      </form>
    </div>
  );
}






export function SignatoryContainer({ signatories, setSignatories,pageSignatureTypes, setPageSignatureTypes, setSignatureTypes, onClick, textInputVisible, documentRef, setTextInputVisible, pdf, pageNum, pageDetails, setPosition, setPdf, position, onDelete }) {
  const [selectedSignatories, setSelectedSignatories] = useState([]);
  const [signatoryPositions, setSignatoryPositions] = useState({});
  const [currentPage, setCurrentPage] = useState(pageNum);



  useEffect(() => {
    setCurrentPage(pageNum); 
  }, [pageNum]);

  

  
  // console.log(pageSignatureTypes)



  const onReorderSignatories = useCallback((newOrder) => {
    setSignatories(newOrder);
    const updatedSignatories = newOrder.map((signatory, index) => ({
      ...signatory,
      sequence: index + 1
    }));
    setSignatories(updatedSignatories);
  }, [setSignatories]);
  
  const handleSignatoryClick = (signatory) => {
    setSelectedSignatories([...selectedSignatories, signatory]);
    onClick(signatory); 
  };


  const handleSetSignatureType = (signatoryId, type) => {
    setSignatureTypes(prevTypes => ({
      ...prevTypes,
      [signatoryId]: type
    }));
    setPageSignatureTypes(prevPageTypes => ({
      ...prevPageTypes,
      [currentPage]: {
        ...prevPageTypes[currentPage],
        [signatoryId]: type
      }
    }));
  };

  useEffect(() => {
    if (selectedSignatories.length === 0) {
    }
  }, [selectedSignatories.length]);



  

  const handleDeleteSignatory = (signatoryId) => {
  onDelete(signatoryId);
  setSelectedSignatories(prevSignatories =>
    prevSignatories.filter(signatory => signatory.id !== signatoryId)
  );
  setSignatoryPositions(prevPositions => {
    const updatedPositions = { ...prevPositions };
    Object.keys(updatedPositions).forEach(page => {
      delete updatedPositions[page][signatoryId];
    });
    return updatedPositions;
  });
  
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
      <div className="flex justify-end">Assinantes disponíveis {signatories.length}/5</div>
      <Reorder.Group axis="y" values={signatories} onReorder={onReorderSignatories}>
        {signatories.map((signatory, index) => (
          <Reorder.Item key={signatory.id} value={signatory}>
            <div className="relative p-4 my-4 bg-white rounded-lg shadow-md cursor-pointer" >
              <div className="flex items-center justify-center">
                <div className="text-lg font-semibold text-center">Assinante {signatory.sequence}</div>
                <button className="absolute top-0 mt-1 mr-1 text-red-400 right-1 hover:text-red-600 focus:outline-none" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSignatory(signatory.id);
                }}>
                  X
                </button>
              </div>
              <div className="text-lg font-normal">{signatory.name} </div>
              <div className="text-lg font-normal">{signatory.email}</div>
              <div className="flex w-full gap-4">
              <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md ${pageSignatureTypes[currentPage] && pageSignatureTypes[currentPage][signatory.id] === 'Assinatura Digital' ? 'bg-gray-200' : ''}`} onClick={() => { handleSetSignatureType(signatory.id, 'Assinatura Digital'); onClick(signatory); }}>
                  Assinatura Digital
                </button>
                <button className={`py-2 px-1 font-medium text-gray-600 w-40 rounded-lg shadow-md ${pageSignatureTypes[currentPage] && pageSignatureTypes[currentPage][signatory.id] === 'Rubrica' ? 'bg-gray-200' : ''}`} onClick={() => { handleSetSignatureType(signatory.id, 'Rubrica'); onClick(signatory); }}>
                  Rubrica
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

