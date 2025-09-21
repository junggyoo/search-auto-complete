import { useMemo } from "react";
import { useDebounceFetch } from "./useDebounceFetch";
import {
	fetchWikiPrefixSearch,
	type PrefixSearchResult,
} from "../services/api";

export function useAutocomplete(query: string) {
	const { data, isLoading, error } = useDebounceFetch<PrefixSearchResult>({
		deps: [query],
		delay: 300,
		enabled: !!query.trim(),
		fetcher: (signal) => fetchWikiPrefixSearch(query, { limit: 15, signal }),
	});
	const items = useMemo(() => data?.items ?? [], [data]);
	return { items, isLoading, error } as const;
}
