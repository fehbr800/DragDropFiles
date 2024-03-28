import { useState } from "react";
import Draggable from "react-draggable";

const DraggableSignature = ({ onSignaturesChange }) => {
  const [signatures, setSignatures] = useState([]);

  const handleDrag = (e, data, index) => {
    const newSignatures = [...signatures];
    newSignatures[index] = { x: data.x, y: data.y };
    setSignatures(newSignatures);
    onSignaturesChange(newSignatures);
  };

  const handleAddSignature = () => {
    const newSignatures = [...signatures, { x: 0, y: 0 }];
    setSignatures(newSignatures);
    onSignaturesChange(newSignatures);
  };

  const handleRemoveSignature = (index) => {
    const newSignatures = signatures.filter((_, i) => i !== index);
    setSignatures(newSignatures);
    onSignaturesChange(newSignatures);
  };

  return (
    <div className="relative">
      {signatures.map((signature, index) => (
        <Draggable
          key={index}
          axis="both"
          handle=".handle"
          defaultPosition={{ x: signature.x, y: signature.y }}
          position={null}
          grid={[1, 1]}
          scale={1}
          onStart={() => {}}
          onDrag={(e, data) => handleDrag(e, data, index)}
          onStop={() => {}}
        >
          <div className="absolute z-50 p-4 transform -translate-x-1/2 bg-white border border-gray-400 rounded-md shadow-md left-1/2 top-1/4">
            <div className="cursor-move handle">Arraste a Assinatura</div>
            <div className="mt-2">Assinatura {index + 1}</div>
            <button
              onClick={() => handleRemoveSignature(index)}
              className="px-4 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remover Assinatura
            </button>
          </div>
        </Draggable>
      ))}
      <button
        onClick={handleAddSignature}
        className="absolute px-4 py-2 text-white bg-blue-500 rounded-md bottom-4 right-4 hover:bg-blue-600"
      >
        Adicionar Assinatura
      </button>
    </div>
  );
};

export default DraggableSignature;