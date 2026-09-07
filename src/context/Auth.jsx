import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";

const AuthContext = createContext();

const initialState = { isAuth: false, user: {} }

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { isAuth: true, user: action.payload }
        case "SET_PROFILE":
            return { ...state, user: { ...state.user, ...action.payload } }
        case "LOGOUT":
            return initialState
        default:
            return state
    }
}

const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const [isAppLoading, setIsAppLoading] = useState(true);

    const readProfile = async (token = null) => {

        const jwt = token || localStorage.getItem("jwt")

        // Minimum 2 second loader display
        const minDelay = new Promise(resolve => setTimeout(resolve, 2000))

        if (!jwt) { await minDelay; setIsAppLoading(false); return }

        const apiCall = axios.get(window.api + "/api/auth/user", { headers: { Authorization: `Bearer ${jwt}` } })
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    dispatch({ type: "LOGIN", payload: data.user, })
                    console.log("User Logged in", data.user)
                }
            })
            .catch(err => {
                console.log(err)
            })

        // Wait for BOTH: API response + 2 seconds minimum
        await Promise.all([apiCall, minDelay])
        setIsAppLoading(false)
    }

    useEffect(() => { readProfile() }, [])

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        dispatch({ type: "LOGOUT" })
    }

    return (
        <AuthContext.Provider value={{ ...state, dispatch, isAppLoading, handleLogout, readProfile }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext)



export default AuthProvider