import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-bold">SkillSathiAI</h2>
          <p className="text-sm text-gray-400 mt-2">
            Empowering learners with AI-driven personalized education and career
            guidance.
          </p>
        </div>


        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
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
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <FaEnvelope className="mr-3 text-xl" />
              <span>support@skillsathiai.com</span>
            </li>
            <li className="flex items-center">
              <FaPhone className="mr-3 text-xl" />
              <span>+91 234 567 8908</span>
            </li>
            <li className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-xl" />
              <span>Noida, Sector-58</span>
            </li>
          </ul>
        </div>
      </div>


      {/* Social Media Links */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaFacebook />
          </a>
        </div>
      </div>


      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        © 2025 SkillSathiAI. All rights reserved.
      </div>
    </footer>
  );
};


export default Footer;

