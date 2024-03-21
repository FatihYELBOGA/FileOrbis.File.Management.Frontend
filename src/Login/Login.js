import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
/* 
for remember me checkbox
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
*/

// copyright section that will place the bottom
function Copyright(props) 
{
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login(props) 
{
  // if login is successful, (userId, rootFolderId, mainFolderId) will be updated 
  // email, password useStates
  const { setUserId, setRootFolderId, setMainFolderId } = props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // when email changes on the form, it will work 
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // when password changes on the form, it will work
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // when the user clicks the sign in button, it will work
  const handleSubmit = (event) => {
    event.preventDefault();

    // email and password data
    /*
    const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    */

    // create the formData to use in the sign in request
    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Password", password);
    
    // sign in request
    fetch('https://localhost:7043/auth/login', {
        method: 'POST',
        body: formData,
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.id != null) {
            // update the userId, rootFolderId, mainFolderId
            // navigate to /home/ + {rootFolderId}
            setUserId(res.id);
            setRootFolderId(res.rootFolderId);
            setMainFolderId(res.rootFolderId);
            alert("succesfully login")
            navigate('/My FileOrbis/' + res.rootFolderId);
        } else {
            alert(res.message);
        }
    })
    .catch((err) => console.log(err));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* avatar */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {/* sign in text */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* email box */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            {/* password box */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            {/*
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            */}
            {/* sign in button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* forget password and sign up links */}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* copyright */}
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
