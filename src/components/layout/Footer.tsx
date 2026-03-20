import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer: React.FC = () => (
  <footer>
    <div className="footer-container">
      <ul>
        <li>
          <Link to="/home-pastel">Landing 2</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link to="/support">Support</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>© {new Date().getFullYear()} Usearly</li>
      </ul>
    </div>
  </footer>
);

export default Footer;
