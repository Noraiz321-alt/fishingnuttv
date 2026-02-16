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

      // sirf membership notification ke liye
      if (data.type === 'membership') {
        NavigationService.navigate('BottomTabs', {
          tab: 'Main',              // konsi tab open karni
          notificationData: data,   // poora notification ka data
          fromNotification: true,   // flag: notification se aaye hain
          showMembershipModal: true // flag: Main screen pe modal dikhana hai
        });
        return;
      }

      // baaki ka purana logic agar chahiye
      const screen = data.screen || 'Main';
      NavigationService.navigate(screen, data);
    }
  });
}
