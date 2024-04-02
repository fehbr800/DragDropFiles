'use client'
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// 


// const DraggableSignature = ({
//   onSignaturesChange,
//   onSubmitSignature,
//   pageNumber,
//   pageWidthA4,
//   pageHeightA4,
// }) => {
//   const [signatures, setSignatures] = useState([]);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [savedSignatures, setSavedSignatures] = useState([]);

//   useEffect(() => {
//     const savedSignaturesJSON = localStorage.getItem('savedSignatures');
//     if (savedSignaturesJSON) {
//       setSavedSignatures(JSON.parse(savedSignaturesJSON));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('savedSignatures', JSON.stringify(savedSignatures));
//   }, [savedSignatures]);

//   const handleDrag = (e, data, index) => {
//     const newX = Math.min(Math.max(data.x, 0), pageWidthA4); // Limita ao tamanho da página
//     const newY = Math.min(Math.max(data.y, 0), pageHeightA4); // Limita ao tamanho da página

//     const newSignatures = [...signatures];
//     newSignatures[index] = { ...newSignatures[index], x: newX, y: newY };
//     setSignatures(newSignatures);
//     onSignaturesChange(newSignatures);
//   };

//   const handleSubmitSignature = (e) => {
//     e.preventDefault();
//     const newSignature = { name, email, x: 0, y: 0, pageNumber };
//     const updatedSignatures = [...signatures, newSignature];
//     setSignatures(updatedSignatures);
//     onSignaturesChange(updatedSignatures);
//     setSavedSignatures([...savedSignatures, newSignature]);
//     onSubmitSignature(updatedSignatures);
//     setName('');
//     setEmail('');
//   };

//   const handleRemoveSignature = (index) => {
//     const newSignatures = signatures.filter((_, i) => i !== index);
//     setSignatures(newSignatures);
//     onSignaturesChange(newSignatures);
//   };

//   const handleSavedSignatureClick = (signature) => {
//     setSignatures([...signatures, { ...signature, x: 0, y: 0, pageNumber }]);
//     onSignaturesChange([...signatures, { ...signature, x: 0, y: 0, pageNumber }]);
//   };

//   return (
//     <div className="relative">
//       <form onSubmit={handleSubmitSignature} className="absolute z-50 max-w-xl p-4 bg-white border border-gray-400 rounded-md shadow-md left-1/2 top-1/4">
//         <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md" />
//         <button type="submit" className="block w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"> Adicionar Assinatura </button>
//       </form>
//       <div className="pdf-container" style={{ position: 'relative', width: `${pageWidthA4}px`, height: `${pageHeightA4}px`, border: '1px solid #ccc' }}>
//         {signatures.map((signature, index) => (
//           <Draggable key={index} axis="both" handle=".handle" defaultPosition={{ x: signature.x, y: signature.y }} position={null} grid={[1, 1]} scale={1} onStart={() => {}} onDrag={(e, data) => handleDrag(e, data, index)} onStop={() => {}}>
//             <div style={{ position: 'absolute', left: `${signature.x}px`, top: `${signature.y}px` }} className="absolute z-50 p-4 transform border border-gray-400 rounded-md shadow-md bg-gray-50 handle">
//               <div className="cursor-move">Arraste a Assinatura</div>
//               <div>{signature.name} {signature.email}</div>
//               <button onClick={() => handleRemoveSignature(index)} className="px-4 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"> Remover Assinatura </button>
//             </div>
//           </Draggable>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DraggableSignature;

export const SignatureForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email });
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
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Movimento cancelado
  
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
  
    const updatedSignatories = [...signatories]; // Create a new array that is a deep copy of the original array
    const [removed] = updatedSignatories.splice(startIndex, 1); // Remover o item arrastado
    updatedSignatories.splice(endIndex, 0, removed); // Inserir o item na nova posição
  
    setSignatures(updatedSignatories);
  };

  const handleRemoveSignatory = (index) => {
    const updatedSignatories = [...signatories];
    updatedSignatories.splice(index, 1);
    setSignatures(updatedSignatories);
  };

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Signatários Adicionados:</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
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
</DragDropContext>
    </div>
  );
};



// const DraggableSignatureCard = ({ signature, onRemove, onSignaturesChange, containerRef, pageWidthA4, pageHeightA4 }) => {
//   const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
//   const SIGNATURE_WIDTH = 200;
//   const SIGNATURE_HEIGHT = 100;

//   useEffect(() => {
//     const { clientWidth, clientHeight } = containerRef.current || {};
//     setContainerDimensions({ width: clientWidth, height: clientHeight });
//   }, [containerRef]);

//   const handleDrag = (e, data) => {
//     // Calcula os limites de movimento levando em consideração as dimensões da página A4
//     const newX = Math.min(Math.max(data.x, 0), pageWidthA4 - SIGNATURE_WIDTH);
//     const newY = Math.min(Math.max(data.y, 0), pageHeightA4 - SIGNATURE_HEIGHT);

//     const newSignature = { ...signature, x: newX, y: newY };
//     onSignaturesChange(newSignature);
//   };

//   return (
//     <Draggable
//       axis="both"
//       handle=".handle"
//       defaultPosition={{ x: signature.x, y: signature.y }}
//       position={null}
//       grid={[1, 1]}
//       scale={1}
//       onStart={() => {}}
//       onDrag={handleDrag}
//       onStop={() => {}}

//     >
//       <div className="absolute z-50 p-4 bg-white border border-gray-300 rounded-md shadow-md">
//         <div className="font-bold text-gray-700 cursor-move handle">Arraste a Assinatura</div>
//         <div className="mt-2 text-sm text-gray-600">{signature.name} ({signature.email})</div>
//         <button
//           onClick={onRemove}
//           className="px-4 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
//         >
//           Remover Assinatura
//         </button>
//       </div>
//     </Draggable>
//   );
// };

// export default DraggableSignatureCard;