import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import NavigationService from '../Navigation/NavigationServices';
import store from '../store';

const KEY = 'pending_notification';

// index.js wale format ke hisaab se payload (kill mode UI side save ke liye)
function buildPayloadFromNotificationData(data = {}) {
  if (!data) return null;
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

// Kill mode: jis notification se app open hua, pehle UI side pe save (headless race kam kare)
export async function saveInitialNotificationIfAny() {
  try {
    const initial = await notifee.getInitialNotification();
    if (!initial?.notification?.data) return;
    const data = initial.notification.data;
    const payload = buildPayloadFromNotificationData(data);
    if (payload) {
      await AsyncStorage.setItem(KEY, JSON.stringify(payload));
      console.log('💾 Initial notification saved (getInitialNotification):', payload);
    }
  } catch (e) {
    console.warn('saveInitialNotificationIfAny failed:', e?.message);
  }
}

export async function savePendingNotification(routeName, params = {}) {
  try {
    const payload = { routeName, params };
    await AsyncStorage.setItem(KEY, JSON.stringify(payload));
    console.log('💾 Pending notification saved:', payload);
  } catch (e) {
    console.warn('Save pending notification failed:', e?.message);
  }
}

export async function loadPendingNotification() {
  try {
    const str = await AsyncStorage.getItem(KEY);
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    console.warn('Load pending notification failed:', e?.message);
    return null;
  }
}

export async function clearPendingNotification() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.warn('Clear pending notification failed:', e?.message);
  }
}

// Call after auth success OR when app comes to foreground and user already authenticated
export async function consumePendingNotificationIfAuthenticated() {
  const state = store.getState();
  const user = state?.auth?.user;
  if (!user) return;

  const pending = await loadPendingNotification();
  if (!pending?.routeName) return;

  NavigationService.navigate(pending.routeName, pending.params || {});
  await clearPendingNotification();
}

