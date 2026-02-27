import { View, Text, FlatList, ImageBackground, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, Animated, StatusBar, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'react-native-axios';
import apipost from '../api/GetApi';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Bcalender from '../componnent/Bcalender';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationService from '../Navigation/NavigationServices';


export default function Booking({ route }) {
  const reduxUser = useSelector(state => state.auth.user);
  // Preference: Redux user, fallback to params
  const responseData = reduxUser || route.params?.responseData || {};
  // console.log('Lake  details data>>>>>>>???????', responseData.memInfo)
  const isFromNotification = route?.params?.fromNotification === true;

  useEffect(() => {
    if (isFromNotification) {
      console.log('🔔 Opened from notification');
    }
  }, []);
  ////////
  const status = (responseData?.memberStatus || '').toLowerCase();
  const isPending = status === 'pending' || status === 'suspend' || status === 'suspended';

  console.log('Lake details data >>>>>', responseData);

  const memInfo = responseData?.memInfo || null;

  ////////////
  // console.log('Lake details data >>>>>', memInfo);

  const toggleDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const scaleAnimation = new Animated.Value(0.8);

  // 🔔 Custom notification modal (admin image notification)
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState(null);
  const [notificationImageLoading, setNotificationImageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lakeData, setLakeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorite, setFavorite] = useState([]);
  const [profileImage, setProfileImage] = useState(responseData.prof_image);
  const [selectedLake, setSelectedLake] = useState(null);

  // 🔔 Notification data → modal open (sirf custom image membership ke liye)
  useEffect(() => {
    const notifData = route?.params?.notificationData || route?.params?.data;
    if (!notifData) return;

    console.log('🔔 Booking - notification data:', notifData);
    setNotificationInfo(notifData);

    const isExpiryReminder =
      typeof notifData.body === 'string' &&
      notifData.body.toLowerCase().includes('membership is expiring soon');

    if (notifData?.image) {
      setNotificationImageLoading(true);
    }

    // Sirf tab modal dikhana jab expiry reminder na ho
    if (!isExpiryReminder && (notifData?.image || notifData?.title)) {
      setShowNotificationModal(true);
    }
  }, [route?.params?.notificationData, route?.params?.data]);



  async function requestUserPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android notification permission granted');
        return true; // ✅ IMPORTANT
      } else {
        console.log('Android notification permission denied');
        return false;
      }
    }

    // Android < 13
    return true;
  }

  useEffect(() => {
    let unsubscribe;

    const initFCM = async () => {
      const hasPermission = await requestUserPermission();

      if (!hasPermission) {
        console.log('Permission not granted, FCM skipped');
        return;
      }

      // 🔑 FCM TOKEN
      const fcmToken = await messaging().getToken();
      console.log('🔥 FCM TOKEN:', fcmToken);

      // 🆔 USER ID
      const userId = responseData?.memberID;
      console.log('👤 USER ID:', userId);

      if (fcmToken && userId) {
        sendFCMTokenToServer(userId, fcmToken);
      }

      // 🔔 Foreground message
      unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert(
          'New FCM Message',
          remoteMessage.notification?.title || 'Message',
        );
      });
    };

    initFCM();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const sendFCMTokenToServer = async (userId, fcmToken) => {
    console.log('fcm token', fcmToken)
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('fcmtoken', fcmToken);

      const response = await fetch(
        'https://fishingnuttv.com/fntv-custom/appFCMtoken.php',
        {
          method: 'POST',
          body: formData,
        },
      );

      const result = await response.json();
      console.log('✅ FCM Token API Response:', result);
    } catch (error) {
      console.log('❌ Error sending FCM token:', error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle('dark-content', true);        // 👈 force override
        StatusBar.setBackgroundColor('#ffffff', true);
      }
      LakeApies()
      getUserProfile()
      return () => {
      };
    }, [])
  );
  const saveMemInfo = async () => {
    try {
      if (responseData?.memInfo) {
        await AsyncStorage.setItem('redirect_params', responseData.memInfo);
        console.log('✅ memInfo saved directly:', responseData.memInfo);
      } else {
        console.warn('⚠️ memInfo not found in route params');
      }
    } catch (error) {
      console.error('Error saving memInfo to AsyncStorage:', error);
    }
  };
  useEffect(() => {
    saveMemInfo()
    LakeApies()
    Favorite()
    getUserDataaa()
    const checkAdminStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.custom_admin === 1) {
            setIsVisible(true);
            Animated.spring(scaleAnimation, {
              toValue: 1,
              friction: 5,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              setIsVisible(false);
            }, 1000); // Popup hide after 3 seconds
          }
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    checkAdminStatus();
    // console.log('favvvvv')
  }, [searchQuery]);


  const getUserDataaa = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('Retrieved user data:>>>', userData);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/profile/${responseData.memberID}`);
      // console.log('User Profile Image :', response.data);
      const imageUrl = response.data.data.image_url;
      setProfileImage(imageUrl);

    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };
  const LakeApies = async () => {
    try {
      const response = await axios.get(`${apipost.Lakeapi}/${responseData.memberID}`, { timeout: 10000 });
      console.log('lake Api>>>>>+====== ', response)
      setLakeData(response.data);
      // console.log('lake Api>>>>>+====== ', lakeData)
    } catch (error) {
      console.error('Error:', error.message);
    }
    finally {
      setLoading(false); // 👈 DATA LOAD HONE KE BAAD
    }
  };

  const Favorite = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/user-favorite-lakes/${responseData.memberID}`);
      const lakeIdsFromData = response.data.userFavoriteLakes.map(item => item.lake_id);
      setFavorite(lakeIdsFromData);

      // Log lake_id values to the console
      console.log('Lake IDs:', lakeIdsFromData);


    } catch (error) {
      console.error('Error:', error.message);
    }

  }


  const markAsFavorite = async (lakeId) => {
    try {
      const response = await axios.post(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-lakes/${responseData.memberID}/${lakeId}/favorite`);
      console.log('markAsFavorite API Response:', response.data);
      // const favoriteIds = response.data.userFavoriteLakes.map(element => element.lake_id);
      // setFavorite(favoriteIds);
      Favorite();
      LakeApies(); // Refresh the lake data after marking as favorite

    } catch (error) {
      console.error('Error marking as favorite:', error);
    }

  };
  const unmarkAsFavorite = async (lakeId) => {
    try {
      const response = await axios.post(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/custom-lakes/${responseData.memberID}/${lakeId}/unfavorite`);
      console.log('unFavorite API Response:', response.data);
      // const favoriteIds = response.data.userFavoriteLakes.map(element => element.lake_id);
      // setFavorite(favoriteIds);
      console.log(response.data, "unfavrote testes");
      Favorite();
      LakeApies(); // Refresh the lake data after unmarking as favorite
    } catch (error) {
      console.error('Error unmarking as favorite:', error);
    }
  };
  console.log(favorite, "testfav");
  const SkeletonCard = () => {
    return (
      <View style={{ paddingBottom: 15, paddingTop: 5 }}>
        <View style={styles.card}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: 90, height: 127, borderRadius: 8 }}
          />

          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: '60%', height: 18, borderRadius: 4, marginBottom: 10 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: '90%', height: 14, borderRadius: 4, marginBottom: 6 }}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: '85%', height: 14, borderRadius: 4 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ width: 120, height: 14, borderRadius: 4 }}
              />
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{ width: 90, height: 28, borderRadius: 6 }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderItem = ({ item, index }) => (
    <View style={{ paddingBottom: 15, }}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.img}
            source={{ uri: item.image_url }}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>

              <View style={{ flexDirection: 'row' }}>
                {item.name.length > 20 ? (
                  <>
                    <Text style={styles.heading}>{item.name.substring(0, 20)}</Text>
                    <Text style={styles.heading}> ...</Text>
                  </>
                ) : (
                  <Text style={styles.heading}>{item.name}</Text>
                )}
              </View>
            </View>
            <View>
              {favorite.includes(item.lake_id) ? (
                <TouchableOpacity onPress={() => unmarkAsFavorite(item.lake_id)}>
                  <Entypo name='heart' style={{ color: 'red' }} size={s(30)} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => markAsFavorite(item.lake_id)}>
                  <Entypo name='heart-outlined' size={s(30)} style={{ color: 'black' }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.paragraph} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={styles.peg}>Pegs Available Today: {item.max_pegs}</Text>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Bcalender', { itemData: item, memberID: responseData.memberID })}
              style={styles.choosePegButton}
            >
              <Text style={styles.choosePegButtonText}>Choose A Peg {item.button}</Text>
            </TouchableOpacity> */}
            {!isPending && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Bcalender', {
                    itemData: item,
                    memberID: responseData.memberID,
                  })
                }
                style={styles.choosePegButton}
              >
                <Text style={styles.choosePegButtonText}>
                  Choose A Peg {item.button}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.nav} onPress={toggleDrawer}>
          <EvilIcons name="navicon" size={s(35)} color='black' />
        </TouchableOpacity>

        <View>
          <Image style={styles.Imglg} source={require('../image/logooo.png')} />
        </View>
        <TouchableOpacity
          style={styles.notifIconWrap}
          onPress={() => NavigationService.navigate('NotificationsList')}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications" size={s(24)} color="#1b6001" />
        </TouchableOpacity>
      </View>


      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AntDesign name="search1" size={s(30)} color='#9ca74b' />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Lakes"
            placeholderTextColor="#a1a19f"
            onChangeText={(text) => setSearchQuery(text)}
          />
          <View style={styles.filterIcon}>
            <AntDesign name="filter" size={s(30)} color='#9ca74b' />
          </View>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Let's Go Fishing</Text>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          Array.from({ length: lakeData?.length || 1 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          <FlatList
            data={lakeData.filter(item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={({ item, index }) => renderItem({ item, index })}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <Animated.View style={[styles.popup, { transform: [{ scale: scaleAnimation }] }]}>
            <Text style={styles.text}>🎉 Welcome to Admin Version 🎯</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* 🔔 Membership / custom notification modal */}
      <Modal
        visible={showNotificationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <View
            style={{
              width: '88%',
              maxHeight: '100%',
              backgroundColor: '#f7fff4',
              borderRadius: 18,
              paddingVertical: 16,
              paddingHorizontal: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}>

            {/* TOP GREEN BAR + TITLE */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View
                style={{
                  width: 6,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: '#1b6001',
                  marginRight: 8,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#1b6001',
                  }}
                  numberOfLines={1}
                >
                  {notificationInfo?.title || 'Notification'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#4d7c3a',
                    marginTop: 2,
                  }}>
                  FishingNutTV Notification
                </Text>
              </View>
            </View>

            {/* IMAGE */}
            {notificationInfo?.image ? (
              <View
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 12,
                  marginBottom: 12,
                  backgroundColor: '#e8f0e5',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                {notificationImageLoading ? (
                  <ActivityIndicator size="large" color="#1b6001" />
                ) : null}
                <Image
                  source={{ uri: notificationInfo.image }}
                  style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 12,
                    position: 'absolute',
                  }}
                  resizeMode="cover"
                  onLoadEnd={() => setNotificationImageLoading(false)}
                />
              </View>
            ) : null}

            {/* BODY TEXT */}
            <View
              style={{
                maxHeight: 180,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#d5ebcb',
                backgroundColor: '#ffffff',
                paddingHorizontal: 10,
                paddingVertical: 8,
                marginBottom: 12,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#333',
                  lineHeight: 20,
                }}>
                {notificationInfo?.body || ''}
              </Text>
            </View>

            {/* BUTTONS ROW */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setShowNotificationModal(false)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: '#1b6001',
                  marginRight: 8,
                }}>
                <Text style={{ color: '#1b6001', fontWeight: '600', fontSize: 14 }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>

  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@s',
    // paddingTop: '5@vs',
  },
  searchContainer: {
    paddingHorizontal: '10@s',
  },
  searchBox: {
    borderWidth: '1@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '8@s',
    // paddingVertical: '2@vs',
    borderColor: 'gray',
    borderRadius: '10@s',
    marginBottom: '15@vs',
  },
  searchInput: {
    fontSize: '18@s',
    color: 'black',
    width: '210@s', // Adjust the width as needed
  },
  filterIcon: {
    borderLeftWidth: '1@s',
    paddingLeft: '15@s',
    borderColor: '#a1a19f',
  },
  titleContainer: {
    paddingHorizontal: '10@s',
    // paddingVertical: '10@vs',
    borderBottomEndRadius: '20@s',
  },
  titleText: {
    color: 'black',
    fontSize: '22@s',
    fontWeight: 'bold',
  },
  listContainer: {
    height: '60%', // Adjust the height based on your design requirements
    paddingHorizontal: '10@s',
  },
  card: {
    borderRadius: '8@s', // 3% scaled for different devices
    overflow: 'hidden',
    backgroundColor: '#f8f9f9',
    marginVertical: '15@vs', // Scaled vertical margin
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '90@s', // Scaled width
    height: '127@s', // Full height of the card
    backgroundColor: '#f8f8ff',
    overflow: 'hidden',
  },
  img: {
    width: '100%', // Full width of the container
    height: '100%', // Full height of the container
    resizeMode: 'cover',
    borderRadius: '8@s', // Scaled border radius
  },
  textContainer: {
    flex: 1, // Takes remaining space next to the image
    justifyContent: 'center',
    backgroundColor: '#f9f9ff',
    paddingHorizontal: '10@s', // Scaled horizontal padding
    // paddingTop: '10@vs', // Scaled vertical padding
  },
  heading: {
    color: '#000000',
    fontSize: '14@s', // Scaled font size
    fontWeight: '800',
  },
  paragraph: {
    color: '#565656',
    paddingTop: '4@vs', // Scaled padding top
    paddingBottom: '13@vs',
    fontSize: '13@s', // Scaled font size
    // height: '45@vs', // Scaled heights
  },
  peg: {
    color: '#000000',
    letterSpacing: '-0.8@s', // Scaled letter spacing
    paddingVertical: '10@vs', // Scaled padding vertical
    fontWeight: 'bold',
    fontSize: '10@s', // Scaled font size
  },
  choosePegButton: {
    marginTop: '10@vs',
    paddingHorizontal: '10@s',
    backgroundColor: '#1b6001',
    borderRadius: '5@s',
    paddingVertical: '4@vs',
  },
  choosePegButtonText: {
    color: 'white',
    fontSize: '12.5@s',
  },
  mainImg: {
    width: '45@s', // Scaled width
    height: '45@s', // Scaled height
    borderRadius: '100@s', // Scaled border radius
    borderWidth: '3@s', // Scaled border width
    borderColor: '#b9dfab',
  },
  notifIconWrap: {
    width: '45@s',
    height: '45@s',
    borderRadius: '100@s',
    backgroundColor: '#b9dfab',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav: {
    width: '45@s', // Scaled width
    height: '45@s', // Scaled height
    borderRadius: '25@s', // Scaled border radius
    backgroundColor: '#b9dfab',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Imglg: {
    width: '80@s', // Scaled width
    height: '80@s', // Scaled height
    borderRadius: '100@s', // Scaled border radius
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // More dark overlay
  },
  popup: {
    backgroundColor: '#1b6001',
    paddingHorizontal: '40@ms',
    paddingVertical: '25@ms',
    borderRadius: '15@ms',
    elevation: 10,
    minWidth: '270@ms',
    alignItems: 'center',
    shadowColor: '#1b6001',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  text: {
    color: '#ffffff',
    fontSize: '20@ms',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});  