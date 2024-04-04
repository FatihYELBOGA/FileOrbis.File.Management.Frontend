import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppBar from '@mui/material/AppBar';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import RestorePageTwoToneIcon from '@mui/icons-material/RestorePageTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { useNavigate } from 'react-router-dom';

// name, owner, last-modified, file-size, original locations columns
const columns = [
    { id: 'name', label: 'Name', minWidth: 450 },
    {
      id: 'owner',
      label: 'Owner',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'file-size',
      label: 'File size',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'original-location',
      label: 'Original Location',
      minWidth: 170,
      align: 'left',
      format: (value) => value.toLocaleString('en-US'),
    }
  ];

export default function Recent(props){

  const [recentFiles, setRecentFiles] = useState([]);

  
  const { userId, rootFolderId, setRootFolderId, mainFolderId, createdFolder } = props;
  // use navigate
  const navigate = useNavigate();
  // selectedRow: represents selected row id
  const [selectedRow, setSelectedRow] = useState(null);
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  // isEditing: checks that editing form is open or closed
  const [isEditing, setIsEditing] = useState(false);
  // folderOrFile: checks that it is file or folder
  const [folderOrFile, setfolderOrFile] = useState(null);
  // renamed: when the file&folder name changed, it is changing to bring current file&folder of the root folder
  const [renamed, setRenamed] = useState(false); 

  const getRecents = () => {
    // load favorites folders
    fetch('https://localhost:7043/files/recent/' + userId)
    .then((res) => {
      if (res.status === 204) {
        // Handle 204 No Content response
        return Promise.resolve(null);
      } else {
        return res.json();
      }
    })
  .then(
      (result) => {
        setRecentFiles(result);
      },
      (error) => {
        console.log(error);
      }
  );
  }

  // favorite folders and files will be uploaded when the trash component is called
  useEffect(() => {
    getRecents();
  }, [])

  return (
    <div>
      {/* 
        when the user clicks the any row, this bar that includes folder&file operations will be displayed to the user
        if the user does not select any row, "no selected item" will be displayed 
       */}
      <AppBar
        position='relative'
        sx={{
          width: { sm: `calc(100%)` },
          height: 40,
          backgroundColor: "#EEEEEE",
          borderRadius: 10,
          marginTop: '15px',
          color: "black",
          justifyContent: 'center', 
        }}
      >   
      {clicked ? 
        <Toolbar sx={{ display: 'flex', alignItems: 'center'}}>
          <CloseTwoToneIcon 
            sx={{cursor:'pointer', marginRight: '10px' }} 
            // clicked = false, selectedRow = null
            // if there is any selected row (it can be folder or file), remove the background color
            onClick={()=>{
              setClicked(false);
              setSelectedRow(null);
              if(document.getElementById("folder - " + selectedRow) != null){
                document.getElementById("folder - " + selectedRow).style.backgroundColor = "";
              }
              if(document.getElementById("file - " + selectedRow) != null){
                document.getElementById("file - " + selectedRow).style.backgroundColor = "";
              }
            }}
          />  
          <span style={{cursor: 'default'}}>1 selected</span>
          <RestorePageTwoToneIcon 
            sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
          />
          <DeleteForeverTwoToneIcon 
            sx={{cursor:'pointer'}} 
          />
        </Toolbar> : 
        // constant "no selected item" text 
        <Toolbar sx={{ display: 'flex', alignItems: 'center'}}>
          <span style={{cursor: 'default'}}>no selected item</span>
        </Toolbar>}
      </AppBar>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "25px" }}>
        <TableContainer sx={{ maxHeight: 480 }}>
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
            <TableRow>
                {/* create the columns */}
                {columns.map((column) => (
                <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{fontWeight: 'bold'}}
                >
                    {column.label}
                </TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {recentFiles.map((file) => {
                return (
                <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={file.id}
                    id={"file - " + file.id}  
                    onClick={() => {                      
                      setfolderOrFile(1);
                      // if there is not any selected row, update selectedRow and clicked, change the background color 
                      if(selectedRow == null){
                        document.getElementById("file - " + file.id).style.backgroundColor = "#A9DDFF";
                        setSelectedRow(file.id);
                        setClicked(true);
                      } 
                      // if selected row id not equals to folder id (meaning another row selected)
                        // find the previous selected row and remove the background color
                        // change the backgroung color of the selected row 
                        // update selectedRow and clicked
                      else {
                        if (selectedRow != file.id){
                          if(document.getElementById("folder - " + selectedRow) != null){
                            document.getElementById("folder - " + selectedRow).style.backgroundColor = "";
                          } 
                          if(document.getElementById("file - " + selectedRow) != null){
                            document.getElementById("file - " + selectedRow).style.backgroundColor = "";
                          }
                          document.getElementById("file - " + file.id).style.backgroundColor = "#A9DDFF";
                          setSelectedRow(file.id);
                          setClicked(true);
                        } 
                        // if selected row id equals to folder id (meaning same row click)
                          // if selected row has background color, remove background color and update clicked = false
                          // if selected row has not backgorund color, change background color and update clicked = true 
                        else {
                          if (document.getElementById("file - " + selectedRow).style.backgroundColor == ""){
                            document.getElementById("file - " + file.id).style.backgroundColor = "#A9DDFF";
                            setClicked(true);
                          } else {
                            document.getElementById("file - " + selectedRow).style.backgroundColor = ""; 
                            setClicked(false);
                          }
                        }
                      }
                    } }
                >
                    {/* iterate each column and create file columns under the related column like folder column */}
                    {columns.map((column) => {
                    // name column for file
                    if(column.id === 'name'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            <AttachFileIcon sx={{marginRight: 2}}/>
                            {file.name}
                        </TableCell>
                        );
                    }
                    // owner column for file
                    if(column.id === 'owner'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            <AccountCircleTwoToneIcon /> me
                        </TableCell>
                        );
                    }
                    // file-size column for folder
                    if(column.id === 'file-size'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                          -
                        </TableCell>
                        );
                    }
                    // file-size column for folder
                    if(column.id === 'original-location'){
                        var counter = 0;
                        var paths = file.path.split("/");
                        var newPath = "My FileOrbis"
                        for(let i=0; i<paths.length-1 ;i++){
                          if(i != 0){
                            newPath = newPath + "/" + paths[counter+1];
                            counter++;
                          }
                        }
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                          {newPath}
                        </TableCell>
                        );
                      }
                    })}
                </TableRow>
                );
              })}
            </TableBody>
        </Table>
        </TableContainer>
    </Paper>
    </div>
  )
}
