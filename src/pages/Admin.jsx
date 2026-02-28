import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    AppBar,
    Toolbar,
    Container,
    Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/Forms.css';
import '../styles/AdminSidebar.css';

import DashboardOverview from '../components/admin/DashboardOverview';
import ProductList from '../components/admin/ProductList';
import OrderList from '../components/admin/OrderList';

// Placeholder components - will be implemented in next steps
const ProductManager = () => <ProductList />;
const OrderManager = () => <OrderList />;

const drawerWidth = 240;

const Admin = () => {
    const { role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [currentView, setCurrentView] = useState('overview');

    const handleLogout = () => {
        dispatch(logout());
    };

    const renderView = () => {
        switch (currentView) {
            case 'overview': return <DashboardOverview />;
            case 'products': return <ProductManager />;
            case 'orders': return <OrderManager />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" className="admin-appbar" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Fashion Fuel Admin
                    </Typography>
                    <Button className="admin-logout-btn" color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className="admin-sidebar"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
                classes={{ paper: 'admin-sidebar' }}
            >
                <Toolbar />
                <Box className="admin-sidebar-brand">
                    <Typography className="admin-sidebar-brand-text">
                        Admin Panel
                    </Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                    <List className="admin-sidebar-list">
                        <ListItem disablePadding className={`admin-sidebar-item ${currentView === 'overview' ? 'selected' : ''}`}>
                            <ListItemButton onClick={() => setCurrentView('overview')}>
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Overview" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding className={`admin-sidebar-item ${currentView === 'products' ? 'selected' : ''}`}>
                            <ListItemButton onClick={() => setCurrentView('products')}>
                                <ListItemIcon><InventoryIcon /></ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding className={`admin-sidebar-item ${currentView === 'orders' ? 'selected' : ''}`}>
                            <ListItemButton onClick={() => setCurrentView('orders')}>
                                <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                                <ListItemText primary="Commands (Orders)" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Container maxWidth="lg">
                    {renderView()}
                </Container>
            </Box>
        </Box>
    );
};

export default Admin;
