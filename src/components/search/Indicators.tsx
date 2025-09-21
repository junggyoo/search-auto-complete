import { Loader2, X } from "lucide-react";

export function ClearButton(props: { visible: boolean; onClick: () => void }) {
	if (!props.visible) return null;
	return (
		<button
			type="button"
			onClick={props.onClick}
			className="p-1 rounded hover:bg-gray-100"
			aria-label="검색어 지우기"
		>
			<X className="w-4 h-4 text-muted-foreground" />
		</button>
	);
}

export function Spinner(props: { visible: boolean }) {
	if (!props.visible) return null;
	return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
}
