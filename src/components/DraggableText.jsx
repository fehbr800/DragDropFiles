import Draggable from "react-draggable";
import { CheckIcon, TrashIcon } from'@heroicons/react/24/outline'
import { cleanBorder, errorColor, goodColor, primary45 } from "../utils/colors";
import { useState, useEffect, useRef } from "react";

export default function DraggableText({ onEnd, onSet, onCancel, initialText }) {
  const [text, setText] = useState(initialText || "Text");
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
    <Draggable onStop={onEnd}>
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
          placeholder="Text"
          onChange={(e) => setText(e.target.value)}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          readOnly={confirmed}
        />
      </div>
    </Draggable>
  );
}