import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { useCallback, useState } from 'react';
import './EditableRectangleNode.css';

function EditableRectangleNode({ id, data, isConnectable }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const open = Boolean(anchorEl);
  const handleTitleChange = useCallback((e) => {
    data.updateNode(id, { title: e.target.value });
  }, [data, id]);

  const handleDescriptionChange = useCallback((e) => {
    data.updateNode(id, { description: e.target.value });
  }, [data, id]);

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

  return (
    <div className="editable-rectangle-node">
      <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
        <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => { /* edit functionality later */ }}>
            <EditIcon fontSize="small" sx={{ marginRight: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { /* link functionality later */ }}>
            <LinkIcon fontSize="small" sx={{ marginRight: 1 }} /> Link
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} /> Delete
            </MenuItem>
        </Menu>
        </div>
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

export default EditableRectangleNode;
