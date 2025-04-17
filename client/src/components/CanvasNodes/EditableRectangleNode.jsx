import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import { IconButton, Menu, Dialog, DialogTitle, DialogActions, Button, Tooltip } from '@mui/material';
import { Handle, Position, NodeResizeControl } from 'reactflow';
import { useCallback, useState, useRef, useEffect } from 'react';
import './EditableRectangleNode.css';
import { useTheme } from '@mui/material/styles';

function EditableRectangleNode({ id, data, isConnectable }) {

    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [linkUrl, setLinkUrl] = useState(data.link || '');
    const colorPickerRef = useRef(null);
    const open = Boolean(anchorEl);
    const [hovered, setHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [fadeDescription, setFadeDescription] = useState(false);
    const hoverTimeoutRef = useRef(null);
    const isEditingRef = useRef(false);

  const handleTitleChange = useCallback((e) => {
    data.updateNode(id, { title: e.target.value });
  }, [data, id]);

  const handleDescriptionChange = useCallback((e) => {
    data.updateNode(id, { description: e.target.value });
  }, [data, id]);

  const handleLinkClick = () => {
    setShowLinkInput(true);
    handleMenuClose(); // Close minibar
  };
  
  const handleLinkSave = () => {
    if (data.updateNode) {
      data.updateNode(id, { link: linkUrl });
    }
    setShowLinkInput(false);
  };
  
  const handleLinkCancel = () => {
    setShowLinkInput(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };
  
  const handleConfirmDelete = () => {
    if (data && data.deleteNode) {
      data.deleteNode(id);
    }
    setConfirmOpen(false);
  };

  const startHoverTimer = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isEditingRef.current) {
        setFadeDescription(true);
      }
    }, 5000);
  };
  
  const clearHoverTimer = () => {
    clearTimeout(hoverTimeoutRef.current);
    setFadeDescription(false);
  };
  
  const handleMouseEnter = () => {
    setShowDescription(true);
    clearHoverTimer();
    startHoverTimer();
  };
  
  const handleMouseLeave = () => {
    clearHoverTimer();
    if (!isEditingRef.current) {
      setFadeDescription(true); // start fade on leave
      setTimeout(() => setShowDescription(false), 300); // hide after fade-out
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showColorPicker &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setShowColorPicker(false);
      }
    };
  
    // Use capture phase to catch events before React Flow or MUI stop them
    document.addEventListener('mousedown', handleClickOutside, true);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showColorPicker]);

  useEffect(() => {
    const handleGlobalDragStart = (e) => {
      if (e.detail.nodeId === id) {
        setFadeDescription(true);
        setShowDescription(false); // 💥 immediate hide
        clearHoverTimer();
      }
    };
  
    window.addEventListener('node-drag-start', handleGlobalDragStart);
    return () => {
      window.removeEventListener('node-drag-start', handleGlobalDragStart);
    };
  }, [id]);

  return (
    
    <div className="editable-rectangle-node react-flow__node-resize" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => {
        setIsDragging(true);
        clearHoverTimer();
        if (!isEditingRef.current) {
            setFadeDescription(true); // Start fading
            setTimeout(() => setShowDescription(false), 300); // Hide after fade
        }
        
        }}

        onMouseUp={() => {
        setIsDragging(false);
        if (!isEditingRef.current) startHoverTimer();
        }}
        style={{
            position: 'relative',
            width: data.width || 250,
            height: data.height || 150,
            overflow: 'visible',
            backgroundColor: theme.palette.mode === 'dark' ? data.darkColor || '#2e2e2e' : data.lightColor || '#f0f0f0',
            zIndex: 0,
            isolation: 'isolate', 
      }}
    >
        <NodeResizeControl
            style={{
                background: 'transparent',
                border: 'none',
            }}
            minWidth={100}
            minHeight={80}
            onResize={(event, params) => {
                data.updateNode(id, { width: params.width, height: params.height });
            }}
        />
      <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
        <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            >
            <Tooltip title="Change Color">
            <IconButton onClick={() => {
                handleMenuClose();
                setShowColorPicker(true); // open the color picker popup
            }}>
                <PaletteIcon fontSize="small" />
            </IconButton>
            </Tooltip>

            <Tooltip title="Add Link">
            <IconButton  
                onClick={() => {
                    handleMenuClose(); // close the menu
                    setShowLinkInput(true); // show the floating link box
                }}
            >
                <LinkIcon fontSize="small" />
            </IconButton>
            </Tooltip>

            <Tooltip title="Delete Node">
            <IconButton onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            </Tooltip>
        </Menu>
        {showLinkInput && (
            <div
                className="link-input-popup"
                style={{
                position: 'absolute',
                backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: '200px',
                }}
            >
                <input
                type="text"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSave();}}
                style={{
                    padding: '6px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f9f9f9',
                    color: theme.palette.text.primary,
                }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                <Button
                    size="small"
                    variant="text"
                    onClick={handleLinkSave}
                    sx={{ minWidth: '40px', padding: '2px 6px' }}
                >
                    Save
                </Button>
                <Button
                    size="small"
                    variant="text"
                    onClick={handleLinkCancel}
                    sx={{ minWidth: '40px', padding: '2px 6px' }}
                >
                    Cancel
                </Button>
                </div>
            </div>
            )}
            {showColorPicker && (
  <div
    ref={colorPickerRef}
    style={{
      position: 'absolute',
      top: '-50px',
      right: '-250px',
      backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
      zIndex: 1500,
      width: 'fit-content',
      pointerEvents: 'auto',
    }}
  >
    {/* Show current color */}
    <div
      title="Current color"
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: theme.palette.mode === 'dark' ? data.darkColor : data.lightColor,
        border: '2px solid black',
        cursor: 'default',
      }}
    />

    {/* Predefined colors */}
    {['#ffcccc', '#ffe0b3', '#ffffcc', '#ccffcc', '#cce5ff', '#e0ccff'].map((color) => (
      <div
        key={color}
        onClick={() => {
          const themeKey = theme.palette.mode === 'dark' ? 'darkColor' : 'lightColor';
          data.updateNode(id, { [themeKey]: color });
          setShowColorPicker(false);
        }}
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: color,
          cursor: 'pointer',
          border: '1px solid #ccc',
        }}
      />
    ))}

    {/* Custom color circle with hidden color input */}
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
        border: '1px solid #ccc',
        cursor: 'pointer',
        position: 'relative',
      }}
      title="Pick a custom color"
    >
      <input
        type="color"
        onChange={(e) => {
          const customColor = e.target.value;
          const themeKey = theme.palette.mode === 'dark' ? 'darkColor' : 'lightColor';
          data.updateNode(id, { [themeKey]: customColor });
          setShowColorPicker(false);
        }}
        style={{
          opacity: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  </div>
)}
        </div>
        
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable={isConnectable}
        style={{ background: '#555' }}
        />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        isConnectable={isConnectable}
        style={{ background: '#555' }}
        />
      <input
        className="nodrag node-title"
        type="text"
        placeholder="Title"
        value={data.title}
        onChange={handleTitleChange}
      />
      {showDescription && (
        <div
            className={`description-popup ${fadeDescription ? 'fade' : ''}`}
            style={{
            position: 'absolute',
            top: 0,
            left: '100%',
            marginLeft: 0,
            minWidth: 200,
            maxWidth: 300,
            backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#fff',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 1000,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: fadeDescription ? 'translateX(10px)' : 'translateX(0)',
            opacity: fadeDescription ? 0 : 1,
            }}
        >
            <textarea
            value={data.description || ''}
            onChange={(e) => {
                isEditingRef.current = true;
                handleDescriptionChange(e);
                setFadeDescription(false);
                clearHoverTimer();
            }}
            onBlur={() => {
                isEditingRef.current = false;
                if (showDescription) startHoverTimer();
            }}
            onFocus={() => {
                isEditingRef.current = true;
                clearHoverTimer();
            }}
            placeholder="Describe this node"
            style={{
                width: '100%',
                minHeight: '20px',
                border: 'none',
                resize: 'none',
                background: 'transparent',
                outline: 'none',
                color: theme.palette.text.primary,
                fontFamily: 'inherit',
                fontSize: '14px',
            }}
            />
        </div>
        )}

      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        isConnectable={isConnectable}
        style={{ background: '#555' }}
        />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable={isConnectable}
        style={{ background: '#555' }}
        />
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Are you sure you want to delete this node?</DialogTitle>
            <DialogActions>
                <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
        {data.link && (
        <Tooltip title="Open Link">
            <IconButton
            size="small"
            onClick={() => window.open(data.link, '_blank')}
            style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#eee',
                zIndex: 10,
            }}
            >
            <LinkIcon fontSize="small" />
            </IconButton>
        </Tooltip>
        )}
        <Handle
            type="target"
            position={Position.Left}
            id="left-target"
            style={{ background: '#555' }}
            />
        <Handle
            type="source"
            position={Position.Left}
            id="left-source"
            style={{ background: '#555' }}
        />
        <Handle
            type="target"
            position={Position.Right}
            id="right-target"
            style={{ background: '#555' }}
        />
        <Handle
            type="source"
            position={Position.Right}
            id="right-source"
            style={{ background: '#555' }}
        />
    </div>
  );
}

export default EditableRectangleNode;
