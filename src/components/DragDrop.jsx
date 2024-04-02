import { useRouter } from 'next/navigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import StepsNavigation from './StepsNavigation';
import { Document, Page, pdfjs } from 'react-pdf';
import DraggableSignatureCard from './CanvaDrag';




export  function DragOnDropFilesRender({signatures, pdfFile}){
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
  const [signatureData, setSignatureData] = useState(null);
  const [pdfSignatures, setPdfSignatures] = useState([]);
  const containerRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showPDF, setShowPDF] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pageWidthA4 = 595;
  const pageHeightA4 = 842;
  const pageSpacing = 20;

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleSignaturesChange = (pageIndex, newSignature) => {
    const updatedSignatures = [...pdfSignatures];
    updatedSignatures[pageIndex] = newSignature;
    setPdfSignatures(updatedSignatures);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setShowPDF(false);
    setNumPages(acceptedFiles.length);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
  });

  useEffect(() => {
    setShowPDF(files.length > 0);
  }, [files]);

  return (
    <div>
      <div {...getRootProps()} className={`flex flex-col items-center justify-center max-w-lg p-2 h-64 border-2
        border-gray-400 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'bg-gray-100' : ''}`}>
        <input {...getInputProps()} />
        {showPDF && (
          <div className="w-full h-2 mb-4 overflow-hidden bg-gray-200 rounded-md">
            <div className="h-full bg-blue-500" style={{ width: `${numPages}%` }}></div>
          </div>
        )}
        {showPDF && (
          <p className="text-gray-600">{`Upload em progresso: ${numPages}%`}</p>
        )}
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
        {signatures && (
          <div className="pdf-container" ref={containerRef}>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, pageIndex) => (
              <div key={`page_${pageIndex}`}>
                {pageIndex + 1 === pageNumber && (
                  <div>
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
            className={`px-2 py-2 w-44 h-12 rounded-md ${pageNumber <= 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Página Anterior
          </button>
          <span className="mx-4 text-lg">
            {pageNumber} de {numPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            className={`px-2 py-2 w-40 h-12 rounded-md ${pageNumber >= numPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropZoneComponent;