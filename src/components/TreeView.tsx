import React from 'react';
import { ID } from '../model/types';
import { useTree } from '../store/treeContext';
import { rootsOf, allMembers } from '../model/selectors';
import TreeNode from './TreeNode';

interface Props {
  highlightIds?: Set<ID>;
}

export default function TreeView({ highlightIds }: Props) {
  const { state, dispatch } = useTree();
  const { tree, selectedId } = state;

  const roots = rootsOf(tree);
  const total = allMembers(tree).length;

  const handleSelect = (id: ID) => {
    dispatch({ type: 'SELECT_MEMBER', payload: id === selectedId ? null : id });
  };

  if (total === 0) {
    return (
      <div className="tree-empty">
        <p>No family members yet.</p>
        <p className="tree-empty-hint">Click <strong>+ Add Member</strong> to get started.</p>
      </div>
    );
  }

  return (
    <div className="tree-view">
      <ul className="tree-root-list">
        {roots.map((root) => (
          <TreeNode
            key={root.id}
            member={root}
            tree={tree}
            selectedId={selectedId}
            onSelect={handleSelect}
            depth={0}
            highlightIds={highlightIds}
          />
        ))}
      </ul>
    </div>
  );
}
