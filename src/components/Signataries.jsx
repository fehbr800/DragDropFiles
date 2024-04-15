import { useState } from "react";
import DraggableText from "./DraggableText";

export default function SignatoryForm({ addSignatory, pdf, pageNum, pageDetails, setPosition, setPdf, onSet }) {
    const [signatories, setSignatories] = useState([]);
    const [name, setName] = useState('');
    const [position, setPositionState] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (name && position) {
        const newSignatory = { name, position };
        setSignatories([...signatories, newSignatory]);
        addSignatory(newSignatory); // Adiciona o novo signatário ao estado global na Home
        setName('');
        setPositionState('');
      } else {
        alert('Por favor, preencha todos os campos');
      }
    };

    const handleSet = async (text) => {
      // Implemente a lógica de como você deseja que a função onSet funcione aqui
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Cargo:
            <input 
              type="text" 
              value={position} 
              onChange={(e) => setPositionState(e.target.value)} 
            />
          </label>
          <button type="submit">Adicionar Signatário</button>
        </form>
  
        {signatories.map((signatory, index) => (
          <DraggableText
            key={index}
            initialText={`${signatory.name}, ${signatory.position}`}
            pdf={pdf}
            pageNum={pageNum}
            pageDetails={pageDetails}
            setPosition={setPosition}
            setPdf={setPdf}
            onSet={onSet} // Passa a função onSet como uma prop
          />
        ))}
      </div>
    );
}