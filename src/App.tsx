import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Input } from "./components/ui/input";
import { fetchWikiPrefixSearch, type PrefixSearchResult } from "./services/api";

import "./App.css";

function App() {
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [results, setResults] = useState<PrefixSearchResult>({ items: [] });
	const isOpen = !!search && !isLoading;

	useEffect(() => {
		if (!search.trim()) {
			setResults({ items: [] });
			setIsLoading(false);
			return;
		}
		setIsLoading(true);

		const timer = setTimeout(async () => {
			try {
				await fetchWikiPrefixSearch(search).then((data) => {
					setResults(data);
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}, 400);

		return () => clearTimeout(timer);
	}, [search]);

	return (
		<main className="p-4">
			<div className="relative">
				<Input value={search} onChange={(e) => setSearch(e.target.value)} />
				{isLoading && (
					<Loader2 className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 animate-spin" />
				)}
				{isOpen && (
					<div className="absolute top-10 left-0 w-full bg-white rounded-md shadow-md border border-gray-200">
						<div className="p-2">
							{results.items.map((item) => (
								<div key={item.pageId}>
									<p>{item.title}</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}

export default App;
