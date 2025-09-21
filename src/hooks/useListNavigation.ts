import { useCallback, useState } from "react";

export function useListNavigation(opts: {
	itemCount: number;
	onSelect: (index: number) => void;
	onEscape?: () => void;
}) {
	const { itemCount, onSelect, onEscape } = opts;
	const [activeIndex, onActiveIndexChange] = useState(-1);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				onActiveIndexChange((p) => Math.min(p + 1, itemCount - 1));
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				onActiveIndexChange((p) => Math.max(p - 1, -1));
				return;
			}
			if (e.key === "Enter") {
				if (activeIndex >= 0 && activeIndex < itemCount) onSelect(activeIndex);
				return;
			}
			if (e.key === "Escape") onEscape?.();
		},
		[activeIndex, itemCount, onSelect, onEscape]
	);

	return { activeIndex, onActiveIndexChange, onKeyDown } as const;
}
