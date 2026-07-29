export function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function toServiceSearchText(name: string, description: string): string {
  return `${name} ${plainText(description)}`.toLocaleLowerCase("id-ID");
}
