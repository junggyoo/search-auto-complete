import React from "react";

export function highlightMatches(text: string, query: string): React.ReactNode {
	if (!query) return text;
	const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${safe})`, "ig");
	const parts = String(text).split(regex);
	return parts.map((part, i) =>
		regex.test(part) ? (
			<span key={i} className="bg-yellow-100 text-yellow-900">
				{part}
			</span>
		) : (
			<span key={i}>{part}</span>
		)
	);
}
