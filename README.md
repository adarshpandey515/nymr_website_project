# PDF Rule Checker (Next.js Demo)

Single-page demo: upload a PDF, add rules, click check, see pass/fail + JSON. Current logic is stubby: random scores + simple text snippet search. Intended as scaffolding to plug real validation later.

## Features
- PDF upload (client) sent as multipart to API
- Dynamic rule list (add/remove)
- API parses PDF text (using `pdf-parse`); creates random pass/fail results
- Tabular results + expandable raw JSON
- Written in Next.js 14 (App Router) + TypeScript

## Quick Start

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## How It Works (Brief)
- Frontend builds `FormData` with file + JSON string of rules.
- API route `/api/check` parses PDF (if any) and returns array of `{ rule, passed, score, snippet }`.
- Snippet is a naive search of first word of rule inside extracted text.

## Extending Later
- Replace random logic with deterministic validators.
- Add auth, persistence, rule categories, better PDF parsing.
- Improve snippet retrieval (context windows, highlights).

## Scripts
```bash
npm run dev    # start dev server
npm run build  # production build
npm start      # run built app
```

## Tech Stack
Next.js, React, TypeScript, pdf-parse.

## Disclaimer
Not production ready. Random outputs; security and validation minimal.
