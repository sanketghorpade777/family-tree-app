import React, { useState, useRef } from 'react';
import { TreeProvider, useTree } from './store/treeContext';
import { ToastProvider, useToast } from './components/Toast';
import TreeView from './components/TreeView';
import DetailPanel from './components/DetailPanel';
import MemberForm from './components/MemberForm';
import SearchBar from './components/SearchBar';
import { Member, ID } from './model/types';
import { exportTree, importTree } from './utils/importExport';
import { allMembers } from './model/selectors';
import './App.css';

function AppShell() {
  const { state, dispatch } = useTree();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [highlightIds, setHighlightIds] = useState<Set<ID>>(new Set());
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalMembers = allMembers(state.tree).length;

  const handleAdd = (data: Omit<Member, 'id'>) => {
    dispatch({ type: 'ADD_MEMBER', payload: data });
    setShowAddModal(false);
    showToast(`${data.name} added successfully`);
  };

  const handleExport = () => exportTree(state.tree);

  const handleImportClick = () => {
    setImportError('');
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importTree(file);
      dispatch({ type: 'LOAD_TREE', payload: imported });
      dispatch({ type: 'SELECT_MEMBER', payload: null });
      showToast('Family tree imported successfully');
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Family Tree</h1>
        <div className="header-controls">
          <SearchBar onHighlight={setHighlightIds} />
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Member
          </button>
          <button className="btn btn-secondary" onClick={handleImportClick} title="Import JSON">
            Import
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={totalMembers === 0}
            title="Export JSON"
          >
            Export
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </header>

      {importError && (
        <div className="import-error" role="alert">
          {importError}
          <button onClick={() => setImportError('')} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* Add member modal */}
      {showAddModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="modal-box">
            <h2 id="add-modal-title">Add Family Member</h2>
            <MemberForm
              onSubmit={handleAdd}
              onCancel={() => setShowAddModal(false)}
              submitLabel="Add member"
            />
          </div>
        </div>
      )}

      {/* Main layout */}
      <main className="app-main">
        <section className="pane pane-tree" aria-label="Family tree">
          <TreeView highlightIds={highlightIds} />
        </section>
        <aside className="pane pane-detail" aria-label="Member details">
          <DetailPanel />
        </aside>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TreeProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </TreeProvider>
  );
}
