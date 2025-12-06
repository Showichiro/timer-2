# Technology Stack

## Architecture

シングルページアプリケーション（SPA）- クライアントサイドのみで動作

## Core Technologies

- **Language**: TypeScript (strict mode)
- **Framework**: Svelte 5 (Runes構文を使用)
- **Runtime**: ブラウザ（ES2022ターゲット）

## Key Libraries

- **Svelte 5**: リアクティブUIフレームワーク（`$state`, `$derived` 等のRunes構文）
- **Tailwind CSS v4**: ユーティリティファーストCSSフレームワーク（`@tailwindcss/vite` プラグイン経由）
- **Vite (rolldown-vite)**: 高速ビルドツール・開発サーバー
- **Vitest**: Viteネイティブのテストフレームワーク
- **Playwright**: ブラウザテスト用（`@vitest/browser-playwright` 経由）

## Development Standards

### Type Safety
- TypeScript strictモード
- Svelteコンポーネントは `<script lang="ts">` を使用
- `checkJs: true` でJSファイルも型チェック対象

### Code Quality
- `svelte-check` による型チェック
- Svelte公式VSCode拡張推奨

### Testing
- Vitest によるユニット/コンポーネントテスト
- `@vitest/browser-playwright` によるブラウザ環境でのテスト実行
- `bun test` でテスト実行

### Styling
- **テーマカラー**: Lavender（ラベンダー）をベースカラーとして使用
- カスタムカラーは `src/app.css` の `@theme` で定義（`--color-lavender-50` 〜 `--color-lavender-950`）
- Tailwindクラスでは `bg-lavender-500`, `text-lavender-700` 等で使用
- UI全体のトーンはLavenderパレットに統一する

## Development Environment

### Required Tools
- Node.js (Bun推奨)
- VS Code + Svelte拡張

### Common Commands
```bash
# Dev: bun dev
# Build: bun build
# Check: bun check
# Test: bun test
# Preview: bun preview
```

## Key Technical Decisions

- **Svelte 5 Runes**: `$state()` による明示的なリアクティブ状態管理
- **rolldown-vite**: 標準Viteの代替として高速ビルドを実現
- **Tailwind v4**: 新しい`@tailwindcss/vite`プラグインによるシームレスな統合
- **No SvelteKit**: シンプルなSPA構成（ルーティング不要な場合）

---
_Document standards and patterns, not every dependency_
