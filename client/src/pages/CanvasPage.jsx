import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { ReactFlow, Background, addEdge, applyNodeChanges, useEdgesState, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Canvas.css';
import { useTheme } from '@mui/material/styles';
import EditableRectangleNode from '../components/CanvasNodes/EditableRectangleNode';
import EditableDiamondNode from '../components/CanvasNodes/EditableDiamondNode';
import '../components/CanvasNodes/EditableRectangleNode.css';
import { useCallback, useState, useEffect } from 'react';

const nodeTypes = {
  editableRectangle: EditableRectangleNode,
  editableDiamond: EditableDiamondNode,
};

const CanvasPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
        darkColor: '#cce5ff',
        lightColor: '#cce5ff',
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
    const colors = ['#ffcccc', '#ffe0b3', '#ffffcc', '#ccffcc', '#cce5ff', '#e0ccff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
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
        darkColor: randomColor,
        lightColor: randomColor,
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Box sx={{ height: '86vh', width: '98vw', position: 'relative',overflow: 'hidden' }}>
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
      <ReactFlowProvider>
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
          style={{ height: '100%', width: '100%' }}
        >
          <Background variant="dots" gap={16} size={2} />
          {/* Optional: Add zoom and fit view controls */}
          <Controls position="top-left" />
          {/* Optional: Add a minimap to navigate the graph */}
          <MiniMap
            style={{
              right: 0,
              bottom: 0,
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8,
              padding: 4,
            }}
            nodeColor={(node) => node.data?.darkColor || node.data?.lightColor || '#999'}
            nodeStrokeColor={(node) => '#555'} // optional: change stroke color
            nodeBorderRadius={6}
            nodeStrokeWidth={3}
          />
        </ReactFlow>
      </ReactFlowProvider>
      <div
        style={{
          position: 'fixed',
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#99ccff',
          boxShadow: '0 0 12px 4px #0077ff',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </Box>
  );
};

export default CanvasPage;
