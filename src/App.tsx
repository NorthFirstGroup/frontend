import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/GoNavbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <AppRoutes />
            <Footer />
        </BrowserRouter>
    );
}

export default App;
