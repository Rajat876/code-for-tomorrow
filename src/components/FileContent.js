import React, { useEffect, useState } from "react";

function findNode(nodes, id) {
    for (const n of nodes) {
        if (n.id === id) return n;
        if (n.type === 'folder' && n.children) {
            const found = findNode(n.children, id);
            if (found) return found;
        }
    }
    return null;
}


export default function FileContent({ tree, selectedId, dispatch }) {
    const node = selectedId ? findNode(tree, selectedId) : null;
    const [text, setText] = useState('');

    useEffect(() =>{
        setText(node && node.type === 'file' ? node.content || '' : '');
    }, [node]);

    if(!node) return <div style={{ padding: '16px' }}>No file selected</div>;
    if(node.type === 'folder') return <div style={{ padding: '16px' }}>Folder selected: {node.name}</div>;

    function onSave() {
        dispatch({type: 'UPDATE_FILE_CONTENT', payload: {id: node.id, content: text}});
        alert('Content saved (local State).');
    }

    function onDelete() {
        if(window.confirm(`Are you sure you want to delete the file "${node.name}"?`)){
            dispatch({type: 'DELETE_NODE', payload: {id: node.id}});
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            <h3>{node.name}</h3>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} style={{ width: '100%' }} />
            <div style={{ marginTop: '8px' }}>
                <button onClick={onSave}>Save</button>
                <button onClick={onDelete} style={{ marginLeft: '8px' }}>Delete</button>
            </div>
        </div>
    )
}
