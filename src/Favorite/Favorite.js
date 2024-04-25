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
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import StarBorderPurple500Icon from '@mui/icons-material/StarBorderPurple500';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

// name, owner, last-modified, file-size, original location columns
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
      id: 'last-modified',
      label: 'Last Modified',
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

export default function Favorite(props){

  const { username, searchText, userId, setRootFolderId, setDirectPath, setActiveMenuItem } = props;

  // favorite file&folders
  const [favoriteFolders, setFavoriteFolders] = useState([]);
  const [favoriteFiles, setFavoriteFiles] = useState([]);
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  // use navigate
  const navigate = useNavigate();
  // selectedRow: represents selected row id
  const [selectedRow, setSelectedRow] = useState(null);
  // folderOrFile: checks that it is file or folder (folder = 0, file = 1)
  const [folderOrFile, setfolderOrFile] = useState(null);
  // path to go 
  const [path, setPath] = useState();
  // loading bar
  const [loading, setLoading] = useState(null);
  // file&folder id: to use whether it is in the trash or not
  // it can change later because selected row doing same work
  const [fileId, setFileId] = useState(null);
  const [folderId, setFolderId] = useState(null);

  // remove starred file&folder
  // selected row, file&folder id = null and clicked = false
  const handleRemoveFavorite = () => {
    if(folderOrFile==0){
      fetch('https://localhost:7043/users/favorites/folder/' + selectedRow, {
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
          setFileId(null);
          setFolderId(null);
          setClicked(false);
          alert("the starred folder succesfully removed!");
          getFavorites();
        },
        (error) => {
             console.log(error);
        }
      )
    } 
    else if(folderOrFile==1){
      fetch('https://localhost:7043/users/favorites/file/' + selectedRow, {
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
          setFileId(null);
          setFolderId(null);
          setClicked(false);
          alert("the starred file succesfully removed!");
          getFavorites();
        },
        (error) => {
            console.log(error);
        }
      )
    }
  }

  // before go to current folder, check whether the folder or file's folder is in the trash or not
  const handleGoInto = (e) => {
    if(folderOrFile == 0){
      fetch("https://localhost:7043/users/check-folder-in-trash?folderId=" + folderId + "&username=" + username)
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
          if(result == true){
            alert("can not be navigated to the folder because the folder places in the trash!");
          }
          else{
            GoToPath();
          }
        },
        (error) => {
          console.log(error);
        }
      )
    }
    else if(folderOrFile == 1){
      fetch("https://localhost:7043/users/check-file-in-trash?fileId=" + fileId + "&username=" + username)
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
          if(result == true){
            alert("can not be navigated to the file because the file places in the trash!");
          }
          else{
            GoToPath();
          }
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  // go to current path
  // get folder id with path
  // clicked = false, direct path = path, root folder id = result's id
  // navigate to my fileorbis
  const GoToPath = () => {
    fetch('https://localhost:7043/folders/path/?path=' + path)
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
        setClicked(false);
        setRootFolderId(result.id);
        setDirectPath(path);
        navigate('/My FileOrbis/' + result.id);
        setActiveMenuItem(1);
      },
      (error) => {
         console.log(error);
      }
    )
  }

  // load favorite file&folders
  const getFavorites = () => {
    setLoading(true);
    // load favorites folders
    fetch('https://localhost:7043/users/favorites/' + userId)
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
        const filteredFolders = result.favoriteFolders.filter(folder => folder.folder.name.includes(searchText));
        setFavoriteFolders(filteredFolders);
      },
      (error) => {
        console.log(error);
      }
    );
    // load favorites files
    fetch('https://localhost:7043/users/favorites/' + userId)
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
        const filteredFiles = result.favoriteFiles.filter(file => file.file.name.includes(searchText));     
        setFavoriteFiles(filteredFiles);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // favorite file&folders will be uploaded when the search text is changed and first render is completed
  useEffect(() => {
    getFavorites();
  }, [searchText])

  return (
    <div>
      <Typography sx={{fontSize: 22, display: "inline", cursor: 'pointer'}}>
        Starred
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
            // clicked = false, selectedRow = null, file&folder id = null
            // if there is any selected row (it can be folder or file), remove the background color
            onClick={()=>{
              setClicked(false);
              setSelectedRow(null);
              setFileId(null);
              setFolderId(null);
              if(document.getElementById("folder - " + selectedRow) != null){
                document.getElementById("folder - " + selectedRow).style.backgroundColor = "";
              }
              if(document.getElementById("file - " + selectedRow) != null){
                document.getElementById("file - " + selectedRow).style.backgroundColor = "";
              }
            }}
          />  
          <span style={{cursor: 'default'}}>1 selected</span>
          <StarBorderPurple500Icon 
            id="remove-star-button"
            sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
            onClick={handleRemoveFavorite}
          />
          <ArrowCircleRightTwoToneIcon 
            id="location-button"
            sx={{cursor:'pointer'}} 
            onClick={handleGoInto}
          />
        </Toolbar> : 
        // constant "no selected item" text 
        <Toolbar sx={{ display: 'flex', alignItems: 'center'}}>
          <span style={{cursor: 'default'}}>no selected item</span>
        </Toolbar>}
      </AppBar>
      {
        loading ?
          // loading bar
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh'
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
            {favoriteFolders.map((folder) => {
              return (
                <TableRow 
                  hover 
                  role="checkbox" 
                  tabIndex={-1} 
                  key={folder.id} 
                  id={"folder - " + folder.id}  
                  onDoubleClick={() => {handleGoInto();}}
                  onClick={() => {
                    setfolderOrFile(0);                      
                    setPath(folder.folder.path);
                    // if there is not any selected row, update selectedRow and clicked, change the background color 
                    if(selectedRow == null){
                      document.getElementById("folder - " + folder.id).style.backgroundColor = "#A9DDFF";
                      setSelectedRow(folder.id);
                      setFolderId(folder.folder.id);
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
                        setFolderId(folder.folder.id);
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
                        {folder.folder.name}
                        <StarTwoToneIcon sx={{marginLeft: "10px"}} fontSize='small'/>
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
                  // last-modified column for folder
                  if(column.id === 'last-modified'){
                    const date = new Date(folder.folder.lastModifiedDate);
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
                  // original-location column for folder
                  if(column.id === 'original-location'){
                    var counter = 0;
                    var paths = folder.folder.path.split("/");
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
            {favoriteFiles.map((file) => {
              return (
                <TableRow 
                  hover 
                  role="checkbox" 
                  tabIndex={-1} 
                  key={file.id}
                  id={"file - " + file.id}  
                  // open the file if the file extension is pdf or images
                  // if not, show the warning
                  onDoubleClick={() => {
                    fetch("https://localhost:7043/files/stream/" + file.file.id)
                    .then(response => {
                      if (!response.ok) {
                        return null;
                      }
                      return response.blob();
                    })
                    .then(blob => {
                      if(blob != null){
                        const fileUrl = URL.createObjectURL(blob);
                        window.open(fileUrl, "_blank");
                      } 
                      else{
                        alert("only pdf and images can be viewed on the browser!");
                      }
                    })
                    .catch(error => {
                      console.error('Error viewing the file:', error);
                    });
                    
                    fetch('https://localhost:7043/files/recent/' + file.file.id, {
                      method: 'PUT',
                    })
                    .then((res) => res.json())
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => console.log(err));
                  }}
                  onClick={() => {                     
                    // update the path and folder&file values
                    setfolderOrFile(1);
                    setPath(file.file.path);
                    // if there is not any selected row, update selectedRow and clicked, change the background color 
                    if(selectedRow == null){
                      document.getElementById("file - " + file.id).style.backgroundColor = "#A9DDFF";
                      setSelectedRow(file.id);
                      setFileId(file.file.id);
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
                        setFileId(file.file.id);
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
                        {file.file.name} 
                        <StarTwoToneIcon sx={{marginLeft: "10px"}} fontSize='small'/>
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
                  // last-modified column for folder
                  if(column.id === 'last-modified'){
                    const date = new Date(file.file.lastModifiedDate);
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
                        {file.file.size}
                      </TableCell>
                    );
                  }
                  // original-location column for folder
                  if(column.id === 'original-location'){
                    var counter = 0;
                    var paths = file.file.path.split("/");
                    var newPath = "My FileOrbis"
                    for(let i=0; i<paths.length ;i++){
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
