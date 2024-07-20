import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import icon from '../../../assets/icons/js-logo-long.png';
import SerialStatus from '../SerialStatus';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabClick = (path: string) => {
    setActiveTab(path);
  };

  return (
    <nav className="bg-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://www.linkedin.com/in/josep-sucarrats-77333a252/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={icon} className="h-6" alt="JS Logo" />
        </a>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-language"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded md:p-0 ${
                  activeTab === '/' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                }`}
                aria-current={activeTab === '/' ? 'page' : undefined}
                onClick={() => handleTabClick('/')}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/documentation"
                className={`block py-2 px-3 rounded md:p-0 ${
                  activeTab === '/documentation' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                }`}
                aria-current={activeTab === '/' ? 'page' : undefined}
                onClick={() => handleTabClick('/documentation')}
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className={`block py-2 px-3 rounded md:p-0 ${
                  activeTab === '/settings' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                }`}
                aria-current={activeTab === '/' ? 'page' : undefined}
                onClick={() => handleTabClick('/settings')}
              >
                Settings
              </Link>
            </li>
            <li>
              <a
                href="#"
                className={`block py-2 px-3 rounded md:p-0 ${
                  activeTab === '/support' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'
                }`}
                aria-current={activeTab === '/' ? 'page' : undefined}
                onClick={() => handleTabClick('/support')}
              >
                Support
              </a>
            </li>
            <SerialStatus />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

