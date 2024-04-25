import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import "./NewFolderForm.css"
import { useNavigate } from 'react-router-dom';

function NewFolderForm(props) {

  const {setActiveMenuItem, rootFolderId, setNewFolderClick, setNewMenuItem, createdFolder, setCreatedFolder} = props
  const [newFolderName, setNewFolderName] = useState("Untitled folder");
  const navigate = useNavigate();
  
  const handleChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCancelClick = () => {
    setNewFolderClick(false);
  }

  // checks whether new folder name is suitable or not
  // < 255 && > 0 character(s) && folder name exist or not && not contains invalid character(s)
  const handleOKClick = () => {
    if(newFolderName.length >= 255){
      alert("the folder name can not exceed 255 characters!")
      return;
    }
    if(newFolderName.trim().length == 0){
      alert("the folder name can not be empty!")
      return;
    }
    if(!newFolderName.includes("/") && 
       !newFolderName.includes("\\") && 
       !newFolderName.includes(":") &&
       !newFolderName.includes("*") && 
       !newFolderName.includes("?") && 
       !newFolderName.includes("<") &&
       !newFolderName.includes(">") && 
       !newFolderName.includes("|")){
        fetch("https://localhost:7043/folders/check-name-exists/?name=" + newFolderName + "&parentFolderId=" + rootFolderId)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if(res == true){
            alert("the folder name: '" + newFolderName + "' is already exist!");
          } 
          else {
            const formData = new FormData();
            formData.append("Name", newFolderName);
            formData.append("ParentFolderId", rootFolderId);
            fetch("https://localhost:7043/folders/create", {
              method: 'POST',
              body: formData,
            })
            .then((res) => res.json())
            .then((res) => {
              if (res.id != null) {
                  alert("folder created succesfully");
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
    } else {
      alert('The folder name can not contain the following characters: / \\ * ? " < > |');
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 1
          }}
        >
          {/* Rename header */}
          <Typography component="h1" variant="h5">
            New folder
          </Typography>
          {/* new name text field */}
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-folder-text"
              label="New folder"
              name="newfolder"
              autoFocus
              value={newFolderName}
              onChange={handleChange}
            />
            {/* align the buttons (Cancel and OK buttons) */}
            <Box
              noValidate
              sx={{ 
                mt: 1,
                display: 'flex',
                gap: 25, // space between butons
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              {/* Cancel button */}
              <Button
                id="cancel-button"
                type="button"
                variant="contained"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              {/* OK button */}
              <Button
                id='OK-button'
                type="button"
                variant="contained"
                onClick={handleOKClick}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default NewFolderForm;
