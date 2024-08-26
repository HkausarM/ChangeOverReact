import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { UrlProvider } from "../provider/domainUrlProvider";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Typography } from '@mui/material';

let result = {}

export default function SellItemPage() {

    const categories = ['Men', 'Women', 'Kids'];
    const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL']
    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productSize, setProductSize] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [price, setProductPrice] = useState("")
    const [discount, setDiscount] = useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [isProductNameInvalid, setProductNameError] = useState(false);
    const [isProductDescriptionInvalid, setProductDescriptionError] = useState(false)
    const [isCategoryInvalid, setCategoryError] = useState(false);
    const [isSizeInvalid, setSizeError] = useState(false);
    const [isDiscountInvalid, setDiscountError] = useState(false);
    const [isPriceInvalid, setPriceError] = useState(false);
    const [image, setImage] = useState({});
  const [imgError, setImgError] = useState('');

  const [imagePreview, setImagePreview] = useState(null); // State for the image preview

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // Valid image types
      if (!validTypes.includes(file.type)) {
        setImgError('Please upload a valid image (JPEG, PNG, GIF).'); // Set error message if type is invalid
        setImage(null);
        setImagePreview(null); // Reset preview if file is invalid
      } else {
        setImgError('');
        setImage(file); // Set the uploaded image file

        const reader = new FileReader(); // Create a FileReader instance
        reader.onloadend = () => {
          setImagePreview(reader.result); // Set the preview URL once the file is read
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
      }
    }
  };


    const handleSubmit = (event) => {
        event.preventDefault();
        const sendSellItem = {};
        sendSellItem[ "ProductName"] = productName ? productName : setProductNameError(true) 
        sendSellItem[ "Description"] = productDescription ? productDescription : setProductDescriptionError(true) 
        sendSellItem[ "Size"] = productSize ? productSize : setSizeError(true)
        sendSellItem[ "Category"] = productCategory ? productCategory : setCategoryError(true) 
        sendSellItem[ "Discount"] = discount ? discount : setDiscount(true) 
        sendSellItem[ "Price"] = price ? price : setPriceError(true) 
        sendSellItem[ "Image"] = image ? image : setImgError(true)
        console.log("sendSellItem", sendSellItem)
        if (productName && productDescription && productSize && productCategory && discount && price) {
            fetch(new UrlProvider().getDomainUrl() + '/products', {
                method: 'POST',
                body: JSON.stringify({"data":sendSellItem}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (response) => {
                result = await response.json();
                if (result.data.attributes) {
                    setDialogOpen(true);
                }
            });
        }
    }

    const handleClose = () => {
        setDialogOpen(false);
        window.location.reload(true);
    };

    return (
        <Box className="sell-item-page"
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div autoComplete="off" onSubmit={handleSubmit}>
                <p>Give more details about the apparel you want to sell</p>

                <TextField
                    id="product-name"
                    label="Product Name"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    onChange={e => {
                        setProductName(e.target.value)
                        if (e.target.value != '') {
                            setProductNameError(false)
                        }
                        else {
                            setProductNameError(true)
                        }
                    }}
                    required
                    error={isProductNameInvalid}
                />
                <TextField
                    id="product-description"
                    label="Product Description"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    onChange={e => {
                        setProductDescription(e.target.value)
                        if (e.target.value != '') {
                            setProductDescriptionError(false)
                        }
                        else {
                            setProductDescriptionError(true)
                        }
                    }}
                    required
                    error={isProductDescriptionInvalid}
                />
                <TextField
                    id="product-size"
                    select
                    required
                    defaultValue=""
                    label="Size"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    onChange={e => {
                        setProductSize(e.target.value)
                        if (e.target.value != '') {
                            setSizeError(false)
                        }
                        else {
                            setSizeError(true)
                        }
                    }}
                    error={isSizeInvalid}
                > {sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                        {size}
                    </MenuItem>
                ))}
                </TextField>
                <TextField
                    id="product-category"
                    select
                    required
                    defaultValue=""
                    label="Category"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    error={isCategoryInvalid}
                    onChange={e => {
                        setProductCategory(e.target.value)
                        if (e.target.value != '') {
                            setCategoryError(false)
                        }
                        else {
                            setCategoryError(true)
                        }
                    }}
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="product-price"
                    required
                    defaultValue=""
                    label="Price"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    error={isPriceInvalid}
                    onChange={e => {
                        setProductPrice(e.target.value)
                        if (e.target.value != '') {
                            setPriceError(false)
                        }
                        else {
                            setPriceError(true)
                        }
                    }}
                ></TextField>
                 <TextField
                    id="product-dicount"
                    required
                    defaultValue=""
                    label="Discount"
                    type="text"
                    autoComplete="off"
                    variant="standard"
                    error={isDiscountInvalid}
                    onChange={e => {
                        setDiscount(e.target.value)
                        if (e.target.value != '') {
                            setDiscountError(false)
                        }
                        else {
                            setDiscountError(true)
                        }
                    }}
                ></TextField>
                <Typography variant="h6">Upload an Image</Typography>
      <input
        accept="image/*"
        id="image-upload"
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span">
          Upload Image
        </Button>
      </label>
      {imagePreview && ( // Show preview if there is one
        <Box mt={2}>
          <Typography variant="body1">Selected Image:</Typography>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '200px', marginTop: '10px' }} // Style the image
          />
        </Box>
      )}
      {imgError && <FormHelperText error>{imgError}</FormHelperText>}
                <br></br>
            
                <Button className="submit-btn" sx={{ mt: 1, mr: 1 }} type="submit" onClick={handleSubmit} variant="outlined">
                    Submit
                </Button>
                <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Product created successfully!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Box>
    );
}
