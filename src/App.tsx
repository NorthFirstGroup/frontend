import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/GoNavbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import AppProvider from '@contexts/AppProvider';

function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <Header />
                <AppRoutes />
                <Footer />
            </AppProvider>
        </BrowserRouter>
    );
}

export default App;
