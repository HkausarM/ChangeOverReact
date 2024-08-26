import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Card, CardActions, CardContent, CardMedia } from "@mui/material";
import Badge from '@mui/material/Badge';
import { UrlProvider } from "../provider/domainUrlProvider";

// Lazy loading components
const SellItemPage = lazy(() => import("./AddProduct"));

function ClippedDrawer() {
  const [datas, setData] = useState(() => {
    // Initialize state from sessionStorage, if available
    const savedData = sessionStorage.getItem('products');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [title, setTitle] = useState('');
  const [apiResponseTime, setApiResponseTime] = useState(null);
  const navigate = useNavigate();

  const drawerWidth = 240;

  const sideNavItems = ['All Products', 'Men', 'Women', 'Kids', 'On Sale'];

  const handleSideMenuOption = useCallback(debounce(async (i) => {
    let url = new UrlProvider().getDomainUrl() + '/products?populate=*';
    if (i !== 'All Products') {
      url += i === 'On Sale' ? '&filters[Discount][$gt]=0' : `&filters[Category][$eq]=${i}`;
    }
    try {
      const startTime = performance.now(); // Start time
      const response = await fetch(url);
      const endTime = performance.now(); // Start time
      const productResponse = await response.json();
      setData(productResponse.data);
      setTitle(i);
      setApiResponseTime(endTime - startTime)
      sessionStorage.setItem('products', JSON.stringify(productResponse.data)); // Store in sessionStorage
    } catch (error) {
      console.error(error);
      setData([]); // Clear data on error
    }
  }, 300), []);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(new UrlProvider().getDomainUrl() + `/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Filter out the deleted product from the state
        const updatedData = datas.filter(product => product.id !== productId);
        setData(updatedData);
        sessionStorage.setItem('products', JSON.stringify(updatedData)); // Update sessionStorage
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    // navigate('/home'); // Navigate to /home on mount
    const currentPath = window.location.pathname;
    if (currentPath === '/') {
      navigate('/home');
    }
    const fetchProducts = async () => {
      const savedData = sessionStorage.getItem('products');
     
// navigate('/home')
      if (savedData) {
        // If products are already in sessionStorage, use them
        setData(JSON.parse(savedData));
        setTitle('All Products');
      } else {
        try {
          const startTime = performance.now(); // Start time
          const response = await fetch(new UrlProvider().getDomainUrl() + '/products?populate=*');
          const endTime = performance.now(); // End time
          const productResponse = await response.json();
          setData(productResponse.data);
          setTitle('All Products');
          sessionStorage.setItem('products', JSON.stringify(productResponse.data)); // Store in sessionStorage
          console.log("^^^^^^^^^^^^^^^^", endTime - startTime)
          // setApiResponseTime(endTime - startTime);
          sessionStorage.setItem('apiResponseTime', endTime - startTime)
        } catch (error) {
          console.error(error);
          setData([]); // Clear data on error
        }
      }
    };
    fetchProducts();
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      

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
  </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/home" element={
            <div>
              <div className='home-title'>
                <Typography variant="h6" sx={{ marginBottom: 3, marginLeft: 4 }}>{title}</Typography>
              </div>
              <div className="cards-shower">
                {datas.length > 0 ? datas.map((product) => (
                  <div className="cards-details" key={product.id}>
                    <Card sx={{ maxWidth: 300 }}>
                      {product.attributes.ProductImg.data && (
                        <CardMedia
                          component="img"
                          alt={product.attributes.ProductName || "Default Alt Text"}
                          height="140"
                          width="300" // Define width to prevent shifts
                          image={`http://localhost:1337${product.attributes?.ProductImg?.data
  ? (product.attributes.ProductImg.data.attributes.formats?.thumbnail?.url 
      ? product.attributes.ProductImg.data.attributes.formats.thumbnail.url 
      : product.attributes.ProductImg.data.attributes.url)
  : ''}`}
                          loading="lazy"
                        />
                      )}
                      <CardContent>
                        <Typography className='prod-name' gutterBottom variant="h6" component="div">
                          {product.attributes.ProductName}
                        </Typography>
                        <div className="price-discount">
                          <Typography gutterBottom variant="h6" component="div">
                            {'€' + product.attributes.Price}
                          </Typography>
                          
                        </div>
                      </CardContent>
                      <CardActions>
                        <Button className="topnav-buttons" size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                      </CardActions>
                    </Card>
                  </div>
                )) : <div>Loading...</div>}
              </div>
            </div>
          }/>
          <Route path="/addproduct" element={
            <Suspense fallback={<div>Loading add product page...</div>}>
              <SellItemPage />
            </Suspense>
          }/>
        </Routes>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <ClippedDrawer />
    </Router>
  );
}
