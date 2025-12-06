# Project Structure

## Organization Philosophy

フラットなシンプル構成 - 小規模SPAに適した最小限のディレクトリ構造

## Directory Patterns

### エントリーポイント
**Location**: `src/main.ts`
**Purpose**: アプリケーションのブートストラップ
**Example**: Svelteアプリのマウント、グローバルCSS読み込み

### ルートコンポーネント
**Location**: `src/App.svelte`
**Purpose**: アプリケーションのメインコンポーネント
**Example**: レイアウト、子コンポーネントの配置

### 再利用可能コンポーネント
**Location**: `src/lib/`
**Purpose**: 再利用可能なUIコンポーネント
**Example**: `Counter.svelte` - 独立した機能単位のコンポーネント

### 静的アセット
**Location**: `src/assets/`（アプリ用）、`public/`（静的ファイル）
**Purpose**: 画像、アイコン、フォント等
**Example**: SVGロゴ、ファビコン

### スタイル
**Location**: `src/app.css`
**Purpose**: グローバルスタイル、Tailwind読み込み
**Example**: `@import "tailwindcss";`

## Naming Conventions

- **Files**: PascalCase（コンポーネント）、camelCase（その他）
- **Components**: `*.svelte` - PascalCase
- **TypeScript**: `*.ts` - camelCase

## Import Organization

```typescript
// Svelte コンポーネントの場合
import Component from './lib/Component.svelte'
import asset from './assets/image.svg'
import '/public-file.svg'  // public直下
```

**Path Aliases**:
- 現時点では未設定（相対パスを使用）

## Code Organization Principles

- **コンポーネント単位**: 1ファイル = 1コンポーネント
- **colocation**: 関連するロジックはコンポーネント内に配置
- **lib/**: 複数箇所で使うコンポーネントのみ配置
- **スタイル**: コンポーネント内`<style>`またはTailwindクラス

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
