import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { ReactFlow, Background, addEdge, applyNodeChanges, useEdgesState, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Canvas.css';
import { useTheme } from '@mui/material/styles';
import EditableRectangleNode from '../components/CanvasNodes/EditableRectangleNode';
import EditableDiamondNode from '../components/CanvasNodes/EditableDiamondNode';
import '../components/CanvasNodes/EditableRectangleNode.css';
import { useCallback, useState, memo } from 'react';

const nodeTypes = {
  editableRectangle: EditableRectangleNode,
  editableDiamond: EditableDiamondNode,
};

const CanvasPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [isDraggingNode, setIsDraggingNode] = useState(false);

  const toolbar_classname = theme.palette.mode === 'light'
    ? 'toolbar-transparent-light'
    : 'toolbar-transparent-dark';

  const [nodeId, setNodeId] = useState(2); // start from 2 since node-1 exists initially
  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  };
  const [nodes, setNodes] = useState([
    {
      id: 'node-1',
      type: 'editableRectangle',
      position: { x: 100, y: 150 },
      data: {
        title: '',
        description: '',
        link: '',
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
                      deleteNode: handleDeleteNode,
                    },
                  }
                : node
            )
          );
        },
        deleteNode: handleDeleteNode,
      },
      resizable: true,
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) =>
      applyNodeChanges(changes, nds).map((node) => {
        if (node.width && node.height) {
          return {
            ...node,
            style: {
              ...node.style,
              width: node.width,
              height: node.height,
            },
          };
        }
        return node;
      })
    );
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
                deleteNode: handleDeleteNode,
              },
              style: {
                ...node.style,
                width: newData.width || node.style?.width,
                height: newData.height || node.style?.height,
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
        link: '',
        updateNode,
        deleteNode: handleDeleteNode,
      },
      style: {
        width: 250,
        height: 100,
      },
      resizable: true,
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes, updateNode, handleDeleteNode]);

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
        onNodeDragStart={(event, node) => {
          // Custom logic to hide description
          window.dispatchEvent(new CustomEvent('node-drag-start', { detail: { nodeId: node.id } }));
        }}
        fitView
        nodeTypes={nodeTypes}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Background variant="dots" gap={16} size={2} />
      </ReactFlow>
    </Box>
  );
};

export default CanvasPage;
