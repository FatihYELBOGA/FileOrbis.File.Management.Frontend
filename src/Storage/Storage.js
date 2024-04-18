import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

// file-type, total-number, size, description columns
const columns = [
  { id: 'file-type', label: 'File Type', minWidth: 250 },
  {
    id: 'total-number',
    label: 'Total Number',
    minWidth: 200,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size',
    minWidth: 200,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'description',
    label: 'Description',
    minWidth: 250,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  }
];

export default function Recent(props){

  const {searchText, username} = props;
  // storage informations
  const [storageDetails, setStorageDetails] = useState([]);  

  // get storage details
  // work when search text triggered
  useEffect(() => {
    fetch('https://localhost:7043/files/storage/' + username)
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
        const filteredFiles = result.filter(file => file.type.includes(searchText));     
        setStorageDetails(filteredFiles);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [searchText])

  return (
    <div>
      <Typography sx={{fontSize: 22, display: "inline", cursor: 'pointer'}}>
        More Storage Details
      </Typography>
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
            {storageDetails.map((file) => {  
              if (file.type !== "") {
                return (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={file.id}
                    id={"file - " + file.id}  
                  >
                    {/* iterate each column and create file columns under the related column like folder column */}
                    {columns.map((column) => {
                    // name column for file
                    if(column.id === 'file-type'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            <AttachFileIcon sx={{marginRight: 2}}/>
                            {file.type}
                        </TableCell>
                        );
                    }
                    // total-number column for file
                    if(column.id === 'total-number'){
                      return (
                      <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                          {file.totalNumber}
                      </TableCell>)
                    }
                    // size column for file
                    if(column.id === 'size'){
                        return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                            {file.size}
                        </TableCell>
                        );
                    }
                    // description column for file
                    if(column.id === 'description'){
                      return (
                        <TableCell key={column.id} align={column.align} sx={{cursor: 'default'}}>
                          {file.description}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
                )}
                else {
                  return (
                    <>
                    <TableRow key={file.id}>
                      <TableCell rowSpan={2} />
                      <TableCell>Total Number of the files </TableCell>
                      <TableCell align="left">{file.totalNumbers}</TableCell>
                    </TableRow>
                    <TableRow key={file.id + "_size"}>
                      <TableCell>Total Size of the files</TableCell>
                      <TableCell align="left">{file.totalSize}</TableCell>
                    </TableRow>
                    </>
                  );
                }
              })}
            </TableBody>
        </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
