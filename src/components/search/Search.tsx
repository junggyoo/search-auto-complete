import React, { createContext, useContext, useId, useMemo } from "react";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { highlightMatches } from "../../utils/highlightMatches";

export type SearchItem = { pageId: number; title: string };

type ListboxCtx = { listboxId: string };
const ListboxContext = createContext<ListboxCtx | null>(null);
const useListboxCtx = () => {
	const c = useContext(ListboxContext);
	if (!c)
		throw new Error("Search subcomponents must be used within <Search.Search>");
	return c;
};

// Root (요청: Search라는 이름)
function SearchRoot(props: { children: React.ReactNode; listboxId?: string }) {
	const autoId = useId();
	const value = useMemo(
		() => ({ listboxId: props.listboxId ?? `listbox-${autoId}` }),
		[props.listboxId, autoId]
	);
	return (
		<ListboxContext.Provider value={value}>
			{props.children}
		</ListboxContext.Provider>
	);
}

// Control: 상단 입력 컨트롤 래퍼
function Control({ children }: { children: React.ReactNode }) {
	return <div className="relative">{children}</div>;
}

// Input: 외부 주입형 제어 인풋
function InputField(props: {
	value: string;
	onChange: (v: string) => void;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onFocus?: () => void;
	expanded?: boolean;
	className?: string;
	placeholder?: string;
}) {
	const { listboxId } = useListboxCtx();
	const {
		value,
		onChange,
		onKeyDown,
		onFocus,
		expanded,
		className,
		placeholder,
	} = props;

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
				aria-expanded={!!expanded}
				aria-autocomplete="list"
				aria-controls={listboxId}
			/>
		</div>
	);
}

// IndicatorGroup: 우측 인디케이터 묶음
function IndicatorGroup({ children }: { children: React.ReactNode }) {
	return (
		<div className="absolute inset-y-0 right-2 flex items-center gap-1">
			{children}
		</div>
	);
}

// ClearButton: 인풋 클리어 버튼
function ClearButton(props: { visible: boolean; onClick: () => void }) {
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

// Spinner: 로딩 스피너
function Spinner(props: { visible: boolean }) {
	if (!props.visible) return null;
	return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
}

// Positioner: 결과 패널 위치자
function ResultsPositioner({
	present,
	children,
}: {
	present: boolean;
	children: React.ReactNode;
}) {
	if (!present) return null;
	return (
		<div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden">
			{children}
		</div>
	);
}

// Content: 결과 패널 내용 컨테이너
function ResultsContent({ children }: { children: React.ReactNode }) {
	return <div className="max-h-80 overflow-auto py-1">{children}</div>;
}

// Loading: 로딩 스켈레톤
function ResultsLoading(props: { visible: boolean; count?: number }) {
	if (!props.visible) return null;
	const n = Math.max(1, props.count ?? 6);
	return (
		<ul className="animate-pulse px-2 py-1 space-y-1">
			{Array.from({ length: n }).map((_, i) => (
				<li key={i} className="h-8 rounded bg-gray-100" />
			))}
		</ul>
	);
}

// Empty: 빈 결과
function ResultsEmpty(props: { visible: boolean }) {
	if (!props.visible) return null;
	return (
		<div className="px-3 py-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
	);
}

// Error: 오류 메시지
function ResultsError(props: { visible: boolean }) {
	if (!props.visible) return null;
	return (
		<div className="px-3 py-4 text-sm text-red-600">
			문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
		</div>
	);
}

// ListItem: 단일 항목(외부에서 List 자식으로 렌더)
function ListItem(props: {
	item: SearchItem;
	active: boolean;
	query: string;
	onPointerEnter: () => void;
	onPointerLeave: () => void;
	onSelect: () => void;
}) {
	const { item, active, query, onPointerEnter, onPointerLeave, onSelect } =
		props;
	return (
		<li role="option" aria-selected={active}>
			<button
				type="button"
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerLeave}
				onClick={onSelect}
				className={[
					"w-full text-left px-3 py-2 transition",
					active ? "bg-gray-100" : "hover:bg-gray-50",
				].join(" ")}
			>
				<div className="flex items-center gap-2">
					<span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-gray-100 text-gray-600 text-[10px]">
						W
					</span>
					<span className="truncate text-sm">
						{highlightMatches(item.title, query)}
					</span>
				</div>
			</button>
		</li>
	);
}

// List: 컨테이너만 담당(아이템은 외부에서 children으로 렌더)
function ResultsList(props: { children: React.ReactNode }) {
	const { listboxId } = useListboxCtx();
	return (
		<div id={listboxId} role="listbox" aria-label="위키백과 자동완성">
			<ul>{props.children}</ul>
		</div>
	);
}

export const Search = {
	Search: SearchRoot,
	Control,
	Input: InputField,
	IndicatorGroup,
	ClearButton,
	Spinner,
	Positioner: ResultsPositioner,
	Content: ResultsContent,
	Loading: ResultsLoading,
	Empty: ResultsEmpty,
	Error: ResultsError,
	ListItem,
	List: ResultsList,
};
