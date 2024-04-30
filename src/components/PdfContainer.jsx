import { PDFDocument } from "pdf-lib";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { SignatoryContainer } from "./Signataries";
import { DraggableSignatory } from "./DraggableText";
import { useSignatoryPositions } from "@/hooks/usePositions";

export function PdfContainer({ pdf, usePositions, signatories, pageNum, pageDetails, setTotalPages, documentRef }) {
  const { getPosition, setPosition } = useSignatoryPositions();

  return (
    <div className="relative">
      <Document
        file={pdf}
        onLoadSuccess={({ numPages }) => setTotalPages(numPages)}
      >
        <Page pageNumber={pageNum} />
      </Document>
      {signatories.map(signatory => {
        const position = getPosition(pageNum, signatory.id);
        return position && (
          <DraggableSignatory
            key={signatory.id}
            signatory={signatory}
            position={position}
            usePositions={{ getPosition, setPosition }}
            currentPage={pageNum}
            documentRef={documentRef}
          />
        );
      })}
    </div>
  );
}