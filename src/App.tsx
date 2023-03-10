import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import Color from './types/Color';
import Item from './types/Item';
import NumberedItem from './types/NumberedItem';
import Result from './types/Result';

const App = () => {
	const navigate = useNavigate();

	const [range, setRange] = useState<number | null>(null);
	const [items, setItems] = useState<Item[]>([{ id: Math.random(), title: '', frame: '', n: null, color: '' }]);

	const COLORS = ['gold', 'cyan', 'red', 'indigo', 'yellow', 'green'];
	const BG_COLORS: { [key: string]: string } = {
		gold: 'bg-amber-500',
		cyan: 'bg-cyan-300',
		red: 'bg-red-500',
		indigo: 'bg-indigo-500',
		yellow: 'bg-yellow-300',
		green: 'bg-green-400',
	};
	const COLOR_TITLES: { [key: string]: string } = {
		gold: 'Emas',
		cyan: 'Biru Muda',
		red: 'Merah',
		indigo: 'Indigo',
		yellow: 'Kuning',
		green: 'Hijau',
	};

	const handleItemChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
		{ id: Math.random(), title: '', frame: '', n: null, color: '' },
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

		const numberedItems: NumberedItem[] = _items.map((item) => ({
			...item,
			lotteryNumbers: uniqueNumbers.splice(0, (item.n ? +item.n : 0)),
		}));

		return numberedItems;
	}

	const numberedItemsToResults = (numberedItems: NumberedItem[]) => {
		let results: Result[] = [];

		numberedItems.map((numberedItem) => {
			const existingFrame = results.find((result) => result.frame === numberedItem.frame);

			if (existingFrame) {
				existingFrame.numberedItems.push(numberedItem);
			} else {
				results.push({
					frame: numberedItem.frame,
					color: numberedItem.color,
					numberedItems: [numberedItem],
				});
			}
		});

		return results;
	}

	const navigateToResults = () => {
		const numberedItems = range ? drawLotteryNumbers(range, items) : [];
		const results = numberedItemsToResults(numberedItems);

		navigate('/results', { state: { range, results } });
	};

	return (
		<div className="flex justify-center bg-gray-100 min-h-screen">
			<form className="bg-white w-full lg:w-5/12 p-4 shadow">
				<div className="flex flex-col min-h-full">
					<div className="form-control w-full mb-2">
						<label className="label">
							<span className="label-text font-medium text-xs">Input Max. Undian</span>
						</label>
						<input
							type="number"
							name="range"
							placeholder="0-1000"
							min="1"
							className="input input-bordered w-full text-xs"
							value={range ? +range : ''}
							onChange={(e) => setRange(+e.target.value)}
						/>
					</div>
					<div className="form-control w-full">
						<label className="label">
							<span className="label-text font-medium text-xs">Input Item</span>
						</label>
						{items.map((item, i) => (
							<div className={"grid grid-cols-12 gap-2 p-2 mb-2 rounded-xl " + (item.color ? BG_COLORS[item.color] : 'bg-gray-100')} key={item.id}>
								<input
									type="text"
									name="title"
									placeholder="Nama Item"
									className="input w-full text-xs col-span-8 sm:col-span-8"
									value={item.title}
									onChange={(e) => handleItemChange(item.id, e)}
								/>
								<input
									type="number"
									name="n"
									placeholder="Jumlah"
									min="1"
									className="input w-full text-xs col-span-3 sm:col-span-4"
									value={item.n ? +item.n : ''}
									onChange={(e) => handleItemChange(item.id, e)}
								/>
								<input
									type="text"
									name="frame"
									placeholder="Frame"
									min="1"
									className="input w-full text-xs col-span-3 sm:col-span-6"
									value={item.frame ? item.frame : ''}
									onChange={(e) => handleItemChange(item.id, e)}
								/>
								<select
									name="color"
									className="select font-medium text-xs w-full col-span-3 sm:col-span-4"
									value={item.color ? item.color : ''}
									onChange={(e) => handleItemChange(item.id, e)}
								>
									<option>Pilih Warna</option>
									{COLORS.map((color) => (
										<option value={color} key={color}>{COLOR_TITLES[color]}</option>
									))}
								</select>

								{items.length > 1 ? (
									<button type="button" onClick={() => removeItem(item.id)} className="btn col-span-2 sm:col-span-2">
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								) : (
									<button type="button" className="btn col-span-2 sm:col-span-2" disabled>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
											<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								)}
							</div>
						))}

					</div>

					<div className="form-control w-full mb-4">
						<button type="button" className="btn btn-outline btn-primary" onClick={addItem}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</div>

					<div className="form-control w-full mt-auto">
						{(
							range &&
							items.every((item) => item.title && item.frame && item.color && item.n && item.n > 0)
						) ? (
							<button type="button" className="btn btn-primary w-full" onClick={navigateToResults}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
								</svg>
								MULAI UNDIAN
							</button>
						) : (
							<button type="button" className="btn btn-primary w-full" disabled>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2" style={{ marginTop: -1 }}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
								</svg>
								MULAI UNDIAN
							</button>
						)}
					</div>
				</div>
			</form>
		</div>
	)
};

export default App;