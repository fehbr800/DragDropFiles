'use client'
import { useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";


import dayjs from "dayjs";
import Drop from "@/components/DragDrop";
import { AddSigDialog } from "@/components/AddSigDialog";
import { BigButton } from "@/components/Button";
import DraggableText from "@/components/DraggableText";
import DraggableSignature from "@/components/DraggableSignature";
import PagingControl from "@/components/PagingControl";
import { blobToURL } from "@/utils/utils";
import SignatoryForm, { SignatoryContainer, SignatoryHistory } from "@/components/Signataries";

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
const [pageNum, setPageNum] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [pageDetails, setPageDetails] = useState(null);
const [signatories, setSignatories] = useState([]);
const documentRef = useRef(null);
const [selectedText, setSelectedText] = useState('')

const addSignatory = (signatory) => {
setSignatories([...signatories, signatory]); // Adiciona o novo signatário ao estado de signatários
};
const handleSet = (text) => {
  setSelectedText(text);
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
                  

                  {/* <SignatoryHistory
                  signatoryHistory={signatories}
                  handleSet={handleSet}
                /> */}
                 <SignatoryContainer
                  textInputVisible={textInputVisible}
                  onClick={() => setTextInputVisible(false)}
                  signatories={signatories}
                  position={position}
                  documentRef={documentRef}
                  addSignatory={addSignatory}
                  pdf={pdf}
                  pageNum={pageNum}
                  pageDetails={pageDetails}
                  setPosition={setPosition}
                  setPdf={setPdf}
                />
          
                <BigButton marginRight={8} title={"Adicionar Assinatura"} onClick={()=> setTextInputVisible(true)}
                  />

                  <BigButton marginRight={8} title={"Resetar"} onClick={()=> {
                    setTextInputVisible(false);
                    setSignatureDialogVisible(false);
                    setSignatureURL(null);
                    setPdf(null);
                    setTotalPages(0);
                    setPageNum(0);
                    setPageDetails(null);
                    }}
                    />
                    {pdf ? (
                    <BigButton marginRight={8} inverted={true} title={"Download"} onClick={()=> {
                      downloadURI(pdf, "file.pdf");
                      }}
                      />
                      ) : null}
          </div>
          <div ref={documentRef} style={styles.documentBlock}>


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

              // new XY in relation to actual document size
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

                // new XY in relation to actual document size
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
                  <Page pageNumber={pageNum + 1} renderTextLayer={false} className="flex" onLoadSuccess={(data)=> {
                    setPageDetails(data);
                    }}
                    />
                </Document>
                <PagingControl pageNum={pageNum} setPageNum={setPageNum} totalPages={totalPages} />
          </div>

        </div>
        ) : null}
  </div>
</div>
);
}

export default Home;