import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
