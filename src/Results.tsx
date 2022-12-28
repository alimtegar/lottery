import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const range: number = location.state?.range;
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);
    const [revealedTabs, setRevealedTabs] = useState(Array(results.length).fill(false));

    function resultsTo2DArray(results: Result[]) {
        let _2dArray: string[][] = [];

        // Sort the numbered items by their frame values
        results.forEach(result => {
            result.numberedItems.sort((a, b) => a.frame.localeCompare(b.frame));
        });

        // Initialize the first row of the 2D array with the titles of the numbered items
        _2dArray[0] = results.reduce((acc, result) => {
            return acc.concat(result.numberedItems.map(item => item.title));
        }, [] as string[]);

        // Find the maximum value of n across all numbered items
        const maxN = Math.max(...results.reduce((acc, result) => {
            return acc.concat(result.numberedItems.map(item => item.n ? item.n : 0));
        }, [] as number[]));

        // Initialize the rest of the rows of the 2D array with empty strings
        for (let i = 1; i <= maxN; i++) {
            _2dArray[i] = Array(_2dArray[0].length).fill('');
        }

        // Fill the 2D array with the lottery numbers
        let currentColumn = 0;
        results.forEach(result => {
            result.numberedItems.forEach(item => {
                item.lotteryNumbers.forEach((number, numberIndex) => {
                    _2dArray[numberIndex + 1][currentColumn] = number.toString();
                });
                currentColumn++;
            });
        });

        return _2dArray;
    }

    const exportToExcel = (data: (string | number)[][]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'Undian.xlsx');
    }

    return (
        <div className="bg-gray-100 w-full min-h-screen">
            <div className="bg-white flex flex-col sm:flex-row justify-between p-4 mb-4 shadow">
                <button
                    type="button"
                    className="btn btn-error mb-2 sm:mb-0"
                    onClick={() => setRevealedTabs(revealedTabs.map((revealedTab, j) => j === activeTabI || revealedTab))}
                    disabled={revealedTabs[activeTabI]}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                    </svg>
                    STOP
                </button>
                <a className="btn btn-success" onClick={() => exportToExcel(resultsTo2DArray(results))}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    EXPORT KE EXCEL
                </a>
            </div>

            {/* <div className="flex flex-col h-full"> */}
            <div className="tabs flex-col sm:flex-row mb-4 px-4">
                {results?.length && results.map((result, i) => (
                    <a
                        className={'tab tab-bordered flex-grow w-full sm:w-auto h-12' + (activeTabI === i ? ' tab-active' : '')}
                        onClick={() => setActiveTabI(i)}
                        key={result.frame}
                    >
                        Frame {result.frame}
                    </a>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-4 px-4">
                {results?.length && results[activeTabI].numberedItems.map((numberedItem) => numberedItem.lotteryNumbers.map((lotteryNumber) => (
                    <div className={"bg-white flex flex-col justify-center items-center aspect-square shadow" + (revealedTabs[activeTabI] ? '' : ' animation-flip')}>
                        {revealedTabs[activeTabI] ? (
                            <>
                                <span className="text-sm -mb-2">
                                    {numberedItem.title}
                                </span>
                                <span className="font-bold text-5xl">
                                    {('' + lotteryNumber).padStart(('' + range).length, '0')}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-5xl">
                                {''.padStart(('' + range).length, '?')}
                            </span>
                        )}
                    </div>
                )))}
            </div>
        </div>
    );
};

export default Results;