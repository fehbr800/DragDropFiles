'use client'
import { useRef, useState } from "react";

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
const styles = {
container: {
maxWidth: 900,
margin: "0 auto",
},
sigBlock: {
display: "inline-block",
border: "3px solid #000",
},
documentBlock: {
maxWidth: 800,
margin: "20px ",
border: "1px solid #999",
},
controls: {
maxWidth: 800,
margin: "0 auto",
marginTop: 8,
},
};
const [pdf, setPdf] = useState(null);
const [autoDate, setAutoDate] = useState(true);
const [signatureURL, setSignatureURL] = useState(null);
const [position, setPosition] = useState(null);
const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
const [textInputVisible, setTextInputVisible] = useState(false);
const [selectedSignatory, setSelectedSignatory] = useState(false);
const [pageNum, setPageNum] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [pageDetails, setPageDetails] = useState(null);
const [signatories, setSignatories] = useState([]);
const documentRef = useRef(null);
const [selectedText, setSelectedText] = useState('')
const [editingIndex, setEditingIndex] = useState(-1);
const [iframeSrc, setIframeSrc] = useState(null);


const addSignatory = (signatory) => {
  if (signatories.length < 5) {
    setSignatories([...signatories, signatory]);
  } else {
    console.log("Limite de 5 signatários atingido. Não é possível adicionar mais.");
  }
};

const handleEditSignatory = (index) => {
  setEditingIndex(index);
  const signatoryToEdit = signatories[index];
  console.log("Editar signatário:", signatoryToEdit);

};

const handleDeleteSignatory = (index) => {
  const updatedSignatories = [...signatories];
  updatedSignatories.splice(index, 1);

  setSignatories(updatedSignatories);
  console.log("Excluir signatário:", signatories[index]);

};

const handleSet = (text) => {
  setSelectedText(text);
};

const handleSignatoryClick = (signatory) => {
  setSelectedSignatory(signatory); 
};

const handleCancel = () => {
  setSelectedSignatory(null); 
};


const simulateDataSending = async (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ success: true, message: "Informações dos signatários enviadas com sucesso!" });
      
    }, 1000);
  });
};

const handleSaveAndContinue = async () => {
  if (signatories.length === 0) {
    console.log("Nenhum signatário adicionado. Por favor, adicione pelo menos um signatário.");
    return;
  }

  const signatoriesData = signatories.map(signatory => ({
    name: signatory.name,
    email: signatory.email,
    signatureType: signatory.signatureType,
    signature: signatory.signature,
  
  }));

  try {
    const existingPdfBytes = await fetch(pdf).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]; 

    const textX = 50;
    let textY = firstPage.getHeight() - 50;

    for (const signatoryData of signatoriesData) {
      firstPage.drawText(signatoryData.name, {
        x: textX,
        y: textY,
        size: 12,
        color: rgb(0, 0, 0), 
      });

    
      textY -= 20; 
    }


    const pdfBytes = await pdfDoc.save();

    
    const modifiedPdfUrl =arrayBufferToBase64(pdfBytes);

    setIframeSrc(modifiedPdfUrl);
    setIframeSrc(`data:application/pdf;base64,${modifiedPdfUrl}`);
  } catch (error) {
    console.error("Erro ao adicionar informações dos signatários ao PDF:", error);
  }
};


const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};




