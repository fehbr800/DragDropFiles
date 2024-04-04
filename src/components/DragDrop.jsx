import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';





export function DragOnDropFilesRender({signatures, pdfFile}){
console.log('Assinaturas recebidas:', signatures);
console.log('Arquivo pdf:', pdfFile);
return(
<>

  <DropZoneComponent signatures={signatures} pdfFile={pdfFile} />

</>
)
}


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DropZoneComponent = ({ signatures, pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPDF, setShowPDF] = useState(false);
  const containerRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [allSignatures, setAllSignatures] = useState({});

  useEffect(() => {
    setShowPDF(files.length > 0);
  }, [files]);

  useEffect(() => {
    initializeAllSignatures();
  }, [numPages]);

  useEffect(() => {
    if (signatures && Object.keys(allSignatures).length > 0) {
      setAllSignatures((prevSignatures) => {
        const updatedSignatures = { ...prevSignatures };
        Object.keys(updatedSignatures).forEach((pageNumber) => {
          updatedSignatures[pageNumber] = signatures.map((sig) => {
            const existingSignature = updatedSignatures[pageNumber].find((s) => s.id === sig.id);
            return existingSignature ? existingSignature : { ...sig, fixed: false };
          });
        });
        return updatedSignatures;
      });
    }
  }, [signatures]);

  const toggleSignatureFix = useCallback((pageNumber, signatureIndex) => {
    setAllSignatures((prevSignatures) => {
      const updatedSignatures = { ...prevSignatures };
      if (!updatedSignatures[pageNumber]) {
        updatedSignatures[pageNumber] = signatures.map((sig) => ({ ...sig, fixed: false }));
      }
      updatedSignatures[pageNumber][signatureIndex].fixed = !updatedSignatures[pageNumber][signatureIndex].fixed;
      return updatedSignatures;
    });
  }, [signatures]);

  const handleDragStop = useCallback((pageNumber, _, data, signatureIndex) => {
    if (!allSignatures[pageNumber][signatureIndex].fixed) {
      const newPosition = { x: data.x, y: data.y };
      setAllSignatures((prevSignatures) => {
        const updatedSignatures = { ...prevSignatures };
        updatedSignatures[pageNumber][signatureIndex] = { ...updatedSignatures[pageNumber][signatureIndex], ...newPosition };
        return updatedSignatures;
      });
    }
  }, [allSignatures]);

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
      addSignatureToCurrentPage(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      addSignatureToCurrentPage(pageNumber - 1);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setShowPDF(true);
    setNumPages(acceptedFiles.length);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
  });

  const initializeAllSignatures = () => {
    const initialSignatures = {};
    for (let i = 1; i <= numPages; i++) {
      initialSignatures[i] = signatures.map((sig) => ({ ...sig, fixed: false }));
    }
    setAllSignatures(initialSignatures);
  };

  const addSignatureToCurrentPage = useCallback(
    (pageNumberToAdd) => {
      setAllSignatures((prevSignatures) => {
        const updatedSignatures = { ...prevSignatures };
        updatedSignatures[pageNumberToAdd] = updatedSignatures[pageNumberToAdd] || [];
        return updatedSignatures;
      });
    },
    [setAllSignatures]
  );

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center max-w-lg p-2 h-64 border-2
        border-gray-400 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'bg-gray-100' : ''}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive ? 'Solte os arquivos aqui' : 'Arraste e solte seus arquivos aqui ou clique para selecionar'}
        </p>
      </div>
      <div className="flex flex-col items-start w-full">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-center gap-2 mb-2">
            <span className="text-gray-800">{file.name}</span>
          </div>
        ))}
        {showPDF && (
          <div className="pdf-container" ref={containerRef}>
            <Document file={pdfFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              {Array.from(new Array(numPages), (_, pageIndex) => (
                <div key={`page_${pageIndex + 1}`}>
                  {pageIndex + 1 === pageNumber && (
                    <div className="relative">
                      {allSignatures[pageNumber] &&
                        allSignatures[pageNumber].map((signature, index) => {
                          console.log(`Posição: x=${signature.x}, y=${signature.y}, Página: ${pageNumber}`);
                          return (
                            <Draggable
                              key={`signature_${index}`}
                              defaultPosition={{ x: signature.x, y: signature.y }}
                              onStop={(e, data) => handleDragStop(pageNumber, e, data, index)}
                              disabled={signature.fixed}
                            >
                              <div
                                className={`absolute z-50 p-2 flex flex-col bg-white/50 border-2 border-dashed border-gray-300
                                rounded shadow-md cursor-pointer ${signature.fixed ? 'opacity-50' : ''}`}
                              >
                                <span className="font-bold">{signature.name}</span> <span>{signature.email}</span>
                              </div>
                            </Draggable>
                          );
                        })}
                      <Page className="z-10" renderTextLayer={false} pageNumber={pageNumber} />
                    </div>
                  )}
                </div>
              ))}
            </Document>
          </div>
        )}
        <div className="flex justify-center mt-2">
          <button
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
            className={`px-2 py-2 w-44 h-12 rounded-md ${
              pageNumber <= 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Página Anterior
          </button>
          <span className="mx-4 text-lg">
            {pageNumber} de {numPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            className={`px-2 py-2 w-40 h-12 rounded-md ${
              pageNumber >= numPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white  hover:bg-blue-600'
            }`}
          >
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropZoneComponent;