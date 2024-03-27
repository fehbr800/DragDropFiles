'use client'
import DropZoneComponent, { DragOnDropFilesRender } from "@/components/DragDrop";
import StepsNavigation from "@/components/StepsNavigation";
import RenderFile from "./renderFile/page";
import { useState } from "react";






export default function Home() {
  const [files, setFiles] = useState([]);

  return (
    <main className="flex flex-col items-center min-h-screen p-24 gap-11">
      <div className="p-4 rounded-lg shadow">
       <DragOnDropFilesRender/>
      </div>
   


   
 
    </main>
  );
}
