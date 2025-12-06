# Research & Design Decisions

---
**Purpose**: タイマーアプリ初期実装の設計判断とディスカバリー結果を記録する。
---

## Summary
- **Feature**: `timer-app-init`
- **Discovery Scope**: New Feature（新規機能）
- **Key Findings**:
  - Web Audio APIによるアラーム音生成はAudioContext + Oscillatorで外部ファイル不要で実現可能
  - Vibration APIはiOS非対応のためフォールバック必須
  - Svelte 5 Runesでの永続化は`$state` + `$effect`パターンが推奨

## Research Log

### Web Audio APIによるアラーム音再生
- **Context**: タイマー完了時の聴覚的通知機能の実装方法調査
- **Sources Consulted**:
  - [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
  - [Stack Overflow: How to make JavaScript beep](https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep)
- **Findings**:
  - AudioContext + OscillatorNodeでビープ音を生成可能（外部音声ファイル不要）
  - ブラウザのオートプレイポリシーにより、ユーザーアクション後でないと再生不可
  - AudioContextは一度作成して再利用することが推奨
  - 周波数・音量・持続時間をカスタマイズ可能
- **Implications**: タイマー開始時にユーザーアクションがあるため、アラーム再生は問題なし。AudioContextはアプリ全体で1インスタンスを共有する設計とする。

### Vibration API対応状況
- **Context**: タイマー完了時のバイブレーション通知機能の実装可能性調査
- **Sources Consulted**:
  - [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
  - [W3C Vibration API Specification](https://www.w3.org/TR/vibration/)
- **Findings**:
  - Chrome（Android）、Firefox、Operaで対応
  - iOS Safari/Chrome/Firefoxは非対応（2025年現在も未サポート）
  - ユーザーアクション後でないと動作しないブラウザあり
  - `navigator.vibrate()`が存在しない場合はfalseを返す
- **Implications**: iOS非対応のためオプショナル機能として実装。機能検出で対応デバイスのみ動作させる。

### Svelte 5 Runes永続化パターン
- **Context**: タイマー設定のローカルストレージ永続化方法調査
- **Sources Consulted**:
  - [DEV: Svelte 5 Persistent State](https://dev.to/developerbishwas/svelte-5-persistent-state-strictly-runes-supported-3lgm)
  - [GitHub: @friendofsvelte/state](https://github.com/friendofsvelte/state)
- **Findings**:
  - `$state` + `$effect`の組み合わせで永続化可能
  - 外部ライブラリなしで実装可能（依存関係最小化）
  - SSR環境では`window`の存在チェックが必要（今回はSPAのため不要）
  - JSONシリアライズでオブジェクト/配列を保存可能
- **Implications**: 外部ライブラリを使わず、カスタム`persisted`関数を実装する方針。シンプルで依存関係が増えない。

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Component State | 各タイマーがローカル状態を管理 | シンプル、Svelte 5 Runesと相性良い | タイマー間の状態共有が難しい | 独立したタイマーに適している |
| Centralized Store | App.svelteで全タイマー状態を一元管理 | 永続化が容易、状態の一貫性 | 若干の複雑さ増加 | 永続化要件に適合 |

**選択**: Centralized Store（App.svelteでタイマー配列を管理し、永続化を一元的に行う）

## Design Decisions

### Decision: アラーム音の実装方法
- **Context**: タイマー完了時にアラーム音を再生する必要がある
- **Alternatives Considered**:
  1. HTML5 Audio要素 + 外部音声ファイル
  2. Web Audio API + Oscillator（プログラマティック生成）
- **Selected Approach**: Web Audio API + Oscillator
- **Rationale**: 外部ファイル不要でバンドルサイズ削減、周波数やパターンのカスタマイズが容易
- **Trade-offs**: 音質は限定的だがアラーム用途には十分
- **Follow-up**: 音のパターン（断続音など）は実装時に調整

### Decision: 永続化の実装方法
- **Context**: タイマー設定をブラウザ再起動後も保持する必要がある
- **Alternatives Considered**:
  1. 外部ライブラリ（@friendofsvelte/state, svelte-persisted-state）
  2. カスタム実装（$state + $effect）
- **Selected Approach**: カスタム実装
- **Rationale**: 依存関係最小化、要件がシンプルで外部ライブラリ不要
- **Trade-offs**: 自前実装のメンテナンスコスト（ただし実装は簡潔）
- **Follow-up**: 型安全性を確保するためTypeScript型定義を明確に

### Decision: タイマー状態管理の構造
- **Context**: 複数タイマーを独立して管理し、永続化する必要がある
- **Alternatives Considered**:
  1. 各TimerCardが独自に状態と永続化を管理
  2. App.svelteでタイマー配列を一元管理し、propsで渡す
- **Selected Approach**: App.svelteで一元管理
- **Rationale**: 永続化ロジックが一箇所に集約、タイマー追加・削除が容易
- **Trade-offs**: propsのバケツリレーが発生するが、コンポーネント階層が浅いため問題なし
- **Follow-up**: タイマー数が増えた場合のパフォーマンスは実装時に検証

## Risks & Mitigations
- iOS Safari Vibration非対応 — 機能検出でサイレントフォールバック（視覚・音声通知は動作）
- ブラウザオートプレイポリシー — タイマー開始時のユーザーアクションで回避済み
- ローカルストレージ容量制限 — タイマーデータは軽量（数KB）のため問題なし

## References
- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API) — AudioContext/Oscillatorの公式ドキュメント
- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) — Vibration APIの仕様と対応状況
- [Svelte 5 Persistent State](https://dev.to/developerbishwas/svelte-5-persistent-state-strictly-runes-supported-3lgm) — Runes永続化パターン
