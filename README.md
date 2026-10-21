# ぐふふの人生入門

`content.txt` を編集するだけで、カテゴリー別のリンク集を更新できる静的サイトです。
トップページを開くたびに JavaScript が `content.txt` を読み込みます。
フレームワーク、パッケージのインストール、自分で行うビルド作業は不要です。

## ファイル一覧

| ファイル | 用途 |
| --- | --- |
| `index.html` | トップページ。カテゴリーとリンクを自動表示します。 |
| `about.html` | このページについて。 |
| `mail.html` | メールアドレスとメール用リンク。 |
| `content.txt` | 日々の更新で編集するリンク集。 |
| `content.js` | テキストの読み込み・解析・表示。 |
| `style.css` | 全ページ共通の見た目。 |
| `.nojekyll` | GitHub Pages で静的ファイルをそのまま配信するためのファイル。 |
| `README.md` | この説明書。 |

添付のテキストは、内容を変更せず `content.txt` という名前で収録しています。
必要なファイルはすべて同じフォルダーに置いてください。

## 普段の更新方法

編集するのは `content.txt` です。UTF-8 で保存してください。

```text
[基本情報]
このページについて about.html
メール mail.html

[読みもの]
新しく書いた文章 https://example.com/essay/
空白を含む リンク名 https://example.com/another/

[新しいカテゴリー]
新しいページ https://example.com/new/
```

- `[カテゴリー名]` が見出しになります。カテゴリー名は自由です。
- その下の行を `リンク名 URL` の形で書きます。URL は行の最後に置きます。
- **最後の空白で区切ります。** リンク名の中に空白を含められます。区切りには空白またはタブを使えます。
- カテゴリーもリンクも、ファイルに書いた順で表示されます。横幅のある画面ではカテゴリーを左、右、次の段の順に並べ、狭い画面では縦に並べます。
- カテゴリーやリンクを追加・削除・移動すると、そのまま目次に反映されます。HTML の変更は不要です。
- 空のカテゴリーは「（準備中）」と表示されます。同じ名前のカテゴリーを書いた場合も、それぞれ別に表示されます。
- 空行と、行頭が `#` のコメント行は無視します。行末コメントは使えません。
- リンク先は `https://...`、`http://...`、`mailto:...`、または `about.html` などの相対 URL を使えます。
- URL に空白が必要な場合は `%20` にしてください。リンク名やカテゴリー名に HTML を書いても、タグとして実行せず文字として表示します。
- カテゴリーの前に置かれたリンクや、不正な形式の行は省き、ページに行番号と理由を表示します。

カテゴリーとリンクの管理は `content.txt` だけで完結します。
紹介文そのものを変える場合は `about.html`、メールアドレスを変える場合は `mail.html` を編集してください。
サイト名や固定の案内文まで `content.txt` で管理する仕様ではありません。

## GitHub Pages で公開する

1. GitHub の公開先リポジトリを用意します。
2. ZIP を展開し、`gufufu-jinsei` フォルダーの**中身**をリポジトリのルートに置きます。ルート直下に `index.html` と `content.txt` がある状態にしてください。`.nojekyll` も含めます。
3. ファイルを `main` ブランチにコミットし、GitHub に push します。GitHub の画面からアップロードしても構いません。
4. リポジトリの **Settings → Pages** を開きます。
5. **Build and deployment → Source** を **Deploy from a branch** にします。
6. **Branch** を `main`、フォルダーを **/(root)** にして **Save** を押します。ブランチ名が異なる場合は、実際にファイルを置いたブランチを選びます。
7. 公開処理が完了したら、Pages の設定画面に表示される URL で確認します。

以後は GitHub 上の `content.txt` を編集・コミットするだけでも更新できます。
公開処理が終わるまで待ち、ページを再読み込みしてください。
`content.txt` はブラウザーに保存済みの内容を使い回さない設定で読み込みますが、GitHub Pages 側の公開処理や配信への反映には時間がかかる場合があります。

内部のファイル参照は相対 URL なので、`https://ユーザー名.github.io/リポジトリ名/` のようなプロジェクトサイトにも対応します。
`content.txt` に同じサイト内のリンクを書く場合も、`/about.html` ではなく `about.html` のように書くと、リポジトリ名の下に正しく移動できます。

GitHub 公式の設定手順：
<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>

## 手元で確認する

`index.html` のダブルクリックでは、ブラウザーの制限で `content.txt` を自動取得できません。
Python が使える環境なら、展開した `gufufu-jinsei` フォルダーで次を実行します。

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

ブラウザーで <http://localhost:8000/> を開きます。終了はターミナルで `Ctrl+C` です。

## 表示について

- 白地、青い下線リンク、細い罫線、淡い色の見出し帯という素朴なデザインです。
- 見出し、段落、箇条書き、表組みを中心にした単純な HTML です。
- スマートフォンではカテゴリーを1列にします。
- 外部フォント、画像、CDN、解析サービスなどへの依存はありません。
- 見た目は古風ですが、目次の自動読み込みには `fetch` と `URL` を使える現在のブラウザーと JavaScript が必要です。
- JavaScript が無効な場合や読み込みに失敗した場合は、案内とテキスト版へのリンクを表示します。

参考にしたページ構成：
<https://www.tohoho-web.com/>

読み込みに使うブラウザー機能の説明：
<https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch>
<https://developer.mozilla.org/en-US/docs/Web/API/Request/cache>
