import { useState } from "react";

import { v4 as uuidv4 } from 'uuid';
import {EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline'
import Draggable from "react-draggable";




export const SignatureForm = ({ onSubmit }) => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');

const handleSubmit = (e) => {
e.preventDefault();
const id = uuidv4();
onSubmit({ id, name, email });
setName('');
setEmail('');
};

return (
<form onSubmit={handleSubmit} className="max-w-xl p-4 bg-white border border-gray-400 rounded-md shadow-md">
  <input type="text" placeholder="Nome" value={name} onChange={(e)=> setName(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
  <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required
  className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
  <button type="submit" className="block w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
    Adicionar Assinatura </button>
</form>
);
};


export const SignatoriesList = ({ signatories, onSubmit, onTypeSelect }) => {
  const [selectedTypes, setSelectedTypes] = useState({});

 


  const handleCardClick = (signatoryId, type) => {
    if (type) {
      setSelectedTypes({ ...selectedTypes, [signatoryId]: type });
      onTypeSelect(type);
    }
  };

  const handleRemoveSignatory = (index) => {
    const updatedSignatories = signatories.filter((_, i) => i !== index);
    onSubmit(updatedSignatories);
  };

  const handleTypeSelect = (signatoryId, type) => {
    setSelectedTypes({ ...selectedTypes, [signatoryId]: type });
    onTypeSelect(type); 
  };

  return (
    <div  className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
     
      <ul className="flex flex-col w-full p-2 rounded shadow-lg">
        {signatories.map((signatory, index) => (
      <SignatoryCard
      key={index}
      signatory={signatory}
      selectedType={selectedTypes[signatory.id] || null}
      onCardClick={(type) => handleCardClick(signatory.id, type)}
      onTypeSelect={(type) => handleTypeSelect(signatory.id, type)}
      onRemove={() => handleRemoveSignatory(index)}
    />
        ))}
      </ul>
    </div>
  );
};


export const SignatoryCard = ({ signatory, selectedType, onCardClick, onRemove }) => {
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(signatory.id, selectedType);
    }
  };

  return (
    <Draggable>
      <div className="z-50 flex items-center justify-between gap-2 p-2 mb-2 border-2 border-dashed cursor-pointer">
        <EllipsisVerticalIcon className="w-5 h-5"/>
        <div onClick={handleClick}>
          <span className="font-bold">{selectedType === 'rubrica' ? 'Rubrica:' : 'Texto:'}</span> 
          {selectedType === 'rubrica' ? getInitials(signatory.name) : signatory.name}
        </div>
        <button onClick={onRemove} className="p-1 text-red-500 rounded-lg hover:bg-red-400 hover:text-white">
          <TrashIcon className="w-6 h-6 " />
        </button>
      </div>
    </Draggable>
  );
};



const getInitials = (name) => {
  const names = name.split(' ');
  return names.map((n) => n.charAt(0)).join('');
};