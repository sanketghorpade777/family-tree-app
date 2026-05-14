# Family Tree Builder

A single-page React application for building and visualizing family trees. Add members, define parent relationships, search, and export your tree as JSON — all saved automatically in the browser.

---

## Features

- **Add / Edit / Delete members** — name, gender, date of birth, father, mother
- **Recursive tree view** — indented list that renders the full family hierarchy
- **Detail panel** — click any member to see their children, siblings, parents, and DOB
- **Relationship validation**
  - Cycle detection — prevents making a descendant someone's parent
  - Father dropdown shows only male members; Mother dropdown shows only female members
  - Soft warning when a child's birth year precedes a parent's
- **Delete dialog** — choose to orphan children or reassign them to the grandparent
- **Live search** — highlights matching members across the tree; auto-selects on a single match
- **Import / Export** — download the tree as JSON and reload it later
- **Toast notifications** — confirmation popup after every add, edit, or delete
- **Persistent storage** — tree is auto-saved to `localStorage` on every change

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Language | TypeScript |
| Bundler | Create React App (Webpack) |
| State management | `useReducer` + React Context (no external library) |
| Persistence | `localStorage` |
| ID generation | `nanoid` |
| Styling | Plain CSS (CSS custom classes, no framework) |

---

## Project Structure

```
src/
├── model/
│   ├── types.ts          # Member, Tree, ValidationResult types
│   ├── selectors.ts      # Pure read functions (childrenOf, siblingsOf, guardiens…)
│   ├── useFunctions.ts   # Pure mutation functions (addMember, editMember, deleteMember)
│   └── validation.ts     # Cycle check, duplicate parent, DOB warnings
├── store/
│   ├── treeContext.tsx   # useReducer + Context provider
│   └── treeStore.ts      # localStorage load/save
├── components/
│   ├── TreeView.tsx       # Renders root-level nodes
│   ├── TreeNode.tsx       # Single recursive tree row
│   ├── DetailPanel.tsx    # Read view + inline edit toggle
│   ├── MemberForm.tsx     # Shared add / edit form with validation
│   ├── DeleteDialog.tsx   # Orphan vs reassign confirmation
│   ├── SearchBar.tsx      # Live search with highlight
│   └── Toast.tsx          # Toast notification provider + hook
└── utils/
    ├── id.ts              # nanoid wrapper
    ├── importExport.ts    # JSON download / file upload
    └── seedData.ts        # Sample family data
```

---

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm 8 or higher

### Installation

```bash
git clone <repository-url>
cd family-tree-task
npm install
```

### Run in development

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads on file changes.

### Production build

```bash
npm run build
```

Outputs an optimized bundle to the `build/` folder, ready to serve as a static site.

---

## Key Design Decisions

**Flat map over nested tree**
Members are stored as a `Record<ID, Member>` with `fatherId` / `motherId` pointers. Children, siblings, and ancestors are all derived at read time — never stored. This means edits never desync two copies of the same data.

**Cycle prevention on every parent change**
Before accepting a new parent assignment, the app walks the candidate parent's ancestor chain. If the current member appears anywhere in it, the assignment is rejected with a clear error message.

**Delete dialog with two strategies**
Silently cascade-deleting a parent would lose the children's relationship data. Silently orphaning surprises users. The dialog makes the choice explicit: remove the parent link, or reassign children to the grandparent.

**Gender-filtered parent dropdowns**
The Father field only shows male members and the Mother field only shows female members, reducing invalid selections without hiding any data.

---

## Known Limitations

- Marriages are not modeled as first-class relationships; spouses are implied by shared children
- Step-parents and in-laws would require a separate edge type
- No undo / redo (localStorage is overwritten on every change)
- No multi-user or cloud sync support
