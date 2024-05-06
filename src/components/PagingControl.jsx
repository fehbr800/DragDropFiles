import { primary45 } from "@/utils/colors";
import { BigButton } from "./Button";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";


export default function PagingControl({ totalPages, pageNum, setPageNum }) {


  const handleFirstPageClick = () => {
    setPageNum(0); 
  };

  const handleLastPageClick = () => {
    setPageNum(totalPages - 1); 
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2 px-4 py-2" >
        <BigButton
          className="text-indigo-400 hover:text-indigo-600 "
          title={  <ChevronDoubleLeftIcon className="w-5 h-5" />}
          onClick={handleFirstPageClick}
          disabled={pageNum === 0} 
        />
        
        <BigButton
          className="text-indigo-400 hover:text-indigo-600 "
          title={<ChevronLeftIcon className="w-5 h-5"/>}
          onClick={() => setPageNum(pageNum - 1)}
          disabled={pageNum === 0} 
        />
        <div className="p-2 font-semibold bg-white rounded-md shadow-md">
           {pageNum + 1}/{totalPages}
        </div>
        <BigButton
          className="text-indigo-400 hover:text-indigo-600 "
          title={<ChevronRightIcon className="w-5 h-5"/>}
          onClick={() => setPageNum(pageNum + 1)}
          disabled={pageNum === totalPages - 1} 
        />
        <BigButton
          className="text-indigo-400 hover:text-indigo-600 "
          title={<ChevronDoubleRightIcon className="w-5 h-5" />}
          onClick={handleLastPageClick}
          disabled={pageNum === totalPages - 1} 
        />
      </div>
    </div>
  );
}