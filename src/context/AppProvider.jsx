import AuthContext from './Auth'

const AppProvider = ({ children }) => {
    return (
        <AuthContext>{children}</AuthContext>
    )
}

export default AppProvider
