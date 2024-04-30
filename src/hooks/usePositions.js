import { useState } from "react";


function useSignatoryPositions(initialData = {}) {
    const [positions, setPositions] = useState(initialData);
  
    const setPosition = (page, signatoryId, position) => {
      setPositions(prev => ({
        ...prev,
        [page]: {
          ...(prev[page] || {}),
          [signatoryId]: position
        }
      }));
    };
  
    const getPosition = (page, id) => {
        return positions[page] ? positions[page][id] : null;
      };
  
    
  return { getPosition, setPosition };

  }

  export default useSignatoryPositions;