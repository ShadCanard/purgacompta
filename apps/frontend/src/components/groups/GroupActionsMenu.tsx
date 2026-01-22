import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface GroupActionsMenuProps {
  row: any;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
}

const GroupActionsMenu: React.FC<GroupActionsMenuProps> = ({ row, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); onEdit(row); }}>Modifier</MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(row); }}>Supprimer</MenuItem>
      </Menu>
    </>
  );
};

export default GroupActionsMenu;
