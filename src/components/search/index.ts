export { SearchRoot } from "./SearchRoot";
export { Control } from "./Control";
export { InputField } from "./InputField";
export { IndicatorGroup } from "./IndicatorGroup";
export { ClearButton, Spinner } from "./Indicators";
export {
	ResultsPositioner,
	ResultsContent,
	ResultsEmpty,
	ResultsError,
} from "./Results";
export { ListItem, ResultsList } from "./List";
export type { SearchItem } from "./types";

// 기존 Search 객체와 동일한 구조로 export
import { SearchRoot } from "./SearchRoot";
import { Control } from "./Control";
import { InputField } from "./InputField";
import { IndicatorGroup } from "./IndicatorGroup";
import { ClearButton, Spinner } from "./Indicators";
import {
	ResultsPositioner,
	ResultsContent,
	ResultsEmpty,
	ResultsError,
} from "./Results";
import { ListItem, ResultsList } from "./List";

export const Search = {
	Search: SearchRoot,
	Control,
	Input: InputField,
	IndicatorGroup,
	ClearButton,
	Spinner,
	Positioner: ResultsPositioner,
	Content: ResultsContent,
	Empty: ResultsEmpty,
	Error: ResultsError,
	ListItem,
	List: ResultsList,
};
