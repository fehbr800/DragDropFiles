import { useRef, useState } from "react";
import DraggableText, { DraggableSignatory } from "./DraggableText";
import { PDFDocument } from "pdf-lib";
import { blobToURL } from "@/utils/utils";
import dayjs from "dayjs";


export default function SignatoryForm({ addSignatory }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signatories, setSignatories] = useState([]);
  const [signatoryHistory, setSignatoryHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      const newSignatory = { name, email };
      setSignatories([...signatories, newSignatory]);
      setSignatoryHistory([...signatoryHistory, newSignatory]);
      addSignatory(newSignatory);
      setName('');
      setEmail('');
    } else {
      console.error('Por favor, preencha todos os campos');
    }
  };

  return (
    <div className="flex flex-col rounded shadow-md">
      <form className="flex flex-col items-center justify-center gap-2 px-8 py-4" onSubmit={handleSubmit}>
        <label>
          Nome:
          <input className="px-2 py-2 mx-2 border border-gray-300 rounded-lg" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input 
            className="px-2 py-2 mx-2 border border-gray-300 rounded-lg"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <button className="px-4 py-2 my-2 text-white transition duration-150 ease-out bg-indigo-500 rounded-lg hover:bg-indigo-600" type="submit">Adicionar Signatário</button>
      </form>
    </div>
  );

}


export function SignatoryHistory({ signatoryHistory, onClick, documentRef , onCancel, onEnd }) {
  const handleClick = (text) => {
    onClick(text);
  };

  const isDuplicate = (text) => {
    return signatoryHistory.some((signatory) => {
      return `${signatory.name}, ${signatory.position}` === text;
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg">
      <h2 className="px-4 py-2 text-lg font-semibold">Signatários:</h2>
      {signatoryHistory.map((signatory, index) => (
        <div
          key={index}
          className="px-4 py-2 border-t border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => {
            const text = `${signatory.name}, ${signatory.position}`;
            if (!isDuplicate(text)) {
              handleClick(text);
            }
          }}
        >
          {`${signatory.name}, ${signatory.position}`}
        </div>
      ))}
    </div>
  );
}

export function SignatoryContainer({ signatories, onClick, textInputVisible, documentRef, setTextInputVisible, pdf, pageNum, pageDetails, setPosition, setPdf, position, onCancel }) {
  const [selectedSignatory, setSelectedSignatory] = useState(null); 
  console.log(position)

  const handleSignatoryClick = (signatory) => {
    setSelectedSignatory(signatory);
  };

  const handleCancel = () => {
    setSelectedSignatory(null); 
  };


  const handleSetSignatory = async (text) => {
    if (selectedSignatory && position) {
      const { originalHeight, originalWidth } = pageDetails;
      const scale = originalWidth / documentRef.current.clientWidth;
  
      const y =
        documentRef.current.clientHeight -
        (position.y +
          (12 * scale) -
          position.offsetY -
          documentRef.current.offsetTop);
      const x =
        position.x -
        166 -
        position.offsetX -
        documentRef.current.offsetLeft;
  
      const newY =
        (y * originalHeight) / documentRef.current.clientHeight;
      const newX =
        (x * originalWidth) / documentRef.current.clientWidth;
  
      const pdfDoc = await PDFDocument.load(pdf);
  
      const pages = pdfDoc.getPages();
      const firstPage = pages[pageNum];
  
      if (typeof text === 'string') {
        // Execute o código para desenhar o texto no PDF
        firstPage.drawText(text, {
          x: newX,
          y: newY,
          size: 20 * scale,
        });
      } else {
        console.error('O texto não é uma string válida:', text);
      }
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)]);
  
      const URL = await blobToURL(blob);
        setPdf(URL);
        setPosition(null);

        // Verifica se setTextInputVisible é uma função válida antes de chamar
        if (typeof setTextInputVisible === 'function') {
          setTextInputVisible(false);
        } else {
          console.error('setTextInputVisible não é uma função válida');
        }
      }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
    {signatories.map((signatory, index) => (
      <div key={index} className="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200" onClick={() => handleSignatoryClick(signatory)}>
        <div className="text-lg font-semibold">Nome: {signatory.name}</div>
        <div className="text-lg font-semibold">Email: {signatory.email}</div>
      
      </div>
    ))}
    {selectedSignatory && (
      <DraggableSignatory
      onEnd={setPosition}
        onCancel={handleCancel}
        onSet={handleSetSignatory}
        signatory={selectedSignatory}
        initialText={
          textInputVisible && selectedSignatory === 'date'
            ? dayjs().format('MM/d/YYYY')
            : null
        }
      />
    )}
  </div>
  );
}