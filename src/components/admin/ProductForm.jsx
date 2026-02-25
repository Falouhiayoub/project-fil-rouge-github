import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import ImageUpload from '../common/ImageUpload';

const ProductForm = ({ open, handleClose, onSave, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        stock: 10 // Default stock
    });

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                stock: product.stock !== undefined ? product.stock : 10
            });
        } else {
            setFormData({
                name: '',
                price: '',
                category: '',
                description: '',
                image: '',
                stock: 10
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({
            ...prev,
            image: url
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        name="name"
                        label="Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="price"
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="stock"
                        label="Stock Quantity"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            label="Category"
                            onChange={handleChange}
                        >
                            <MenuItem value="men">Men</MenuItem>
                            <MenuItem value="women">Women</MenuItem>
                            <MenuItem value="kids">Kids</MenuItem>
                            <MenuItem value="accessories">Accessories</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                    />
                    <Box>
                        <InputLabel shrink>Product Image</InputLabel>
                        <ImageUpload onUploadSuccess={handleImageUpload} />
                        {formData.image && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <img src={formData.image} alt="Preview" style={{ maxHeight: 200, maxWidth: '100%' }} />
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductForm;
