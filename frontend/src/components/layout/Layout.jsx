import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../common/AnnouncementBar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import MiniCartDrawer from '../common/MiniCartDrawer';
import WhatsAppFloating from '../common/WhatsAppFloating';
import CookieConsent from '../common/CookieConsent';
import SeoSchema from '../common/SeoSchema';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <SeoSchema />
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MiniCartDrawer />
      <WhatsAppFloating />
      <CookieConsent />
    </div>
  );
};

export default Layout;
