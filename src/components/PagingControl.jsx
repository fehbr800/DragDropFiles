import { primary45 } from "@/utils/colors";
import { BigButton } from "./Button";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";


export default function PagingControl({ totalPages, pageNum, setPageNum, addSignatureToCurrentPage }) {

  const handleFirstPageClick = () => {
    setPageNum(1);
    addSignatureToCurrentPage(1);
  };

  const handleLastPageClick = () => {
    setPageNum(totalPages);
    addSignatureToCurrentPage(totalPages);
  };

  const handlePrevPageClick = () => {
    const newPageNum = pageNum - 1;
    setPageNum(newPageNum);
    addSignatureToCurrentPage(newPageNum);
  };

  const handleNextPageClick = () => {
    const newPageNum = pageNum + 1;
    setPageNum(newPageNum);
    addSignatureToCurrentPage(newPageNum);
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2 px-4 py-2">
        <BigButton
          className="text-indigo-400 hover:text-indigo-600"
          title={<ChevronDoubleLeftIcon className="w-5 h-5" />}
          onClick={handleFirstPageClick}
          disabled={pageNum === 1}
        />
        <BigButton
          className="text-indigo-400 hover:text-indigo-600"
          title={<ChevronLeftIcon className="w-5 h-5" />}
          onClick={handlePrevPageClick}
          disabled={pageNum === 1}
        />
        <div className="p-2 font-semibold bg-white rounded-md shadow-md">
          {pageNum}/{totalPages}
        </div>
        <BigButton
          className="text-indigo-400 hover:text-indigo-600"
          title={<ChevronRightIcon className="w-5 h-5" />}
          onClick={handleNextPageClick}
          disabled={pageNum === totalPages}
        />
        <BigButton
          className="text-indigo-400 hover:text-indigo-600"
          title={<ChevronDoubleRightIcon className="w-5 h-5" />}
          onClick={handleLastPageClick}
          disabled={pageNum === totalPages}
        />
      </div>
    </div>
  );
}