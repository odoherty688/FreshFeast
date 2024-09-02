import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import logo from '../FreshFeast.png'
import theme from './Theme';
import { Link, useLocation } from 'react-router-dom';  // Import Link from react-router-dom
import { Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';

const drawerWidth = 240;

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
//   open?: boolean;
// }>(({ theme, open }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   transition: theme.transitions.create('margin', {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
// }));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const NavBar = () => {
  const [open, setOpen] = React.useState(false);
  const { logout } = useAuth0();
  const location = useLocation(); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    logout({ logoutParams: { returnTo: window.location.origin + '/login'} })
  }

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} theme={theme}>
        <Toolbar>
          <IconButton
            color="inherit"
            data-testid="navigation-drawer-button"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center', 
            flexGrow: 1, 
            }}
          >
            <img src={logo} width={200} height={115} alt='logo'/>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem data-testid='user-information-button' key={'UserInformation'} component={Link} to="/user" onClick={handleDrawerClose} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PermIdentityOutlinedIcon /> 
              </ListItemIcon>
              <ListItemText primary={
                <Typography color={theme.palette.secondary.contrastText}>
                  Your Account
                </Typography>
              } />
            </ListItemButton>
          </ListItem>
        </List>
        <List>
            <ListItem data-testid='home-button' key={'Home'} component={Link} to="/" onClick={handleDrawerClose} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HomeRoundedIcon /> 
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Home
                  </Typography>
                } />
              </ListItemButton>
            </ListItem>
            <ListItem data-testid='favourites-button' key={'Favourites'} component={Link} to="/favourites" onClick={handleDrawerClose} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FavoriteRoundedIcon /> 
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Favourites
                  </Typography>
                } />
              </ListItemButton>
            </ListItem>
            <ListItem data-testid='search-button' key={'Search'} component={Link} to="/search" onClick={handleDrawerClose} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SearchRoundedIcon /> 
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Search
                  </Typography>
                } />
              </ListItemButton>
            </ListItem>
            <ListItem data-testid='calendar-button' key={'Calendar'} component={Link} to="/calendar" onClick={handleDrawerClose} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CalendarTodayIcon /> 
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Calendar
                  </Typography>
                } />
              </ListItemButton>
            </ListItem>
            <ListItem data-testid='restaurants-button' key={'Restaurants'} component={Link} to="/restaurants" onClick={handleDrawerClose} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PlaceRoundedIcon /> 
                </ListItemIcon>
                <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Restaurants
                  </Typography>
                } />
              </ListItemButton>
            </ListItem>
        </List>
        <List>
          <ListItem data-testid='logout-button' key={'Logout'} onClick={handleLogout} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary={
                  <Typography color={theme.palette.secondary.contrastText}>
                    Logout
                  </Typography>
                } />
          </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      </Box>
      );
}

export default NavBar;