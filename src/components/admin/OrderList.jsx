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
    MenuItem
} from '@mui/material';
import { getOrders, updateOrder } from '../../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Find the order to keep other data intact
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const updatedOrder = { ...order, status: newStatus };
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));

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
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {/* Assuming order structure has customer info, adjusting if different based on schema discovery */}
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
                                    <TableCell>
                                        <Select
                                            value={order.status || 'Pending'}
                                            size="small"
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Processing">Processing</MenuItem>
                                            <MenuItem value="Shipped">Shipped</MenuItem>
                                            <MenuItem value="Delivered">Delivered</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
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
        </Box>
    );
};

export default OrderList;
