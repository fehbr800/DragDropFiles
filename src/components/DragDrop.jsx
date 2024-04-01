import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import StepsNavigation from './StepsNavigation';
import { Document, Page, pdfjs } from 'react-pdf';
import DraggableSignature from './CanvaDrag';



export function DragOnDropFilesRender(){

return(
<>

  <DropZoneComponent />

</>
)
}


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DropZoneComponent = () => {
const [files, setFiles] = useState([]);
const [showPDF, setShowPDF] = useState(false);
const [numPages, setNumPages] = useState(null);
const [pageNumber, setPageNumber] = useState(1);
const [addedSignatures, setAddedSignatures] = useState([]);
const pageWidthA4 = 595;
const pageHeightA4 = 842;
const pageSpacing = 20;

const onDrop = useCallback((acceptedFiles) => {
setFiles(acceptedFiles);
setShowPDF(false);
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
onDrop,
accept: '.pdf',
});

const handleNextPage = () => {
if (pageNumber < numPages) { setPageNumber(pageNumber + 1); } }; const handlePreviousPage=()=> {
  if (pageNumber > 1) {
  setPageNumber(pageNumber - 1);
  }
  };

  const handleNextButtonClick = () => {
  if (files.length > 0) {
  setShowPDF(true);
  setAddedSignatures(Array(numPages).fill([]));
  } else {
  console.error('Nenhum arquivo PDF selecionado para upload.');
  }
  };

  function onDocumentLoadSuccess({ numPages }) {
  setNumPages(numPages);
  setAddedSignatures(new Array(numPages).fill([]));
  }


  return (
  <div className="flex flex-col gap-4">
    <div {...getRootProps()} className={`flex flex-col items-center justify-center max-w-lg p-2 h-64 border-2
      border-gray-400 border-dashed rounded-lg cursor-pointer ${ isDragActive ? 'bg-gray-100' : '' }`}>
      <input {...getInputProps()} />
      <p className="mb-4 text-gray-600">
        {isDragActive ? 'Solte os arquivos aqui' : 'Arraste e solte seus arquivos aqui ou clique para selecionar'}
      </p>
      <div className="flex flex-col items-center w-full">
        {files.map((file, index) => (
        <div key={index} className="flex items-center justify-center gap-2 mb-2">
          <span className="text-gray-800">{file.name}</span>
        </div>
        ))}
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={()=> {
        setFiles([]);
        setShowPDF(false);
        }}
        className="px-4 py-2 font-bold text-gray-500 border border-gray-300 rounded hover:text-gray-800"
        >
        Cancelar
      </button>
      <button onClick={handleNextButtonClick}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
        Continuar
      </button>
    </div>

    {showPDF && (
    <div className="mt-4 overflow-y-scroll shadow-lg rounded-xl">
      <h2>PDF Exibido:</h2>
      <Document file={files[0]} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, pageIndex) => (
        <div key={`page_${pageIndex}`} style={{ marginTop: `${pageIndex !== 0 ? pageSpacing : 0}px` }}>
          {pageIndex + 1 === pageNumber && (
          <div>
            <Page className="z-10 flex items-center justify-center page" renderTextLayer={false}
              pageNumber={pageNumber} />
            <div style={{ position: 'relative', width: pageWidthA4, height: pageHeightA4 }}>
              <DraggableSignature addedSignatures={addedSignatures} pageNumber={pageNumber}
                onSignaturesChange={(newSignatures)=> {
                setAddedSignatures((prevSignatures) => {
                const updatedSignatures = [...prevSignatures];
                updatedSignatures[pageNumber - 1] = newSignatures;
                return updatedSignatures;
                });
                }}
                />

            </div>
          </div>
          )}
        </div>
        ))}
      </Document>
      <div className="flex justify-center mt-2">
        <button onClick={handlePreviousPage} disabled={pageNumber <=1} className={`px-2 py-2 w-44 h-12 rounded-md ${
          pageNumber <=1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}>
          Página Anterior
        </button>
        <span className="mx-4 text-lg">
          {pageNumber} de {numPages}
        </span>
        <button onClick={handleNextPage} disabled={pageNumber>= numPages}
          className={`px-2 py-2 w-40 h-12 rounded-md ${
          pageNumber >= numPages
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          >
          Próxima Página
        </button>
      </div>
    </div>
    )}
  </div>
  );
  };

  export default DropZoneComponent;