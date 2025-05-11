const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className="container py-4">{children}</main>
        </>
    );
};

export default Layout;
