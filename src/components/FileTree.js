import React from "react";
import FileNode from "./FileNode";

export default function FileTree({ nodes, dispatch, selectedId }) {
    return (
        <>
        <div>
            {nodes.map(node => (
                <FileNode />
            ))}
        </div>
        </>
    );
}