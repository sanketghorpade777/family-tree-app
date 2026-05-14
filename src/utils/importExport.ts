import { Tree } from '../model/types';

export function exportTree(tree: Tree): void {
  const json = JSON.stringify(tree, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'family-tree.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importTree(file: File): Promise<Tree> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as Tree;
        if (!parsed.members || typeof parsed.members !== 'object') {
          reject(new Error('Invalid file: missing members field.'));
          return;
        }
        resolve(parsed);
      } catch {
        reject(new Error('Could not parse JSON file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
