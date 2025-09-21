import React, { useId, useMemo } from "react";
import { ListboxContext } from "./context";

export function SearchRoot(props: {
	children: React.ReactNode;
	listboxId?: string;
}) {
	const autoId = useId();
	const value = useMemo(
		() => ({
			listboxId: props.listboxId ?? `listbox-${autoId}`,
		}),
		[props.listboxId, autoId]
	);
	return (
		<ListboxContext.Provider value={value}>
			{props.children}
		</ListboxContext.Provider>
	);
}
