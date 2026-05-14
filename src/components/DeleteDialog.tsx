import React, { useEffect } from 'react';
import { Member } from '../model/types';
import { DeleteStrategy } from '../model/types';

interface Props {
  member: Member;
  hasChildren: boolean;
  onConfirm: (strategy: DeleteStrategy) => void;
  onCancel: () => void;
}

export default function DeleteDialog({ member, hasChildren, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="modal-box">
        <h2 id="delete-title">Delete {member.name}?</h2>

        {hasChildren ? (
          <>
            <p>This member has children. What should happen to them?</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={() => onConfirm('orphan')}
              >
                Remove parent link
              </button>
              <button
                className="btn btn-warning"
                onClick={() => onConfirm('reassign')}
              >
                Reassign to grandparent
              </button>
            </div>
          </>
        ) : (
          <>
            <p>Are You Sure ? </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onConfirm('orphan')}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
