import { useParams } from 'react-router-dom';
import { Box,Tooltip } from '@mui/material';
import { ReactFlow, Background, addEdge, applyNodeChanges, useEdgesState, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/Canvas.css';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import DeleteIcon from '@mui/icons-material/Delete';
import EditableRectangleNode from '../components/CanvasNodes/EditableRectangleNode';
import EditableNodeWrapper from '../components/NewCanvasNodes/EditableNodeWrapper';
import AnimatedGradientEdge from '../components/CanvasNodes/CustomEdges/AnimatedGradientEdge';
import '../components/CanvasNodes/EditableRectangleNode.css';
import { useCallback, useState, useEffect } from 'react';
import { renderShape } from '../components/NewCanvasNodes/shapeUtils';
import { Button } from '@mui/material'
import CropSquareIcon from '@mui/icons-material/CropSquare';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HexagonIcon from '@mui/icons-material/Hexagon';
import CloudIcon from '@mui/icons-material/Cloud';
import TerminalIcon from '@mui/icons-material/Terminal';

const nodeTypes = {
  // editableRectangle: EditableRectangleNode,
  editableNode: EditableNodeWrapper,
};

const edgeTypes = {
  animatedGradient: AnimatedGradientEdge,
};

const CanvasPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const iconColor = theme.palette.mode === 'dark' ? 'black' : 'black';
  const [labelInput, setLabelInput] = useState('');
  const [isLabelEditing, setIsLabelEditing] = useState(false);

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [edgeClickPosition, setEdgeClickPosition] = useState({ x: 0, y: 0 });

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
      type: 'editableNode',
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
  
  const buttonStyle = {
    m: 0.5,
    px: 1.5,
    py: 1,
    borderRadius: '10px',
    background: isDarkMode
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.04)',
    color: isDarkMode ? '#fff' : '#111',
    backdropFilter: 'blur(8px)',
    border: isDarkMode
      ? '1px solid rgba(255,255,255,0.2)'
      : '1px solid rgba(0,0,0,0.1)',
    boxShadow: isDarkMode
      ? '0 2px 6px rgba(0,0,0,0.6)'
      : '0 2px 6px rgba(0,0,0,0.2)',
    fontSize: '0.85rem',
    textTransform: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: isDarkMode
        ? 'rgba(255,255,255,0.15)'
        : 'rgba(0,0,0,0.08)',
      boxShadow: isDarkMode
        ? '0 4px 10px rgba(0,0,0,0.7)'
        : '0 4px 10px rgba(0,0,0,0.3)',
    },
    '&:active': {
      boxShadow: isDarkMode
        ? 'inset 0 2px 6px rgba(255,255,255,0.15)'
        : 'inset 0 2px 6px rgba(0,0,0,0.2)',
      transform: 'translateY(1px)',
    },
  };
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

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  // const handleAddRectangle = useCallback(() => {
  //   const colors = ['#ffcccc', '#ffe0b3', '#ffffcc', '#ccffcc', '#cce5ff', '#e0ccff'];
  //   const randomColor = colors[Math.floor(Math.random() * colors.length)];
  //   const newNode = {
  //     id: `node-${nodeId}`,
  //     type: 'editableRectangle',
  //     position: {
  //       x: Math.random() * 600,
  //       y: Math.random() * 400,
  //     },
  //     data: {
  //       title: '',
  //       description: '',
  //       link: '',
  //       updateNode,
  //       deleteNode: handleDeleteNode,
  //       darkColor: randomColor,
  //       lightColor: randomColor,
  //     },
  //     style: {
  //       width: 250,
  //       height: 100,
  //     },
  //     resizable: true,
  //   };
  //   setNodes((nds) => [...nds, newNode]);
  //   setNodeId((id) => id + 1);
  // }, [nodeId, setNodes, updateNode, handleDeleteNode]);

  const handleAddEditableNode = useCallback((shapeType = 'trapezium') => {
    const colors = ['#ffcccc', '#ffe0b3', '#ffffcc', '#ccffcc', '#cce5ff', '#e0ccff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNode = {
      id: `node-${nodeId}`,
      type: 'editableNode',
      shapeType: shapeType,
      position: {
        x: Math.random() * 600,
        y: Math.random() * 400,
      },
      data: {
        title: '',
        description: '',
        link: '',
        shapeType: shapeType,
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

  const handleDeleteEdge = (edgeId) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const handleAddLabel = (edgeId, newLabel) => {
    const labelColor = isDarkMode ? 'white' : 'black';
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, label: newLabel || 'Label', labelColor: labelColor, } }
          : edge
      )
    );
    setIsLabelEditing(false); // ✅ close toolbar after adding label
    setLabelInput('');        // optional: clear input field
    setSelectedEdge(null);    // optional: deselect edge after editing
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isLabelEditing && !e.target.closest('.label-input-box')) {
        setIsLabelEditing(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLabelEditing]);

  return (
    <Box sx={{ height: '86vh', width: '98vw', position: 'relative',overflow: 'hidden' }}>
      {/* Floating Toolbar */}
      <div className={toolbar_classname}>
      <Button onClick={() => handleAddEditableNode('rectangle')} startIcon={<CropSquareIcon />} sx={buttonStyle}>Rectangle</Button>
      <Button onClick={() => handleAddEditableNode('diamond')} startIcon={<ChangeHistoryIcon />} sx={buttonStyle}>Diamond</Button>
      <Button onClick={() => handleAddEditableNode('parallelogram')} startIcon={<DataObjectIcon />} sx={buttonStyle}>Data Node</Button>
      <Button onClick={() => handleAddEditableNode('cylinder-vertical')} startIcon={<StorageIcon />} sx={buttonStyle}>Database</Button>
      <Button onClick={() => handleAddEditableNode('cylinder-horizontal')} startIcon={<SwapVertIcon />} sx={buttonStyle}>Queue</Button>
      <Button onClick={() => handleAddEditableNode('ellipse')} startIcon={<RadioButtonUncheckedIcon />} sx={buttonStyle}>Ellipse</Button>
      <Button onClick={() => handleAddEditableNode('arrowhead-right')} startIcon={<ArrowForwardIcon />} sx={buttonStyle}>Arrowhead</Button>
      <Button onClick={() => handleAddEditableNode('hexagon')} startIcon={<HexagonIcon />} sx={buttonStyle}>Hexagon</Button>
      <Button onClick={() => handleAddEditableNode('cloud')} startIcon={<CloudIcon />} sx={buttonStyle}>Cloud</Button>
      <Button onClick={() => handleAddEditableNode('terminal-icon')} startIcon={<TerminalIcon />} sx={buttonStyle}>Terminal</Button>
    </div>
      <ReactFlowProvider>
        {/* Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={(event, edge) => {
            const bounds = event.target.getBoundingClientRect();
            setEdgeClickPosition({ x: event.clientX, y: event.clientY });
            setSelectedEdge(edge);
            event.stopPropagation();
          }}
          onConnect={(params) => {
            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            const newEdge = {
              ...params,
              id: `edge-${params.source}-${params.target}-${Date.now()}`, // ensures uniqueness
              type: 'animatedGradient',
              data: {
                sourceColor: sourceNode?.data?.darkColor || '#000',
                targetColor: targetNode?.data?.darkColor || '#000',
              },
            };

            setEdges((eds) => addEdge(newEdge, eds));
          }}
          onNodeDragStart={(event, node) => {
            // Custom logic to hide description
            window.dispatchEvent(new CustomEvent('node-drag-start', { detail: { nodeId: node.id } }));
          }}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          style={{ height: '100%', width: '100%' }}
        >
          <Background variant="dots" gap={32} size={2} />
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
  nodeStrokeColor={(node) => '#555'}
  nodeBorderRadius={6}
  nodeStrokeWidth={3}
  renderNode={(node) => {
    const shapeType = node.data?.shapeType;  // Get the shape type from node data
    const width = node.width || 100;  // Set default width if not defined
    const height = node.height || 100; // Set default height if not defined
    const fill = node.data?.darkColor || node.data?.lightColor || '#999';  // Use color based on node data

    // Render the shape based on shapeType
    return (
      <svg width={width} height={height}>
        {renderShape(shapeType, { width, height, fill, borderColor: '#555' })}
      </svg>
    );
  }}
/>

        </ReactFlow>
        {selectedEdge && (
          <div
            style={{
              position: 'absolute',
              top: edgeClickPosition.y,
              left: edgeClickPosition.x,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '6px 8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              gap: '8px',
              zIndex: 999,
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing on toolbar click
          >
            {/* <Tooltip title="Edit Edge">
            <IconButton size="small" sx={{ color: iconColor }} onClick={() => console.log('Edit clicked')}>
              <EditIcon fontSize="small" />
            </IconButton>
            </Tooltip> */}
            <Tooltip title="Add Label">
              <IconButton
                size="small"
                sx={{ color: iconColor }}
                onClick={() => {
                  if (selectedEdge) {
                    setIsLabelEditing(true); // Trigger the label input box
                    setLabelInput(selectedEdge.data.label || 'Label'); // Set the current label
                  }
                }}
              >
                <LabelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Edge">
              <IconButton
                size="small"
                sx={{ color: iconColor }}
                onClick={() => {
                  if (selectedEdge) {
                    handleDeleteEdge(selectedEdge.id);
                    setSelectedEdge(null); // Deselect the edge after deletion
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {isLabelEditing && selectedEdge && (
            <div
              style={{
                position: 'absolute',
                top: edgeClickPosition.y - 30, // Slightly above the click point
                left: edgeClickPosition.x,
                transform: 'translate(-50%, 0)',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '6px 12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 999,
              }}
            >
              <input
                className="label-input-box"
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onBlur={() => {
                  handleAddLabel(selectedEdge.id, labelInput); // Update label on blur
                  setIsLabelEditing(false); // Close the input box
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLabel(selectedEdge.id, labelInput); // Update label on Enter
                    setIsLabelEditing(false); // Close the input box
                  }
                }}
                style={{
                  fontSize: '12px',
                  padding: '5px',
                  width: '120px', // A fixed width for the input box
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: isDarkMode ? '#333' : 'white', // Dark background for dark mode
                  color: isDarkMode ? 'white' : 'black', // White text for dark mode, black for light mode
                }}
              />
            </div>
          )}
      </ReactFlowProvider>
      <div
        style={{
          position: 'fixed',
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
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
