import React, { useEffect, useState } from 'react';
import { Platform, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import NavigationStack from '../Drawer/NavigationStack';
import ForceUpdateScreen from './ForceUpdateScreen';

const AppWrapper = () => {
  const [shouldForceUpdate, setShouldForceUpdate] = useState(false);
  const [storeLink, setStoreLink] = useState('');
  const [message, setMessage] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    // Check version on initial load
    checkVersion();
    
    // Add app state change listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, check for updates
      checkVersion();
    }
    setAppState(nextAppState);
  };

  const checkVersion = async () => {
    const version = DeviceInfo.getVersion();
    const platform = Platform.OS;

    try {
      const res = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/update_app_alert.php');
      const data = await res.json();

      let latestVersion = platform === 'android'
        ? data.latest_version_android
        : data.latest_version_ios;

      let link = platform === 'android'
        ? data.android_app_link
        : data.ios_app_link;

      const isOutdated = compareVersions(version, latestVersion) === -1;

      if (isOutdated) {
        setShouldForceUpdate(true);
        setStoreLink(link);
        setMessage(data.message);
      } else {
        setShouldForceUpdate(false);
      }
    } catch (e) {
      console.error('Version check failed:', e);
    }
  };

  const compareVersions = (v1, v2) => {
    const a = v1.split('.').map(Number);
    const b = v2.split('.').map(Number);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const x = a[i] || 0;
      const y = b[i] || 0;
      if (x > y) return 1;
      if (x < y) return -1;
    }
    return 0;
  };

  if (shouldForceUpdate) {
    return <ForceUpdateScreen storeLink={storeLink} message={message} />;
  }

  return <NavigationStack />;
};

export default AppWrapper;