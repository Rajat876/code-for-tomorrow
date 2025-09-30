import React from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Toolbar({ state, dispatch }) {

    function createFolder() {
        const parentId = prompt('Enter parent folder id(eg. root of folder-1). Leave blank for root:') || 'root';
        const name = prompt('Enter new folder name:');
        if(!name) return alert('Name Required');
        const node = { id: uuidv4(), name, type: 'folder', isExpanded: false, children: [] };
        dispatch({type: 'CREATE_NODE', payload: {parentId, node}});
    };

    function createFile() {
        const parentId = prompt('Enter parent folder id(eg. root or folder-1). Leave blank for root:') || 'root';
        const name = prompt('New file name:(include extension, e.g. file.txt)');
        if(!name) return alert('Name Required');
        const node = { id: uuidv4(), name, type: 'file', content: '' };
        dispatch({type: 'CREATE_NODE', payload: {parentId, node}});
    }

    function rename() {
        const id = prompt('Enter file/folder id to rename:');
        if(!id) return alert('ID Required');
        const newName = prompt('Enter new name:');
        if(!newName) return alert('Name Required');
        dispatch({type: 'RENAME_NODE', payload: {id, newName}});
    }

    function del() {
        const id = prompt('Enter file/folder id to delete:');
        if(!id) return;
        if (window.confirm(`Are you sure you want to delete node with id "${id}"?`)){
            dispatch({type: 'DELETE_NODE', payload: {id}});
        }
    }
    
    return (
        <>
          <div style={{ padding: '8px' , borderBottom: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <button onClick={createFolder}>New Folder</button>
            <button onClick={createFile}>New File</button>
            <button onClick={rename}>Rename</button>
            <button onClick={del}>Delete</button>
            <div style={{marginLeft: 'auto', color: 'red'}}>{state.error}</div>
          </div>
        </>
    )
}