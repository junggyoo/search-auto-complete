import { debounce } from "es-toolkit";
import { useEffect, useState, type DependencyList } from "react";

interface UseDebounceFetchOptions<T> {
	fetcher: (signal: AbortSignal) => Promise<T>;
	deps: DependencyList;
	delay?: number;
	enabled?: boolean;
	initialData?: T | null;
}

export function useDebounceFetch<T>({
	fetcher,
	deps,
	delay = 300,
	enabled = true,
	initialData = null,
}: UseDebounceFetchOptions<T>) {
	const [data, setData] = useState<T | null>(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<unknown>(null);

	useEffect(() => {
		if (!enabled) {
			setIsLoading(false);
			return;
		}

		const controller = new AbortController();

		setIsLoading(true);
		const debounceFetch = debounce(async () => {
			setError(null);
			try {
				const result = await fetcher(controller.signal);
				setData(result);
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") {
					return;
				}
				setError(err);
			} finally {
				setIsLoading(false);
			}
		}, delay);

		debounceFetch();

		return () => {
			controller.abort();
			debounceFetch.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, enabled, delay]);

	return { data, isLoading, error } as const;
}
