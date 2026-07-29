import DOMPurify from "isomorphic-dompurify";

const allowedTags = [
  "a", "blockquote", "br", "div", "em", "h2", "h3", "h4", "img", "li", "ol", "p", "span", "strong", "ul",
];
const allowedAttributes = ["alt", "class", "href", "src", "target", "title"];

export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?):|(?:\/|#))/i,
  }).replace(/\s(target="_blank")/g, ' $1 rel="noopener noreferrer"');
}
