# Research & Design Decisions

## Summary
- **Feature**: `ui-ux-improvement`
- **Discovery Scope**: Extension（既存システムの拡張）
- **Key Findings**:
  - svelte-dnd-actionはSvelte 5対応済み（onconsider/onfinalize構文を使用）
  - Web Notifications APIはユーザージェスチャーに応じた許可リクエストが必須
  - 既存のストレージ機構（localStorage）を活用して順序を永続化可能

## Research Log

### ドラッグ&ドロップライブラリ選定
- **Context**: Svelte 5環境でのドラッグ&ドロップ実装に最適なライブラリを調査
- **Sources Consulted**:
  - [svelte-dnd-action GitHub](https://github.com/isaacHagoel/svelte-dnd-action)
  - [dnd-kit-svelte](https://github.com/hanielu/dnd-kit-svelte)
  - [@thisux/sveltednd](https://github.com/thisuxhq/sveltednd)
- **Findings**:
  - svelte-dnd-action: 成熟したライブラリ、Svelte 5対応、アクセシビリティ対応済み
  - dnd-kit-svelte: @dnd-kitのSvelteポート、v0.1.5が最新、比較的新しい
  - @thisux/sveltednd: Svelte 5 runes専用、軽量だが機能が限定的
- **Implications**: svelte-dnd-actionを採用（成熟度とアクセシビリティ機能）

### Web Notifications API調査
- **Context**: タイマー完了時のブラウザ通知実装方法を調査
- **Sources Consulted**:
  - [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
  - [Web Push API Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
- **Findings**:
  - 許可リクエストはユーザージェスチャーに応じて行う必要がある
  - Notification.permissionで現在の状態を確認可能
  - ペイロードサイズは4KB以下を推奨
  - Service Workerなしでも基本的な通知は可能
- **Implications**: 設定画面またはタイマー開始時に許可を求めるフローが必要

### アクセシビリティ要件調査
- **Context**: WCAG 2.1 AA基準とARIAパターンの確認
- **Sources Consulted**: WCAG 2.1ガイドライン
- **Findings**:
  - フォーカスインジケーターは最低3:1のコントラスト比が必要
  - ライブリージョンはaria-liveとaria-atomicで状態変更を通知
  - ドラッグ&ドロップにはキーボード代替操作が必要
- **Implications**: svelte-dnd-actionの組み込みa11y機能を活用

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| 既存パターン拡張 | 現在のコンポーネント構造に機能追加 | 変更最小限、一貫性維持 | 責務が肥大化する可能性 | 採用 |
| 新規ユーティリティ層 | notification/a11y用の独立モジュール作成 | 責務分離が明確 | 小規模アプリには過剰設計 | 部分採用 |

## Design Decisions

### Decision: ドラッグ&ドロップライブラリの選定
- **Context**: Svelte 5環境でのDnD実装
- **Alternatives Considered**:
  1. svelte-dnd-action — 成熟、アクセシビリティ対応、actionベース
  2. dnd-kit-svelte — React @dnd-kitのポート、新しい
  3. @thisux/sveltednd — Svelte 5専用、軽量
  4. ネイティブHTML5 DnD — 依存なし、カスタマイズが大変
- **Selected Approach**: svelte-dnd-action
- **Rationale**: 成熟度が高く、アクセシビリティ対応が組み込み済み、Svelte 5対応済み
- **Trade-offs**: dnd-kit-svelteより軽量ではないが、安定性と機能性を優先
- **Follow-up**: $state使用時の既知問題に注意

### Decision: 通知アーキテクチャ
- **Context**: タイマー完了時の通知方法
- **Alternatives Considered**:
  1. Web Notifications APIのみ — シンプル、許可が必要
  2. Service Worker + Push API — 高機能だが過剰設計
  3. ページ内通知のみ — 許可不要だがバックグラウンド対応不可
- **Selected Approach**: Web Notifications API + タイトル点滅
- **Rationale**: Service Worker不要で実装がシンプル、バックグラウンド通知も可能
- **Trade-offs**: ブラウザがバックグラウンドでも開いている必要がある
- **Follow-up**: 通知許可のUXフロー設計

### Decision: 設定の永続化
- **Context**: 通知音のオン/オフ設定の保存方法
- **Alternatives Considered**:
  1. 既存のlocalStorage機構を拡張
  2. 別のストレージキーで管理
- **Selected Approach**: 既存のstorage.tsに設定用関数を追加
- **Rationale**: コードの一貫性維持、既存パターンの活用
- **Trade-offs**: storage.tsの責務が少し広がる

## Risks & Mitigations
- svelte-dnd-actionの$state問題 — 特定バージョンを避ける、動作確認を徹底
- 通知許可の拒否 — タイトル点滅でフォールバック、音声通知は既存機能
- WCAG対応の確認不足 — コントラスト比チェッカーで検証

## References
- [svelte-dnd-action](https://github.com/isaacHagoel/svelte-dnd-action) — ドラッグ&ドロップライブラリ
- [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API) — 通知API仕様
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) — アクセシビリティガイドライン
