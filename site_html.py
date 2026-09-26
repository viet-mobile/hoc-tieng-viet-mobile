# Strips JW-only nav tabs/subtabs/panels out of template.html for a non-jw site build, using
# site_profiles.NON_JW_HTML_REMOVALS as the declarative list of what to remove. Uses Python's
# built-in html.parser (no bs4/lxml in this environment) to find the exact [start, end) byte
# span of each matching element by walking a tag-depth stack, so removal is exact even though
# template.html has deeply nested divs -- a naive string/regex removal could not find the
# correct matching close tag.
import re
from html.parser import HTMLParser

# Most subtab groups name their per-value content mount "<group>-<value>-pane" (wizard, bible),
# but grammar's are "<group>-<value>-panel" -- try both so a removal isn't silently a no-op.
PANE_ID_SUFFIXES = ["pane", "panel"]

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
             "param", "source", "track", "wbr"}


class _SpanFinder(HTMLParser):
    def __init__(self, html_text, matchers):
        super().__init__(convert_charrefs=False)
        self.html_text = html_text
        self.matchers = matchers  # list of (tag, attr, value)
        self.stack = []  # [{"tag":..., "start":pos, "match": bool}]
        self.spans = []

    def _is_match(self, tag, attrs_d):
        return any(tag == mt and attrs_d.get(ma) == mv for (mt, ma, mv) in self.matchers)

    def _tag_end(self, start):
        return self.html_text.index(">", start) + 1

    def handle_starttag(self, tag, attrs):
        start = self.getpos_offset()
        end = self._tag_end(start)
        is_match = self._is_match(tag, dict(attrs))
        if tag in VOID_TAGS:
            if is_match:
                self.spans.append((start, end))
            return
        self.stack.append({"tag": tag, "start": start, "match": is_match})

    def handle_startendtag(self, tag, attrs):
        start = self.getpos_offset()
        end = self._tag_end(start)
        if self._is_match(tag, dict(attrs)):
            self.spans.append((start, end))

    def handle_endtag(self, tag):
        start = self.getpos_offset()
        end = self._tag_end(start)
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                frame = self.stack.pop(i)
                del self.stack[i:]
                if frame["match"]:
                    self.spans.append((frame["start"], end))
                return

    def getpos_offset(self):
        line, col = self.getpos()
        return self._line_offsets[line - 1] + col


def _find_spans(html_text, matchers):
    finder = _SpanFinder(html_text, matchers)
    offsets = [0]
    for i, ch in enumerate(html_text):
        if ch == "\n":
            offsets.append(i + 1)
    finder._line_offsets = offsets
    finder.feed(html_text)
    return finder.spans


def remove_elements(html_text, matchers):
    """Removes every element (and its full subtree) matching (tag, attr, value) in `matchers`.
    Returns (new_text, count). Overlapping/nested spans are merged so partial matches inside an
    already-removed element don't corrupt offsets."""
    spans = _find_spans(html_text, matchers)
    if not spans:
        return html_text, 0
    spans.sort()
    merged = []
    for s, e in spans:
        if merged and s <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], e))
        else:
            merged.append((s, e))
    out = []
    prev = 0
    for s, e in merged:
        out.append(html_text[prev:s])
        prev = e
    out.append(html_text[prev:])
    return "".join(out), len(merged)


def _promote_default_subtab(html_text, attr, pane_prefix):
    """If removing this group's subtabs took out the one button with aria-selected="true"
    (e.g. grammar's default "lessons" subtab), the tab would otherwise land on a blank pane with
    no active button. Promotes the first remaining button/pane in that group to be the default:
    marks the button aria-selected="true" and drops "display:none" from its pane, so the tab has
    a sensible, visibly-selected starting subtab instead of an all-deselected row."""
    if re.search(r'<button class="subtab-btn" ' + re.escape(attr) + r'="[^"]*" aria-selected="true"', html_text):
        return html_text  # a default is already selected among the surviving buttons
    m = re.search(r'<button class="subtab-btn" ' + re.escape(attr) + r'="([^"]*)" aria-selected="false"', html_text)
    if not m:
        return html_text  # group has no buttons left at all (or already handled)
    val = m.group(1)
    html_text = html_text[:m.start()] + html_text[m.start():m.end()].replace('aria-selected="false"', 'aria-selected="true"') + html_text[m.end():]
    for suffix in PANE_ID_SUFFIXES:
        pane_id = pane_prefix + "-" + val + "-" + suffix
        html_text = html_text.replace(
            f'<div id="{pane_id}" style="display:none">',
            f'<div id="{pane_id}">',
            1,
        )
    return html_text


def strip_site_html(html_text, removals):
    """Applies site_profiles.NON_JW_HTML_REMOVALS to the assembled page. Returns
    (result_text, removal_counts dict) for reporting/assertions."""
    counts = {}
    text = html_text

    tab_matchers = []
    for tab in removals.get("tabs", []):
        tab_matchers.append(("button", "data-tab", tab))
        tab_matchers.append(("section", "id", "panel-" + tab))
    text, n = remove_elements(text, tab_matchers)
    counts["tabs"] = n

    for group in removals.get("subtabs", []):
        attr = group["attr"]
        # Most groups' per-value content mount matches the attribute name (data-wizard ->
        # "wizard-<value>-pane"), but a few pre-existing panels don't (data-curriculum's panes
        # are "curr-<value>-pane", data-grammar's are "...-panel" not "...-pane" -- see
        # PANE_ID_SUFFIXES). "pane_prefix" lets a group declare its actual prefix explicitly
        # instead of silently failing to match and leaving an orphaned pane behind.
        pane_prefix = group.get("pane_prefix", attr.replace("data-", ""))
        matchers = []
        for val in group["values"]:
            matchers.append(("button", attr, val))
            for suffix in PANE_ID_SUFFIXES:
                matchers.append(("div", "id", pane_prefix + "-" + val + "-" + suffix))
        text, n = remove_elements(text, matchers)
        counts["subtab:" + attr] = n
        text = _promote_default_subtab(text, attr, pane_prefix)

    review_matchers = [("button", "data-review", v) for v in removals.get("review_categories", [])]
    if review_matchers:
        text, n = remove_elements(text, review_matchers)
        counts["review_categories"] = n

    return text, counts


def empty_elements(html_text, matchers):
    """Keeps each element matching (tag, attr, value) but drops everything inside it (its opening
    and closing tags stay, so ids/classes the runtime mounts into still exist). Returns
    (new_text, count)."""
    spans = sorted(_find_spans(html_text, matchers), reverse=True)
    for start, end in spans:
        open_end = html_text.index(">", start) + 1
        close_start = html_text.rindex("</", start, end)
        html_text = html_text[:open_end] + html_text[close_start:]
    return html_text, len(spans)
