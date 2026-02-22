import notifee, { EventType } from '@notifee/react-native';
import NavigationService from '../Navigation/NavigationServices';

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

      // membership: News/Blogs → View_Post (backend kabhi screen: BottomTabs bhej deta hai); Main/Booking/B-Details → BottomTabs
      if (data.type === 'membership') {
        const tab = data.tab || data.screen || 'Main';
        if (tab === 'News' || tab === 'Blogs') {
          // News/Blogs View_Post ke andar hain, BottomTabs ke nahi
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
}
