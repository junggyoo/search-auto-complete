import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "./components/ui/input";
import { useDebounceFetch } from "./hooks/useDebounceFetch";
import { fetchWikiPrefixSearch, type PrefixSearchResult } from "./services/api";

import "./App.css";

function App() {
	const [search, setSearch] = useState("");

	const { data, isLoading } = useDebounceFetch<PrefixSearchResult>({
		deps: [search],
		delay: 300,
		enabled: !!search.trim(),
		fetcher: (signal) => fetchWikiPrefixSearch(search, { limit: 10, signal }),
	});

	const isOpen = !!search && !isLoading;

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
							{(data?.items ?? []).map((item) => (
								<div
									key={item.pageId}
									onClick={() =>
										window.open(
											`https://ko.wikipedia.org/wiki/${item.title}`,
											"_blank"
										)
									}
								>
									<p className="cursor-pointer hover:bg-gray-100 p-2 rounded-md">
										{item.title}
									</p>
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
