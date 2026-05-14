import { Tree } from '../model/types';


export const SEED_TREE: Tree = {
  members: {
    'seed-1': { id: 'seed-1', name: 'Ramesh Sharma', gender: 'male', dob: '1945-03-10' },
    'seed-2': { id: 'seed-2', name: 'Kamla Sharma', gender: 'female', dob: '1948-07-22' },
    'seed-3': {
      id: 'seed-3',
      name: 'Amit Sharma',
      gender: 'male',
      dob: '1970-11-05',
      fatherId: 'seed-1',
      motherId: 'seed-2',
    },
    'seed-4': {
      id: 'seed-4',
      name: 'Priya Sharma',
      gender: 'female',
      dob: '1973-04-18',
      fatherId: 'seed-1',
      motherId: 'seed-2',
    },
    'seed-5': { id: 'seed-5', name: 'Sunita Verma', gender: 'female', dob: '1972-09-30' },
    'seed-6': {
      id: 'seed-6',
      name: 'Rohan Sharma',
      gender: 'male',
      dob: '1995-06-14',
      fatherId: 'seed-3',
      motherId: 'seed-5',
    },
    'seed-7': {
      id: 'seed-7',
      name: 'Sneha Sharma',
      gender: 'female',
      dob: '1998-12-02',
      fatherId: 'seed-3',
      motherId: 'seed-5',
    },
    'seed-8': {
      id: 'seed-8',
      name: 'Aarav Sharma',
      gender: 'male',
      dob: '2020-03-25',
      fatherId: 'seed-6',
    },
  },
};
