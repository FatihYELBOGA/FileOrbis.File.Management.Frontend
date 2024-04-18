import * as React from 'react';
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
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewMenu(props) {

  const {setActiveMenuItem, rootFolderId, mainFolderId, setNewMenuItem, createdFolder, setCreatedFolder} = props;
  const [hovered, setHovered] = useState(null);
  const [newFolderClick, setNewFolderClick] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
 
  const handleNewFolderMenu = () => {
    setNewFolderClick(true);
  }

  const handleFileUploadMenu = () => {
    inputRef.current.click();
  }
  
  // checks whether file name is correct or not like folder operation
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    file.name.trim();
    if(file.name.length >= 255){
      alert("the file name can not exceed 255 characters!")
      return;
    }
    if(file.name.length == 0){
      alert("the file name can not be empty!")
      return;
    }
    if(!file.name.includes("/") && 
       !file.name.includes("\\") && 
       !file.name.includes(":") &&
       !file.name.includes("*") && 
       !file.name.includes("?") && 
       !file.name.includes("<") &&
       !file.name.includes(">") && 
       !file.name.includes("|")){
      if(file != null){
        fetch("https://localhost:7043/folders/check-name-exists/?name=" + file.name + "&parentFolderId=" + rootFolderId)
        .then((res) => res.json())
        .then((res) => {
          if(res == true){
            alert("the file name: '" + file.name + "' is already exist!");
          } 
          else {
            const formData = new FormData();
            formData.append("Content", file);
            formData.append("FolderId", rootFolderId);
            fetch("https://localhost:7043/files/add", {
              method: 'POST',
              body: formData,
            })
            .then((res) => res.json())
            .then((res) => {
              if (res.id != null) {
                alert("file added succesfully");
                if(createdFolder){
                  setCreatedFolder(false);
                } else {
                  setCreatedFolder(true);
                }
              } else {
                alert(res.message);    
              }
            })
            .catch((err) => console.log(err));
            setNewMenuItem(false);
            navigate("/My FileOrbis/" + rootFolderId);
            setActiveMenuItem(1); 
          }
        })
      }
    } else {
      alert('The file name can not contain the following characters: / \\ * ? " < > |');
    }
  };

  return (
    <div className="modal-new">
      <div className="modal-content-new">
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          {
            newFolderClick 
            ? 
              <NewFolderForm setActiveMenuItem={setActiveMenuItem} rootFolderId={rootFolderId} mainFolderId={mainFolderId} setNewFolderClick={setNewFolderClick} setNewMenuItem={setNewMenuItem} createdFolder={createdFolder} setCreatedFolder={setCreatedFolder} /> 
            :
              <MenuList>
                {/* new folder list item */}
                <MenuItem 
                  onClick={handleNewFolderMenu}
                  onMouseEnter={() => setHovered(0)}
                  onMouseLeave={() => setHovered(null)}
                  style={{backgroundColor: hovered === 0 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}
                >
                  <ListItemIcon>
                    <CreateNewFolderTwoToneIcon/>
                  </ListItemIcon>
                  <ListItemText>New folder</ListItemText>
                </MenuItem>
                {/* file upload list item */}
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <MenuItem 
                  onClick={handleFileUploadMenu}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(null)}
                  style={{backgroundColor: hovered === 1 ? '#e0e0e0' : 'transparent', paddingTop: '15px', paddingBottom: '15px'}}
                >
                  <ListItemIcon>
                    <NoteAddTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText>File Upload</ListItemText>
                </MenuItem>               
                {/* Cancel button */}
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