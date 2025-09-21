import { useMemo, useRef, useState } from "react";
import { Search } from "./components/search/Search";
import { useAutocomplete } from "./hooks/useAutocomplete";
import { useListNavigation } from "./hooks/useListNavigation";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { useComboboxInputKeydown } from "./hooks/useComboboxInputKeydown";

import "./App.css";

function App() {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const { items, isLoading, error } = useAutocomplete(query);

	const {
		activeIndex,
		onActiveIndexChange,
		onKeyDown: navKeyDown,
	} = useListNavigation({
		itemCount: items.length,
		onSelect: (idx: number) => {
			const it = items[idx];
			if (!it) return;
			window.open(`https://ko.wikipedia.org/wiki/${it.title}`, "_blank");
		},
		onEscape: () => {
			if (open) {
				setOpen(false);
				onActiveIndexChange(-1);
			}
		},
	});

	useOutsideClick(containerRef as React.RefObject<HTMLElement | null>, () => {
		setOpen(false);
		onActiveIndexChange(-1);
	});

	const onInputKeyDown = useComboboxInputKeydown({
		open,
		setOpen,
		activeIndex,
		onActiveIndexChange,
		query,
		onEnterWithoutSelection: () => {
			window.open(
				`https://ko.wikipedia.org/w/index.php?search=${encodeURIComponent(
					query.trim()
				)}`,
				"_blank"
			);
		},
		onClear: () => setQuery(""),
		navKeyDown,
	});

	const shouldShow = useMemo(
		() => open && (isLoading || items.length > 0 || !!error || !!query.trim()),
		[open, isLoading, items.length, error, query]
	);

	return (
		<main className="p-4">
			<div ref={containerRef} className="relative max-w-lg mx-auto">
				<Search.Search>
					<Search.Control>
						<Search.Input
							value={query}
							onChange={(v) => {
								setQuery(v);
								if (!open) setOpen(true);
							}}
							onFocus={() => setOpen(true)}
							onKeyDown={onInputKeyDown}
							expanded={shouldShow}
							placeholder="위키백과에서 검색…"
						/>
						<Search.IndicatorGroup>
							<Search.ClearButton
								visible={!!query}
								onClick={() => {
									setQuery("");
									setOpen(false);
									onActiveIndexChange(-1);
								}}
							/>
							<Search.Spinner visible={isLoading} />
						</Search.IndicatorGroup>
					</Search.Control>

					<Search.Positioner present={shouldShow}>
						<Search.Content>
							<Search.List>
								{items.map((item, idx: number) => (
									<Search.ListItem
										key={item.pageId}
										item={item}
										active={idx === activeIndex}
										query={query}
										onPointerEnter={() => onActiveIndexChange(idx)}
										onPointerLeave={() => onActiveIndexChange(-1)}
										onSelect={() => {
											window.open(
												`https://ko.wikipedia.org/wiki/${item.title}`,
												"_blank"
											);
										}}
									/>
								))}
							</Search.List>
							<Search.Loading visible={isLoading} />
							<Search.Empty
								visible={
									!isLoading && !error && !!query.trim() && items.length === 0
								}
							/>
							<Search.Error visible={!isLoading && !!error} />
						</Search.Content>
					</Search.Positioner>
				</Search.Search>
			</div>
		</main>
	);
}

export default App;
