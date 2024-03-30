import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FileOrbisIcon from '../Images/icon.png'
import CloudIcon from '@mui/icons-material/Cloud';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import StarRateIcon from '@mui/icons-material/StarRate';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import StorageIcon from '@mui/icons-material/Storage';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NewMenu from '../NewMenu/NewMenu';

const drawerWidth = 240;

function Navbar(props) 
{
  const { rootFolderId, setRootFolderId, mainFolderId, createdFolder, setCreatedFolder, window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  // activeMenuItem represents id of the selected left menu bar
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const navigate = useNavigate();
  const[newMenuItem, setNewMenuItem] = useState(false); 

  useEffect(() => {
    setActiveMenuItem(1);  
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // when the user clicks the new button, it will work
  const handleNewButtonClick = () => {
    setNewMenuItem(true);
  }

  // when the user clicks the any menu item, it will work
  const handleMenuItemClick = (index, text) => {
    setActiveMenuItem(index);
    if(text != null){
      if(text == "My FileOrbis"){
        setRootFolderId(mainFolderId);
        navigate("/"+ text + "/" + mainFolderId);
      } else {
        navigate("/" + text);
      }
    }
  };

  // left menu bar
  const drawer = (
    <div>
      {/* fileorbis icon */}
      <img 
        src={FileOrbisIcon} alt="icon" 
        style={{ width: '180px', height: '100px', cursor: 'pointer'}} 
        onClick={() => {
          setRootFolderId(mainFolderId);
          navigate("/My FileOrbis/" + mainFolderId);
          setActiveMenuItem(1);
        }} 
      />
      {/* new menu */}
      <List>
          <ListItem disablePadding>
            <ListItemButton 
               onClick={() => handleNewButtonClick()} 
            >
              <ListItemIcon>
                <AddCircleRoundedIcon fontSize='large'/>
              </ListItemIcon>
              <ListItemText primary={'New'} />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      {/* my fileorbis, recent menus */}
      <List>
        {['My FileOrbis', 'Recent'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              sx={{ 
                backgroundColor: activeMenuItem === index + 1 ? '#A9DDFF' : 'inherit',
                '&:hover': {
                  backgroundColor: activeMenuItem === index + 1 ? '#A9DDFF' : '#EEEEEE', 
                }
              }} 
              onClick={() => handleMenuItemClick(index + 1, text)}
            >
              <ListItemIcon>
                {
                    index === 0 ? <CloudIcon /> : 
                    index === 1 ? <WorkHistoryIcon /> : null
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* shared, starred, trashed menus */}
      <List>
        {['Starred', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton 
              sx={{ 
                backgroundColor: activeMenuItem === index + 3 ? '#A9DDFF' : 'inherit',
                '&:hover': {
                  backgroundColor: activeMenuItem === index + 3 ? '#A9DDFF' : '#EEEEEE', 
                }
              }} 
              onClick={() => handleMenuItemClick(index + 3, text)}
            >
              <ListItemIcon>
                {
                    index === 0 ? <StarRateIcon /> : 
                    index === 1 ? <AutoDeleteIcon /> : null
                }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* storage menu */}
      <List>
          <ListItem disablePadding>
            <ListItemButton 
              sx={{ 
                backgroundColor: activeMenuItem === 6 ? '#A9DDFF' : 'inherit',
                '&:hover': {
                  backgroundColor: activeMenuItem === 6 ? '#A9DDFF' : '#EEEEEE', 
                }
              }} 
              onClick={() => handleMenuItemClick(6, "Storage")}
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={'Storage'} />
            </ListItemButton>
          </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* top white menu */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2, 
                display: { sm: 'none' }, 
                backgroundColor: "#A9DDFF",
                '&:hover': {
                  backgroundColor: '#356FFF'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Typography variant="h6" noWrap component="div" sx={{color:'black'}}>
            FileOrbis - file system management
          </Typography>
        </Toolbar>
      </AppBar>
      {/* drawer menu */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {newMenuItem ? <NewMenu rootFolderId={rootFolderId} mainFolderId={mainFolderId} setNewMenuItem={setNewMenuItem} createdFolder={createdFolder} setCreatedFolder={setCreatedFolder} /> : null}
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
