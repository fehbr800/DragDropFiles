import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { SignatoryContainer } from "./Signataries";

export function PdfContainer({ initialPdf, initialSignatories, pdf, setPdf }) {
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(initialPdf);
    const [signatories, setSignatories] = useState(initialSignatories);
    const [signatoryPositions, setSignatoryPositions] = useState({});
  
    // Função para salvar as posições das assinaturas
    const saveSignatoryPositions = (pageNumber, positions) => {
      setSignatoryPositions((prevPositions) => ({
        ...prevPositions,
        [pageNumber]: positions,
      }));
    };
  
    useEffect(() => {
      const loadPdf = async () => {
        try {
          const pdfDoc = await PDFDocument.load(pdf);
          const pages = pdfDoc.getPages();
          setTotalPages(pages.length);
        } catch (error) {
          console.error('Erro ao carregar PDF:', error);
        }
      };
  
      loadPdf();
    }, [pdf]);
  
    const handlePageChange = (newPageNumber) => {
      setCurrentPage(newPageNumber);
    };
  
    return (
      <div>
        <SignatoryContainer
          signatories={signatories}
       
          position={signatoryPositions[currentPage] || []}

         setPosition={setSignatoryPositions}
          saveSignatoryPositions={(positions) => saveSignatoryPositions(currentPage, positions)}
        />
        <div>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <PageContainer
              key={pageNumber}
              pageNumber={pageNumber}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              setPdf={setPdf}
              pdf={pdf}
              signatories={signatories}
              setSignatoryPositions={(positions) => saveSignatoryPositions(pageNumber + 1, positions)}
            />
          ))}
        </div>
      </div>
    );
  }
  
  function PageContainer({ pageNumber, onPageChange, currentPage, setPdf, pdf, signatories, setSignatoryPosition }) {
    const [loadedPageDetails, setLoadedPageDetails] = useState(null);
    const [signatoryPositions, setSignatoryPositions] = useState([]);
  
    useEffect(() => {
      const loadPdf = async () => {
        try {
          const pdfDoc = await PDFDocument.load(pdf);
          const currentPage = pdfDoc.getPage(pageNumber);
          const { width, height } = currentPage.getSize();
  
          // Carregar as posições das assinaturas
          const savedSignatoryPositions = getSavedSignatoryPositions(pageNumber);
  
          // Renderizar assinaturas na página
          signatories.forEach((signatory) => {
            const position = savedSignatoryPositions?.find((pos) => pos.name === signatory.name);
  
            if (position) {
              const newX = position.x * width;
              const newY = (1 - position.y) * height;
  
              currentPage.drawText(signatory.name, {
                x: newX,
                y: newY,
              });
            }
          });
  
          const pdfBytes = await pdfDoc.save();
          const newPdf = new Blob([pdfBytes], { type: 'application/pdf' });
          setPdf(URL.createObjectURL(newPdf));
        } catch (error) {
          console.error('Erro ao carregar PDF:', error);
        }
      };
  
      loadPdf();
    }, [pdf, pageNumber, signatories, setPdf]);
  
    // Renderizar áreas de assinatura na página
    const renderSignatoryAreas = () => {
      return signatoryPositions.map((position, index) => {
        const style = {
          position: 'absolute',
          left: `${position.x * 100}%`,
          top: `${(1 - position.y) * 100}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: '999px',
          width: '100px', // Defina o tamanho da área de assinatura conforme necessário
          height: '50px', // Defina o tamanho da área de assinatura conforme necessário
          border: '2px dashed #000', // Adicione uma borda pontilhada para representar a área de assinatura
          pointerEvents: 'none', // Evita que a área de assinatura seja clicada
        };
  
        return <div key={index} style={style}></div>;
      });
    };
  
    return (
      <div style={{ position: 'relative' }}>
        {renderSignatoryAreas()}
        <Document
          file={pdf}
          onLoadSuccess={(data) => {
         
            setLoadedPageDetails(data);
          }}
        >
          <Page
            pageNumber={pageNumber + 1}
            renderTextLayer={false}
            onLoadSuccess={(data) => {
                setLoadedPageDetails(data);
            }}
          />
        </Document>
      </div>
    );
  }
  