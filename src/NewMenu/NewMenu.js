import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import './NewMenu.css'
import Button from '@mui/material/Button';
import { useState } from 'react';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import NoteAddTwoToneIcon from '@mui/icons-material/NoteAddTwoTone';
import NewFolderForm from '../NewFolderForm/NewFolderForm';
import { useEffect } from 'react';

export default function NewMenu(props) {

  const {rootFolderId, mainFolderId, setNewMenuItem, createdFolder, setCreatedFolder} = props;
  const [hovered, setHovered] = useState(null);
  const [newFolderClick, setNewFolderClick] = useState(false);
  const [fileUploadClick, setFileUploadClick] = useState(false);
 
  const handleNewFolderMenu = () => {
    setNewFolderClick(true);
  }

  const handleFileUploadMenu = () => {
    setFileUploadClick(true);
  }

  return (
    <div className="modal-new">
      <div className="modal-content-new">
            <Paper sx={{ width: 320, maxWidth: '100%' }}>
                {
                    newFolderClick ? <NewFolderForm rootFolderId={rootFolderId} mainFolderId={mainFolderId} setNewFolderClick={setNewFolderClick} setNewMenuItem={setNewMenuItem} createdFolder={createdFolder} setCreatedFolder={setCreatedFolder} /> :
                    <MenuList>
                        <MenuItem 
                        onClick={handleNewFolderMenu}
                        onMouseEnter={() => setHovered(0)}
                        onMouseLeave={() => setHovered(null)}
                        style={{backgroundColor: hovered === 0 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}>
                        <ListItemIcon>
                            <CreateNewFolderTwoToneIcon/>
                        </ListItemIcon>
                        <ListItemText>New folder</ListItemText>
                        </MenuItem>
                        <MenuItem 
                        onClick={handleFileUploadMenu}
                        onMouseEnter={() => setHovered(1)}
                        onMouseLeave={() => setHovered(null)}
                        style={{backgroundColor: hovered === 1 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}>
                        <ListItemIcon>
                            <NoteAddTwoToneIcon />
                        </ListItemIcon>
                        <ListItemText>File Upload</ListItemText>
                        </MenuItem>               
                        <div  style={{ display: 'flex', justifyContent: 'center', marginBottom: 5, marginTop: 12}}>
                            <Button
                                type="button"
                                variant="contained"
                                onClick={() => {setNewMenuItem(false);}}
                                sx={{backgroundColor: "#878787"}}
                            >
                                Cancel
                            </Button>
                        </div>
                    </MenuList> 
                }
            </Paper>
        </div>
    </div>
  );
}