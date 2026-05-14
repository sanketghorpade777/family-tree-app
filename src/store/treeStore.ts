import { Tree } from '../model/types';

const STORAGE_KEY = 'family-tree';

export function loadTree(): Tree | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Tree;
  } catch {
    return null;
  }
}

export function saveTree(tree: Tree): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  } catch {
    // Storage quota exceeded — silently ignore.
  }
}

export function clearTree(): void {
  localStorage.removeItem(STORAGE_KEY);
}
