## 검색 자동완성 (React + TypeScript + Vite)

간단하고 읽기 쉬운 설계로 만든 위키백과 기반 검색 자동완성 예제입니다. 입력 디바운스, 요청 취소(AbortController), 키보드 내비게이션, 외부 클릭 닫기, 일치 구간 하이라이트, 접근성(ARIA listbox)까지 기본기를 모두 갖춘 컴포넌트를 제공합니다.

### 주요 기능

- **위키백과 Prefix Search 연동**: 한국어 위키백과의 `prefixsearch` 엔드포인트를 사용해 빠른 자동완성 제공
- **입력 디바운스 + 요청 취소**: `es-toolkit`의 `debounce`와 `AbortController`로 불필요한 네트워크 요청 최소화
- **키보드 내비게이션**: `ArrowUp/Down`, `Enter`, `Escape` 지원
- **외부 클릭 닫기**: 입력 영역 밖 클릭 시 결과 패널 자동 닫기
- **일치 구간 하이라이트**: 사용자의 검색어와 일치하는 텍스트를 강조 표시
- **접근성 고려**: ARIA `listbox`/`option`, `aria-controls`, `aria-selected` 적용
- **컴포저블 UI**: `Search.Search`, `Search.Input`, `Search.List` 등 네임스페이스 형태로 조합 가능한 서브 컴포넌트 제공

### 기술 스택

- **앱**: React 19, TypeScript, Vite
- **스타일**: TailwindCSS 4, `lucide-react`
- **유틸**: `es-toolkit`(debounce), `clsx`, `tailwind-merge`

## 시작하기

### 설치 및 실행

```bash
npm install
npm run dev
```

## 동작 개요

- **데이터 흐름**: `App.tsx` → `useAutocomplete(query)` → `useDebounceFetch` → `services/api.ts`

  - `useDebounceFetch`가 300ms 디바운스로 `fetcher`를 호출하고, 이때 생성한 `AbortController`로 이전 요청을 취소합니다.
  - `api.ts`의 `fetchWikiPrefixSearch`가 위키백과 `prefixsearch`를 호출하여 `{ items, nextOffset }` 형태로 정규화합니다.

- **UI 구성**: `Search` 네임스페이스의 컴포넌트들을 조합

  - `Search.Search` 하위에서만 서브 컴포넌트 사용 가능(컨텍스트 보호)
  - `Search.Input`은 `aria-autocomplete="list"`, `aria-controls`로 `listbox`와 연결
  - `Search.List`는 `role="listbox"`, 각 `Search.ListItem`은 `role="option"`, `aria-selected`를 설정

- **키보드 UX**: `useListNavigation` + `useComboboxInputKeydown`
  - ArrowDown/Up: 활성 인덱스 이동(-1 포함)
  - Enter: 선택이 존재하면 해당 항목 선택, 선택이 없고 입력이 있으면 위키 검색 페이지로 이동
  - Escape: 열려있으면 닫기, 닫혀있으면 입력 내용 지우기(클리어 콜백)

## API 연동

- **엔드포인트**: 한국어 위키백과 `https://ko.wikipedia.org/w/api.php` (`origin=*` 포함)
- **메서드**: `services/api.ts`의 `fetchWikiPrefixSearch(query, options)`
  - **입력**: `query: string`, `options: { limit?, offset?, namespace?, signal? }`
  - **출력**: `{ items: { pageId, title, namespace }[], nextOffset? }`
  - 오류 시 예외를 던지며, `AbortError`는 무시하고 로딩이 종료됩니다.

## 상태 처리

- **로딩**: `Search.Spinner`로 표시
- **빈 결과**: `Search.Empty`로 표시
- **오류**: `Search.Error`로 사용자 친화적 메시지 표시

## 스크립트

- `npm run dev`: 개발 서버
- `npm run build`: 타입체크 + 프로덕션 빌드
- `npm run preview`: 빌드 결과 미리보기
- `npm run lint`: ESLint 실행

---

필요한 개선이나 문서 보완 요청은 환영합니다.
