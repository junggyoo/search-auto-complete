import React from "react";

export function ResultsPositioner({
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

export function ResultsContent({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-96 overflow-auto py-1 scroll-smooth">{children}</div>
	);
}

export function ResultsEmpty(props: { visible: boolean }) {
	if (!props.visible) return null;
	return (
		<div className="px-3 py-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
	);
}

export function ResultsError(props: { visible: boolean }) {
	if (!props.visible) return null;
	return (
		<div className="px-3 py-4 text-sm text-red-600">
			문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
		</div>
	);
}
