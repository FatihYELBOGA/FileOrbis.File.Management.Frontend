import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import './Rename.css'

export default function RenameForm({ rootFolderId, folderOrFile, id, setIsEditing, renamed, setRenamed, setClicked }) {
    
  // newName: represents new file&folder name (text field)
  const [newName, setNewName] = useState("");

  // when text field value changes, it will work
  const handleChange = (event) => {
    setNewName(event.target.value);
  };

  // rename operations
  // checks whether the new file&folder name is suitable or not
  const onSubmit = () => 
  {
    if(newName.length >= 255){
      alert("file&folder name can not exceed 255 characters!")
      return;
    }
    if(newName.trim().length == 0){
      alert("file&folder name can not be empty!")
      return;
    }
    var extension = "";
    var folders_or_file = "folders";
    if(folderOrFile == 0){
      if(!newName.includes("/") && 
          !newName.includes("\\") && 
          !newName.includes(":") &&
          !newName.includes("*") && 
          !newName.includes("?") && 
          !newName.includes("<") &&
          !newName.includes(">") && 
          !newName.includes("|")){
            fetch("https://localhost:7043/folders/check-name-exists/?name=" + newName + "&parentFolderId=" + rootFolderId)
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if(res == true){
                alert("the folder name: '" + newName + "' is already exist!");
              } 
              else {
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
                    alert("folder name changed succesfully!");
                    setIsEditing(false);
                    setClicked(false);
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
              }
            })
       }
       else{
          alert('The file&folder name can not contain the following characters: / \\ * ? " < > |')
       }
    } 
    else if(folderOrFile == 1){
      folders_or_file = "files"
      fetch("https://localhost:7043/files/name/" + id)
      .then((res) => res.text())
      .then((res) => {
        var names = res.split(".");
        if(names.length > 1){
          extension = names[names.length - 1];
          if(!newName.includes("/") && 
          !newName.includes("\\") && 
          !newName.includes(":") &&
          !newName.includes("*") && 
          !newName.includes("?") && 
          !newName.includes("<") &&
          !newName.includes(">") && 
          !newName.includes("|")){
            fetch("https://localhost:7043/folders/check-name-exists/?name=" + newName + "." + extension + "&parentFolderId=" + rootFolderId)
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if(res == true){
                alert("the file name: '" + newName + "." + extension + "' is already exist!");
              } else {
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
                    alert("file name changed succesfully!");
                    setIsEditing(false);
                    setClicked(false);
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
             }
           })
          }
          else{
            alert('The file&folder name can not contain the following characters: / \\ * ? " < > |')
          }
        }
      });
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
              id="rename-text"
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
                id="OK-button"
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
