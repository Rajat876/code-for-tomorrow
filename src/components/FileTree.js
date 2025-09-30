import React from "react";
import FileNode from "./FileNode";

export default function FileTree({ nodes, dispatch, selectedId }) {
    return (
        <>
        <div>
            {nodes.map(node => (
                <FileNode key={node.id} node={node} dispatch={dispatch} level={0} selectedId={selectedId} />
            ))}
        </div>
        </>
    );
}