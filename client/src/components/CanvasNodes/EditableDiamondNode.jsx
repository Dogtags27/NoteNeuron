import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import { IconButton, Menu, Dialog, DialogTitle, DialogActions, Button, Tooltip } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import './EditableRectangleNode.css'; // reuse styles

function EditableDiamondNode({ id, data, isConnectable }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState(data.link || '');
  const colorPickerRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleTitleChange = useCallback((e) => {
    data.updateNode(id, { title: e.target.value });
  }, [data, id]);

  const handleDescriptionChange = useCallback((e) => {
    data.updateNode(id, { description: e.target.value });
  }, [data, id]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    data.deleteNode?.(id);
    setConfirmOpen(false);
  };

  const handleLinkSave = () => {
    data.updateNode?.(id, { link: linkUrl });
    setShowLinkInput(false);
  };

  const handleLinkCancel = () => setShowLinkInput(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [showColorPicker]);

  const size = data.size || 140;
  const bgColor = theme.palette.mode === 'dark' ? data.darkColor || '#2e2e2e' : data.lightColor || '#f0f0f0';

  return (
    <div style={{ position: 'relative', width: size, height: size, overflow: 'visible' }}>
      <div
        className="editable-rectangle-node"
        style={{
          width: size,
          height: size,
          transform: 'rotate(45deg)',
          backgroundColor: bgColor,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          position: 'relative',
          zIndex: 0,
          isolation: 'isolate',
        }}
      >
        <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 10, transform: 'rotate(-45deg)' }}>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <Tooltip title="Change Color">
              <IconButton onClick={() => { handleMenuClose(); setShowColorPicker(true); }}>
                <PaletteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Link">
              <IconButton onClick={() => { handleMenuClose(); setShowLinkInput(true); }}>
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Node">
              <IconButton onClick={handleDeleteClick}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Menu>
        </div>

        <div style={{ position: 'absolute', top: '30%', left: '15%', width: '70%', transform: 'rotate(-45deg)', zIndex: 5 }}>
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
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div
            ref={colorPickerRef}
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-260px',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              zIndex: 1500,
              width: 'fit-content',
            }}
          >
            <div
              title="Current color"
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: bgColor,
                border: '2px solid black',
              }}
            />
            {['#ffcccc', '#ffe0b3', '#ffffcc', '#ccffcc', '#cce5ff', '#e0ccff'].map((color) => (
              <div
                key={color}
                onClick={() => {
                  const key = theme.palette.mode === 'dark' ? 'darkColor' : 'lightColor';
                  data.updateNode(id, { [key]: color });
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
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                border: '1px solid #ccc',
                position: 'relative',
              }}
            >
              <input
                type="color"
                onChange={(e) => {
                  const custom = e.target.value;
                  const key = theme.palette.mode === 'dark' ? 'darkColor' : 'lightColor';
                  data.updateNode(id, { [key]: custom });
                  setShowColorPicker(false);
                }}
                style={{
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          </div>
        )}

        {/* Link input */}
        {showLinkInput && (
          <div
            className="link-input-popup"
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-180px',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              padding: '8px',
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
              onKeyDown={(e) => e.key === 'Enter' && handleLinkSave()}
              style={{
                padding: '6px',
                borderRadius: '4px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f9f9f9',
                color: theme.palette.text.primary,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
              <Button size="small" onClick={handleLinkSave}>Save</Button>
              <Button size="small" onClick={handleLinkCancel}>Cancel</Button>
            </div>
          </div>
        )}

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
                transform: 'rotate(-45deg)',
                zIndex: 10,
              }}
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {/* Diamond vertex handles */}
      <Handle type="source" position={Position.Top} style={{ left: '50%' }} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} style={{ top: '50%' }} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} style={{ left: '50%' }} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} style={{ top: '50%' }} isConnectable={isConnectable} />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Are you sure you want to delete this node?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditableDiamondNode;
