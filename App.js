
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import 'fast-text-encoding'; // 👈 this will polyfill TextEncoder and
import AppWrapper from './app/componnent/AppWrapper';
import messaging from '@react-native-firebase/messaging';
import { notificationListeners } from './app/Notification/NotificationServices'
import notifee from '@notifee/react-native';
import { Provider } from 'react-redux';
import store from './app/store';


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
      const notifId = data.type === 'membership' ? 'fntv_membership' : (remoteMessage.messageId || `fg_${Date.now()}`);

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

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};

export default App;

