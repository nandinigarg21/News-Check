import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300 py-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
        
        {/* Brand */}
        <h2 className="text-xl font-bold tracking-tight">
          Fake<span className="text-blue-500">News</span>{" "}
          <span className="hidden sm:inline">Detector</span>
        </h2>

        {/* Copy */}
        <p className="text-sm text-gray-400">
          © {year} FakeNews Detector — All Rights Reserved.
        </p>

        {/* Links */}
        <div className="flex space-x-5">
          <button className="text-sm hover:text-blue-400 transition-colors">
            Privacy
          </button>
          <button className="text-sm hover:text-blue-400 transition-colors">
            Terms
          </button>
          <button className="text-sm hover:text-blue-400 transition-colors">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
