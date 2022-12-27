import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);
    // const [excelData, setExcelData] = useState<(string | number)[][]>();

    const resultsToExcelData = (_results: Result[]) => {
        // create the 2D array
        let _excelData: (string | number)[][] = [];
        for (let i = 0; i < _results.length; i++) {
            let item = _results[i].item;
            let lotteryNumbers = _results[i].lotteryNumbers;
            if (i === 0) {
                _excelData.push([item.title]);
            } else {
                _excelData[0].push(item.title);
            }
            for (let j = 0; j < lotteryNumbers.length; j++) {
                if (_excelData.length <= j + 1) {
                    _excelData.push([lotteryNumbers[j]]);
                } else {
                    _excelData[j + 1].push(lotteryNumbers[j]);
                }
            }
        }

        // pad the shorter arrays with empty values
        for (let i = 0; i < _excelData.length; i++) {
            while (_excelData[i].length < _results.length) {
                _excelData[i].push('');
            }
        }

        return _excelData;
    }

    const exportToExcel = (data: (string | number)[][]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'Undian.xlsx');
    }

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

                <div className="grid grid-cols-2 gap-2">
                    {results?.length && results[activeTabI].lotteryNumbers.map((lotteryNumber) => (
                        <div className="font-bold text-2xl text-center px-4 py-8 border rounded" key={lotteryNumber}>
                            {lotteryNumber}
                        </div>
                    ))}
                </div>

                <div className="mt-auto">
                    <a
                        className="btn btn-success w-full"
                        onClick={() => exportToExcel(resultsToExcelData(results))} 
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