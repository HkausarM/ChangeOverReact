import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import { BrowserRouter as Link } from 'react-router-dom';


const Header = () => {
    return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
        ChangeOver
      </Typography>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Button className="topnav-buttons" sx={{ color: '#fff' }} component={Link} to="/home">
          Buy
        </Button>
        <Button className="topnav-buttons" sx={{ color: '#fff' }} component={Link} to="/addproduct">
          Add Product
        </Button>
      </Box>
    </Toolbar>
  </AppBar>)
}

export default Header;