import Header from './GoNavbar';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <main className="container py-4">{children}</main>
            <Footer />
        </>
    );
};

export default Layout;
