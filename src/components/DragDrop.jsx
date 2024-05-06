import { cleanBorder, primary45 } from "@/utils/colors";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";


export default function Drop({ onLoaded }) {


  const onDrop = useCallback((acceptedFiles) => {
    onLoaded(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  return (
<div
      {...getRootProps()}
      className={`relative border-4 rounded-lg p-6 mt-5 cursor-pointer transition duration-300 ease-in-out ${
        isDragActive ? 'border-purple-700 bg-purple-100 shadow-lg' : 'border-gray-300 bg-white hover:border-purple-600'
      }`}
      style={{ minHeight: '200px' }}
    >
      <DocumentPlusIcon className="w-20 h-20 mx-auto text-gray-500" />
      <input {...getInputProps()} />
      <p className={`text-center font-semibold ${
        isDragActive ? 'text-purple-700' : 'text-gray-600'
      }`}>
        {isDragActive ? 'Solte o PDF aqui' : 'Arraste e solte um arquivo PDF aqui ou clique para selecionar'}
      </p>
    </div>
  );
}
