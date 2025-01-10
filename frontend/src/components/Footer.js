import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-7 md:py-10 border-t border-gray-300  space-y-1">
      <p className="text-sm">
        © {new Date().getFullYear()} Image & Video Processor
      </p>
      <p>All rights reserved</p>
    </footer>
  );
};

export default Footer;
