'use client'
import { useCallback, useEffect, useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";


import dayjs from "dayjs";
import Drop from "@/components/DragDrop";
import { AddSigDialog } from "@/components/AddSigDialog";
import { BigButton } from "@/components/Button";
import DraggableText, { DraggableSignatory } from "@/components/DraggableText";
import DraggableSignature from "@/components/DraggableSignature";
import PagingControl from "@/components/PagingControl";
import { blobToURL } from "@/utils/utils";
import SignatoryForm, { SignatoryContainer, SignatoryHistory } from "@/components/Signataries";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { document } from "postcss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function downloadURI(uri, name) {
var link = document.createElement("a");
link.download = name;
link.href = uri;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

function Home() {
const [pdf, setPdf] = useState(null);
const [autoDate, setAutoDate] = useState(true);
const [signatureURL, setSignatureURL] = useState(null);
const [position, setPosition] = useState(null);
const [textInputVisible, setTextInputVisible] = useState(false);
const [pageNum, setPageNum] = useState(1);
const [totalPages, setTotalPages] = useState(0);
const [pageDetails, setPageDetails] = useState(null);
const [signatories, setSignatories] = useState([]);
const documentRef = useRef(null);
const [iframeSrc, setIframeSrc] = useState(null);
const [signatoryPositions, setSignatoryPositions] = useState({});
const [signatureTypes, setSignatureTypes] = useState({});
const [selectedSignatories, setSelectedSignatories] = useState([]);
const [allSignatures, setAllSignatures] = useState({});
const [sendingData, setSendingData] = useState(false); 
const [confirmationMessage, setConfirmationMessage] = useState(""); 



const addSignatory = (signatory) => {
if (signatories.length < 5) { setSignatories([...signatories, signatory]); } 
else { console.log("Limite de 5 signatários  atingido. Não é possível adicionar mais."); } };


 const handleDeleteSignatory=(index)=> {
  const updatedSignatories = [...signatories];
  updatedSignatories.splice(index, 1);

  setSignatories(updatedSignatories);
  handleRemoveSignatory(index)
  console.log("Excluir signatário:", signatories[index]);

  };

 

  const handleSetPosition = (signatoryId, newPosition) => {
    setSignatoryPositions((prevPositions) => {
      const updatedPositions = { ...prevPositions };
      if (!updatedPositions[pageNum]) {
        updatedPositions[pageNum] = {};
      }
      updatedPositions[pageNum][signatoryId] = newPosition;
      localStorage.setItem('signatoryPositions', JSON.stringify(updatedPositions));
      return updatedPositions;
    });
  };

  const handleRemoveSignatory = (signatoryId) => {
    setSignatoryPositions((prevPositions) => {
      const updatedPositions = { ...prevPositions };
      if (updatedPositions[pageNum] && updatedPositions[pageNum][signatoryId]) {
        delete updatedPositions[pageNum][signatoryId];
      }
      localStorage.setItem('signatoryPositions', JSON.stringify(updatedPositions));
      return updatedPositions;
    });
  
    setAllSignatures((prevSignatures) => {
      const updatedSignatures = { ...prevSignatures };
      if (updatedSignatures[pageNum]) {
        updatedSignatures[pageNum] = updatedSignatures[pageNum].filter(s => s.id !== signatoryId);
      }
      return updatedSignatures;
    });
  
    setSelectedSignatories((prevSelectedSignatories) =>
      prevSelectedSignatories.filter(s => s.id !== signatoryId)
    );
  
   
  }
  

  useEffect(() => {
    const savedPositions = JSON.parse(localStorage.getItem('signatoryPositions')) || {};
    setSignatoryPositions(savedPositions);
  }, []);

  useEffect(() => {
    setSelectedSignatories([]);
  }, [pageNum]);

  useEffect(() => {
    const currentPagePositions = signatoryPositions[pageNum] || {};
    const newSelectedSignatories = signatories.filter(signatory => currentPagePositions[signatory.id]);
    setSelectedSignatories(newSelectedSignatories);
  }, [pageNum]);




  const simulateDataSending = async (data) => {
  return new Promise((resolve, reject) => {
  setTimeout(() => {
  resolve({ success: true, message: "Informações dos signatários enviadas com sucesso!" });

  }, 1000);
  });
  };

  const fakeBackendRequest = async (data) => {
    console.log("Enviando dados para o backend:", data);
  
 
    await new Promise(resolve => setTimeout(resolve, 1000));
  
  
    const response = { success: true, message: "Informações recebidas com sucesso no backend." };
    return response;
  };
  
  const handleSaveAndContinue = async () => {
    if (signatories.length === 0) {
      console.log("Nenhum signatário adicionado. Por favor, adicione pelo menos um signatário.");
      return;
    }

    setSendingData(true);

    const signatoriesData = signatories.map(signatory => ({
      name: signatory.name,
      email: signatory.email,
      signatureType: signatory.signatureType,
      signature: signatory.signature,
      signaturePosition: pageNum === pageNum ? signatory.position : null,
      pageNumber: pageNum
    }));

    try {
      const existingPdfBytes = await fetch(pdf).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pdfBytes = await pdfDoc.save();


      const requestData = await fakeBackendRequest({
        pdf: arrayBufferToBase64(pdfBytes),
        signatories: signatoriesData,
        signatoryPositions: signatoryPositions, 
        signatureTypes: signatureTypes, 
      
      });

      const response = await simulateDataSending(requestData);

      setSendingData(false);
      setConfirmationMessage(response.message);
      
      console.log("Resposta do backend:", response);
    } catch (error) {
      console.error("Erro ao adicionar informações dos signatários ao PDF:", error);
      setSendingData(false);
    }
  };


  const getCurrentPagePositions = () => signatoryPositions[pageNum] || {};

  const selectSignatory = (signatory) => {
    setSelectedSignatories((prevSelectedSignatories) => {
      const isAlreadySelected = prevSelectedSignatories.some((s) => s.id === signatory.id);
      if (!isAlreadySelected) {
        return [...prevSelectedSignatories, signatory];
      }
      return prevSelectedSignatories;
    });
    addSignatureToCurrentPage(signatory, pageNum);
  };

 
  const addSignatureToCurrentPage = useCallback(
    (signature, pageNumberToAdd) => {
      setAllSignatures((prevSignatures) => {
        const updatedSignatures = { ...prevSignatures };
        updatedSignatures[pageNumberToAdd] = updatedSignatures[pageNumberToAdd] || [];
        
        const isAlreadyAdded = updatedSignatures[pageNumberToAdd].some((s) => s.id === signature.id);
        if (!isAlreadyAdded) {
          updatedSignatures[pageNumberToAdd].push(signature);
        }
        
        return updatedSignatures;
      });
    },
    [setAllSignatures]
  );

  useEffect(() => {
    let timer;
    if (confirmationMessage) {
      timer = setTimeout(() => {
        setConfirmationMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [confirmationMessage]);



  const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) { binary +=String.fromCharCode(bytes[i]); } return btoa(binary); }; return ( <div
    className="">
    <div className="">


        <div className="flex items-center justify-center my-auto">
          {!pdf ? (
          <Drop onLoaded={async (files)=> {
            const URL = await blobToURL(files[0]);
            setPdf(URL);
            }}
            />
            ) : null}
        </div>


        {pdf ? (
        <div className="flex py-4 grow ">
          <div  className="flex flex-col gap-4 mt-10">
            <div className="flex flex-col items-end flex-1 gap-4 p-4">
              <SignatoryForm addSignatory={addSignatory} signatories={signatories} pdf={pdf} pageNum={pageNum}
                pageDetails={pageDetails} setPosition={setPosition} setPdf={setPdf} />

              <SignatoryContainer 
                signatories={signatories}  
                onClick={selectSignatory}
                onDelete={handleDeleteSignatory}
                position={position}
                pdf={pdf}
                setSignatories={setSignatories}
                documentRef={documentRef}
                pageDetails={pageDetails}
                setPosition={setPosition}
                setPdf={setPdf}
                setSignatureTypes={setSignatureTypes}
                pageNum={pageNum}
                pageSignatureTypes={signatureTypes}
                setPageSignatureTypes={setSignatureTypes}
                
                />
                {pdf?(

              <div className="flex flex-col justify-end gap-4">
              <button onClick={handleSaveAndContinue}
                className={`px-8 py-2 font-semibold text-white rounded-md ${
                  sendingData ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={sendingData}
              >
                {sendingData ? 'Enviando...' : 'Salvar e continuar'}
              </button>
              {confirmationMessage && <p className="text-sm text-emerald-500">{confirmationMessage}</p>}
              </div>
                ):null}
            </div>
          </div>
          
          <div  className="flex-1 mx-auto">
          <div className="relative mx-auto flex-1 bg-gray-200 max-w-7xl overflow-y-auto h-[900px]">
            <div className="absolute top-[0.64rem] z-50 right-0 flex justify-end mx-2">
              <button className="p-1 text-red-400 bg-white rounded-lg shadow-lg hover:text-red-600 hover:bg-gray-50"
                onClick={()=> {
                setTextInputVisible(false);
                setSignatureURL(null);
                setPdf(null);
                setTotalPages(0);
                setPageNum(0);
                setPageDetails(null);
                }}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>


            <div ref={documentRef} className="p-4 rounded-md relative parent max-w-[800px] overflow-hidden mx-auto flex flex-col">
            <Document file={pdf} onLoadSuccess={({ numPages }) => setTotalPages(numPages)}>
                    {Array.from(new Array(totalPages), (_, pageIndex) => (
                      <div key={`page_${pageIndex + 1}`}>
                        {pageIndex + 1 === pageNum && (
                          <div className="relative">
                            {allSignatures[pageNum] &&
                              allSignatures[pageNum].map((signature, index) => (
                                <DraggableSignatory
                                key={`signature_${signature.id}`} 
                                  pageDetails={pageDetails}
                                  documentRef={documentRef}
                                  setPosition={setPosition}
                                  currentPage={pageNum}
                                  position={getCurrentPagePositions()[signature.id]}
                                  signatory={signature}
                                  onCancel={() => handleRemoveSignatory(signature.id)}
                                  onEnd={(e, data) => {
                                    if (data) {
                                      handleSetPosition(signature.id, { x: data.x, y: data.y });
                                    }
                                  }}
                                  onSet={handleSetPosition}
                                  onRemove={handleRemoveSignatory}
                                  pageSignatureTypes={signatureTypes}
                                
                                />
                              ))}
                            <Page  width={800}  className="max-h-[1200px]" renderTextLayer={false} pageNumber={pageNum} />
                          </div>
                        )}
                      </div>
                    ))}
                  </Document>
            </div>           
          </div>
          <PagingControl pageNum={pageNum} setPageNum={setPageNum} totalPages={totalPages} addSignatureToCurrentPage={addSignatureToCurrentPage} />
          </div>
         
        </div>
        ) : null}

    </div>
    {iframeSrc && (
    <iframe src={iframeSrc} width="100%" height="600" title="PDF Modificado"></iframe>
    )}

    </div>
    );
    }

    export default Home;