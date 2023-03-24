## AI-blog-assistant
OpenAIを用いたブログ生成ツール

https://user-images.githubusercontent.com/19645346/225935421-9eebdefd-8c77-4d32-84b4-f68251fd9587.mp4


## Setup
```
npm i
```

## Build/start
main/rendererをビルドしてElectronアプリをdeveloper modeで立ち上げる
```
npm run clean-build-start
```

## Watch renderer
先に以下を実行
```
npm run clean-build-start
```

Watchモードでrendererをビルド。ウィンドウリロードで変更が反映される。
mainプロセスは変更したら`npm run clean-build-start`を再実行する必要がある。

```
npm run build:renderer -- --mode=development  --watch
```

## Production build
```
npm run prdbuild:win
npm run prdbuild:mac
```

## ビルド・フォルダ構成
rendererはvite、mainプロセスはtscでビルドしている。

### rendererプロセス
- src
    - components: 共通コンポーネント(といいつつ共通ではないもの全てが入っている)
    - pages: ページコンポーネント(TODO ページ固有のコンポーネントはこっちに移したい)
    - openai: OpenAIに関するモジュール
    - template-mod: テンプレートに関するモジュール(TODO openaiにもテンプレート周りのコードがあるので集約したい)
    - main-module: メインプロセスを実行するモジュール (TODO global.d.tsのメインプロセス周りの型をこっちにうつす)
    - errors: エラー関連モジュール

### mainプロセス
- electron
    - openai: OpenAIに関するモジュール
    - errors: エラー関連モジュール
    - settings: 設定関連モジュール
    - storage: ストレージ関連モジュール (TODO 現状ファイル操作のみなのでリネームなりした方がいい)
    - utils: ユーティリティ
    - main.cts: Electronアプリのエンドポイント。rendererプロセスからの処理ハンドラーの設定も行う(TODO ここは別ファイルにしたい)。
    - preload.cts: rendererプロセスに公開するモジュールの設定
