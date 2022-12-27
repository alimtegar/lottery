import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import Item from './types/Item';
import Result from './types/Result';

const App = () => {
	const navigate = useNavigate();

	const [range, setRange] = useState<number | null>(null);
	const [items, setItems] = useState<Item[]>([{ id: Math.random(), title: '', n: null }]);

	const handleItemChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const changedItems = items.map((item) => {
			return item.id === id ? {
				...item,
				[e.target.name]: e.target.value,
			} : item;
		})

		setItems(changedItems);
	};

	const addItem = () => setItems([
		...items,
		{ id: Math.random(), title: '', n: null },
	]);

	const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id));

	function generateUniqueNumbers(min: number, max: number, count: number): number[] {
		let numbers = new Set<number>();
		while (numbers.size < count) {
			numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
		}
		return Array.from(numbers);
	}

	const drawLotteryNumbers = (range: number, _items: Item[]) => {
		const count = _items.reduce((total, item) => total + (item.n ? +item.n : 0), 0);
		let uniqueNumbers = generateUniqueNumbers(1, range, count);

		const _results: Result[] = _items.map((item) => ({
			item: item,
			lotteryNumbers: uniqueNumbers.splice(0, (item.n ? +item.n : 0)),
		}));

		return _results;
	}

	const navigateToResults = () => {
		const results = range ? drawLotteryNumbers(range, items) : [];

		navigate('/results', { state: { results: results } });
	};

	return (
		<form className="w-full h-full">
			<div className="flex flex-col h-full">
				<div className="form-control w-full mb-2">
					<label className="label">
						<span className="label-text font-medium text-xs">Input Max. Undian</span>
					</label>
					<input
						type="number"
						name="range"
						placeholder="0-999"
						min="1"
						className="input input-bordered w-full text-xs"
						value={range ? +range : ''}
						onChange={(e) => setRange(+e.target.value)}
					/>
				</div>
				<div className="form-control w-full mb-2">
					<label className="label">
						<span className="label-text font-medium text-xs">Input Item</span>
					</label>
					<div className="grid grid-cols-6 gap-2">
						{items.map((item, i) => (
							<React.Fragment key={item.id}>
								<input
									type="text"
									name="title"
									placeholder="Nama Item"
									className="input input-bordered w-full text-xs col-span-3"
									value={item.title}
									onChange={(e) => handleItemChange(item.id, e)}
								/>
								<input
									type="number"
									name="n"
									placeholder="Jumlah"
									min="1"
									className="input input-bordered w-full text-xs col-span-2"
									value={item.n ? +item.n : ''}
									onChange={(e) => handleItemChange(item.id, e)}
								/>

								{items.length > 1 ? (
									<button type="button" onClick={() => removeItem(item.id)} className="btn btn-outline btn-error">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								) : (
									<button type="button" className="btn btn-outline btn-error" disabled>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								)}
							</React.Fragment>
						))}
					</div>
				</div>
				<div className="form-control w-full mb-2">
					<button type="button" className="btn btn-outline btn-primary" onClick={addItem}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</button>
				</div>
				<div className="form-control w-full mt-auto">
					{(
						range &&
						items.every((item) => item.title && item.n && item.n > 0)
					) ? (
						<button type="button" className="btn btn-primary w-full" onClick={navigateToResults}>
							MULAI UNDIAN
						</button>
					) : (
						<button type="button" className="btn btn-primary w-full" disabled>
							MULAI UNDIAN
						</button>
					)}
				</div>
			</div>
		</form>
	)
};

export default App;