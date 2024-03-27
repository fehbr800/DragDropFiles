
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import StepsNavigation from './StepsNavigation';


const steps = [
  {  name: 'Upload de Arquivos', href: '/', status: 'complete' },
  { name: 'Mostrando Arquivos', href: '/', status: 'upcoming' },
  {  name: 'Preview', href: '#', status: 'upcoming' },
]

export function DragOnDropFilesRender(){
  
  return(
    <>
    <StepsNavigation steps={steps}/>
      <DropZoneComponent />
      <RenderFile />
      </>
  )
}


const DropZoneComponent = () => {
const [files, setFiles] = useState([]);
const [loading, setLoading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const router = useRouter()

const onDrop = useCallback((acceptedFiles) => {
setLoading(true); 
setFiles(acceptedFiles);

let totalSize = 0;
acceptedFiles.forEach((file) => {
totalSize += file.size;
});

let uploadedSize = 0;
acceptedFiles.forEach((file) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onprogress = (event) => {
uploadedSize += event.loaded;
let progress = (uploadedSize / totalSize) * 100;

progress = progress > 100 ? 100 : progress;
setUploadProgress(progress);
};
reader.onloadend = () => {
if (uploadedSize === totalSize) {

setTimeout(() => {
setLoading(false); 
setUploadProgress(0); 
}, 2000);
}
};
});
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

const handleNextButtonClick = () => {
  router.push(`/renderFile?files=${JSON.stringify(files)}`);
};


const handleCancelButton = () => {
  setFiles([]);
};

return (
<div className='flex flex-col gap-4'>
  <div {...getRootProps()} className={`flex flex-col items-center justify-center max-w-lg p-2 h-64 border-2
    border-gray-400 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'bg-gray-100' : '' }`}>
    <input {...getInputProps()} />
    {loading && (
    <div className="w-full h-2 mb-4 overflow-hidden bg-gray-200 rounded-md">
      <div className="h-full bg-blue-500" style={{ width: `${uploadProgress}%` }}></div>
    </div>
    )}
    {loading && (
    <p className="mb-4 text-gray-600">{`Upload em progresso: ${uploadProgress.toFixed(0)}%`}</p>
    )}

    <p className="mb-4 text-gray-600">
      {isDragActive ? 'Solte os arquivos aqui' : 'Arraste e solte seus arquivos aqui ou clique para selecionar'}
    </p>
    <div className="flex flex-col items-start w-full">
      {files.map((file, index) => (
      <div key={index} className="flex items-center mb-2">
        {file.type.startsWith('image/') ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover w-8 h-8 mr-2 rounded" />
        ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
          <path
            d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z">
          </path>
        </svg>
        )}
        <span className="text-gray-800">{file.name}</span>
      </div>
      ))}
    </div>
  </div>
  <div>

  </div>
  <div className='flex gap-2'>
  <button onClick={handleCancelButton}
      className="px-4 py-2 font-bold text-gray-500 border border-gray-300 rounded hover:text-gray-800">
     Cancelar
    </button>
    <button onClick={handleNextButtonClick}
      className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
      Continuar
    </button>
  </div>


</div>
);
};

export default DropZoneComponent;


function RenderFile({files}) {
  return (
    <div>
      {/* {files.map((file, index) => (
        <div key={index}>
          <p>{file.name}</p>
          <p>{file.type}</p>
          <p>{file.size} bytes</p>
          {file.type.startsWith('image/') && (
            <img src={URL.createObjectURL(file)} alt={file.name} />
          )}
        </div>
      ))} */}

      Pag render file
    </div>
  );
}

