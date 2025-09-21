import { createContext, useContext } from "react";

export type ListboxCtx = { listboxId: string };

export const ListboxContext = createContext<ListboxCtx | null>(null);

export const useListboxCtx = () => {
	const c = useContext(ListboxContext);
	if (!c)
		throw new Error("Search subcomponents must be used within <Search.Search>");
	return c;
};
