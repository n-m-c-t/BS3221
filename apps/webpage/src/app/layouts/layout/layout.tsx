import { Outlet } from 'react-router-dom';
import SideNav from '../sidenav/sidenav';
import './layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <SideNav />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

