import { Handle, Position } from 'reactflow';
import { useCallback } from 'react';
import './EditableRectangleNode.css';

function EditableRectangleNode({ id, data, isConnectable }) {
  const handleTitleChange = useCallback((e) => {
    data.updateNode(id, { title: e.target.value });
  }, [data, id]);

  const handleDescriptionChange = useCallback((e) => {
    data.updateNode(id, { description: e.target.value });
  }, [data, id]);

  return (
    <div className="editable-rectangle-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      <input
        className="nodrag node-title"
        type="text"
        placeholder="Title"
        value={data.title}
        onChange={handleTitleChange}
      />
      <textarea
        className="nodrag node-description"
        placeholder="Description"
        value={data.description}
        onChange={handleDescriptionChange}
      />

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default EditableRectangleNode;
