
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
      <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
      <button type="submit" className="block w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"> Adicionar Assinatura </button>
    </form>
  );
};


export const SignatoriesList = ({ signatories, setSignatures }) => {

  const handleRemoveSignatory = (index) => {
    const updatedSignatories = [...signatories];
    updatedSignatories.splice(index, 1);
    setSignatures(updatedSignatories);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
  
  <Droppable droppableId="signatories">
    {(provided) => (
      <ul
        className="flex flex-col w-full p-2 rounded shadow-lg"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        {signatories.map((signatory, index) => (
          <Draggable key={index} draggableId={`signatory-${index}`} index={index}>
            {(provided) => (
              <li
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="flex items-center justify-between p-2 mb-2 border-2 border-dashed cursor-move"
              >
                <span className="font-bold">{signatory.name}</span> - {signatory.email}
                <button onClick={() => handleRemoveSignatory(index)} className="text-red-500">
                  Remover
                </button>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
    </div>
  );
};



