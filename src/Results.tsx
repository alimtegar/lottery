import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);

    function resultsTo2DArray(results: Result[]) {
        // Get the maximum number of lottery numbers
        const maxLength = Math.max(...results.map(result => result.lotteryNumbers.length));
      
        // Initialize the 2D array with empty strings
        const arr = new Array(maxLength + 1).fill('').map(() => new Array(results.length).fill(''));
      
        // Set the titles in the first row
        arr[0] = results.map(result => result.item.title);
      
        // Set the lottery numbers in the subsequent rows
        results.forEach((result, colIndex) => {
          result.lotteryNumbers.forEach((num, rowIndex) => {
            arr[rowIndex + 1][colIndex] = num;
          });
        });
      
        return arr;
      }

    const exportToExcel = (data: (string | number)[][]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'Undian.xlsx');
    }

    // useEffect(() => drawLotteryNumbers(range, items), []);

    return (
        <form className="w-full h-full">
            <div className="flex flex-col h-full">
                <div className="tabs mb-4">
                    {results?.length && results.map((result, i) => (
                        <a
                            className={'tab tab-bordered flex-grow h-12' + (activeTabI === i ? ' tab-active' : '')}
                            onClick={() => setActiveTabI(i)}
                            key={result.item.id}
                        >
                            {result.item.title}
                        </a>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {results?.length && results[activeTabI].lotteryNumbers.map((lotteryNumber) => (
                        <div className="font-bold text-2xl text-center px-4 py-8 border rounded" key={lotteryNumber}>
                            {lotteryNumber}
                        </div>
                    ))}
                </div>

                <div className="mt-auto">
                    <a
                        className="btn btn-success w-full"
                        onClick={() => exportToExcel(resultsTo2DArray(results))}
                        download="Undian.xlsx"
                    >
                        EXPORT KE EXCEL
                    </a>
                </div>
            </div>
        </form>
    );
};

export default Results;