import { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Types
import Result from './types/Result';

const Results = () => {
    const location = useLocation();
    const results: Result[] = location.state?.results;

    const [activeTabI, setActiveTabI] = useState(0);

    return (
        <>
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
                    <div className="font-bold text-2xl text-center px-4 py-8 border rounded">
                        {lotteryNumber}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Results;