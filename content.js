/* content.txt の書き方: [カテゴリー名] の次の行から「リンク名 URL」。 */
(function () {
  "use strict";

  function parseContent(text, baseUrl) {
    var categories = [];
    var warnings = [];
    var current = null;
    var lines = text.replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);

    function warn(line, message) {
      warnings.push({ line: line, message: message });
    }

    lines.forEach(function (source, index) {
      var line = source.trim();
      if (!line || line.charAt(0) === "#") return;

      var heading = line.match(/^\[(.*)\]$/);
      if (heading) {
        var name = heading[1].trim();
        if (!name) {
          current = null;
          warn(index + 1, "カテゴリー名が空です。");
          return;
        }
        current = { name: name, links: [] };
        categories.push(current);
        return;
      }

      // 最後の空白で区切るので、リンク名の途中に空白があっても使えます。
      var link = line.match(/^(.+)\s+(\S+)$/);
      if (!link) {
        warn(index + 1, "「リンク名 URL」または「[カテゴリー名]」の形で記入してください。");
        return;
      }
      if (!current) {
        warn(index + 1, "リンクの前に [カテゴリー名] を記入してください。");
        return;
      }

      try {
        var url = new URL(link[2], baseUrl);
        if (["http:", "https:", "mailto:"].indexOf(url.protocol) === -1) {
          warn(index + 1, "この種類の URL は使えません。");
          return;
        }
      } catch (error) {
        warn(index + 1, "URL の書き方を確認してください。");
        return;
      }
      current.links.push({ label: link[1].trim(), url: link[2] });
    });

    return { categories: categories, warnings: warnings };
  }

  function readContent(fetcher, baseUrl) {
    var contentUrl = new URL("content.txt", baseUrl).href;
    return fetcher(contentUrl, { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.text();
    }).then(function (text) {
      return parseContent(text, baseUrl);
    });
  }

  function element(tag, text) {
    var node = document.createElement(tag);
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function renderDirectory(result) {
    var container = document.getElementById("directory");
    var status = document.getElementById("content-status");
    var notice = document.getElementById("content-notice");
    var count = document.getElementById("content-count");
    container.textContent = "";
    notice.textContent = "";
    notice.className = "";
    var total = 0;
    var table = element("table");
    table.className = "directory";
    table.setAttribute("role", "presentation");
    var body = element("tbody");
    table.appendChild(body);
    var row;

    result.categories.forEach(function (category, index) {
      if (index % 2 === 0) {
        row = element("tr");
        body.appendChild(row);
      }
      var cell = element("td");
      cell.appendChild(element("h2", "■ " + category.name));
      if (category.links.length) {
        var list = element("ul");
        category.links.forEach(function (link) {
          var item = element("li");
          var anchor = element("a", link.label);
          anchor.setAttribute("href", link.url);
          item.appendChild(anchor);
          list.appendChild(item);
          total += 1;
        });
        cell.appendChild(list);
      } else {
        var empty = element("p", "（準備中）");
        empty.className = "empty-category";
        cell.appendChild(empty);
      }
      row.appendChild(cell);
    });

    if (result.categories.length) container.appendChild(table);
    status.textContent = result.categories.length ? "" : "リンクはまだ登録されていません。";
    count.textContent = result.categories.length + " カテゴリー / " + total + " リンク";

    if (result.warnings.length) {
      notice.className = "notice";
      notice.appendChild(element("p", "content.txt の一部の行を読み込めませんでした。"));
      var warnings = element("ul");
      result.warnings.forEach(function (warning) {
        warnings.appendChild(element("li", warning.line + "行目：" + warning.message));
      });
      notice.appendChild(warnings);
    }
  }

  function showError(message) {
    var status = document.getElementById("content-status");
    var notice = document.getElementById("content-notice");
    status.textContent = "目次を読み込めませんでした。";
    notice.textContent = "";
    notice.className = "notice";
    notice.appendChild(element("p", message));
    var paragraph = element("p");
    var link = element("a", "リンク一覧（テキスト）を開く");
    link.setAttribute("href", "content.txt");
    paragraph.appendChild(link);
    notice.appendChild(paragraph);
  }

  function start() {
    if (!document.getElementById("directory")) return;
    if (window.location.protocol === "file:") {
      showError("ファイルを直接開くと目次を読み込めません。GitHub Pages 上で開くか、README.md の手順でローカルサーバーを起動してください。");
      return;
    }
    if (typeof window.fetch !== "function" || typeof window.URL !== "function") {
      showError("このブラウザーでは目次を読み込めません。新しいブラウザーで開いてください。");
      return;
    }
    document.getElementById("content-status").textContent = "目次を読み込んでいます。";
    readContent(window.fetch.bind(window), window.location.href).then(renderDirectory).catch(function () {
      showError("通信状態と、同じフォルダーに content.txt があることを確認して、ページを再読み込みしてください。");
    });
  }

  // 解析と読み込みは Node.js でも単独で検証できます。公開時に Node.js は不要です。
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { parseContent: parseContent, readContent: readContent };
  }
  if (typeof document !== "undefined") start();
}());
