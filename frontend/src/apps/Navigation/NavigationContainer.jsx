import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { selectCurrentUserRole } from '@/redux/auth/selectors';

import { useAppContext } from '@/context/appContext';
import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo.png';
import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  MenuOutlined,
  ShopOutlined,
  WalletOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();
  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;

  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();
  const userRole = useSelector(selectCurrentUserRole); // Get role from Redux

  const adminItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/">{translate('dashboard')}</Link>,
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to="/customer">{translate('customers')}</Link>,
    },
    {
      key: 'vender',
      icon: <ShopOutlined />,
      label: <Link to="/vender">{translate('Vendors')}</Link>,
    },
    {
      key: 'employee',
      icon: <ContainerOutlined />,
      label: <Link to="/employee">{translate('employee')}</Link>,
    },
    {
      key: 'attendance',
      icon: <FileSyncOutlined />,
      label: <Link to="/attendence">{translate('employee attendance')}</Link>,
    },
    {
      key: 'leave',
      icon: <FileSyncOutlined />,
      label: <Link to="/leave">{translate('leave requests')}</Link>,
    },
    {
      key: 'payroll',
      icon: <CreditCardOutlined />,
      label: <Link to="/payroll">{translate('payroll')}</Link>,
    },
    {
      key: 'invoice',
      icon: <ContainerOutlined />,
      label: <Link to="/invoice">{translate('invoices')}</Link>,
    },
    {
      key: 'quote',
      icon: <FileSyncOutlined />,
      label: <Link to="/quote">{translate('quote')}</Link>,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: <Link to="/payment">{translate('payments')}</Link>,
    },
    {
      key: 'paymentMode',
      icon: <WalletOutlined />,
      label: <Link to="/payment/mode">{translate('payments_mode')}</Link>,
    },
    { key: 'taxes', icon: <ShopOutlined />, label: <Link to="/taxes">{translate('taxes')}</Link> },
    {
      key: 'generalSettings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">{translate('settings')}</Link>,
    },
    {
      key: 'about',
      icon: <ReconciliationOutlined />,
      label: <Link to="/about">{translate('about')}</Link>,
    },
  ];

  //  Employee menu
  const employeeItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/">{translate('dashboard')}</Link>,
    },
    {
      key: 'attendance',
      icon: <FileSyncOutlined />,
      label: <Link to="/attendance">{translate('My Attendance')}</Link>,
    },
    {
      key: 'leave',
      icon: <ContainerOutlined />,
      label: <Link to="/leave">{translate('My Leaves')}</Link>,
    },
    {
      key: 'payslip',
      icon: <ContainerOutlined />,
      label: <Link to="/payslip">{translate('My Payslip')}</Link>,
    },
    {
      key: 'about',
      icon: <ReconciliationOutlined />,
      label: <Link to="/about">{translate('about')}</Link>,
    },
  ];

  // Pick correct menu
  const items = userRole === 'employee' ? employeeItems : adminItems;

  useEffect(() => {
    if (location) {
      if (currentPath !== location.pathname) {
        setCurrentPath(location.pathname === '/' ? 'dashboard' : location.pathname.slice(1));
      }
    }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: isMobile ? 'absolute' : 'relative',
        bottom: '20px',
        ...(!isMobile && { left: '20px', top: '20px' }),
      }}
      theme="light"
    >
      <div
        className="logo"
        onClick={() => navigate(userRole === 'employee' ? '/' : '/employee-dashboard')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logoIcon} alt="Logo" style={{ marginLeft: '-5px', height: '40px' }} />
      </div>
      <Menu
        items={items}
        mode="inline"
        theme="light"
        selectedKeys={[currentPath]}
        style={{ width: 256 }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ marginLeft: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer width={250} placement="left" closable={false} onClose={onClose} open={visible}>
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
