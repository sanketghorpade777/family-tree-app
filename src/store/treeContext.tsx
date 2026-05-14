import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Tree, Member, ID, DeleteStrategy } from '../model/types';
import { addMember, editMember, deleteMember } from '../model/useFunctions';
import { loadTree, saveTree } from './treeStore';

// ── State ──────────────────────────────────────────────────────────────────

interface State {
  tree: Tree;
  selectedId: ID | null;
}

const EMPTY_TREE: Tree = { members: {} };

// ── Actions ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_MEMBER'; payload: Omit<Member, 'id'> }
  | { type: 'EDIT_MEMBER'; payload: { id: ID; data: Omit<Member, 'id'> } }
  | { type: 'DELETE_MEMBER'; payload: { id: ID; strategy: DeleteStrategy } }
  | { type: 'SELECT_MEMBER'; payload: ID | null }
  | { type: 'LOAD_TREE'; payload: Tree };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_MEMBER': {
      const tree = addMember(state.tree, action.payload);
      return { ...state, tree };
    }
    case 'EDIT_MEMBER': {
      const tree = editMember(state.tree, action.payload.id, action.payload.data);
      return { ...state, tree };
    }
    case 'DELETE_MEMBER': {
      const tree = deleteMember(state.tree, action.payload.id, action.payload.strategy);
      const selectedId = state.selectedId === action.payload.id ? null : state.selectedId;
      return { ...state, tree, selectedId };
    }
    case 'SELECT_MEMBER':
      return { ...state, selectedId: action.payload };
    case 'LOAD_TREE':
      return { ...state, tree: action.payload };
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface TreeContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    tree: loadTree() ?? EMPTY_TREE,
    selectedId: null,
  });

  useEffect(() => {
    saveTree(state.tree);
  }, [state.tree]);

  return (
    <TreeContext.Provider value={{ state, dispatch }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('useTree must be used inside TreeProvider');
  return ctx;
}
