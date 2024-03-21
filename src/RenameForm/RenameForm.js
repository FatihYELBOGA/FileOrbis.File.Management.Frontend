import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import './Rename.css'

function FolderRenameForm({ folderOrFile, id, setIsEditing, renamed, setRenamed }) {
    
  // newName: represents new file&folder name (text field)
  const [newName, setNewName] = useState("");

  // when text field value changes, it will work
  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  const onSubmit = () => 
  {
    // checks whether newName created with space character(s) or not
    if(newName.trim().length != 0){
      // checks that the file or folder will change
      var folders_or_file = "folders";
      if(folderOrFile == 1){
        folders_or_file = "files"
      }
      // rename file&folder request
      fetch("https://localhost:7043/" + folders_or_file + "/rename/" + id + "?name=" + newName, {
       method: 'PUT'
      })
      .then((res) => {
        if (res.status === 204) {
          // Handle 204 No Content response
          return Promise.resolve(null);
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if(res !== null){
          // display the successful message
          // close the editing form (setIsEditing) and render the page (setRenamed)
          if(folderOrFile == 0){
            alert("folder name changed succesfully!");
          } else {
            alert("file name changed succesfully!");
          }
          setIsEditing(false);
          if(renamed){
            setRenamed(false);
          } else {
            setRenamed(true);
          }
        }
      }, 
      (error) => {
        console.log(error);
      })
    } else {
        alert("invalid new name");
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
            Rename
          </Typography>
          {/* new name text field */}
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="rename"
              label="New name"
              name="rename"
              autoFocus
              value={newName}
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
                onClick={() => {setIsEditing(false);}}
              >
                Cancel
              </Button>
              {/* OK button */}
              <Button
                type="button"
                variant="contained"
                onClick={onSubmit}
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

export default FolderRenameForm;
