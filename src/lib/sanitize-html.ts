import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "a",
  "blockquote",
  "br",
  "cite",
  "div",
  "em",
  "figcaption",
  "figure",
  "h2",
  "h3",
  "h4",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "ul",
];

const allowedAttributes: Record<string, string[]> = {
  a: ["href", "title", "target", "rel", "class"],
  img: ["src", "alt", "title", "class", "width", "height"],
  figure: ["class"],
  figcaption: ["class"],
  blockquote: ["class"],
  "*": ["class"],
};

/**
 * Quill/paste often injects &nbsp; / U+00A0 between words.
 * Those block normal wrap + break CSS justify. Normalize to real spaces.
 */
export function normalizeArticleWhitespace(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#x0*a0;/gi, " ")
    .replace(/ /g, " ");
}

export function sanitizeArticleHtml(html: string): string {
  const normalized = normalizeArticleWhitespace(html);
  const cleaned = sanitizeHtml(normalized, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
    // Drop Quill align classes / inline justify — layout uses CSS only
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.target === "_blank") {
          next.rel = "noopener noreferrer";
        }
        return { tagName, attribs: next };
      },
      img: (tagName, attribs) => {
        const src = attribs.src || "";
        const okHttp = /^https?:\/\//i.test(src);
        const okData = /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(src);
        if (!okHttp && !okData) {
          const { src: _drop, ...rest } = attribs;
          return { tagName, attribs: rest };
        }
        if (okData && src.length > 2_000_000) {
          const { src: _drop, ...rest } = attribs;
          return { tagName, attribs: rest };
        }
        return { tagName, attribs };
      },
      p: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      h2: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      h3: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      h4: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      li: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      div: (tagName, attribs) => stripAlignJunk(tagName, attribs),
      span: (tagName, attribs) => stripAlignJunk(tagName, attribs),
    },
  });
  // sanitize-html may re-emit entities; normalize again for render safety
  return normalizeArticleWhitespace(cleaned);
}

function stripAlignJunk(tagName: string, attribs: Record<string, string>) {
  const next = { ...attribs };
  delete next.align;
  delete next.style;
  if (next.class) {
    next.class = next.class
      .split(/\s+/)
      .filter((c) => c && !/^ql-align-/.test(c) && c !== "ql-align-justify")
      .join(" ");
    if (!next.class) delete next.class;
  }
  return { tagName, attribs: next };
}
