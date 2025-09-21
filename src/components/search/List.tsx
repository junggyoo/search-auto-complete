import React from "react";
import { highlightMatches } from "../../utils/highlightMatches";
import { useListboxCtx } from "./context";
import type { SearchItem } from "./types";

export function ListItem(props: {
	item: SearchItem;
	active: boolean;
	query: string;
	onPointerEnter: () => void;
	onPointerLeave: () => void;
	onSelect: () => void;
}) {
	const { item, active, query, onPointerEnter, onPointerLeave, onSelect } =
		props;
	return (
		<li role="option" aria-selected={active}>
			<button
				type="button"
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerLeave}
				onClick={onSelect}
				className={[
					"w-full text-left px-3 py-2 transition",
					active ? "bg-gray-100" : "hover:bg-gray-50",
				].join(" ")}
			>
				<div className="flex items-center gap-2">
					<span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-gray-100 text-gray-600 text-[10px]">
						W
					</span>
					<span className="truncate text-sm">
						{highlightMatches(item.title, query)}
					</span>
				</div>
			</button>
		</li>
	);
}

export function ResultsList(props: { children: React.ReactNode }) {
	const { listboxId } = useListboxCtx();
	return (
		<div id={listboxId} role="listbox" aria-label="위키백과 자동완성">
			<ul>{props.children}</ul>
		</div>
	);
}
