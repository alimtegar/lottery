import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { RandomReveal } from 'react-random-reveal';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const range: number = location.state?.range;
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);
    const [revealedTabs, setRevealedTabs] = useState(Array(results.length).fill(false));

    const BG_COLORS: { [key: string]: string } = {
		gold: 'bg-amber-500',
		cyan: 'bg-cyan-300',
		red: 'bg-red-500',
		indigo: 'bg-indigo-500',
		yellow: 'bg-yellow-300',
		green: 'bg-green-400',
	};

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
            <div className="bg-white flex flex-col sm:flex-row justify-between mb-4 shadow">
                <button
                    type="button"
                    className="btn btn-error btn-sm m-2"
                    onClick={() => setRevealedTabs(revealedTabs.map((revealedTab, j) => j === activeTabI || revealedTab))}
                    disabled={revealedTabs[activeTabI]}
                >
                    STOP
                </button>

                <div className="tabs flex-col sm:flex-row">
                    {results?.length && results.map((result, i) => (
                        <a
                            className={'tab tab-bordered flex-grow w-full sm:w-auto h-12 font-medium' + (activeTabI === i ? ' tab-active' : '')}
                            onClick={() => setActiveTabI(i)}
                            key={result.frame}
                        >
                            Frame {result.frame}
                        </a>
                    ))}
                </div>

                <a className="btn btn-info btn-sm m-2" onClick={() => exportToExcel(resultsTo2DArray(results))}>
                    EXPORT KE EXCEL
                </a>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4 px-4">
                {results?.length && results[activeTabI].numberedItems.map((numberedItem) => numberedItem.lotteryNumbers.map((lotteryNumber) => (
                    <div className={"flex flex-col justify-center items-center text-center p-4 text-white rounded-xl shadow " + (results[activeTabI].color ? BG_COLORS[results[activeTabI].color] : 'bg-gray-100')} key={lotteryNumber}>
                        <span className="font-semibold text-xl mb-1">
                            {numberedItem.title}
                        </span>
                        <span className="font-bold text-6xl">
                            <RandomReveal
                                isPlaying
                                duration={revealedTabs[activeTabI] ? 0 : 3600}
                                characterSet={Array.from({ length: 10 }, (_, i) => '' + i)}
                                characters={('' + lotteryNumber).padStart(('' + range).length, '0')}
                            />
                        </span>
                    </div>
                )))}
            </div>
        </div>
    );
};

export default Results;