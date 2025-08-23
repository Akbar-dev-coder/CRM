import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';

import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';
import { selectAuth } from '@/redux/auth/selectors';

export default function ErpCrmApp() {
  const { Content } = Layout;

  // const { state: stateApp, appContextAction } = useAppContext();
  // // const { app } = appContextAction;
  // const { isNavMenuClose, currentApp } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();
  const { current } = useSelector(selectAuth);
  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  // useLayoutEffect(() => {
  //   dispatch(settingsAction.list({ entity: 'setting' }));
  // }, []);

  // const appSettings = useSelector(selectAppSettings);

  // useEffect(() => {
  //   const { loadDefaultLang } = storePersist.get('firstVisit');
  //   if (appSettings.tsn_app_language && !loadDefaultLang) {
  //     window.localStorage.setItem('firstVisit', JSON.stringify({ loadDefaultLang: true }));
  //   }
  // }, [appSettings]);

  // only load setting for admin/owner

  useLayoutEffect(() => {
    if (current?.role === 'owner' || current?.role === 'admin') {
      dispatch(settingsAction.list({ entity: 'setting' }));
    }
  }, [current?.role, dispatch]);
  // if (!settingIsloaded && (current?.role === 'owner' || current?.role === 'admin')) {
  //   return <PageLoader />;
  // }
  if (settingIsloaded || current?.role === 'employee') {
    return (
      <Layout hasSider>
        <Navigation />

        {isMobile ? (
          <Layout style={{ marginLeft: 0 }}>
            <HeaderContent />
            <Content
              style={{
                margin: '40px auto 30px',
                overflow: 'initial',
                width: '100%',
                padding: '0 25px',
                maxWidth: 'none',
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        ) : (
          <Layout>
            <HeaderContent />
            <Content
              style={{
                margin: '40px auto 30px',
                overflow: 'initial',
                width: '100%',
                padding: '0 50px',
                maxWidth: 1400,
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        )}
      </Layout>
    );
  } else {
    return <PageLoader />;
  }
}
