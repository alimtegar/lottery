import Item from './Item';

type NumberedItem = Item & {
    lotteryNumbers: number[],
};

export default NumberedItem;