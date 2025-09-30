import './App.css';
import { useReducer } from 'react';
import { fileSystemReducer, initialState } from './state/fileSystemReducer';
import FileTree from './components/FileTree';
import FileContent from './components/FileContent';
import Toolbar from './components/Toolbar';
import InitialTree from '../data/initialTree.json';


function App() {
  const [state, dispatch] = useReducer(fileSystemReducer, initialState);
  console.log(InitialTree);

  if(!state || !state.tree) return <div>Loading...</div>;

  return (
    <>
    <div className="app-shell">
      <Toolbar state={state} dispatch={dispatch} />
      <div className="main">
        <aside className="sidebar">
          <FileTree nodes={state.tree} dispatch={dispatch} selectedId={state.selectedId} />
        </aside>
        <section className="content">
          <FileContent tree={state.tree} selectedId={state.selectedId} dispatch={dispatch} />
        </section>
      </div>
    </div>
    </>
  );
}

export default App;
