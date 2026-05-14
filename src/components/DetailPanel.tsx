import React, { useState } from 'react';
import { useTree } from '../store/treeContext';
import { useToast } from './Toast';
import { childrenOf, siblingsOf } from '../model/selectors';
import MemberForm from './MemberForm';
import DeleteDialog from './DeleteDialog';
import { Member } from '../model/types';

export default function DetailPanel() {
  const { state, dispatch } = useTree();
  const { showToast } = useToast();
  const { tree, selectedId } = state;

  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (!selectedId) {
    return (
      <div className="detail-panel detail-panel--empty">
        <p>Select a family member to see details.</p>
      </div>
    );
  }

  const member = tree.members[selectedId];
  if (!member) return null;

  const father = member.fatherId ? tree.members[member.fatherId] : undefined;
  const mother = member.motherId ? tree.members[member.motherId] : undefined;
  const children = childrenOf(tree, selectedId);
  const siblings = siblingsOf(tree, selectedId);

  const handleEdit = (data: Omit<Member, 'id'>) => {
    dispatch({ type: 'EDIT_MEMBER', payload: { id: selectedId, data } });
    setEditing(false);
    showToast(`${data.name} updated successfully`);
  };

  const handleDelete = (strategy: import('../model/types').DeleteStrategy) => {
    const name = member.name;
    dispatch({ type: 'DELETE_MEMBER', payload: { id: selectedId, strategy } });
    setShowDelete(false);
    showToast(`${name} deleted successfully`);
  };

  if (editing) {
    return (
      <div className="detail-panel">
        <h2>Edit {member.name}</h2>
        <MemberForm
          initial={member}
          existingId={selectedId}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
          submitLabel="Save changes"
        />
      </div>
    );
  }

  return (
    <div className="detail-panel">
      {showDelete && (
        <DeleteDialog
          member={member}
          hasChildren={children.length > 0}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div className="detail-header">
        <h2>{member.name}</h2>
        <div className="detail-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
            Delete
          </button>
        </div>
      </div>

      <dl className="detail-list">
        {member.gender && (
          <>
            <dt>Gender</dt>
            <dd>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</dd>
          </>
        )}

        {member.dob && (
          <>
            <dt>Date of birth</dt>
            <dd>{member.dob}</dd>
          </>
        )}

        <dt>Father</dt>
        <dd>{father ? father.name : '—'}</dd>

        <dt>Mother</dt>
        <dd>{mother ? mother.name : '—'}</dd>

        <dt>Children</dt>
        <dd>
          {children.length > 0
            ? children.map((c) => c.name).join(', ')
            : '—'}
        </dd>

        <dt>Siblings</dt>
        <dd>
          {siblings.length > 0
            ? siblings.map((s) => s.name).join(', ')
            : '—'}
        </dd>
      </dl>
    </div>
  );
}
