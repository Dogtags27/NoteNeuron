import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { ReactFlow, Background, addEdge, applyNodeChanges, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Canvas.css';
import { useTheme } from '@mui/material/styles';
import EditableRectangleNode from '../components/CanvasNodes/EditableRectangleNode';
import '../components/CanvasNodes/EditableRectangleNode.css';
import { useCallback, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

const nodeTypes = {
  editableRectangle: EditableRectangleNode,
};

const CanvasPage = () => {
  const { id } = useParams();
  const theme = useTheme();

  const toolbar_classname = theme.palette.mode === 'light'
    ? 'toolbar-transparent-light'
    : 'toolbar-transparent-dark';

  const [nodeId, setNodeId] = useState(2); // start from 2 since node-1 exists initially

  const [nodes, setNodes] = useState([
    {
      id: 'node-1',
      type: 'editableRectangle',
      position: { x: 100, y: 150 },
      data: {
        title: '',
        description: '',
        updateNode: (id, newData) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      ...newData,
                      updateNode: node.data.updateNode,
                    },
                  }
                : node
            )
          );
        },
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const updateNode = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...newData,
                updateNode,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  const handleAddRectangle = useCallback(() => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'editableRectangle',
      position: {
        x: Math.random() * 600,
        y: Math.random() * 400,
      },
      data: {
        title: '',
        description: '',
        updateNode,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes, updateNode]);

  return (
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {/* Floating Toolbar */}
      <div className={toolbar_classname}>
        <button
          onClick={handleAddRectangle}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: '#0077ff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ➕ Rectangle
        </button>
      </div>

      {/* Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        fitView
        nodeTypes={nodeTypes}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Background variant="dots" gap={16} size={1} />
      </ReactFlow>
    </Box>
  );
};

export default CanvasPage;
