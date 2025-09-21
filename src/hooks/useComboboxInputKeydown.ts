import { useCallback } from "react";

export function useComboboxInputKeydown(opts: {
	open: boolean;
	setOpen: (v: boolean) => void;
	activeIndex: number;
	onActiveIndexChange: (i: number) => void;
	query: string;
	onEnterWithoutSelection: () => void;
	onClear?: () => void;
	navKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
	const {
		open,
		setOpen,
		activeIndex,
		onActiveIndexChange,
		query,
		onEnterWithoutSelection,
		onClear,
		navKeyDown,
	} = opts;

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			// 화살표로 열기
			if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				setOpen(true);
				return;
			}
			// 선택 없음 + Enter → 외부 제공 동작
			if (e.key === "Enter" && activeIndex < 0 && query.trim()) {
				onEnterWithoutSelection();
				return;
			}
			// Esc → 열려있으면 닫기, 아니면 클리어
			if (e.key === "Escape") {
				if (open) {
					setOpen(false);
					onActiveIndexChange(-1);
					return;
				}
				onClear?.();
				return;
			}
			// 나머지 키는 내비 훅에 위임
			navKeyDown(e);
		},
		[
			open,
			activeIndex,
			query,
			setOpen,
			onActiveIndexChange,
			onEnterWithoutSelection,
			onClear,
			navKeyDown,
		]
	);

	return onKeyDown;
}
