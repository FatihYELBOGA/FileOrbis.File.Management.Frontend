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
import FolderRenameForm from '../RenameForm/RenameForm';
import StarRateTwoToneIcon from '@mui/icons-material/StarRateTwoTone';

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
  const { userId, rootFolderId, setRootFolderId, mainFolderId, createdFolder, directPath } = props;
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
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  // isEditing: checks that editing form is open or closed
  const [isEditing, setIsEditing] = useState(false);
  // folderOrFile: checks that it is file or folder
  const [folderOrFile, setfolderOrFile] = useState(null);
  // renamed: when the file&folder name changed, it is changing to bring current file&folder of the root folder
  const [renamed, setRenamed] = useState(false); 

  // when the user double clicks the folder row, it will work
  // update root folder id, path of the selected folder and selected row id
  // navigate to /home/ + {rootFolderId}
  const handleDoubleClickFolder = (id, path) => {
      setRootFolderId(id);
      setPath(path);
      setSelectedRow(null);
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

  const handleSentToTrash = () => {
    // sent the file or folder with id to trash  
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
          setClicked(false);
          alert("folder succesfully trashed");
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
          setClicked(false);
          alert("file succesfully trashed");
          getFoldersAndFiles();
        },
        (error) => {
             console.log(error);
        }
      )
    }
  }

  const handleDownload = () => {

    if(folderOrFile == 1)
    {
      var fileName = "";

      fetch('https://localhost:7043/files/name/' + selectedRow)
      .then(response => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return response.text();
      })
      .then(data => {
        fileName = data;
      })
      .catch(error => {
        console.error(error);
      });
  
      fetch(`https://localhost:7043/files/` + selectedRow)
        .then(response => {
          if (!response.ok) {
            throw new Error('Server error!');
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          alert("file downloaded successfully!");
        })
        .catch(error => {
          console.error(error);
        });
    } 
    else if(folderOrFile == 0)
    {      
      var folderName = "";

      fetch('https://localhost:7043/folders/name/' + selectedRow)
      .then(response => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return response.text();
      })
      .then(data => {
        folderName = data;
      })
      .catch(error => {
        console.error(error);
      });
  
      const endpointUrl = 'https://localhost:7043/folders/zip/'+ selectedRow;

      fetch(endpointUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Server error');
          }
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', folderName + ".zip"); // İndirilen dosyanın adı
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        })
        .catch(error => {
          console.error(error);
        });
      }
  };

  const handleStar = () => {
    if(folderOrFile == 0){
      const formData = new FormData();
      formData.append("UserId", userId);
      formData.append("FolderId", selectedRow);
      
      // sign in request
      fetch('https://localhost:7043/users/favorites/folder', {
          method: 'POST',
          body: formData,
      })
      .then((res) => res.json())
      .then((res) => {
        alert("file succesfully starred!");
      })
      .catch((err) => console.log(err));
    }
    else if(folderOrFile == 1){
      const formData = new FormData();
      formData.append("UserId", userId);
      formData.append("FileId", selectedRow);
      
      // sign in request
      fetch('https://localhost:7043/users/favorites/file', {
          method: 'POST',
          body: formData,
      })
      .then((res) => res.json())
      .then((res) => {
        alert("file succesfully starred!");
      })
      .catch((err) => console.log(err));
    }
  }

  const getFoldersAndFiles = () => {
    fetch('https://localhost:7043/folders/' + rootFolderId)
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
        // update the folders and files
        setSubFolders(result.subFolders);
        setSubFiles(result.subFiles);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  useEffect(() => {
    if(rootFolderId != mainFolderId){
      setPath(directPath);
    }
  }, [])
 
  // when rootFolderId updated and first render completed, it will work
  useEffect(() => {
    getFoldersAndFiles();
    if(rootFolderId == mainFolderId){
      setPath("");
    }
  }, [rootFolderId, renamed, createdFolder])

  return (
    <div>
      {/* constant "my fileorbis" header path */}
      <Typography onClick={handleClickMainFolder} sx={{fontSize: 20, display: "inline", cursor: 'pointer'}}>
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
            sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
            onClick={()=>{ setIsEditing(true); }}
          />
          <DownloadTwoToneIcon 
            sx={{ marginRight: '25px', cursor:'pointer' }} 
            onClick={handleDownload}
          />
          <StarRateTwoToneIcon 
            sx={{ marginRight: '25px', cursor:'pointer' }} 
            onClick={handleStar}
          />
          <DeleteTwoToneIcon 
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
        <FolderRenameForm 
          folderOrFile={folderOrFile}
          id={selectedRow}
          setIsEditing={setIsEditing}
          renamed={renamed}
          setRenamed={setRenamed}
        /> : null
      }
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
                      handleDoubleClickFolder(folder.id,folder.path);
                    }}
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
                      
                    }}
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
    </div>  
  );
}
