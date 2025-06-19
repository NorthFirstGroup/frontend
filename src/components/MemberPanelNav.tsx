// frontend/src/components/MemberPanelNav/MemberPanelNav.tsx

import React, { useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { routeConfigs } from '../routes/routeConfigs';
import styles from './MemberPanelNav.module.css';

const navPathNames: { [key: string]: string } = {
  '/user/profile': '帳號設定',
  '/user/point': '點數資訊', 
  '/user/orders': '訂單紀錄',
  '/organizer/apply': '申請成為廠商',
};

const MemberPanelNav: React.FC = () => {
  const location = useLocation();

  const memberPanelNavigationItems = useMemo(() => {
    if (!routeConfigs) {
      console.error("Error: routeConfigs is not initialized.");
      return [];
    }
    return routeConfigs
      .filter(route => navPathNames.hasOwnProperty(route.path))
      .map(route => {
        const name = navPathNames[route.path];
        return { path: route.path, name: name, roles: route.roles };
      });
  }, [routeConfigs, navPathNames]);


  return (
    <>
      {/* 移除調試用的紅框 */}
      {/* <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '10px 0' }}>
        DEBUG: MemberPanelNav 在此！
      </div> */}

      <Nav variant="underline" className={`mb-4 ${styles.memberPanelNav}`}> {/* mb-4 可以考慮移除，讓間距完全由 CSS 控制 */}
        {memberPanelNavigationItems.length > 0 ? (
          memberPanelNavigationItems.map((item) => (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.name}
              </Nav.Link>
            </Nav.Item>
          ))
        ) : (
          // 如果沒有導航項目，這個備用連結可以移除，或者替換成一個空的 div
          <Nav.Item>
            <Nav.Link>
              載入中或無導航項目
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>
    </>
  );
};

export default MemberPanelNav;