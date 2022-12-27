import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import ReactCardFlip from 'react-card-flip';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const range: number = location.state?.range;
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // function resultsTo2DArray(results: Result[]) {
    //     // Get the maximum number of lottery numbers
    //     const maxLength = Math.max(...results.map(result => result.lotteryNumbers.length));

    //     // Initialize the 2D array with empty strings
    //     const arr = new Array(maxLength + 1).fill('').map(() => new Array(results.length).fill(''));

    //     // Set the titles in the first row
    //     arr[0] = results.map(result => result.item.title);

    //     // Set the lottery numbers in the subsequent rows
    //     results.forEach((result, colIndex) => {
    //         result.lotteryNumbers.forEach((num, rowIndex) => {
    //             arr[rowIndex + 1][colIndex] = num;
    //         });
    //     });

    //     return arr;
    // }

    const exportToExcel = (data: (string | number)[][]) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, 'Undian.xlsx');
    }

    // useEffect(() => drawLotteryNumbers(range, items), []);

    return (
        <div className="bg-gray-100 w-full h-screen">
            <div className="bg-white flex justify-between p-4 mb-4 shadow">
                <button className="btn btn-primary" onClick={() => setIsFlipped(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>

                    GENERATE
                </button>
                <a className="btn btn-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                    </svg>
                    EXPORT KE EXCEL
                </a>
            </div>

            {/* <div className="flex flex-col h-full"> */}
            <div className="tabs mb-4 px-4">
                {results?.length && results.map((result, i) => (
                    <a
                        className={'tab tab-bordered flex-grow h-12' + (activeTabI === i ? ' tab-active' : '')}
                        onClick={() => { setActiveTabI(i); setIsFlipped(false) }}
                        key={result.frame}
                    >
                        Frame {result.frame}
                    </a>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 px-4">
                {results?.length && results[activeTabI].numberedItems.map((numberedItem) => numberedItem.lotteryNumbers.map((lotteryNumber) => (
                    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical" key={lotteryNumber}>
                        <div className="bg-white flex flex-col justify-center items-center h-64 shadow">
                            <span className="font-bold text-5xl">
                                {''.padStart(('' + range).length, '?')}
                            </span>
                        </div>

                        <div className="bg-white flex flex-col justify-center items-center h-64 shadow">
                            <span className="text-sm -mb-2">
                                {numberedItem.title}
                            </span>
                            <span className="font-bold text-5xl">
                                {('' + lotteryNumber).padStart(('' + range).length, '0')}
                            </span>
                        </div>
                    </ReactCardFlip>

                )))}
            </div>



            {/* <div className="mt-auto">
                    <a
                        className="btn btn-success w-full"
                        onClick={() => exportToExcel(resultsTo2DArray(results))}
                        download="Undian.xlsx"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>

                        EXPORT KE EXCEL
                    </a>
                </div> */}
        </div>
        // </div>
    );
};

export default Results;