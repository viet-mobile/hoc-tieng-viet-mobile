function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatScriptureText(text) {
  if (!text || typeof text !== "string") return text;
  // Match citations
  const aliases = ['thi thiên', 'thi', '시편', 'châm ngôn', 'lu', '누가', '2 ti', '1 ti-mô-thê'];
  const esc = aliases.map(a => a.replace(/[\^$*+?.()|[\]{}\\]/g, '\\$&')).join('|');
  const re = new RegExp('(^|[^\\p{L}\\p{M}\\d_])(' + esc + ')\\s+(\\d+)(?:\\s*:\\s*([\\d\\s,–~-]+(?:\\b|\\d)))?', 'gui');
  
  const placeholders = [];
  const tokenized = text.replace(re, function(match, pre, book, ch, vs) {
    const citation = (book + " " + ch + (vs ? ":" + vs : "")).trim();
    const idx = placeholders.length;
    placeholders.push({
      pre: pre,
      ref: book + " " + ch + (vs ? ":" + vs : ""),
      citation: citation
    });
    return pre + "___SCRIPTURE_TOKEN_" + idx + "___";
  });
  
  let html = escapeHtml(tokenized);
  placeholders.forEach(function(item, idx) {
    const badge = '<span class="scripture-badge" data-scripture-ref="' + escapeHtml(item.ref) + '" role="button" tabindex="0" title="' + escapeHtml(item.citation) + '">' + escapeHtml(item.citation) + '</span>';
    html = html.replace("___SCRIPTURE_TOKEN_" + idx + "___", badge);
  });
  return html;
}

console.log(formatScriptureText("1, 2. (a) Đức Giê-hô-va làm gì cho dân ngài ngày nay? (Thi thiên 23:1, 2, 5) (b)"));
console.log(formatScriptureText("“Hãy để ý đến cách anh em nghe”.—LU 8:18."));
console.log(formatScriptureText("의로운 자들은 땅을 차지하고 (시편 37:29)"));
