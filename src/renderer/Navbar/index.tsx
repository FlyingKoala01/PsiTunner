import React from 'react';
import { Link } from 'react-router-dom';
import icon from '../../../assets/icons/js-logo-long.png';
import SerialStatus from '../SerialStatus';

const Navbar: React.FC = () => {
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
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/documentation"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
              >
                Settings
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700"
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
