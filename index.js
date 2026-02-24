import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
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
  if (type === EventType.PRESS) {
    const data = detail.notification?.data || {};
    console.log('🔔 BG/kill CLICK →', data);

    const NavigationService = require('./app/Navigation/NavigationServices').default;

    if (data.type === 'membership') {
      const tab = data.tab || data.screen || 'Main';
      if (tab === 'News' || tab === 'Blogs') {
        NavigationService.navigate('View_Post', {
          tab,
          notificationData: data,
          fromNotification: true,
        });
      } else {
        NavigationService.navigate('BottomTabs', {
          tab: ['Booking', 'B-Details', 'Main'].includes(tab) ? tab : 'Booking',
          notificationData: data,
          fromNotification: true,
        });
      }
      return;
    }

    const screen = data.screen || 'Main';
    NavigationService.navigate(screen, data);
  }
});

AppRegistry.registerComponent(appName, () => App);
