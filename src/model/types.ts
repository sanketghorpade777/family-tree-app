export type ID = string;

export type Gender = 'male' | 'female';

export interface Member {
  id: ID;
  name: string;
  gender?: Gender;
  dob?: string;
  fatherId?: ID;
  motherId?: ID;
}

export interface Tree {
  members: Record<ID, Member>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  valid: boolean;
}

export type DeleteStrategy = 'orphan' | 'reassign';
