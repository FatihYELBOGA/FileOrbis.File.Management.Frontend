import './App.css';
import Login from './Login/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Navbar from './Navbar/Navbar';
import Box from '@mui/material/Box';
import MyFileOrbis from './MyFileOrbis/MyFileOrbis'
import Trash from './Trash/Trash';
import Toolbar from '@mui/material/Toolbar';
import Favorite from './Favorite/Favorite';
import Recent from './Recent/Recent';
import Storage from './Storage/Storage';

function App() 
{
  // rootFolderId: represents each changing root folder id
  // mainfolderId: represents the top root folder id
  // userId: represents authenticated user id
  const [rootFolderId, setRootFolderId] = useState(null);
  const [mainFolderId, setMainFolderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  // checks whether the new file&folder is created
  const [createdFolder, setCreatedFolder] = useState(false);
  const [directPath, setDirectPath] = useState("");
  // activeMenuItem represents id of the selected left menu bar
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [searchText, setSearchText] = useState("");

  // if userId equals null, go to the Login page
  if(userId == null){
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Login setUsername={setUsername} setUserId={setUserId} setRootFolderId={setRootFolderId} setMainFolderId={setMainFolderId} />} />
            <Route exact path='/sign-up' />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
  // if userId not equals null (userId is id), go to the Home page
  else{
    return (
      <Box sx={{ display: 'flex' }}>
        <BrowserRouter>
          {/* constant navbar menu */}
          <Navbar setSearchText={setSearchText} setUserId={setUserId} rootFolderId={rootFolderId} setRootFolderId={setRootFolderId} mainFolderId={mainFolderId} createdFolder={createdFolder} setCreatedFolder={setCreatedFolder} activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} />
          {/* (box and toolbar component) it represents the remaining free space outside the navbar */}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${240}px)` } }}
          >
            <Toolbar />
            {/* left side menu bar links */}
            <Routes>
              <Route exact path={'/My FileOrbis/' + rootFolderId} element = {<MyFileOrbis searchText={searchText} userId={userId} rootFolderId={rootFolderId} setRootFolderId={setRootFolderId} mainFolderId={mainFolderId} createdFolder={createdFolder} directPath={directPath} />} />
              <Route exact path='/Recent' element = {<Recent searchText={searchText} username={username} setRootFolderId={setRootFolderId} setDirectPath={setDirectPath} setActiveMenuItem={setActiveMenuItem} />} />
              <Route exact path='/Starred' element = {<Favorite username={username} searchText={searchText} userId={userId} setRootFolderId={setRootFolderId} setDirectPath={setDirectPath} setActiveMenuItem={setActiveMenuItem} />} />
              <Route exact path='/Trash' element = {<Trash searchText={searchText} username={username} />} />
              <Route exact path='/Storage' element = {<Storage searchText={searchText} username={username} />} />              
          </Routes>
          </Box>
        </BrowserRouter>
      </Box>
    );
  }
}

export default App;
