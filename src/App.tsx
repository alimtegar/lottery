import React, { useState } from 'react';

let nextId = 1;

const App = () => {
	const [items, setItems] = useState([{ id: nextId, title: '', n: 1 }]);

	console.log({ nextId })

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
		{ id: ++nextId, title: '', n: 1 },
	]);

	const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id));

	return (
		<div className="bg-base-200 flex justify-center">
			<div className="flex bg-white w-96 min-h-screen p-4 prose">
				<form className="w-full">
					<div className="flex flex-col h-full">
						<div className="form-control w-full mb-2">
							<label className="label">
								<span className="label-text font-medium text-xs">Input Max. Undian</span>
							</label>
							<input type="text" placeholder="0-999" className="input input-bordered w-full text-xs" />
						</div>
						<div className="form-control w-full mb-2">
							<label className="label">
								<span className="label-text font-medium text-xs">Input Item</span>
							</label>
							<div className="grid grid-cols-6 gap-2">
								{items.map((item) => (
									<React.Fragment key={item.id}>
										<input type="text" onChange={(e) => handleItemChange(item.id, e)} value={item.title} name="title" placeholder="Nama Item" className="input input-bordered w-full text-xs col-span-3" />
										<input type="text" onChange={(e) => handleItemChange(item.id, e)} value={item.n} name="n" placeholder="0" className="input input-bordered w-full text-xs col-span-2" />
										<button type="button" onClick={() => removeItem(item.id)} className="btn btn-outline btn-error">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
												<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
											</svg>
										</button>
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
							<button className="btn btn-primary">
								MULAI UNDIAN
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
};

export default App;