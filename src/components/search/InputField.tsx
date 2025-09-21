import React from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useListboxCtx } from "./context";

export function InputField(props: {
	value: string;
	onChange: (v: string) => void;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onFocus?: () => void;
	className?: string;
	placeholder?: string;
}) {
	const { listboxId } = useListboxCtx();
	const { value, onChange, onKeyDown, onFocus, className, placeholder } = props;

	return (
		<div className="relative">
			<SearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyDown}
				onFocus={onFocus}
				placeholder={placeholder ?? "위키백과에서 검색…"}
				className={["pl-9 pr-9", className].filter(Boolean).join(" ")}
				aria-autocomplete="list"
				aria-controls={listboxId}
			/>
		</div>
	);
}
