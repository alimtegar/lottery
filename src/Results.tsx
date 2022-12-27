import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Types
import Item from './types/Item';

type Result = {
    item: Item,
    lotteryNumbers: number[],
}

const Results = () => {
    const location = useLocation();
    const range: number = location.state?.range;
    const items: Item[] = location.state?.items;

    const [results, setResults] = useState<Result[]>();
    const [activeTabI, setActiveTabI] = useState(0);

    const generateUniqueNumbers = (min: number, max: number, count: number): number[] => {
        // create an empty array to store the unique numbers
        const uniqueNumbers: number[] = [];

        // keep generating random numbers until we have the desired number of unique numbers
        while (uniqueNumbers.length < count) {
            // generate a random number within the specified range
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

            // check if the random number is already in the array
            if (!uniqueNumbers.includes(randomNumber)) {
                // if it's not, add it to the array
                uniqueNumbers.push(randomNumber);
            }
        }

        // return the array of unique numbers
        return uniqueNumbers;
    }

    const drawLotteryNumbers = () => {
        const count = items.reduce((total, item) => total + item.n, 0);
        const uniqueNumbers = generateUniqueNumbers(1, range, count);

        const _results: Result[] = items.map((item) => ({
            item: item,
            lotteryNumbers: uniqueNumbers.splice(0, item.n),
        }));

        setResults(_results);
    }

    useEffect(drawLotteryNumbers, []);

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