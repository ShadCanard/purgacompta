import React from 'react';
import { IconButton, Menu, MenuItem, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface ActionsMenuProps {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  editLabel?: string;
  deleteLabel?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  moreActions?: React.ReactElement<typeof MenuItem>[];
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ row, onEdit, onDelete, editLabel = 'Modifier', deleteLabel = 'Supprimer', canEdit = true, canDelete = true, moreActions }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Surcharge les onClick des MenuItem de moreActions pour fermer le menu
  const enhancedMoreActions = moreActions?.map((action, idx) => {
    if (React.isValidElement(action) && typeof (action.props as any).onClick === 'function') {
      return React.cloneElement(
        action as React.ReactElement<any>,
        {
          onClick: (e: any) => {
            handleClose();
            (action.props as any).onClick(e);
          },
          key: action.key ?? idx,
        }
      );
    }
    return action;
  });

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* More actions en premier */}
        {enhancedMoreActions?.map((action, idx) => (
          <React.Fragment key={(action as any).key ?? idx}>{action}</React.Fragment>
        ))}
        {/* Diviseur si actions principales */}
        {(!!(canEdit && onEdit) || !!(canDelete && onDelete)) && moreActions && moreActions.length > 0 && <Divider />}
        {canEdit && onEdit && <MenuItem onClick={() => { handleClose(); onEdit(row); }}>{editLabel}</MenuItem>}
        {canDelete && onDelete && <MenuItem onClick={() => { handleClose(); onDelete(row); }}>{deleteLabel}</MenuItem>}
      </Menu>
    </>
  );
};

export default ActionsMenu;
