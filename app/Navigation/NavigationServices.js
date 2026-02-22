import { StackActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
  console.log('✅ Navigator SET:', !!navigatorRef);
}

function navigate(routeName, params = {}) {
  console.log('➡️ TRY NAVIGATE:', routeName, params);

  if (!_navigator) {
    console.log('⚠️ Navigator not ready');
    return;
  }

  // Nested tab screens
  const nestedTabScreens = ['View_Post', 'BottomTabs'];

  if (nestedTabScreens.includes(routeName)) {
    if (routeName === 'BottomTabs') {
      // yahan se Drawer ke andar BottomTabs + uska child tab open karein
      const targetTab = params.tab || params.screen || 'Booking';

      // Login se aaya hua responseData Drawer ke params me pada hota hai
      const rootState = _navigator.getRootState?.();
      const drawerRoute = rootState?.routes?.find(r => r.name === 'NavigationDrawer');
      const existingResponseData = drawerRoute?.params?.responseData;

      // responseData ko preserve + notification ke params ko merge karein
      const childParams = {
        ...(existingResponseData ? { responseData: existingResponseData } : {}),
        ...params,
      };

      _navigator.navigate('NavigationDrawer', {
        screen: 'BottomTabs',
        params: {
          screen: targetTab,  // BottomTabs ke andar ka tab name: 'Main' / 'Booking' / 'B-Details'
          params: childParams, // is tab ke params (notificationData waghera)
        },
      });
      return;
    }

    if (routeName === 'View_Post') {
      const routes = _navigator.getRootState()?.routes || [];
      const existing = routes.find(r => r.name === routeName);

      if (existing) {
        _navigator.dispatch(StackActions.replace(routeName, params));
      } else {
        _navigator.navigate(routeName, params);
      }
      return;
    }
  }

  // Simple screen
  _navigator.navigate(routeName, params);
}

export default {
  navigate,
  setTopLevelNavigator,
};
