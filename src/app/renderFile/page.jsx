'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";




pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function RenderFile() {

  const router = useRouter();
  const [fileUrls, setFileUrls] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);


  useEffect(() => {
    if (router.query && router.query.fileUrls) {
      const fileUrlsParam = router.query.fileUrls;
      setFileUrls(JSON.parse(fileUrlsParam));
    }
  }, [router.query]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      {fileUrls.map((fileUrl, index) => (
        <div key={index}>
          <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              className="flex items-center justify-center mb-0"
              renderTextLayer={false}
              pageNumber={pageNumber}
              scale={scale}
            />
          </Document>
        </div>
      ))}
    </div>
  );
}