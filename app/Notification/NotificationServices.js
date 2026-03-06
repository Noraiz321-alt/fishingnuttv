import notifee, { EventType } from '@notifee/react-native';
import NavigationService from '../Navigation/NavigationServices';
import store from '../store';
import { savePendingNotification } from './pendingNotification';

// export function notificationListeners() {
//     notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         console.log('✅ FOREGROUND CLICK →', detail.notification?.data);
  
//         const screen = detail.notification?.data?.screen || 'Main';
//         NavigationService.navigate(screen, detail.notification?.data);
//       }
//     });
//   }

export function notificationListeners() {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const data = detail.notification?.data || {};
      console.log('✅ FOREGROUND CLICK →', data);

      const state = store.getState();
      const user = state?.auth?.user;

      // membership: News/Blogs → View_Post (backend kabhi screen: BottomTabs bhej deta hai); Main/Booking/B-Details → BottomTabs
      if (data.type === 'membership') {
        const tab = data.tab || data.screen || 'Main';
        if (tab === 'News' || tab === 'Blogs') {
          // News/Blogs View_Post ke andar hain, BottomTabs ke nahi
          const routeName = 'View_Post';
          const params = { tab, notificationData: data, fromNotification: true };
          if (user) {
            NavigationService.navigate(routeName, params);
          } else {
            savePendingNotification(routeName, params);
          }
        } else {
          const routeName = 'BottomTabs';
          const params = {
            tab: ['Booking', 'B-Details', 'Main'].includes(tab) ? tab : 'Booking',
            notificationData: data,
            fromNotification: true,
          };
          if (user) {
            NavigationService.navigate(routeName, params);
          } else {
            savePendingNotification(routeName, params);
          }
        }
        return;
      }

      const screen = data.screen || 'Main';
      const routeName = screen;
      const params = data;
      if (user) {
        NavigationService.navigate(routeName, params);
      } else {
        savePendingNotification(routeName, params);
      }
    }
  });
}
