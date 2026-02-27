
import { SafeAreaView, ScrollView, StyleSheet, Text, View, AppState } from 'react-native'
import React, { useState, useEffect } from 'react'
import 'fast-text-encoding'; // 👈 this will polyfill TextEncoder and
import AppWrapper from './app/componnent/AppWrapper';
import messaging from '@react-native-firebase/messaging';
import { notificationListeners } from './app/Notification/NotificationServices'
import notifee from '@notifee/react-native';
import { Provider } from 'react-redux';
import store from './app/store';
import { consumePendingNotificationIfAuthenticated, saveInitialNotificationIfAny } from './app/Notification/pendingNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './app/store/authSlice';


const EXPIRY_REFRESH_MIN_INTERVAL_MS = 60 * 1000; // 60 sec throttle
let lastExpiryRefreshAt = 0;

async function refreshMemberFromExpiryIfNeeded() {
  try {
    const now = Date.now();
    if (now - lastExpiryRefreshAt < EXPIRY_REFRESH_MIN_INTERVAL_MS) {
      return;
    }

    const state = store.getState();
    const baseUser = state?.auth?.user;
    const memberID = baseUser?.memberID;
    if (!memberID) return;

    const url = `https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=Expiry&user_id=${memberID}`;
    const res = await fetch(url);
    const latest = await res.json();
    console.log('🔄 [AppState] Expiry API response:', latest);

    const toStore = latest?.success ? latest : baseUser;
    await AsyncStorage.setItem('user', JSON.stringify(toStore));
    store.dispatch(setUser(toStore));
    lastExpiryRefreshAt = now;
  } catch (e) {
    console.warn('refreshMemberFromExpiryIfNeeded error:', e?.message || e);
  }
}

const App = () => {
  useEffect(() => {
    // 🔹 Create high-priority channel
    notifee.createChannel({
      id: 'high',
      name: 'High Priority Notifications',
      importance: 4,
    });

    // 🔹 Foreground click listener
    notificationListeners();

    // 🔹 Foreground message listener
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 FOREGROUND RECEIVED:', remoteMessage);

      const data = remoteMessage.data || {};
      const { title, body } = data;
      const notifId = remoteMessage.messageId || data.id || `fg_${Date.now()}`;

      await notifee.displayNotification({
        id: notifId,
        title: title || 'Notification',
        body: body || '',
        data: remoteMessage.data,
        android: {
          channelId: 'high',
          smallIcon: 'ic_launcher',
          priority: 5,
          pressAction: { id: 'default' },
          vibrationPattern: [300, 500],
        },
      });
    });

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshMemberFromExpiryIfNeeded();
        consumePendingNotificationIfAuthenticated();
      }
    });

    // Kill mode: notification tap pe pehle pending save (UI side), taake login ke baad consume mile
    saveInitialNotificationIfAny();
    // Initial foreground refresh (agar already logged-in user hai)
    refreshMemberFromExpiryIfNeeded();

    return () => {
      unsubscribe();
      appStateSub.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

export default App;

