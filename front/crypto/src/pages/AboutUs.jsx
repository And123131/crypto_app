import React from 'react';
import PillNav from '../components/PillNav';
import ProfileCard from '../components/ProfileCard';
import logo from '../assets/logo.png';

function AboutUs() {
  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <PillNav
          logo={logo}
          logoAlt="Company Logo"
          items={[{ label: 'Home', href: '/' }, { label: 'Stock', href: '/stock' }]}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
          theme="light"
          initialLoadAnimation={false}
        />
      </div>

    
        <div className="opacity-0.3 mt-32 px-4">
          <h1 className="font-bold mb-6 text-yellow-400">About Us</h1>
          <p className="text-2xl text-white mb-4 font-bold">
              At Crypto, we are passionate about empowering individuals and businesses to navigate the dynamic world of cryptocurrency. Our platform provides cutting-edge tools, real-time data, and accurate predictions to help you make informed decisions in the ever-evolving digital asset market.
          </p>

          <h1 className="text-4xl font-bold mb-6 text-yellow-400 mt-10">Our Team</h1>
          <ProfileCard className="flex flex-col items-center justify-center"
            name="Andrii Yakuba"
              title={
              <>
                CEO | CTO <br />
                Full-Stack Soft-Dev <br />
                Designer
              </>
            }
            contactText="LinkedIn"
            showUserInfo
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => window.open('https://www.linkedin.com/in/andrii-yakuba-403413248/', '_blank')}
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            iconUrl="some_icon_url"
            behindGlowEnabled
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>

    </>
  );
}

export default AboutUs;