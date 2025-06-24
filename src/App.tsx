import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header/GoNavbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import AppProvider from '@contexts/AppProvider';
import SecondaryNavbar from './components/Header/SecondaryNavbar'; // New secondary header component

function App() {
    // console.log('App component rendering');
    const [mainHeaderHeight, setMainHeaderHeight] = useState(0);
    const [secondaryNavbarHeight, setSecondaryNavbarHeight] = useState(0);

    const totalHeaderHeight = mainHeaderHeight + secondaryNavbarHeight;

    return (
        <BrowserRouter>
            <AppProvider>
                <Header onMainHeaderHeightChange={setMainHeaderHeight} />
                <SecondaryNavbar
                    mainHeaderHeight={mainHeaderHeight}
                    onSecondaryNavbarHeightChange={setSecondaryNavbarHeight}
                />
                <div style={{ paddingTop: `${totalHeaderHeight}px` }}>
                    <AppRoutes />
                </div>
                <Footer />
            </AppProvider>
        </BrowserRouter>
    );
}

export default App;
