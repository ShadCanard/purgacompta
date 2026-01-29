import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Autocomplete } from '@mui/material';
import { useUser, useUpdateUser } from '@/providers/UserProvider';
import { User } from '@purgacompta/common';
import { hasMinimumRole } from '@/lib/utils';

interface UpdateUserInfoModalProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

const UpdateUserInfoModal: React.FC<UpdateUserInfoModalProps> = ({ open, onClose, user: userProp }) => {
  const { user: currentUser } = useUser();
  const user = userProp ?? currentUser;
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [phone, setPhone] = useState(user?.data?.phone || '');
  const [firstName, setFirstName] = useState(user?.data?.firstName || '');
  const [lastName, setLastName] = useState(user?.data?.lastName || '');
  const [alias, setAlias] = useState(user?.data?.alias || '');
  const [role, setRole] = useState<UserRole>(user?.role || UserRole.MEMBER);
  const [tabletUsername, setTabletUsername] = useState(user?.data?.tabletUsername || '');

  // Pour garder les valeurs à jour si user change
  React.useEffect(() => {
    setPhone(user?.data?.phone || '');
    setFirstName(user?.data?.firstName || '');
    setLastName(user?.data?.lastName || '');
    setAlias(user?.data?.alias || '');
    setTabletUsername(user?.data?.tabletUsername || '');
    setRole(user?.role || UserRole.MEMBER);
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    updateUser({
      id: user.id,
      input: {
        role,
        data: {
          phone,
          firstName,
          lastName,
          alias,
          tabletUsername,
        },
      },
    }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Modifier mes informations</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Prénom"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Nom"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Alias"
            value={alias}
            onChange={e => setAlias(e.target.value)}
            fullWidth
          />
          <TextField
            label="Téléphone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Nom sur tablette"
            value={tabletUsername}
            onChange={e => setTabletUsername(e.target.value)}
            fullWidth
          />
        {(hasMinimumRole(currentUser, UserRole.ADMIN) && currentUser.id !== user?.id) && (
          <Autocomplete
            options={Object.values(UserRole).filter(r => {
              if (!currentUser) return false;
              if (currentUser.role === UserRole.OWNER) return true;
              // Ne proposer que les rôles strictement inférieurs à celui du currentUser
              const hierarchy: Record<UserRole, number> = {
                GUEST: 0,
                MEMBER: 1,
                MANAGER: 2,
                ADMIN: 3,
                OWNER: 4,
              };
              return hierarchy[r as UserRole] < hierarchy[currentUser.role as UserRole];
            })}
            value={role}
            onChange={(_, newValue) => setRole(newValue as UserRole)}
            renderInput={(params) => <TextField {...params} label="Rôle" fullWidth required />}
            disableClearable
          />
        )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={isPending}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateUserInfoModal;
