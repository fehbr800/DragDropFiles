import Draggable from "react-draggable";
import { CheckIcon, EllipsisVerticalIcon, TrashIcon } from'@heroicons/react/24/outline'
import { cleanBorder, errorColor, goodColor, primary45 } from "../utils/colors";
import { useState, useEffect, useRef } from "react";

export default function DraggableText({ onEnd, onSet, onCancel, initialText }) {
  const [text, setText] = useState(initialText || "Assinatura");
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!initialText) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [initialText]);

  const handleDoubleClick = () => {
    setConfirmed(false);
  };

  const handleClick = () => {
    if (confirmed) {
      setConfirmed(false);
    }
  };

  const handleSet = () => {
    if (!confirmed) {
      onSet(text);
      setConfirmed(true);
    }
  };

  return (
    <Draggable  onStop={onEnd}>
      <div className="absolute z-50 p-2 border-2 rounded-lg border-primary-400">
        <div className="absolute flex gap-2 right-1 top-4">
          <button className="text-green-500/40" onClick={handleSet}>
            <CheckIcon className="w-5 h-5" />
          </button>
          <button className="text-red-500/40" onClick={onCancel}>
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        <input
          ref={inputRef}
          className={`p-1 text-lg bg-transparent border-0 cursor-${confirmed ? "default" : "move"} focus:outline-none`}
          value={text}
          placeholder="Assinatura"
          onChange={(e) => setText(e.target.value)}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          readOnly={confirmed}
        />
      </div>
    </Draggable>
  );
}





export function DraggableSignatory({ onEnd, onCancel, onSet, initialText, signatory, index }) {
  const [confirmed, setConfirmed] = useState(false);
  const [name, setName] = useState(initialText || signatory?.name || "Nome");
  const [email, setEmail] = useState(signatory?.email || "");
console.log(signatory)
  const inputRef = useRef(null);

  const selectText = (element) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    if (!signatory?.name) {
      inputRef.current.focus();
      selectText(inputRef.current);
    }
  }, [signatory?.name]);

  const handleDoubleClick = () => {
    setConfirmed(false);
  };

  const handleClick = () => {
    if (confirmed) {
      setConfirmed(false);
    }
  };

  const handleSet = async () => {
    if (!confirmed) {
      if (typeof name === 'string' && name.trim().length > 0) {
        onSet(name); 
        setConfirmed(true);
      } else {
        console.error('O nome não é uma string válida ou está vazio:', name);
      }
    }
  };



  return (
    <Draggable handle=".ellipsis" onStop={onEnd}>
    <div className="absolute z-50 flex items-center justify-between p-2 border-2 rounded-lg border-primary-400"  >
    <div className="cursor-pointer ellipsis">
          <EllipsisVerticalIcon className="w-6 h-8"/>
        </div>
      <div onClick={handleSet} className="flex items-start justify-between gap-4">
       
        <div
          ref={inputRef}
          className={`p-1 relative text-lg bg-transparent cursor-${confirmed ? "default" : "move"} focus:outline-none`}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          contentEditable={confirmed}
        >
          <div className="text-sm text-gray-500">
            {signatory?.signatureType && `${signatory.signatureType}`}
          </div>
          <div className="text-sm text-gray-500">
            {email}
          </div>
          
        </div>

        <div className="flex mx-2">
          {/* <button className="text-green-500/40">
            <CheckIcon className="w-5 h-5" />
          </button> */}
          <button className="text-red-500/40" onClick={onCancel}>
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
       
      </div>
      <div className="absolute -top-3 -right-[0.8rem] flex items-center py-1 px-2 text-sm text-gray-400 bg-white rounded-lg shadow-md">
        {index + 1}
      </div>
   
    </div>
  </Draggable>
  );
}