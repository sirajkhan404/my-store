import AuthContext from './Auth'
import CartProvider from './CartContext'

const AppProvider = ({ children }) => {
    return (
        <AuthContext>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthContext>
    )
}

export default AppProvider
