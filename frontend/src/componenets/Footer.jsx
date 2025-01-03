import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Description */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-bold">SkillSathiAI</h2>
          <p className="text-sm text-gray-400">
            Empowering learners with AI-driven personalized education and career
            guidance.
          </p>
        </div>

        {/* Links */}
        <div className="mb-4 md:mb-0">
          <h3 className="font-semibold text-sm mb-2">Quick Links</h3>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#features" className="hover:text-gray-200">
                Features
              </a>
            </li>
            <li>
              <a href="#technologies" className="hover:text-gray-200">
                Technologies
              </a>
            </li>
            <li>
              <a href="#roadmap" className="hover:text-gray-200">
                Roadmap
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-sm mb-2">Contact Us</h3>
          <ul className="text-sm space-y-1">
            <li>Email: support@skillsathai.com</li>
            <li>Phone: +91 234 567 890</li>
            <li>Address: Noida ,Sector-58</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © 2025 SkillSathiAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
