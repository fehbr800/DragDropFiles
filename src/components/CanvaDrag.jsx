import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";

const DraggableSignature = ({ onSignaturesChange, signature, pageNumber, pageWidthA4, pageHeightA4 }) => {
  const [signatures, setSignatures] = useState([]);
  const [isAddNewFormVisible, setIsAddNewFormVisible] = useState(false);
  const [isSelectSavedFormVisible, setIsSelectSavedFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savedSignatures, setSavedSignatures] = useState([]);

  useEffect(() => {
    const savedSignaturesJSON = localStorage.getItem('savedSignatures');
    if (savedSignaturesJSON) {
      setSavedSignatures(JSON.parse(savedSignaturesJSON));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedSignatures', JSON.stringify(savedSignatures));
  }, [savedSignatures]);

  const handleDrag = (e, data, index) => {
    const newSignatures = [...signatures];
    newSignatures[index] = { ...newSignatures[index], x: data.x, y: data.y };
    setSignatures(newSignatures);
    onSignaturesChange(newSignatures);
  };

  const handleAddNewSignature = () => {
    setIsAddNewFormVisible(true);
    setIsSelectSavedFormVisible(false);
  };

  const handleSelectSavedSignature = () => {
    setIsSelectSavedFormVisible(true);
    setIsAddNewFormVisible(false);
  };

  const handleSubmitNewSignature = (e) => {
    e.preventDefault();
    const newSignature = { name, email, x: 0, y: 0 };
    if (!signatures.find((signature) => signature.name === name && signature.email === email)) {
      setSignatures([...signatures, newSignature]);
      onSignaturesChange([...signatures, newSignature]);
      setSavedSignatures([...savedSignatures, newSignature]);
    }
    setIsAddNewFormVisible(false);
    setName('');
    setEmail('');
  };

  const handleRemoveSignature = (index) => {
    const newSignatures = signatures.filter((_, i) => i !== index);
    setSignatures(newSignatures);
    onSignaturesChange(newSignatures);
  };

  const handleSavedSignatureClick = (signature) => {
    setSignatures([...signatures, { ...signature, x: 0, y: 0 }]);
    onSignaturesChange([...signatures, { ...signature, x: 0, y: 0 }]);
  };

  return (
    <div className="relative">
      {isAddNewFormVisible && (
        <form onSubmit={handleSubmitNewSignature} className="absolute z-50 p-4 bg-white border border-gray-400 rounded-md shadow-md left-1/2 top-1/4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="block w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Adicionar Assinatura
          </button>
        </form>
      )}
      {isSelectSavedFormVisible && (
        <div className="absolute z-50 p-4 bg-white border border-gray-400 rounded-md shadow-md left-1/2 top-1/4">
          <p className="text-lg font-semibold">Assinaturas Salvas:</p>
          {savedSignatures.map((signature, index) => (
            <div
              key={index}
              className="px-3 py-1 my-4 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              onClick={() => handleSavedSignatureClick(signature)}
            >
              {signature.name}
              {signature.email}
            </div>
          ))}
        </div>
      )}
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
          <div className="absolute z-50 p-4 transform -translate-x-1/2 border border-gray-400 rounded-md shadow-md bg-gray-50 left-1/2 top-1/4">
            <div className="cursor-move handle">Arraste a Assinatura</div>
            <div className="mt-2">{signature.name} {signature.email}</div>
            <button
              onClick={() => handleRemoveSignature(index)}
              className="px-4 py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Remover Assinatura
            </button>
          </div>
        </Draggable>
      ))}
      <div className="flex gap-8 p-4">
      <button onClick={handleAddNewSignature} className="px-4 py-2 text-white bg-blue-500 rounded-md bottom-4 right-4 hover:bg-blue-600">
        Adicionar Assinatura
      </button>
      <button onClick={handleSelectSavedSignature} className="px-4 py-2 text-white bg-green-500 rounded-md bottom-4 left-4 hover:bg-green-600">
        Selecionar Assinatura Salva
      </button>
      </div>

    </div>
  );
};

export default DraggableSignature;
