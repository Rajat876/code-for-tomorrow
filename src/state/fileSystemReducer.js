
import InitialTree from '../data/initialTree.json';
// Helper to find and remove a node by id, returning [node, newTree]
function extractNode(nodes, id) {
    let found = null;
    function helper(arr) {
        return arr.filter(n => {
            if (n.id === id) {
                found = n;
                return false;
            }
            if (n.type === 'folder' && n.children) {
                n.children = helper(n.children);
            }
            return true;
        });
    }
    const newTree = helper([...nodes]);
    return [found, newTree];
}

export const initialState = {
    tree: InitialTree,
    selectedId: null,
    error: null
};

function traverse(nodes, predicate, updater){
    return nodes.map(node => {
        if(predicate(node)) return updater(node);
        if(node.type === 'folder' && node.children){
            return{...node, children: traverse(node.children, predicate, updater)}
        }
        return node;
    });
}

function removeNode(nodes, idToRemove) {
    return nodes.filter(n => n.id !== idToRemove).map(n => (n.type === 'folder' && n.children) ? {...n, children: removeNode(n.children, idToRemove)} : n);
}

export function fileSystemReducer(state, action) {
    switch(action.type){
        case 'MOVE_NODE': {
            const { draggedId, targetId } = action.payload;
            if (draggedId === 'root' || draggedId === targetId) return state;
            // Remove node from tree
            const [draggedNode, treeWithoutDragged] = extractNode(state.tree, draggedId);
            if (!draggedNode) return state;
            // Insert node into target folder
            const newTree = traverse(treeWithoutDragged, n => n.id === targetId && n.type === 'folder', folder => ({
                ...folder,
                children: [...(folder.children || []), draggedNode]
            }));
            return { ...state, tree: newTree };
        }
        case 'SELECT_FILE':
            return {...state, selectedId: action.payload.id, error: null};
        
        case 'TOGGLE_EXPAND':
            return {
                ...state,
                tree: traverse(state.tree, n => n.id === action.payload.id && n.type === 'folder', node => ({...node, isExpanded: !node.isExpanded})),
            };

        case 'CREATE_NODE':{
            const {parentId, node} = action.payload;
            let hasDuplicate = false;
            const newTree = traverse(state.tree, n => n.id === parentId && n.type === 'folder', parentNode => {
                hasDuplicate = (parentNode.children || []).some(c => c.name === node.name);
                if(hasDuplicate) return parentNode;
                return {...parentNode, children: [...(parentNode.children || []), node],}
            });
            if(hasDuplicate) return {...state, error: 'A node with the same name already exists in this folder.'};
            return {...state, tree: newTree, error: null};
        };

        case 'RENAME_NODE':{
            const {id, newName} = action.payload;
            const newTree = traverse(state.tree, n => n.id === id, node => ({...node, name: newName}));
            return {...state, tree: newTree, error: null};
        }
        
        case 'DELETE_NODE':{
            if(action.payload.id === 'root'){
                return {...state, error: 'Cannot delete the root folder.'}
                };
            return {...state, tree: removeNode(state.tree, action.payload.id), selectedId: state.selectedId === action.payload.id ? null : state.selectedId, error: null};
        }

        case 'UPDATE_FILE_CONTENT':{
            const {id, content} = action.payload;
            const newTree = traverse(state.tree, n => n.id === id && n.type === 'file', f => ({...f, content}));
            return {...state, tree: newTree, error: null};
        }

        case 'SET_ERROR':
            return {...state, error: action.payload.error};

        case 'CLEAR_ERROR':
            return {...state, error: null};

        default:
            return state;
    }
}