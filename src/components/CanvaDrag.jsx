import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
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

  const handleCardClick = (signatory, type) => {
    if (type) {
      onSubmit([...signatories, { ...signatory, type }]);
      setSelectedTypes({ ...selectedTypes, [signatory.id]: type });
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
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
      <div className="flex mb-2">
         <button
          className={`mr-2 px-3 py-1 rounded border ${selectedTypes['rubrica'] ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTypeSelect('rubrica')}
        >
          Rubrica
        </button>
        <button
          className={`px-3 py-1 rounded border ${selectedTypes['texto'] ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTypeSelect('texto')}
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
      onTypeSelect={(type) => handleTypeSelect(signatory.id, type)}
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