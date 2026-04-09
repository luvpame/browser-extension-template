# Browser Extension Template

このファイルは、このリポジトリでコーディングエージェントがどのように作業すべきかを定義します。

## 目的

- このリポジトリは、WXT、React、pnpm、TypeScript、Vite+、mise を使ったブラウザ拡張プロジェクトとして扱ってください。
- 現在のスコープには React popup、background の ping/pong 疎通確認、Chrome / Firefox 向けの build / zip が含まれます。
- タスクが明示的にそれ以上を求めていない限り、最小スコープを維持してください。権限、content scripts、options page、storage、ブラウザ固有分岐は必要になったときだけ追加してください。

## リポジトリの前提情報

- パッケージマネージャー: `pnpm`
- ランタイム / ビルドツール: `wxt`
- 検証ツールチェイン: `vite-plus`
- UI: React
- 言語モード: ESM TypeScript
- 標準作業環境: `mise install`
- ビルド対象:
  - Chrome: MV3
  - Firefox: MV2

## 現在の実装

- `entrypoints/background.ts`: install 時のログ出力と、typed message による ping/pong 応答を行います。
- `entrypoints/popup/*`: React popup を描画し、background 接続確認 UI を提供します。
- `lib/template-metadata.ts`: 拡張機能名、説明、アイコンパスを管理します。
- `lib/template-protocol.ts`: popup/background 間の typed messaging を管理します。
- `tests/*.spec.ts`: background、protocol、WXT config の最小保証を持ち、`vite-plus/test` を使います。
- `.github/workflows/ci.yml`: format / lint / test / build を行い、`main` push 時に zip artifact を生成します。

## 推奨されるコマンド選択

- ローカル開発: `vp run dev`、必要なら `vp run dev:chrome` または `vp run dev:firefox`
- 整形のみの変更: `vp fmt`
- 単一の挙動 / ユニット変更: `vp test`
- 型レベルまたは API 表面の変更: `vp check`
- Manifest / WXT / ビルド変更: `vp run build`
- GitHub Actions / workflow 変更: `vp run lint:gha`
- 配布物やパッケージングの確認: `vp run zip`
- 引き渡し前の信頼性確認 / タスク完了後、ユーザーに通知する前に実行: `vp check`

## 環境とツール

- ビルド出力先は次を想定します:
  - `.output/chrome-mv3/`
  - `.output/firefox-mv2/`

## プロジェクト保守の注意

- popup/background 間の message type は `lib/template-protocol.ts` に集約してください。呼び出し側へ生文字列を増やさないでください。
- 拡張機能名、protocol 名、metadata、または関連ファイル名を変えるときは、`lib/template-*.ts`、`README.md`、関連テストをまとめて更新してください。
- Manifest や WXT 設定を変えるときは、Chrome MV3 と Firefox MV2 の両方を維持してください。
- zip や CI に関わる変更では、`.github/workflows/ci.yml` と `.output/*.zip` の生成フローも合わせて確認してください。

## Commitルール

- **conventional-commit** Skill を使ってなるべく分割してコミットすること

## コーディング規約

- 新規または変更する通常コードでは、関数は **アロー関数** (`() => {}`) を優先してください。
- テストファイルは `.spec.(ts|tsx)` という形式で作成すること
- テストスイートは `describe`、テストケースは `it` で記述すること
- Vitest の globals は無効です。テスト API は `vite-plus/test` から明示 import してください。
