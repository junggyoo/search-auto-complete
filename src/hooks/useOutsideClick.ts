import { useEffect } from "react";

export function useOutsideClick(
	ref: React.RefObject<HTMLElement | null>,
	onOutside: () => void
) {
	useEffect(() => {
		function onMouseDown(e: MouseEvent) {
			if (!ref.current) return;
			if (ref.current.contains(e.target as Node)) return;
			onOutside();
		}
		document.addEventListener("mousedown", onMouseDown);
		return () => document.removeEventListener("mousedown", onMouseDown);
	}, [ref, onOutside]);
}
