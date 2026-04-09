# Browser Extension Template

このファイルは、このリポジトリでコーディングエージェントがどのように作業すべきかを定義します。

## 目的

- このリポジトリは、WXT、React、pnpm、TypeScript、Vite+、mise を使ったブラウザ拡張プロジェクトとして扱ってください。
- 現在のスコープには React popup、background の ping/pong 疎通確認、Chrome 向けの build / zip が含まれます。
- タスクが明示的にそれ以上を求めていない限り、最小スコープを維持してください。権限、content scripts、options page、storage、ブラウザ固有分岐は必要になったときだけ追加してください。

## リポジトリの前提情報

- パッケージマネージャー: `pnpm`
- ランタイム / ビルドツール: `wxt`
- 検証ツールチェイン: `vite-plus`
- UI: React
- 言語モード: ESM TypeScript
- ビルド対象: Chrome: MV3

## 推奨されるコマンド選択

- ローカル開発: `vp run dev`
- フォーマット: `vp fmt`
- lint, typecheck: `vp lint`
- テスト実行: `vp test`
- 包括チェック（フォーマット、リント、テスト、型テスト）: `vp check`
- 引き渡し前の信頼性確認 / タスク完了後、ユーザーに通知する前に実行: `vp check`
- Manifest / WXT / ビルド変更: `vp run build`
- 配布物やパッケージングの確認: `vp run zip`

## 環境とツール

- ビルド出力先は次を想定します:
  - `.output/chrome-mv3/`

## プロジェクト保守の注意

- 拡張機能のメタデータ（名前・説明など）は `lib/template-metadata.ts` に集約してください。
- popup/background 間の message type は `lib/template-protocol.ts` に集約してください。呼び出し側へ生文字列を増やさないでください。
- 拡張機能名、protocol 名、metadata、または関連ファイル名を変えるときは、`lib/template-*.ts`、`README.md`、関連テストをまとめて更新してください。
- zip や CI に関わる変更では、`.github/workflows/ci.yml` と `.output/*.zip` の生成フローも合わせて確認してください。

## Commitルール

- **conventional-commit** Skill を使ってなるべく分割してコミットすること

## コーディング規約

- 新規または変更する通常コードでは、関数は **アロー関数** (`() => {}`) を優先してください。
- テストファイルは `.spec.(ts|tsx)` という形式で作成すること
- テスト API (`describe`, `it`, `expect`, `vi` など) は `vite-plus/test` から明示 import してください。
