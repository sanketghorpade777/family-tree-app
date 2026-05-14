import { ID, Member, Tree, DeleteStrategy } from './types';
import { generateId } from '../utils/id';
import { childrenOf } from './selectors';

export function addMember(tree: Tree, data: Omit<Member, 'id'>): Tree {
  const id = generateId();
  return {
    members: { ...tree.members, [id]: { ...data, id } },
  };
}

export function editMember(tree: Tree, id: ID, data: Omit<Member, 'id'>): Tree {
  if (!tree.members[id]) return tree;
  return {
    members: { ...tree.members, [id]: { ...data, id } },
  };
}

export function deleteMember(
  tree: Tree,
  id: ID,
  strategy: DeleteStrategy
): Tree {
  const members = { ...tree.members };
  const children = childrenOf(tree, id);

  for (const child of children) {
    const updated = { ...child };
    if (updated.fatherId === id) {
      if (strategy === 'reassign') {
        updated.fatherId = members[id]?.fatherId;
      } else {
        delete updated.fatherId;
      }
    }
    if (updated.motherId === id) {
      if (strategy === 'reassign') {
        updated.motherId = members[id]?.motherId;
      } else {
        delete updated.motherId;
      }
    }
    members[child.id] = updated;
  }

  delete members[id];
  return { members };
}
