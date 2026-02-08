import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip,
    Select,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getOrders, updateOrder } from '../../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Find the order to keep other data intact
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const updatedOrder = { ...order, status: newStatus };
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));

            // Update selected order if it's the one being changed
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(updatedOrder);
            }

            await updateOrder(orderId, updatedOrder);
        } catch (error) {
            console.error('Error updating order:', error);
            // Revert on error properly if needed, but for now we just log
            fetchOrders();
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>Orders</Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {order.customerName || order.userId || 'Guest'}
                                    </TableCell>
                                    <TableCell>
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>${order.totalAmount || order.total || 0}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status || 'Pending'}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenModal(order)}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                }
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Order Details Modal */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" component="div">
                        Order Details
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedOrder && (
                        <Box>
                            {/* Order Information */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Order ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {selectedOrder.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Customer Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {selectedOrder.customerName || selectedOrder.userId || 'Guest'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Order Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Amount
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold" color="primary">
                                        ${selectedOrder.totalAmount || selectedOrder.total || 0}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Products Information */}
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Products
                            </Typography>
                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell align="center">Quantity</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Subtotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name || item.productName || 'Product'}</TableCell>
                                                    <TableCell align="center">{item.quantity || 1}</TableCell>
                                                    <TableCell align="right">${item.price || 0}</TableCell>
                                                    <TableCell align="right">
                                                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No product information available
                                </Typography>
                            )}

                            <Divider sx={{ my: 3 }} />

                            {/* Status Management */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Order Status
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body1">
                                        Current Status:
                                    </Typography>
                                    <Chip
                                        label={selectedOrder.status || 'Pending'}
                                        color={getStatusColor(selectedOrder.status)}
                                    />
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Change Status:
                                    </Typography>
                                    <Select
                                        value={selectedOrder.status || 'Pending'}
                                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Processing">Processing</MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    </Select>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderList;
