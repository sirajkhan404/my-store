import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Products from './Prodects'
import Orders from './Orders'
import Users from './Users'
import Profile from './Profile'
import Analytics from './Analytics'
import ProtectedRoute from '@/components/Misc/ProtectedRoute'

const Index = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<ProtectedRoute Component={Analytics} allowedRoles={["superAdmin"]} />} />
            <Route path="/products/*" element={<ProtectedRoute Component={Products} allowedRoles={["superAdmin"]} />} />
            <Route path="/orders/*" element={<ProtectedRoute Component={Orders} allowedRoles={["superAdmin", "customer"]} />} />
            <Route path="/users/*" element={<ProtectedRoute Component={Users} allowedRoles={["superAdmin"]} />} />
            <Route path="/profile/*" element={<ProtectedRoute Component={Profile} allowedRoles={["superAdmin", "customer"]} />} />
        </Routes>
    )
}

export default Index