import { useState } from "react";

import { v4 as uuidv4 } from 'uuid';



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

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
      <div className="flex mb-2">
        <button
          className={`mr-2 px-3 py-1 rounded border ${selectedTypes['rubrica'] ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onTypeSelect('rubrica')}
        >
          Rubrica
        </button>
        <button
          className={`px-3 py-1 rounded border ${selectedTypes['texto'] ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onTypeSelect('texto')}
        >
          Texto
        </button>
      </div>
      <ul className="flex flex-col w-full p-2 rounded shadow-lg">
        {signatories.map((signatory, index) => (
          <SignatoryCard
            key={index}
            signatory={signatory}
            selectedType={selectedTypes[signatory.id] || null}
            onCardClick={(type) => handleCardClick(signatory.id, type)}
            onTypeSelect={(type) => setSelectedTypes({ ...selectedTypes, [signatory.id]: type })}
            onRemove={() => handleRemoveSignatory(index)}
          />
        ))}
      </ul>
    </div>
  );
};

export const SignatoryCard = ({ signatory, selectedType, onCardClick, onTypeSelect, onRemove }) => {
  console.log(selectedType)
  return (
    <li className="flex items-center justify-between gap-2 p-2 mb-2 border-2 border-dashed cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
</svg>

       <div onClick={onCardClick ? () => onCardClick(signatory.id, selectedType) : undefined}>
        <span className="font-bold">{selectedType === 'rubrica' ? 'Rubrica:' : 'Texto:'}</span> {selectedType === 'rubrica' ? getInitials(signatory.name) : signatory.name}
      </div>
      <div>
        <button 
          className={`mr-2 px-3 py-1 rounded border ${selectedType === 'rubrica' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={onTypeSelect ? () => onTypeSelect('rubrica') : undefined}
        >
          Rubrica
        </button>
        <button 
          className={`px-3 py-1 rounded border ${selectedType === 'texto' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={ onTypeSelect ? () => onTypeSelect('texto') : undefined}
        >
          Texto
        </button>
      </div>
      <button onClick={onRemove} className="p-1 text-red-500 rounded-lg hover:bg-red-400 hover:text-white">
        Remover
      </button>
    </li>
  );
};

const getInitials = (name) => {
  const names = name.split(' ');
  return names.map((n) => n.charAt(0)).join('');
};