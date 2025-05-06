import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => (
    <footer className="bg-dark text-light py-3 mt-auto">
        <Container className="text-center">
            <small>© {new Date().getFullYear()} GoTicket. All rights reserved.</small>
        </Container>
    </footer>
);

export default Footer;
