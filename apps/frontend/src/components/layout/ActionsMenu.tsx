import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface ActionsMenuProps {
  row: any;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  editLabel?: string;
  deleteLabel?: string;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ row, onEdit, onDelete, editLabel = 'Modifier', deleteLabel = 'Supprimer' }) => {
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
        <MenuItem onClick={() => { handleClose(); onEdit(row); }}>{editLabel}</MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(row); }}>{deleteLabel}</MenuItem>
      </Menu>
    </>
  );
};

export default ActionsMenu;
