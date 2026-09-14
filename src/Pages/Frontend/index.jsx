import { Route, Routes } from 'react-router-dom'
import Home from '../Frontend/Home'
import About from '../Frontend/About'
import Products from '../Frontend/Products'
import Contact from '../Frontend/Contact'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppButton from '../../components/Misc/WhatsAppButton'

const Frontend = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='about' element={<About />} />
                <Route path='products' element={<Products />} />
                <Route path='contact' element={<Contact />} />
            </Routes>
            <Footer />
            <WhatsAppButton />
        </>
    )
}

export default Frontend