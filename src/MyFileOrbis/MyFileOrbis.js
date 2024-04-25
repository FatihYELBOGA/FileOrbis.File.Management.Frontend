import React, { useEffect, useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppBar from '@mui/material/AppBar';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import RenameForm from '../RenameForm/RenameForm';
import StarRateTwoToneIcon from '@mui/icons-material/StarRateTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

// name, owner, last-modified, file-size columns
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
    label: 'Last modified',
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
  }
];

export default function MyFileOrbis(props) 
{
  const { searchText, userId, rootFolderId, setRootFolderId, mainFolderId, createdFolder, directPath } = props;
  // folders and files of user's main folder
  const [subFolders, setSubFolders] = useState([]);
  const [subFiles, setSubFiles] = useState([]);
  // constant text like "my drive"
  const mainFolderName = "My FileOrbis";
  // each folder path
  const [path, setPath] = useState("");  
  // use navigate
  const navigate = useNavigate();
  // selectedRow: represents selected row id
  const [selectedRow, setSelectedRow] = useState(null);
  const [favorite, setFavorite] = useState(false);
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  // isEditing: checks that editing form is open or closed
  const [isEditing, setIsEditing] = useState(false);
  // folderOrFile: checks that it is file or folder
  const [folderOrFile, setfolderOrFile] = useState(null);
  // renamed: when the file&folder name changed, it is changing to bring current file&folder of the root folder
  const [renamed, setRenamed] = useState(false); 
  const [loading, setLoading] = useState(null);

  // when the user double clicks the folder row, it will work
  // update root folder id, path of the selected folder and selected row id
  // navigate to /home/ + {rootFolderId}
  const handleDoubleClickFolder = (id, path) => {
      setRootFolderId(id);
      setPath(path);
      setSelectedRow(null);
      setFavorite(false);
      navigate('/My FileOrbis/' + id);
  }

  // when the user clicks the main folder "my fileorbis", it will work
  // update rootFolderId = mainFolderId, path = "", clicked = false
  const handleClickMainFolder = () => {
      setRootFolderId(mainFolderId);
      setPath("");
      setClicked(false);
      navigate('/My FileOrbis/' + mainFolderId);
  }
  
  // when the user clicks the path at the top (breadcrumbs), it will work
  const handleClickPath = (e) => {
    // remove last character of the path, for exp; "abc/def" instead of "abc/def/"
    const query = e.target.id.substring(0, e.target.id.length-1);
    // get folder id with folder path
    fetch('https://localhost:7043/folders/path/?path=' + query)
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
        // update rootFolderId = id, path = query, clicked = false
        setRootFolderId(result.id);
        setPath(query);
        setClicked(false);
        // navigate to /home/ + {rootFolderId}
        navigate('/My FileOrbis/' + result.id);
      },
      (error) => {
           console.log(error);
      }
    )
  }

  // trash operations with file&folder id
  // selected row = null, favorite and clicked = false
  const handleSentToTrash = () => {
    // send the file or folder with id to trash  
    if(folderOrFile == 0){
      fetch('https://localhost:7043/folders/trash/' + selectedRow, {
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
          setFavorite(false);
          setClicked(false);
          alert("the folder succesfully trashed!");
          getFoldersAndFiles();
        },
        (error) => {
          console.log(error);
        }
      )
    } 
    else if(folderOrFile == 1) { 
      fetch('https://localhost:7043/files/trash/' + selectedRow, {
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
          setFavorite(false);
          setClicked(false);
          alert("the file succesfully trashed!");
          getFoldersAndFiles();
        },
        (error) => {
             console.log(error);
        }
      )
    }
  }

  // before download, get file&folder name
  // download operations with file& folder id
  const handleDownload = async () => {
    if (folderOrFile == 1) {
      try {
        let fileName = "";
        const response1 = await fetch('https://localhost:7043/files/name/' + selectedRow);
        if (!response1.ok) {
          throw new Error("Server error");
        }
        fileName = await response1.text();
  
        const response2 = await fetch(`https://localhost:7043/files/download/` + selectedRow);
        if (!response2.ok) {
          throw new Error('Server error!');
        }
        const blob = await response2.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        alert("file downloaded successfully!");
      } catch (error) {
        console.error(error);
      }
    } else if (folderOrFile == 0) {
      try {
        let folderName = "";
        const response3 = await fetch('https://localhost:7043/folders/name/' + selectedRow);
        if (!response3.ok) {
          throw new Error("Server error");
        }
        folderName = await response3.text();
  
        const endpointUrl = 'https://localhost:7043/folders/zip/'+ selectedRow;
        const response4 = await fetch(endpointUrl);
        if (!response4.ok) {
          throw new Error('Server error');
        }
        const blob = await response4.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', folderName + ".zip");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        alert("folder downloaded successfully!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  // check whether file&folder is starred or not
  // if not starred, add to favorite table
  const handleStar = () => {
    if(!favorite){
    if(folderOrFile == 0){
      const formData = new FormData();
      formData.append("UserId", userId);
      formData.append("FolderId", selectedRow);
      fetch('https://localhost:7043/users/favorites/folder', {
          method: 'POST',
          body: formData,
      })
      .then((res) => res.json())
      .then((res) => {
        alert("folder succesfully starred!");
        getFoldersAndFiles();
        setClicked(false);
      })
      .catch((err) => console.log(err));
    }
    else if(folderOrFile == 1){
      const formData = new FormData();
      formData.append("UserId", userId);
      formData.append("FileId", selectedRow);
      fetch('https://localhost:7043/users/favorites/file', {
          method: 'POST',
          body: formData,
      })
      .then((res) => res.json())
      .then((res) => {
        alert("file succesfully starred!");
        getFoldersAndFiles();
        setClicked(false);
      })
      .catch((err) => console.log(err));
    }
    } else {
      alert("the file&folder is already starred!");
    }
  }

  // get folder with folder and user ids
  const getFoldersAndFiles = () => {
    setSelectedRow(null);
    setLoading(true);
    fetch('https://localhost:7043/folders/?folderId=' + rootFolderId + "&userId=" + userId)
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
        const filteredSubFolders = result.subFolders.filter(folder => folder.name.includes(searchText));
        const filteredSubFiles = result.subFiles.filter(file => file.name.includes(searchText));

        setSubFolders(filteredSubFolders);
        setSubFiles(filteredSubFiles);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // if the folder is not top folder
  useEffect(() => {
    if(rootFolderId != mainFolderId){
      setPath(directPath);
    }
  }, [])
 
  // when rootFolderId updated and first render completed, it will work
  // when there are rename, creation, search text, it will work
  useEffect(() => {
    getFoldersAndFiles();
    if(rootFolderId == mainFolderId){
      setPath("");
    }
  }, [rootFolderId, renamed, createdFolder, searchText])

  return (
    <div>
      {/* constant "my fileorbis" header path */}
      <Typography id="my-fileorbis" onClick={handleClickMainFolder} sx={{fontSize: 20, display: "inline", cursor: 'pointer'}}>
        {mainFolderName} 
      </Typography>
      <KeyboardArrowRightTwoToneIcon/>
      {/* create each path (breadcrumbs) */}
      {path.split("/").map((p, index) => {
        const eachFolderPath = path.split("/").slice(0, index+1).join("/") + "/";
        if(index !== 0){
          return (
            <div style={{display: 'inline-block'}}>
              <Typography id={eachFolderPath} onClick={handleClickPath} sx={{ fontSize: 20, display: "inline", cursor: 'pointer'}}>
                {p} 
              </Typography>
              <KeyboardArrowRightTwoToneIcon/>
            </div>
          )  
        }
      })}
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
              setFavorite(false);
              if(document.getElementById("folder - " + selectedRow) != null){
                document.getElementById("folder - " + selectedRow).style.backgroundColor = "";
              }
              if(document.getElementById("file - " + selectedRow) != null){
                document.getElementById("file - " + selectedRow).style.backgroundColor = "";
              }
            }}
          />  
          <span style={{cursor: 'default'}}>1 selected</span>
          <DriveFileRenameOutlineTwoToneIcon 
            id="rename-button"
            sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
            onClick={()=>{ setIsEditing(true); }}
          />
          <DownloadTwoToneIcon 
            id="download-button"
            sx={{ marginRight: '25px', cursor:'pointer' }} 
            onClick={handleDownload}
          />
          <StarRateTwoToneIcon 
            id="star-button"
            sx={{ marginRight: '25px', cursor:'pointer' }} 
            onClick={handleStar}
          />
          <DeleteTwoToneIcon 
            id="trash-button"
            sx={{cursor:'pointer'}} 
            onClick={handleSentToTrash}
          />
        </Toolbar> : 
        // constant "no selected item" text 
        <Toolbar sx={{ display: 'flex'}}>
          <span style={{cursor: 'default'}}>no selected item</span>
        </Toolbar>}
      </AppBar>
      {/* if the editing form (rename form) is open, it will work*/}
      {isEditing ? 
        <RenameForm 
          rootFolderId={rootFolderId}
          folderOrFile={folderOrFile}
          id={selectedRow}
          setIsEditing={setIsEditing}
          renamed={renamed}
          setRenamed={setRenamed}
          setClicked={setClicked}
        /> : null
      }
      {
        loading ?
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh'
          }}
        >
          <CircularProgress />
        </Box> :
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
              {subFolders.map((folder) => {
                return (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={folder.id} 
                    id={"folder - " + folder.id}  
                    // clicked = false, selectedRow = null
                    onDoubleClick={() => {
                      setClicked(false);
                      setSelectedRow(null);
                      setFavorite(false);
                      handleDoubleClickFolder(folder.id,folder.path);
                    }}
                    onClick={() => {
                      setfolderOrFile(0);
                      // if there is not any selected row, update selectedRow and clicked, change the background color 
                      if(selectedRow == null){
                        document.getElementById("folder - " + folder.id).style.backgroundColor = "#A9DDFF";
                        setSelectedRow(folder.id);
                        setFavorite(folder.starred);
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
                          setFavorite(folder.starred);
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
                            {folder.starred ? <StarTwoToneIcon id="star-icon" sx={{marginLeft: "10px"}} fontSize='small' /> : null}
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
                        var value = "-"
                        if(folder.LastModifiedDate != null){
                          const date = new Date(folder.LastModifiedDate);
                          const day = date.getDate();
                          const month = date.toLocaleString('en-US', { month: 'short' });
                          const year = date.getFullYear();
                          const time = date.toLocaleTimeString();
                          value = day + " " + month + " " + year + " " + time;
                        }
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
                    })}
                  </TableRow>
                );
              })}
              {subFiles.map((file) => {
                return (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={file.id}
                    id={"file - " + file.id}      
                    onDoubleClick={() => {
                      fetch("https://localhost:7043/files/stream/" + selectedRow)
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
                      
                      fetch('https://localhost:7043/files/recent/' + selectedRow, {
                        method: 'PUT',
                      })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => console.log(err));
                    }}
                      
                    onClick={() => {                   
                      setfolderOrFile(1);
                      // if there is not any selected row, update selectedRow and clicked, change the background color 
                      if(selectedRow == null){
                        document.getElementById("file - " + file.id).style.backgroundColor = "#A9DDFF";
                        setSelectedRow(file.id);
                        setFavorite(file.starred);
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
                          setFavorite(file.starred);
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
                            {file.starred ? <StarTwoToneIcon id="star-icon" sx={{marginLeft: "10px"}} fontSize='small'/> : null}
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
                      // last-modified column for file
                      if(column.id === 'last-modified'){
                        const date = new Date(file.createdDate);
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
  );
}
