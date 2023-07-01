import React from 'react';

function Footer() {
  return (
    <footer
      className="footer"
      style={{ background: '#002244', color: 'white', padding: '10px 0', position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 999 }}
    >
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} Student Assess. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
