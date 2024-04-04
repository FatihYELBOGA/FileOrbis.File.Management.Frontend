import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import "./NewFolderForm.css"
import { useNavigate } from 'react-router-dom';

function NewFolderForm(props) {

  const {setActiveMenuItem, rootFolderId, mainFolderId, setNewFolderClick, setNewMenuItem, createdFolder, setCreatedFolder} = props
  const [newFolderName, setNewFolderName] = useState("Untitled folder");
  const navigate = useNavigate();
  
  const handleChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCancelClick = () => {
    setNewFolderClick(false);
  }

  const handleOKClick = () => {
    
    // create the formData to use in the sign in request
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
              id="newfolder"
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
                type="button"
                variant="contained"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              {/* OK button */}
              <Button
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
