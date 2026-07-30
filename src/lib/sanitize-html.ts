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

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src"],
    allowProtocolRelative: false,
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
    },
  });
}
