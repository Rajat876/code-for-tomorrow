import { FaFile, FaFolder, FaFolderOpen } from "react-icons/fa";
export default function FileNode({ node, dispatch, selectedId, level = 0 }) {
    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/node-id', node.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedId = e.dataTransfer.getData('application/node-id');
        if (draggedId && draggedId !== node.id && node.type === 'folder') {
            dispatch({ type: 'MOVE_NODE', payload: { draggedId, targetId: node.id } });
        }
    };
    const padding = { paddingLeft: `${level * 12}px` };

    const onToggle = (e) => {
        e.stopPropagation();
        if (node.type === 'folder') {
            dispatch({ type: 'TOGGLE_FOLDER', payload: { id: node.id } });
        }
    }
    const onSelect = (e) => {
        e.stopPropagation();
        if (node.type === 'file') {
            dispatch({ type: 'SELECT_FILE', payload: { id: node.id } });
        }else {
            dispatch({ type: 'SELECT_FOLDER', payload: { id: null } });
        }
    }

    return (
        <div
            className={`node-row ${selectedId === node.id ? 'selected' : ''}`}
            style={{display: 'flex', alignItems: 'center', ...padding, cursor: 'pointer'}}
            onClick={onSelect}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <span onClick={onToggle} style={{width: '20px'}}>
                {node.type === 'folder' ? (node.isExpanded ? <FaFolderOpen /> : <FaFolder />) : <FaFile />}
            </span>
            <span style={{ marginLeft: '8px' }}>{node.name}</span>

            {node.type === 'folder' && node.isExpanded && node.children &&
                <div>
                    {node.children.map(child => (
                        <FileNode key={child.id} node={child} dispatch={dispatch} selectedId={selectedId} level={level + 1} />
                    ))}
                </div>
            }
        </div>
    );
}