import { useState } from "react";

const SignatureComponent = ({ onDragStart }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', signatureType: '' });
  const [showTextarea, setShowTextarea] = useState(false);
  const [textareaContent, setTextareaContent] = useState('');

  const handleDragStart = (e) => {
    onDragStart();
  };

  const handleSignatureClick = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setShowTextarea(true);
    setTextareaContent(`Nome: ${formData.name}\nE-mail: ${formData.email}\nTipo de Assinatura: ${formData.signatureType}`);
    setFormData({ name: '', email: '', signatureType: '' });
    setShowForm(false);
  };

  const handleDragTextarea = (e) => {
    e.dataTransfer.setData('text/plain', textareaContent);
  };

  const handleDragCancel = (e) => {
    setShowForm(false);
  }


  return (
    <div className="flex flex-col">
   <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleSignatureClick}
        className="flex items-center justify-center h-12 px-4 py-2 bg-blue-200 cursor-move w-28 rounded-3xl"
      >
        Assinatura
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="">
       
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-bold">Formulário de Assinatura</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="signatureType" className="block text-sm font-medium text-gray-700">Tipo de Assinatura</label>
              <input type="text" id="signatureType" name="signatureType" value={formData.signatureType} onChange={handleChange} className="w-full p-2 mt-1 border border-gray-300 rounded-md" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="reset" onClick={handleDragCancel} className="p-2 text-red-400 rounded shadow ">Cancel</button>
              <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Enviar</button>
            </div>
          </div>
        </form>
      ) : null}

    {showTextarea && (
        <textarea
          draggable
          onDragStart={handleDragTextarea}
          className="absolute p-4 border-2 border-gray-700 border-dashed rounded-lg"
          value={textareaContent}
          readOnly
          style={{ left: '50px', top: '50px' }} 
        />
      )}

   
    </div>
  );
};

export default SignatureComponent;