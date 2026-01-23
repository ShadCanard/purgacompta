import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
  Avatar,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Contacts as ContactsIcon,
  CurrencyExchange,
} from '@mui/icons-material';
import { signOut, useSession } from 'next-auth/react';
import { useUser } from '@/providers/UserProvider';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;


import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  requiredRole?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Annuaire', icon: <ContactsIcon />, path: '/contacts' },
  { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions', requiredRole: 'MEMBER' },
  { text: 'Comptes', icon: <AccountBalanceIcon />, path: '/accounts', requiredRole: 'MEMBER' },
  {
    text: 'Gestion',
    icon: <PeopleIcon />,
    requiredRole: 'MEMBER',
    children: [
      { text: 'Prix Groupes', icon: <CurrencyExchange />, path: '/prices', requiredRole: 'MEMBER' },
      { text: 'Membres', icon: <PeopleIcon />, path: '/members', requiredRole: 'MANAGER' },
    ],
  },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings', requiredRole: 'MANAGER', children: [
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/settings/users', requiredRole: 'MANAGER' },
    { text: 'Groupes', icon: <AccountBalanceIcon />, path: '/settings/groups', requiredRole: 'MANAGER' },
    { text: 'Objets', icon: <AssessmentIcon />, path: '/settings/items', requiredRole: 'MANAGER' },
    { text: 'Rôles & Permissions', icon: <SettingsIcon />, path: '/settings/roles', requiredRole: 'ADMIN' },
    { text: 'Logs', icon: <AssessmentIcon />, path: '/settings/logs', requiredRole: 'ADMIN' },
  ] },
];

const roleColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  GUEST: 'default',
  MEMBER: 'info',
  MANAGER: 'warning',
  ADMIN: 'error',
  OWNER: 'secondary',
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();
  const { user, hasPermission } = useUser();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  const roleHierarchy: Record<string, number> = {
    GUEST: 0,
    MEMBER: 1,
    MANAGER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  const canAccessMenuItem = (item: MenuItem): boolean => {
    if (!item.requiredRole) return true;
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[item.requiredRole];
  };

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;


  // Gestion de l'ouverture des sous-menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleToggleMenu = (text: string) => {
    setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  // Rendu récursif des menus
  const renderMenuItems = (items: MenuItem[], depth = 0) =>
    items.map((item) => {
      const isAccessible = canAccessMenuItem(item);
      if (!isAccessible) return null;
      const isActive = item.path && router.pathname === item.path;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.text] || false;

      return (
        <React.Fragment key={item.text}>
          <ListItem disablePadding sx={{ display: 'block', mb: 0.5, pl: depth * 2 }}>
            <ListItemButton
              onClick={() => {
                if (hasChildren) {
                  handleToggleMenu(item.text);
                } else if (item.path) {
                  handleNavigation(item.path);
                }
              }}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'initial',
                px: 2.5,
                mx: 1,
                borderRadius: 2,
                backgroundColor: isActive ? 'rgba(156, 39, 176, 0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: 'center',
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'text.primary',
                    },
                  }}
                />
              )}
              {hasChildren && !collapsed && (isOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          {hasChildren && !collapsed && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderMenuItems(item.children!, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          borderRight: '1px solid rgba(156, 39, 176, 0.3)',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #9c27b0, #ff5722)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🔥 Purgatory
          </Typography>
        )}
        <IconButton onClick={onToggle} size="small">
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(156, 39, 176, 0.2)' }} />

      {/* User Info */}
      {session?.user && (
        <Box sx={{ p: collapsed ? 1 : 2, textAlign: 'center' }}>
          <Avatar
            src={user?.avatar || undefined}
            alt={user?.name || 'User'}
            sx={{
              width: collapsed ? 40 : 64,
              height: collapsed ? 40 : 64,
              mx: 'auto',
              mb: collapsed ? 0 : 1,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          />
          {!collapsed && (
            <>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name}
              </Typography>
              {user && (
                <Chip
                  label={user.role}
                  size="small"
                  color={roleColors[user.role] || 'default'}
                  sx={{ mt: 0.5 }}
                />
              )}
            </>
          )}
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(156, 39, 176, 0.2)' }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {renderMenuItems(menuItems)}
      </List>

      <Divider sx={{ borderColor: 'rgba(156, 39, 176, 0.2)' }} />

      {/* Logout */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
              mx: 1,
              mb: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: 'center',
                color: 'error.main',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Déconnexion"
                sx={{ '& .MuiTypography-root': { color: 'error.main' } }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>

      {/* Version frontend */}
      {!collapsed && (
        <Box sx={{ textAlign: 'center', py: 1, opacity: 0.6 }}>
          <Typography variant="caption">
            v{process.env.NEXT_PUBLIC_FRONTEND_VERSION}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
