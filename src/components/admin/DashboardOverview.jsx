import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getProducts, getOrders } from '../../services/api';

const StatCard = ({ title, count, icon, color }) => (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <Box>
            <Typography variant="body1" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{count}</Typography>
        </Box>
        <Box sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </Box>
    </Paper>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    getProducts(),
                    getOrders()
                ]);

                const products = productsRes.data;
                const orders = ordersRes.data;

                // Calculate simple stats
                const revenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || Number(order.total) || 0), 0);

                setStats({
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    totalRevenue: revenue
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Dashboard Overview</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="Total Products"
                        count={stats.totalProducts}
                        icon={<InventoryIcon color="primary" sx={{ fontSize: 30 }} />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="Total Orders"
                        count={stats.totalOrders}
                        icon={<ShoppingCartIcon color="success" sx={{ fontSize: 30 }} />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="Total Revenue"
                        count={`$${stats.totalRevenue.toFixed(2)}`}
                        icon={<AttachMoneyIcon color="warning" sx={{ fontSize: 30 }} />}
                        color="warning"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardOverview;
