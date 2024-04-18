import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppBar from '@mui/material/AppBar';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import RestorePageTwoToneIcon from '@mui/icons-material/RestorePageTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

// name, owner, trashed-date, file-size, original location columns
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
     id: 'trashed-date',
    label: 'Trashed Date',
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

export default function Trash(props) {

  const {searchText, username} = props;

  // trash folders and files of the user
  const [trashFolders, setTrashFolders] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);  
  // selectedRow: represents selected row id
  const [selectedRow, setSelectedRow] = useState(null);
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  // folderOrFile: checks that it is file or folder
  const [folderOrFile, setfolderOrFile] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleRestoreClick = () => {
    alert("the parent folders can be in the trash so while file&folder is restored, be careful!");

    // delete forever the file or folder
    if(folderOrFile == 0){
      fetch('https://localhost:7043/folders/restore/' + selectedRow, {
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
      .then(
        (result) => {
          setSelectedRow(null);
          setClicked(false);
          alert("succesfully restored!");
          getTrash();
        },
        (error) => {
             console.log(error);
        }
      )
    } 
    else if(folderOrFile == 1) { 
      fetch('https://localhost:7043/files/restore/' + selectedRow, {
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
      .then(
        (result) => {
          setSelectedRow(null);
          setClicked(false);
          alert("succesfully restored!");
          getTrash();
        },
        (error) => {
             console.log(error);
        }
      )
    }
  }

  const handleDeleteForeverClick = () => {
    // delete forever the file or folder
    if(folderOrFile == 0){
      fetch('https://localhost:7043/folders/' + selectedRow, {
        method: 'DELETE'
      })
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
          setSelectedRow(null);
          setClicked(false);
          alert("folder succesfully removed!");
          getTrash();
        },
        (error) => {
             console.log(error);
        }
      )
    } 
    else if(folderOrFile == 1) { 
      fetch('https://localhost:7043/files/' + selectedRow, {
        method: 'DELETE'
      })
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
          setSelectedRow(null);
          setClicked(false);
          alert("file succesfully removed!");
          getTrash();
        },
        (error) => {
             console.log(error);
        }
      )
    }
  }

  const getTrash = () => {
    setLoading(true);
    // load trash folders
    fetch('https://localhost:7043/folders/trash/' + username)
    .then((res) => {
      if (res.status === 204) {
        // Handle 204 No Content response
        return Promise.resolve(null);
      } else {
        return res.json();
      }
    })
    .then((result) => {      
      const filteredFolders = result.filter(folder => folder.name.includes(searchText));     
      setTrashFolders(filteredFolders);
    },
    (error) => {
      console.log(error);
    });
    // load trash files
    fetch('https://localhost:7043/files/trash/' + username)
    .then((res) => {
      if (res.status === 204) {
        // Handle 204 No Content response
        return Promise.resolve(null);
      } else {
        return res.json();
      }
    })  
    .then((result) => {      
      const filteredFiles = result.filter(file => file.name.includes(searchText));     
      setTrashFiles(filteredFiles);
      setLoading(false);
    },
    (error) => {
      console.log(error);
    });
  }

  // trash folders and files will be uploaded when the trash component is called
  useEffect(() => {
    getTrash();
  }, [searchText])
  
  return (
    <div>
    <Typography sx={{fontSize: 22, display: "inline", cursor: 'pointer'}}>
      Trash
    </Typography>
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
            onClick={handleRestoreClick}
          />
          <DeleteForeverTwoToneIcon 
            sx={{cursor:'pointer'}} 
            onClick={handleDeleteForeverClick}
          />
        </Toolbar> : 
        // constant "no selected item" text 
        <Toolbar sx={{ display: 'flex', alignItems: 'center'}}>
          <span style={{cursor: 'default'}}>no selected item</span>
        </Toolbar>}
      </AppBar>
      {
        loading ?
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh', // Sayfanın tamamına yayılmasını sağlar
            }}
          >
            <CircularProgress />
          </Box>
        :
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
            {/* create the folders */}
            {trashFolders.map((folder) => {
              return (
                <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={folder.id} 
                    id={"folder - " + folder.id}  
                    onClick={() => {
                      setfolderOrFile(0);
                      // if there is not any selected row, update selectedRow and clicked, change the background color 
                      if(selectedRow == null){
                        document.getElementById("folder - " + folder.id).style.backgroundColor = "#A9DDFF";
                        setSelectedRow(folder.id);
                        setClicked(true);
                      }
                      // if selected row id not equals to folder id (meaning another row selected)
                        // find the previous selected row and remove the background color
                        // change the backgroung color of the selected row 
                        // update selectedRow and clicked
                      else {
                        if (selectedRow != folder.id){
                          if(document.getElementById("file - " + selectedRow) != null){
                            document.getElementById("file - " + selectedRow).style.backgroundColor = "";
                          } 
                          if(document.getElementById("folder - " + selectedRow) != null){
                            document.getElementById("folder - " + selectedRow).style.backgroundColor = "";
                          }
                          document.getElementById("folder - " + folder.id).style.backgroundColor = "#A9DDFF";
                          setSelectedRow(folder.id);
                          setClicked(true);
                        }
                        // if selected row id equals to folder id (meaning same row click)
                          // if selected row has background color, remove background color and update clicked = false
                          // if selected row has not backgorund color, change background color and update clicked = true 
                        else {
                          if (document.getElementById("folder - " + selectedRow).style.backgroundColor == ""){
                            document.getElementById("folder - " + folder.id).style.backgroundColor = "#A9DDFF";
                            setClicked(true);
                          } else {
                            document.getElementById("folder - " + selectedRow).style.backgroundColor = ""; 
                            setClicked(false);
                          }
                        }
                      }
                    }} 
                >
                    {/* iterate each column and create folder columns under the related column */}
                    {columns.map((column) => {
                    // name column for folder
                    if(column.id === 'name'){
                      return (
                        <TableCell 
                            key={column.id} 
                            align={column.align} 
                            sx={{cursor: 'default'}}
                        >
                          <FolderTwoToneIcon sx={{marginRight: 2}}/>
                          {folder.name}
                          {folder.starred ? <StarTwoToneIcon sx={{marginLeft: "10px"}} fontSize='small' /> : null}
                        </TableCell>
                      );
                    }
                    // owner column for folder
                    if(column.id === 'owner'){
                      return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            <AccountCircleTwoToneIcon /> me
                        </TableCell>
                      );
                    }
                    // trashed-date column for folder
                    if(column.id === 'trashed-date'){
                      const date = new Date(folder.deletedDate);
                      const day = date.getDate();
                      const month = date.toLocaleString('en-US', { month: 'short' });
                      const year = date.getFullYear();
                      const time = date.toLocaleTimeString();
                      const value = day + " " + month + " " + year + " " + time;
                      return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            {value}
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
                      var paths = folder.path.split("/");
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
            {trashFiles.map((file) => {
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
                  }}
                >
                    {/* iterate each column and create file columns under the related column like folder column */}
                    {columns.map((column) => {
                    // name column for file
                    if(column.id === 'name'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            <AttachFileIcon sx={{marginRight: 2}}/>
                            {file.name}
                            {file.starred ? <StarTwoToneIcon sx={{marginLeft: "10px"}} fontSize='small' /> : null}
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
                    // trashed-date column for file
                    if(column.id === 'trashed-date'){
                      const date = new Date(file.deletedDate);
                      const day = date.getDate();
                      const month = date.toLocaleString('en-US', { month: 'short' });
                      const year = date.getFullYear();
                      const time = date.toLocaleTimeString();
                      const value = day + " " + month + " " + year + " " + time;
                      return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            {value}
                        </TableCell>
                      );
                    }
                    // file-size column for file
                    if(column.id === 'file-size'){
                      return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                          {file.size}
                        </TableCell>
                      );
                    }
                    // original-location column for file
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
      }
    </div>
  )
}