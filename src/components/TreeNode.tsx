import React from 'react';
import { Member, ID } from '../model/types';
import { Tree } from '../model/types';
import { childrenOf } from '../model/selectors';

interface Props {
  member: Member;
  tree: Tree;
  selectedId: ID | null;
  onSelect: (id: ID) => void;
  depth: number;
  highlightIds?: Set<ID>;
}

const GENDER_ICON: Record<string, string> = {
  male: '♂',
  female: '♀',

};

export default function TreeNode({
  member,
  tree,
  selectedId,
  onSelect,
  depth,
  highlightIds,
}: Props) {
  const children = childrenOf(tree, member.id);
  const isSelected = selectedId === member.id;
  const isHighlighted = highlightIds?.has(member.id);

  return (
    <li className="tree-node">
      <button
        className={[
          'tree-node-btn',
          isSelected ? 'tree-node-btn--selected' : '',
          isHighlighted ? 'tree-node-btn--highlighted' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onSelect(member.id)}
        aria-pressed={isSelected}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <span className="tree-node-icon">
          {GENDER_ICON[member.gender ?? 'unspecified']}
        </span>
        <span className="tree-node-name">{member.name}</span>
        {member.dob && (
          <span className="tree-node-dob">b. {member.dob.slice(0, 4)}</span>
        )}
      </button>

      {children.length > 0 && (
        <ul className="tree-children">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              member={child}
              tree={tree}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
              highlightIds={highlightIds}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
