import { Outlet } from 'react-router-dom';
import SideNav from '../sidenav/sidenav';
import './layout.css'; // Import the new CSS file

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <SideNav>
      <div className="main-content">
        <Outlet />
      </div>
      </SideNav>
    </div>
  );
};

export default Layout;
