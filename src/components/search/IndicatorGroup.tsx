import React from "react";

export function IndicatorGroup({ children }: { children: React.ReactNode }) {
	return (
		<div className="absolute inset-y-0 right-2 flex items-center gap-1">
			{children}
		</div>
	);
}
