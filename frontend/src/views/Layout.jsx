import React from 'react';
import MyNavbar from './MyNavbar';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <>
      <MyNavbar />
      <div className="container mt-4">
        <Outlet /> {/* Aquí se renderizarán las diferentes páginas */}
      </div>
    </>
  );
}

export default Layout;