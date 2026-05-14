import { ID, Member, Tree, ValidationResult } from './types';
import { guardiens } from './selectors';

export function validateMember(
  candidate: Omit<Member, 'id'> & { id?: ID },
  tree: Tree,
  existingId?: ID // provided when editing an existing member
): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const warnings: ValidationResult['warnings'] = [];

  if (!candidate.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  if (candidate.fatherId && candidate.motherId) {
    if (candidate.fatherId === candidate.motherId) {
      errors.push({
        field: 'motherId',
        message: 'Father and mother must be different people.',
      });
    }
  }

  const selfId = existingId ?? candidate.id;

  if (selfId) {
    // A member cannot be their own ancestor — block cycle creation.
    for (const parentField of ['fatherId', 'motherId'] as const) {
      const newParentId = candidate[parentField];
      if (!newParentId) continue;

      if (newParentId === selfId) {
        errors.push({
          field: parentField,
          message: 'A member cannot be their own parent.',
        });
        continue;
      }

      // Would-be parent's ancestors must not include selfId.
      const ancestors = guardiens(tree, newParentId);
      if (ancestors.has(selfId)) {
        errors.push({
          field: parentField,
          message: 'This selection would create a cycle in the family tree.',
        });
      }
    }
  }

  // Soft DOB warnings.
  if (candidate.dob) {
    const selfYear = new Date(candidate.dob).getFullYear();

    for (const parentField of ['fatherId', 'motherId'] as const) {
      const parentId = candidate[parentField];
      if (!parentId) continue;
      const parent = tree.members[parentId];
      if (parent?.dob) {
        const parentYear = new Date(parent.dob).getFullYear();
        if (selfYear <= parentYear) {
          warnings.push({
            field: 'dob',
            message: `Birth year (${selfYear}) is not after ${
              parentField === 'fatherId' ? 'father' : 'mother'
            }'s birth year (${parentYear}).`,
          });
        }
      }
    }
  }

  return { errors, warnings, valid: errors.length === 0 };
}