return (
<div className="container flex items-center justify-center mx-auto ">

  <div className="">



    {signatureDialogVisible ? (
    <AddSigDialog autoDate={autoDate} setAutoDate={setAutoDate} onClose={()=> setSignatureDialogVisible(false)}
      onConfirm={(url) => {
      setSignatureURL(url);
      setSignatureDialogVisible(false);
      }}
      />
      ) : null}

      {!pdf ? (
      <Drop onLoaded={async (files)=> {
        const URL = await blobToURL(files[0]);
        setPdf(URL);
        }}
        />
        ) : null}
        {pdf ? (
        <div className="flex justify-center gap-5 py-4">
          <div className="flex flex-col gap-4 mt-10">
            {/* {!signatureURL ? (
            <BigButton marginRight={8} title={"Adicionar assinatura Digital"} onClick={()=>
              setSignatureDialogVisible(true)}
              />
              ) : null} */}

              {/* <BigButton marginRight={8} title={"Add Date"} onClick={()=> setTextInputVisible("date")}
                /> */}
                <SignatoryForm addSignatory={addSignatory} pdf={pdf} pageNum={pageNum} pageDetails={pageDetails}
                  setPosition={setPosition} setPdf={setPdf} />

                <SignatoryContainer
                signatories={signatories}
                onClick={() => setSelectedSignatory(true)}
                onEdit={handleEditSignatory}
                onDelete={handleDeleteSignatory}
                position={position}
                pdf={pdf}
                documentRef={documentRef}
                pageDetails={pageDetails}
                setPosition={setPosition}
                setPdf={setPdf}
                pageNum={pageNum}
                
              />
                {/* <BigButton marginRight={8} title={"Adicionar Assinatura"} onClick={()=> setTextInputVisible(true)}
                  /> */}

                 
                    {/* {pdf ? (
                    <BigButton marginRight={8} inverted={true} title={"Download"} onClick={()=> {
                      downloadURI(pdf, "file.pdf");
                      }}
                      />
                      ) : null} */}

                      {pdf?(
                      
                        <button onClick={handleSaveAndContinue} className="px-8 py-2 font-semibold text-white bg-indigo-600 rounded-md">
                          Salvar e continuar
                        </button>
                      ):null}
          </div>
          <div ref={documentRef} className="relative rounded-md shadow-md max-w-[800px] ">
            <div className="absolute top-[0.64rem] z-50 right-0 flex justify-end mx-2">
           <button className="p-1 text-red-400 rounded-lg shadow-lg hover:text-red-600 hover:bg-gray-50" onClick={()=> {
                    setTextInputVisible(false);
                    setSignatureDialogVisible(false);
                    setSignatureURL(null);
                    setPdf(null);
                    setTotalPages(0);
                    setPageNum(0);
                    setPageDetails(null);
                    }}>
                      <XMarkIcon className="w-6 h-6"/>
                    </button>
            </div>
         
          {/* {selectedSignatory ? (
            signatories.map((signatory, index) => (
              <DraggableSignatory
              index={index}
                key={index}
                initialText={
                  textInputVisible && selectedSignatory === 'date'
                    ? dayjs().format('MM/d/YYYY')
                    : null
                }
                signatory={signatory}
                onCancel={handleCancel}
                onEnd={setPosition}
                onSet={async (name) => {
                  if (selectedSignatory ) {
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

                    firstPage.drawText(name, {
                      x: newX,
                      y: newY,
                      size: 20 * scale,
                      });

                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([new Uint8Array(pdfBytes)]);

                    const URL = await blobToURL(blob);
                    setPdf(URL);
                    setPosition(null);
                    setTextInputVisible(false);
                    setSelectedSignatory(null);
                  }
                }}
              />
            ))
          ) : null} */}


            {textInputVisible ? (
            <DraggableText initialText={ textInputVisible && selectedText ==="date" ? dayjs().format("MM/d/YYYY") : null } onCancel={()=>
              setTextInputVisible(false)}
              onEnd={setPosition}
              onSet={async (text) => {
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

              firstPage.drawText(text, {
              x: newX,
              y: newY,
              size: 20 * scale,
              });

              const pdfBytes = await pdfDoc.save();
              const blob = new Blob([new Uint8Array(pdfBytes)]);

              const URL = await blobToURL(blob);
              setPdf(URL);
              setPosition(null);
              setTextInputVisible(false);
              }}
              />
              ) : null}

              {signatureURL ? (
              <DraggableSignature url={signatureURL} onCancel={()=> {
                setSignatureURL(null);
                }}
                onSet={async () => {
                const { originalHeight, originalWidth } = pageDetails;
                const scale = originalWidth / documentRef.current.clientWidth;

                const y =
                documentRef.current.clientHeight -
                (position.y -
                position.offsetY +

                documentRef.current.offsetTop);
                const x =
                position.x -

                position.offsetX -
                documentRef.current.offsetLeft;
                const newY =
                (y * originalHeight) / documentRef.current.clientHeight;
                const newX =
                (x * originalWidth) / documentRef.current.clientWidth;

                const pdfDoc = await PDFDocument.load(pdf);

                const pages = pdfDoc.getPages();
                const firstPage = pages[pageNum];

                const pngImage = await pdfDoc.embedPng(signatureURL);
                const pngDims = pngImage.scale( scale * .3);

                firstPage.drawImage(pngImage, {
                x: newX,
                y: newY,
                width: pngDims.width,
                height: pngDims.height,
                });

                if (autoDate) {
                firstPage.drawText(
                `Signed ${dayjs().format(
                "M/d/YYYY HH:mm:ss ZZ"
                )}`,
                {
                x: newX,
                y: newY - 10,
                size: 14 * scale,
                color: rgb(0.074, 0.545, 0.262),
                }
                );
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([new Uint8Array(pdfBytes)]);

                const URL = await blobToURL(blob);
                setPdf(URL);
                setPosition(null);
                setSignatureURL(null);
                }}
                onEnd={setPosition}
                />
                ) : null}


                <Document file={pdf} onLoadSuccess={(data)=> {
                  setTotalPages(data.numPages);
                  }}
                  >
                  <Page pageNumber={pageNum + 1}  renderTextLayer={false}  onLoadSuccess={(data)=> {
                    setPageDetails(data);
                    }}
                    />
                </Document>
                <PagingControl pageNum={pageNum} setPageNum={setPageNum} totalPages={totalPages} />
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