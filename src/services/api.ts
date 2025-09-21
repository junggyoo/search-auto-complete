// wikipediaPrefixSearch.ts

// 1) Raw API 타입 (공식 응답 형태)
export interface WikiPrefixSearchItem {
	ns: number;
	title: string;
	pageid: number;
}

export interface WikiPrefixSearchContinue {
	psoffset: number;
	continue: string;
}

export interface WikiPrefixSearchRaw {
	batchcomplete?: string;
	continue?: WikiPrefixSearchContinue;
	query?: {
		prefixsearch?: WikiPrefixSearchItem[];
	};
}

// 2) 앱에서 쓰기 쉬운 정규화 타입
export interface PrefixSearchResult {
	items: Array<{
		pageId: number;
		title: string;
		namespace: number;
	}>;
	nextOffset?: number; // 더 불러올 때 사용할 offset (없으면 더 없음)
}

// 3) 요청 옵션
export interface PrefixSearchOptions {
	limit?: number; // 1~500 (기본 10) — 문서 기준. :contentReference[oaicite:1]{index=1}
	offset?: number; // 페이지네이션용
	namespace?: number | "*"; // 기본 0 (문서 네임스페이스)
	signal?: AbortSignal; // React에서 AbortController로 취소할 때 사용
}

/**
 * ko.wikipedia.org prefixsearch 호출
 * - origin=* : CORS 허용을 위해 필요
 * - list=prefixsearch, pssearch: 검색어, pslimit/ psoffset/ psnamespace 등 지원
 */
export async function fetchWikiPrefixSearch(
	query: string,
	{ limit = 10, offset, namespace, signal }: PrefixSearchOptions = {}
): Promise<PrefixSearchResult> {
	if (!query?.trim()) {
		return { items: [] };
	}

	const endpoint = "https://ko.wikipedia.org/w/api.php";

	const params = new URLSearchParams({
		action: "query",
		format: "json",
		list: "prefixsearch",
		origin: "*", // CORS
		pssearch: query.trim(),
		pslimit: String(Math.min(Math.max(limit, 1), 500)), // 1~500 안전 처리
	});

	if (typeof offset === "number" && offset >= 0) {
		params.set("psoffset", String(offset));
	}
	if (typeof namespace !== "undefined") {
		params.set("psnamespace", String(namespace));
	}

	const url = `${endpoint}?${params.toString()}`;
	const res = await fetch(url, { signal });

	if (!res.ok) {
		throw new Error(
			`Wikipedia API request failed: ${res.status} ${res.statusText}`
		);
	}

	const data: WikiPrefixSearchRaw = await res.json();

	const items =
		data.query?.prefixsearch?.map((it) => ({
			pageId: it.pageid,
			title: it.title,
			namespace: it.ns,
		})) ?? [];

	const nextOffset = data.continue?.psoffset;

	return { items, nextOffset };
}
