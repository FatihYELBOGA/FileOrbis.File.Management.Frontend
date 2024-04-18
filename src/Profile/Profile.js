import {
    Box, TextField, Typography, Grid, Button, createTheme, ThemeProvider
  } from '@mui/material';
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2150eb',
      },
      secondary: {
        main: '#ffffff',
      }
    },
    components: {
      MuiInput: {
        styleOverrides: {
          underline: {
            "&:hover:not(.Mui-disabled):before": {
              borderBottom: "none"
            },
            "&.Mui-focused:after": {
              borderBottom: "none"
            }
          },
          root: {
            "&:hover": {
  
              backgroundColor: "transparent"
            },
            "&:focus": {
              backgroundColor: "transparent"
            }
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.Mui-focused fieldset": {
              borderColor: "transparent"
            }
          }
        }
      }
    }
  });


// it will complete later
export default function Profile(){
    return (
        <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3, marginTop: 2, borderRadius: 2, width: '60%', marginLeft: '20%', marginRight: '20%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', marginBottom: 3 }}>
          <Typography variant="h6" component="p" sx={{ color: '#000', textAlign: 'center', textShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)', fontFamily: 'Poppins', fontWeight: 300, fontSize: '32px' }}></Typography>
       </Box>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <TextField  label="E-mail" disabled fullWidth/>
          </Grid>
          
          <Grid item xs={6}>
            <TextField label="First Name" fullWidth/>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Last Name" fullWidth/>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button sx={{ width: '50%', padding:'1%', marginRight:'25%',color:"white",backgroundColor:"#7D7D7D",fontWeight:"bold" }} variant="contained">Save Changes</Button>
        </Box>
      </Box>
    </ThemeProvider>
    )
}