'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function RenderFile({files}) {


  
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