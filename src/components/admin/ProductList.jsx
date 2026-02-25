import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import ProductForm from './ProductForm';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            showSnackbar('Error fetching products', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleAddClick = () => {
        setCurrentProduct(null);
        setOpenForm(true);
    };

    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setOpenForm(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                showSnackbar('Product deleted from MockAPI successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                showSnackbar('Error deleting product', 'error');
            }
        }
    };

    const handleFormSave = async (productData) => {
        try {
            if (currentProduct) {
                await updateProduct(currentProduct.id, productData);
                showSnackbar('Product updated in MockAPI successfully');
            } else {
                await createProduct(productData);
                showSnackbar('Product added to MockAPI successfully');
            }
            setOpenForm(false);
            setPage(0); // Reset to first page after adding/editing
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            showSnackbar('Error saving product: ' + error.message, 'error');
        }
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    };

    // Calculate paginated products
    const paginatedProducts = products.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Products</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Add Product
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        </TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell sx={{ textTransform: 'capitalize' }}>{product.category}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>
                                            <Box sx={{ 
                                                color: product.stock <= 3 ? '#f87171' : 'inherit',
                                                fontWeight: product.stock <= 3 ? 700 : 400
                                            }}>
                                                {product.stock || 0}
                                                {product.stock <= 3 && ' (Low)'}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEditClick(product)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(product.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {products.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    {/* Custom Pagination */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 1,
                            mt: 4,
                            mb: 2,
                            flexWrap: 'wrap'
                        }}
                    >
                        {/* Previous Button */}
                        <Button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            sx={{
                                minWidth: '100px',
                                height: '45px',
                                border: '1px solid rgba(152, 37, 152, 0.3)',
                                borderRadius: '8px',
                                color: page === 0 ? 'rgba(152, 37, 152, 0.3)' : '#982598',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: page === 0 ? 'transparent' : 'rgba(152, 37, 152, 0.1)',
                                    borderColor: page === 0 ? 'rgba(152, 37, 152, 0.3)' : '#982598',
                                },
                                '&.Mui-disabled': {
                                    color: 'rgba(152, 37, 152, 0.3)',
                                    borderColor: 'rgba(152, 37, 152, 0.3)',
                                },
                                textTransform: 'none',
                                fontSize: '15px',
                                fontWeight: 500,
                            }}
                        >
                            ← Previous
                        </Button>

                        {/* Page Numbers */}
                        {(() => {
                            const totalPages = Math.ceil(products.length / rowsPerPage);
                            const pageNumbers = [];

                            if (totalPages <= 7) {
                                // Show all pages if 7 or fewer
                                for (let i = 0; i < totalPages; i++) {
                                    pageNumbers.push(i);
                                }
                            } else {
                                // Show first page, last page, current page, and pages around current
                                pageNumbers.push(0); // First page

                                if (page > 2) {
                                    pageNumbers.push('ellipsis-start');
                                }

                                // Pages around current page
                                for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
                                    pageNumbers.push(i);
                                }

                                if (page < totalPages - 3) {
                                    pageNumbers.push('ellipsis-end');
                                }

                                pageNumbers.push(totalPages - 1); // Last page
                            }

                            return pageNumbers.map((pageNum, index) => {
                                if (typeof pageNum === 'string') {
                                    // Ellipsis
                                    return (
                                        <Box
                                            key={pageNum}
                                            sx={{
                                                width: '45px',
                                                height: '45px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#b0b0b0',
                                                fontSize: '18px',
                                            }}
                                        >
                                            ...
                                        </Box>
                                    );
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        sx={{
                                            minWidth: '45px',
                                            width: '45px',
                                            height: '45px',
                                            border: pageNum === page
                                                ? '2px solid #982598'
                                                : '1px solid rgba(152, 37, 152, 0.3)',
                                            borderRadius: '8px',
                                            color: pageNum === page ? '#ffffff' : '#b0b0b0',
                                            backgroundColor: pageNum === page
                                                ? '#982598'
                                                : 'transparent',
                                            '&:hover': {
                                                backgroundColor: pageNum === page
                                                    ? '#982598'
                                                    : 'rgba(152, 37, 152, 0.1)',
                                                borderColor: '#982598',
                                                color: pageNum === page ? '#ffffff' : '#982598',
                                            },
                                            fontSize: '15px',
                                            fontWeight: pageNum === page ? 600 : 500,
                                        }}
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            });
                        })()}

                        {/* Next Button */}
                        <Button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= Math.ceil(products.length / rowsPerPage) - 1}
                            sx={{
                                minWidth: '100px',
                                height: '45px',
                                border: '1px solid rgba(152, 37, 152, 0.3)',
                                borderRadius: '8px',
                                color: page >= Math.ceil(products.length / rowsPerPage) - 1
                                    ? 'rgba(152, 37, 152, 0.3)'
                                    : '#982598',
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: page >= Math.ceil(products.length / rowsPerPage) - 1
                                        ? 'transparent'
                                        : 'rgba(152, 37, 152, 0.1)',
                                    borderColor: page >= Math.ceil(products.length / rowsPerPage) - 1
                                        ? 'rgba(152, 37, 152, 0.3)'
                                        : '#982598',
                                },
                                '&.Mui-disabled': {
                                    color: 'rgba(152, 37, 152, 0.3)',
                                    borderColor: 'rgba(152, 37, 152, 0.3)',
                                },
                                textTransform: 'none',
                                fontSize: '15px',
                                fontWeight: 500,
                            }}
                        >
                            Next →
                        </Button>
                    </Box>

                    {/* Rows per page selector */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            mt: 2,
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ color: '#b0b0b0', fontSize: '14px' }}>
                            Products per page:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[5, 10, 25].map((size) => (
                                <Button
                                    key={size}
                                    onClick={() => {
                                        setRowsPerPage(size);
                                        setPage(0);
                                    }}
                                    sx={{
                                        minWidth: '45px',
                                        height: '35px',
                                        border: rowsPerPage === size
                                            ? '2px solid #982598'
                                            : '1px solid rgba(152, 37, 152, 0.3)',
                                        borderRadius: '6px',
                                        color: rowsPerPage === size ? '#ffffff' : '#b0b0b0',
                                        backgroundColor: rowsPerPage === size
                                            ? '#982598'
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: rowsPerPage === size
                                                ? '#982598'
                                                : 'rgba(152, 37, 152, 0.1)',
                                            borderColor: '#982598',
                                            color: rowsPerPage === size ? '#ffffff' : '#982598',
                                        },
                                        fontSize: '14px',
                                        fontWeight: rowsPerPage === size ? 600 : 500,
                                    }}
                                >
                                    {size}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                </>
            )}

            <ProductForm
                open={openForm}
                handleClose={() => setOpenForm(false)}
                onSave={handleFormSave}
                product={currentProduct}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductList;
