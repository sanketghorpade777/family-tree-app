import { ID, Member, Tree } from './types';

export function getMember(tree: Tree, id: ID): Member | undefined {
  return tree.members[id];
}

export function allMembers(tree: Tree): Member[] {
  return Object.values(tree.members);
}

export function childrenOf(tree: Tree, id: ID): Member[] {
  return allMembers(tree).filter(
    (m) => m.fatherId === id || m.motherId === id
  );
}

export function siblingsOf(tree: Tree, id: ID): Member[] {
  const member = tree.members[id];
  if (!member) return [];
  return allMembers(tree).filter((m) => {
    if (m.id === id) return false;
    const sharedFather = member.fatherId && m.fatherId === member.fatherId;
    const sharedMother = member.motherId && m.motherId === member.motherId;
    return sharedFather || sharedMother;
  });
}

// Returns all guardiens of id (parents, grandparents, …) as a Set of IDs.
export function guardiens(tree: Tree, id: ID): Set<ID> {
  const visited = new Set<ID>();
  const queue: ID[] = [id];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const m = tree.members[current];
    if (!m) continue;
    for (const parentId of [m.fatherId, m.motherId]) {
      if (parentId && !visited.has(parentId)) {
        visited.add(parentId);
        queue.push(parentId);
      }
    }
  }
  return visited;
}

export function ancestorsOf(tree: Tree, id: ID): Member[] {
  return Array.from(guardiens(tree, id))
    .map((aid) => tree.members[aid])
    .filter(Boolean) as Member[];
}

export function descendantsOf(tree: Tree, id: ID): Member[] {
  const result: Member[] = [];
  const queue: ID[] = [id];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = childrenOf(tree, current);
    result.push(...children);
    queue.push(...children.map((c) => c.id));
  }
  return result;
}

// Members with no known parents — rendered as tree roots.
export function rootsOf(tree: Tree): Member[] {
  return allMembers(tree).filter((m) => !m.fatherId && !m.motherId);
}

export function searchMembers(tree: Tree, query: string): Member[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allMembers(tree).filter((m) => m.name.toLowerCase().includes(q));
}
