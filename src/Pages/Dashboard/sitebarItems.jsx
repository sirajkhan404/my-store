import { DesktopOutlined, PieChartOutlined, TeamOutlined, DashboardOutlined, UserOutlined, BarChartOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const root = "/dashboard"

export const items = [
    { key: "1", label: <Link to={`${root}`} className="text-decoration-none">Dashboard</Link>, icon: <DashboardOutlined /> },
    { key: "2", label: <Link to={`${root}/analytics`} className="text-decoration-none">Analytics</Link>, icon: <BarChartOutlined />, allowedRoles: ["superAdmin"] },
    { key: "3", label: <Link to={`${root}/products`} className="text-decoration-none">Products</Link>, icon: <DesktopOutlined />, allowedRoles: ["superAdmin"] },
    { key: "4", label: <Link to={`${root}/orders`} className="text-decoration-none">Orders</Link>, icon: <PieChartOutlined /> },
    { key: "5", label: <Link to={`${root}/users`} className="text-decoration-none">Users</Link>, icon: <TeamOutlined />, allowedRoles: ["superAdmin"] },
    { key: "6", label: <Link to={`${root}/messages`} className="text-decoration-none">Messages</Link>, icon: <MessageOutlined /> },
    { key: "7", label: <Link to={`${root}/profile`} className="text-decoration-none">Profile</Link>, icon: <UserOutlined /> }
];
