export function formatSymbolCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function truncatePath(path: string, maxLength = 30): string {
  if (path.length <= maxLength) return path;
  return `...${path.slice(-maxLength)}`;
}
