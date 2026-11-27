const aliases = ['thi thiên', 'thi', '시편', 'châm ngôn', 'lu', '누가', '2 ti', '1 ti-mô-thê'];
const esc = aliases.map(a => a.replace(/[\^$*+?.()|[\]{}\\]/g, '\\$&')).join('|');
const re = new RegExp('(^|[^\\p{L}\\p{M}\\d_])(' + esc + ')\\s+(\\d+)(?:\\s*:\\s*([\\d\\s,–~-]+(?:\\b|\\d)))?', 'gui');

function formatScriptureHtml(html) {
  if (!html || typeof html !== 'string') return html;
  const parts = html.split(/(<[^>]+>)/g);
  for (let i = 0; i < parts.length; i += 2) {
    if (!parts[i]) continue;
    parts[i] = parts[i].replace(re, function(match, pre, book, ch, vs) {
      const citation = (book + ' ' + ch + (vs ? ':' + vs : '')).trim();
      return (pre || '') + '<span class="scripture-badge" data-scripture-ref="' + citation + '" role="button" tabindex="0">' + citation + '</span>';
    });
  }
  return parts.join('');
}

const input1 = '<div class="reader-vi"><b>1.</b> Đức Giê-hô-va (Thi thiên 23:1, 2, 5) nói <span class="highlight">LU 8:18</span>.</div>';
console.log(formatScriptureHtml(input1));
