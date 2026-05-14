import React, { useState, useEffect } from 'react';
import { Member, ID, Gender } from '../model/types';
import { useTree } from '../store/treeContext';
import { validateMember } from '../model/validation';
import { allMembers } from '../model/selectors';

interface Props {
  initial?: Partial<Member>;
  existingId?: ID;
  onSubmit: (data: Omit<Member, 'id'>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function MemberForm({
  initial = {},
  existingId,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: Props) {
  const { state } = useTree();
  const [name, setName] = useState(initial.name ?? '');
  const [gender, setGender] = useState<Gender>(initial.gender ?? 'male');
  const [dob, setDob] = useState(initial.dob ?? '');
  const [fatherId, setFatherId] = useState<ID | ''>(initial.fatherId ?? '');
  const [motherId, setMotherId] = useState<ID | ''>(initial.motherId ?? '');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const draft: Omit<Member, 'id'> = {
    name,
    gender,
    dob: dob || undefined,
    fatherId: fatherId || undefined,
    motherId: motherId || undefined,
  };

  const result = validateMember(draft, state.tree, existingId);

  const errorFor = (field: string) =>
    result.errors.find((e) => e.field === field);
  const warningFor = (field: string) =>
    result.warnings.find((w) => w.field === field);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!result.valid) return;
    onSubmit(draft);
  };

  // Keyboard: Esc cancels
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  const members = allMembers(state.tree).filter((m) => m.id !== existingId);
  const maleMembers = members.filter((m) => m.gender === 'male');
  const femaleMembers = members.filter((m) => m.gender === 'female');

  const memberOption = (m: Member) =>
    `${m.name}${m.dob ? ` (b. ${m.dob.slice(0, 4)})` : ''}`;

  return (
    <form onSubmit={handleSubmit} className="member-form" noValidate>
      {/* Name */}
      <div className="form-field">
        <label htmlFor="mf-name">Name *</label>
        <input
          id="mf-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          aria-invalid={submitAttempted && !!errorFor('name')}
        />
        {submitAttempted && errorFor('name') && (
          <span className="field-error">{errorFor('name')!.message}</span>
        )}
      </div>

      {/* Gender */}
      <div className="form-field">
        <label htmlFor="mf-gender">Gender</label>
        <select
          id="mf-gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
        >
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date of birth */}
      <div className="form-field">
        <label htmlFor="mf-dob">Date of birth</label>
        <input
          id="mf-dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        {warningFor('dob') && (
          <span className="field-warning">{warningFor('dob')!.message}</span>
        )}
      </div>

      {/* Father */}
      <div className="form-field">
        <label htmlFor="mf-father">Father</label>
        <select
          id="mf-father"
          value={fatherId}
          onChange={(e) => setFatherId(e.target.value as ID | '')}
          aria-invalid={submitAttempted && !!errorFor('fatherId')}
        >
          <option value="">— None —</option>
          {maleMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {memberOption(m)}
            </option>
          ))}
        </select>
        {submitAttempted && errorFor('fatherId') && (
          <span className="field-error">{errorFor('fatherId')!.message}</span>
        )}
      </div>

      {/* Mother */}
      <div className="form-field">
        <label htmlFor="mf-mother">Mother</label>
        <select
          id="mf-mother"
          value={motherId}
          onChange={(e) => setMotherId(e.target.value as ID | '')}
          aria-invalid={submitAttempted && !!errorFor('motherId')}
        >
          <option value="">— None —</option>
          {femaleMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {memberOption(m)}
            </option>
          ))}
        </select>
        {submitAttempted && errorFor('motherId') && (
          <span className="field-error">{errorFor('motherId')!.message}</span>
        )}
      </div>

      {/* Cycle/general errors */}
      {submitAttempted && result.errors.filter(e => !['name','fatherId','motherId'].includes(e.field)).map((e, i) => (
        <p key={i} className="field-error">{e.message}</p>
      ))}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
