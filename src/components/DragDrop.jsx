import { cleanBorder, primary45 } from "@/utils/colors";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";


export default function Drop({ onLoaded }) {
  const styles = {
    container: {
      textAlign: "center",
      border: cleanBorder,
      padding: 20,
      marginTop: 12,
      color: primary45,
      fontSize: 18,
      fontWeight: 600,
      borderRadius: 4,
      userSelect: "none",
      outline: 0,
      cursor: "pointer",
    },
  };

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
  className={`border-2 rounded-lg p-4 cursor-pointer ${
    isDragActive ? 'border-purple-600 bg-purple-100' : 'border-gray-300 bg-white'
  }`}
>
  <input {...getInputProps()} />
  {isDragActive ? (
    <p className="text-purple-600">Solte o PDF aqui</p>
  ) : (
    <p className="text-gray-600">Adicione um arquivo PDF aqui</p>
  )}
</div>
  );
}
