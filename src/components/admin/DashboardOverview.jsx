import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getProducts, getOrders } from '../../services/api';
import '../../styles/AdminDashboard.css';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#982598', '#b84db8', '#d870d8', '#e8a0e8', '#f8d0f8'];

const StatCard = ({ title, count, icon, color }) => (
    <Paper
        elevation={3}
        className={`stat-card ${color}`}
    >
        <div className={`stat-icon-container ${color}`}>
            {React.cloneElement(icon, { className: 'stat-icon' })}
        </div>
        <Box className="stat-content">
            <Typography className="stat-title">{title}</Typography>
            <Typography className="stat-count">{count}</Typography>
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
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState([]);

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
                    totalRevenue: revenue,
                    lowStockProducts: products.filter(p => (p.stock || 0) <= 3)
                });

                // Prepare chart data - group orders by month or create sample data
                const monthlyData = prepareChartData(orders, products);
                setChartData(monthlyData);

                // Calculate Analytics
                calculateAnalytics(orders, products);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateAnalytics = (orders, products) => {
        // Top Selling Products
        const productSales = {};
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const id = item.productId || item.id;
                    productSales[id] = (productSales[id] || 0) + (item.quantity || 1);
                });
            }
        });

        const sortedProducts = Object.entries(productSales)
            .map(([id, sales]) => {
                const product = products.find(p => String(p.id) === String(id));
                return {
                    name: product ? product.name : `Product ${id}`,
                    sales
                };
            })
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        setTopProducts(sortedProducts);

        // Revenue by Category
        const catRev = {};
        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const product = products.find(p => String(p.id) === String(item.productId || item.id));
                    const category = product ? product.category : 'Unknown';
                    const itemTotal = (item.price || 0) * (item.quantity || 1);
                    catRev[category] = (catRev[category] || 0) + itemTotal;
                });
            }
        });

        const sortedCategories = Object.entries(catRev)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        setCategoryRevenue(sortedCategories);
    };

    const prepareChartData = (orders, products) => {
        // Create sample monthly data for visualization
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        // If we have real orders, we could group them by month
        // For now, create representative data based on current stats
        const avgOrdersPerMonth = Math.ceil(orders.length / 6);
        const avgRevenuePerMonth = orders.reduce((sum, order) =>
            sum + (Number(order.totalAmount) || Number(order.total) || 0), 0) / 6;

        return months.map((month, index) => {
            // Add some variation to make the chart more interesting
            const variation = 0.7 + (Math.random() * 0.6);
            return {
                month,
                orders: Math.max(1, Math.floor(avgOrdersPerMonth * variation)),
                revenue: Math.max(50, avgRevenuePerMonth * variation),
                products: Math.max(1, Math.floor((products.length / 6) * variation))
            };
        });
    };

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
            <Grid container spacing={4} sx={{ justifyContent: 'space-between', alignItems: 'stretch' }}>
                <Grid item xs={12} sm={6} md={3.5} className="stat-card-wrapper">
                    <StatCard
                        title="Total Products"
                        count={stats.totalProducts}
                        icon={<InventoryIcon color="primary" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3.5} className="stat-card-wrapper">
                    <StatCard
                        title="Total Orders"
                        count={stats.totalOrders}
                        icon={<ShoppingCartIcon color="success" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3.5} className="stat-card-wrapper">
                    <StatCard
                        title="Total Revenue"
                        count={`$${stats.totalRevenue.toFixed(2)}`}
                        icon={<AttachMoneyIcon color="warning" />}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Box sx={{ mt: 5 }}>
                <Grid container spacing={4}>
                    {/* Revenue & Orders Chart */}
                    <Grid item xs={12}>
                        <Paper elevation={3} className="chart-container">
                            <Typography variant="h6" className="chart-title">
                                Revenue & Orders Trend
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#982598" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#982598" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#b84db8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#b84db8" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(152, 37, 152, 0.2)" />
                                    <XAxis dataKey="month" stroke="#b0b0b0" />
                                    <YAxis stroke="#b0b0b0" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                            border: '1px solid rgba(152, 37, 152, 0.5)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(152, 37, 152, 0.3)',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#982598"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        name="Revenue ($)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#b84db8"
                                        fillOpacity={1}
                                        fill="url(#colorOrders)"
                                        name="Orders"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Products Bar Chart */}
                    <Grid item xs={12}>
                        <Paper elevation={3} className="chart-container">
                            <Typography variant="h6" className="chart-title">
                                Monthly Statistics
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(152, 37, 152, 0.2)" />
                                    <XAxis dataKey="month" stroke="#b0b0b0" />
                                    <YAxis stroke="#b0b0b0" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                            border: '1px solid rgba(152, 37, 152, 0.5)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(152, 37, 152, 0.3)',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="products" fill="#982598" name="Products" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="orders" fill="#b84db8" name="Orders" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Top Products & Category Revenue */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="chart-container">
                            <Typography variant="h6" className="chart-title">
                                Top Selling Products
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart layout="vertical" data={topProducts}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(152, 37, 152, 0.2)" />
                                    <XAxis type="number" stroke="#b0b0b0" />
                                    <YAxis dataKey="name" type="category" stroke="#b0b0b0" width={100} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                            border: '1px solid rgba(152, 37, 152, 0.5)',
                                            borderRadius: '8px',
                                            color: '#ffffff'
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="#982598" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} className="chart-container">
                            <Typography variant="h6" className="chart-title">
                                Revenue by Category
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryRevenue}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryRevenue.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                                            border: '1px solid rgba(152, 37, 152, 0.5)',
                                            borderRadius: '8px',
                                            color: '#ffffff'
                                        }}
                                        formatter={(value) => `$${value.toFixed(2)}`}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Restock Needed Section */}
            {stats.lowStockProducts?.length > 0 && (
                <Box sx={{ mt: 5 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '16px', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#f87171', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InventoryIcon /> Restock Needed Soon
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Current Stock</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.lowStockProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <img src={product.image} alt={product.name} style={{ width: 30, height: 30, borderRadius: '4px' }} />
                                                    {product.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>{product.category}</TableCell>
                                            <TableCell sx={{ color: product.stock === 0 ? '#f87171' : '#fbbf24', fontWeight: 700 }}>
                                                {product.stock || 0}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button size="small" variant="outlined" color="primary">
                                                    Manage
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
        </Box>
    );
};

export default DashboardOverview;
