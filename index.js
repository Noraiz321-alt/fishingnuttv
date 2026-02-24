import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// 🔹 Prevent duplicate notifications
let lastMessageId = null;
const NOTIF_ID_MEMBERSHIP = 'fntv_membership'; // ek hi membership notif – replace, duplicate nahi

function getNotificationId(remoteMessage) {
  const data = remoteMessage.data || {};
  if (data.type === 'membership') return NOTIF_ID_MEMBERSHIP;
  return remoteMessage.messageId || `msg_${Date.now()}`;
}

// 🔹 Handle background & kill mode messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const messageId = remoteMessage.messageId || `msg_${Date.now()}`;
  if (messageId === lastMessageId) return;
  lastMessageId = messageId;

  console.log('📩 BACKGROUND RECEIVED:', remoteMessage);

  const { title, body } = remoteMessage.data || {};
  const notifId = getNotificationId(remoteMessage);

  const channelId = await notifee.createChannel({
    id: 'high',
    name: 'High Priority Notifications',
    importance: 4,
    sound: 'default',
  });

  await notifee.displayNotification({
    id: notifId,
    title: title || 'Notification',
    body: body || '',
    data: remoteMessage.data,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      priority: 5,
      pressAction: { id: 'default', launchActivity: 'default' },
      vibrationPattern: [300, 500],
    },
  });
});

// 🔹 Handle background/kill click
// index.js

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.PRESS) return;

  const data = detail.notification?.data || {};
  console.log('🔔 BG/kill CLICK →', data);

  try {
    const payload = buildRoutePayloadFromData(data);
    await AsyncStorage.setItem('pending_notification', JSON.stringify(payload));
    console.log('💾 BG pending notification saved:', payload);
  } catch (e) {
    console.warn('BG save pending notification failed:', e?.message);
  }
});

function buildRoutePayloadFromData(data = {}) {
  if (data.type === 'membership') {
    const tab = data.tab || data.screen || 'Main';
    if (tab === 'News' || tab === 'Blogs') {
      return {
        routeName: 'View_Post',
        params: { tab, notificationData: data, fromNotification: true },
      };
    }
    return {
      routeName: 'BottomTabs',
      params: {
        tab: ['Booking', 'B-Details', 'Main'].includes(tab) ? tab : 'Booking',
        notificationData: data,
        fromNotification: true,
      },
    };
  }
  const screen = data.screen || 'Main';
  return { routeName: screen, params: data };
}

AppRegistry.registerComponent(appName, () => App);
