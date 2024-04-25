import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import AppBar from '@mui/material/AppBar';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useNavigate } from 'react-router-dom';
import ImportContactsTwoToneIcon from '@mui/icons-material/ImportContactsTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// name, owner, last-modified, file-size, original location columns
const columns = [
  { id: 'name', label: 'Name', minWidth: 450 },
  {
    id: 'last-used-date',
    label: 'Last Used Date',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
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

  const { searchText, username, setRootFolderId, setDirectPath, setActiveMenuItem } = props;
  // use navigate
  const navigate = useNavigate();
  // selectedRow: represents selected row id
  const [selectedRow, setSelectedRow] = useState(null);
  // clicked: checks whether the row is selected or not
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(null);
  // recent files and its path
  const [recentFiles, setRecentFiles] = useState([]);  
  const [path, setPath] = useState();

  // get recent files
  const getRecents = () => {
    setLoading(true);
    // load favorites folders
    fetch('https://localhost:7043/files/recent/' + username)
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
        const filteredFiles = result.filter(file => file.name.includes(searchText));
        setRecentFiles(filteredFiles);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // when the file is opened by user, update the recent date of the file
  // show a warning when the file extension is not pdf or image
  const handleOpenFile = () => {
    fetch("https://localhost:7043/files/stream/" + selectedRow)
    .then(response => {
      if (!response.ok) {
        throw new Error('error countered!');
      }
      return response.blob();
    })
    .then(blob => {
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      getRecents();
    })
    .catch(error => {
      console.error('Error viewing the file:', error);   
      getRecents();                       
      alert("only pdf and images can be viewed on the browser!");
    });
      
    fetch('https://localhost:7043/files/recent/' + selectedRow, {
      method: 'PUT',
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));
    setClicked(false);
  }

  // checks whether the file is in the trash or not
  const checkInTrash = () => {
    fetch("https://localhost:7043/users/check-file-in-trash?fileId=" + selectedRow + "&username=" + username)
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
          handleGoInto();
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // get folder id with folder path
  // navigate to my fileorbis navbar
  const handleGoInto = () => {
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

  // when first render is completed and search text is changed, it will work
  useEffect(() => {
    getRecents();
  }, [searchText])

  return (
    <div>
      <Typography sx={{fontSize: 22, display: "inline", cursor: 'pointer'}}>
        Recent
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
          <ImportContactsTwoToneIcon 
            id="open-button"
            sx={{marginLeft:'50px', marginRight: '25px', cursor:'pointer' }} 
            onClick={handleOpenFile}
          />
          <ArrowCircleRightTwoToneIcon
            id="location-button" 
            sx={{cursor:'pointer'}} 
            onClick={checkInTrash}
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
              {recentFiles.map((file) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={file.id}
                      id={"file - " + file.id}  
                      onDoubleClick={handleOpenFile}
                      onClick={() => {                             
                        setPath(file.path);
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
                      // last-used-date column for file
                      if(column.id === 'last-used-date'){
                        const date = new Date(file.recentDate);
                        const day = date.getDate();
                        const month = date.toLocaleString('en-US', { month: 'short' });
                        const year = date.getFullYear();
                        const time = date.toLocaleTimeString();
                        const value = day + " " + month + " " + year + " " + time;
                        return (
                          <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            {value}
                          </TableCell>
                        )
                      }
                      // owner column for file
                      if(column.id === 'owner'){
                        return (
                          <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                              <AccountCircleTwoToneIcon /> me
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
                      // original location column for file
                      if(column.id === 'original-location'){
                        var counter = 0;
                        var paths = file.path.split("/");
                        var newPath = "My FileOrbis"
                        for(let i=0; i<paths.length; i++){
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
