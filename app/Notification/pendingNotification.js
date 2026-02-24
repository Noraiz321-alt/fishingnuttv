import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../Navigation/NavigationServices';
import store from '../store';

const KEY = 'pending_notification';

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

