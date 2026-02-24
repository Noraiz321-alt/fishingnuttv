import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
  Image, Modal, ActivityIndicator, Switch
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { StackActions, useNavigation, useFocusEffect, DrawerActions, } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import apipost from '../api/GetApi';
import GelleryPic from '../screen/GelleryPic';
import Qrscanner from '../componnent/Qrscanner';
import Video from '../screen/Video';
import View_Post from '../screen/View_Post';
import LeaguesTabs from '../screen/LeaguesTabs';

import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { clearPendingNotification } from '../Notification/pendingNotification';
const DraweContant = (props) => {
  const navigation = useNavigation();
  const { route } = props;
  const dispatch = useDispatch();

  const reduxUser = useSelector(state => state.auth.user);
  // Preference: Redux user, fallback to route params (old flow)
  const Data = reduxUser || route?.params?.responseData || {};
  const isPending = Data?.memberStatus === 'pending';

  console.log('show data drawer', Data)
  const memberID = Data.memberID || '';
  const fullName = `${Data.first_name || ''} ${Data.last_name || ''}`;

  const [profileImage, setProfileImage] = useState(Data.prof_image || '');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [shopUrl, setShopUrl] = useState(null);

  const [pageSwitches, setPageSwitches] = useState({
    GelleryPic: false,
    Qrscanner: false,
    View_Post: false,
    LeaguesTabs: false,
    Video: false,
  });

  const itemData = { image_url: profileImage };

  const getUserProfile = async () => {
    try {
      const res = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/profile/${memberID}`);
      setProfileImage(res.data.data.image_url);
    } catch (error) {
      console.error('User profile fetch error:', error);
    }
  };

  const fetchSidebarVisibility = async () => {
    try {
      const res = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/get_AppSidebar_visibility.php');
      const data = await res.json();
      const visibleItems = data.visible_items || [];
      console.log('✅ Visible menu items from API:', visibleItems);

      const updatedSwitches = {
        GelleryPic: visibleItems.includes('GelleryPic'),
        Qrscanner: visibleItems.includes('Qrscanner'),
        View_Post: visibleItems.includes('View_Post'),
        LeaguesTabs: visibleItems.includes('LeaguesTabs'),
        Video: visibleItems.includes('Video'),
        'Bait Store': visibleItems.includes('Bait Store'), // ✅ Add this line
      };

      setPageSwitches(updatedSwitches);
    } catch (err) {
      console.error('Sidebar visibility fetch error:', err);
    }
  };

  const postSidebarVisibility = async (admin_id) => {
    const allPages = ['GelleryPic', 'Qrscanner', 'View_Post', 'LeaguesTabs', 'Video'];
    const formData = new FormData();
    formData.append('admin_id', admin_id);
    allPages.forEach(item => formData.append('menu_items[]', item));

    try {
      const res = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/app_sidebar_visibility.php', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        console.log('Sidebar POST success:', data);
      } catch (err) {
        console.error('JSON parse error:', err);
      }
    } catch (err) {
      console.error('Sidebar post error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('state', () => {
      const drawerState = props.navigation.getState();

      const isDrawerOpen = drawerState.history?.some(
        (entry) => entry.type === 'drawer'
      );

      if (isDrawerOpen) {
        console.log('📂 Drawer open detected (via state listener)');
        fetchSidebarVisibility();
        fetchShopUrl();

      }
    });

    return unsubscribe;
  }, [props.navigation]);


  useFocusEffect(
    React.useCallback(() => {
      console.log('🔔 DrawerContent focused, API call hone wali hai...');
      const fetchAndPost = async () => {
        await getUserProfile();
        await fetchSidebarVisibility();
        await fetchShopUrl();
        // await postSidebarVisibility(memberID);
      };
      fetchAndPost();
    }, [])
  );



  const fetchShopUrl = async () => {
    try {
      const response = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/bait_store_api.php');
      const data = await response.json();
      console.log('show url data>>>>>', data)
      if (data.status === 'success') {
        setShopUrl(data.shop_url); // API se URL mil gaya
      } else {
        console.error('API returned error');
      }
    } catch (err) {
      console.error('Network/API Error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      if (fingerprintEnabled === 'false') {
        await AsyncStorage.removeItem('user');
      }
      dispatch(clearUser());
      await clearPendingNotification();
      navigation.dispatch(StackActions.replace('Login', { fromLogout: true }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageUpload = async () => {
    const imageResponse = await launchImageLibrary({ mediaType: 'photo' });
    if (imageResponse.didCancel) return;

    setLoading(true);

    try {
      const imageUri = imageResponse.assets[0].uri;
      const imageName = imageUri.split('/').pop();
      const formData = new FormData();

      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageName,
      });

      const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/profile/update-image/${memberID}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setProfileImage(data.data.image_url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountHandler = async () => {
    try {
      setModalVisible(false);
      const res = await axios.get(`${apipost.deleteacount}${memberID}`);
      if (res.data.message === 'User account deleted successfully') {
        // Redux + navigation cleanup on account delete
        dispatch(clearUser());
        navigation.dispatch(StackActions.replace('Login'));
      }
    } catch (err) {
      console.error('Account delete error:', err);
    }
  };

  const renderItem = (title, icon, target, pageKey) => {
    const isVisibleToUser = pageSwitches[pageKey];
    if (!isVisibleToUser) return null;

    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate(target, { data: Data })}
        >
          {icon}
          <Text style={styles.text2}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerContentScrollView contentContainerStyle={{ marginTop: 20 }}>
        <View style={styles.header}>
          <View style={styles.imgWrapper}>
            <View style={styles.mainImg}>
              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#1b6001" />
                </View>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Zoom_image', { itemData })}>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.Img}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleImageUpload} style={styles.cameraIconContainer}>
              <FontAwesome name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingLeft: 15 }}>
          {renderItem('Your Catches', <MaterialIcons name="photo-library" size={33} color="#1b6001" />, 'GelleryPic', 'GelleryPic')}
          {!isPending &&
            renderItem(
              'Peg Scanner',
              <MaterialIcons name="document-scanner" size={33} color="#1b6001" />,
              Qrscanner,
              'Qrscanner'
            )
          }
          {renderItem('View Posts', <MaterialIcons name="newspaper" size={33} color="#1b6001" />, View_Post, 'View_Post')}
          {renderItem('Leagues', <Entypo name="trophy" size={33} color="#1b6001" />, LeaguesTabs, 'LeaguesTabs')}
          {renderItem('Videos', <MaterialCommunityIcons name="message-video" size={33} color="#1b6001" />, Video, 'Video')}


          {pageSwitches['Bait Store'] && shopUrl && (
            <TouchableOpacity
              style={styles.item1}
              onPress={() =>
                navigation.navigate('LeagueWebView', {
                  url: shopUrl,
                })
              }
            >
              <FontAwesome name="shopping-basket" size={25} color="#1b6001" />
              <Text style={styles.text2}>Bait Store →</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.item1} onPress={() => setModalVisible(true)}>
            <AntDesign name="delete" size={25} color="#DC143C" />
            <Text style={styles.text1} allowFontScaling={false}>Close My Account</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <AntDesign name="logout" size={30} color="#b9dfab" />
        <Text style={styles.textbtn}>Sign Out</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalMainContainer}>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteAccountHandler} style={styles.deleteBtn}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DraweContant;

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b9dfab',
    opacity: 0.9,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    marginBottom: vs(10),
  },
  imgWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    width: s(140), // scaled
    aspectRatio: 1,
    justifyContent: 'center',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    borderRadius: s(70),
    borderWidth: s(4),
    borderColor: '#1b6001',
    overflow: 'hidden',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Img: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: vs(5),
    right: s(10),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: s(8),
    borderRadius: s(100),
    elevation: 5,
    zIndex: 5,
  },
  name: {
    color: '#1b6001',
    fontSize: s(18),
    fontWeight: '600',
    marginTop: vs(10),
  },
  item1: {
    marginVertical: vs(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: vs(15),
    paddingRight: s(15),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text2: {
    fontSize: s(16),
    color: '#1b6001',
    fontWeight: '500',
    marginLeft: s(10),
  },
  text1: {
    fontSize: s(16),
    color: '#DC143C',
    fontWeight: '500',
    marginLeft: s(10),
  },
  btn: {
    paddingHorizontal: s(15),
    alignItems: 'center',
    height: vs(55),
    width: '100%',
    backgroundColor: '#1b6001',
    flexDirection: 'row',
    marginBottom: vs(50),
  },
  textbtn: {
    color: '#b9dfab',
    fontWeight: '600',
    fontSize: s(18),
    paddingLeft: s(10),
    opacity: 0.9,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainContainer: {
    backgroundColor: '#1b6001',
    padding: s(20),
    borderRadius: s(10),
    width: '80%',
  },
  modalText: {
    color: '#b9dfab',
    fontWeight: 'bold',
    fontSize: s(20),
    marginBottom: vs(20),
    textAlign: 'center',
  },
  modalButtonText: {
    color: '#b9dfab',
    fontSize: s(18),
    fontWeight: '500',
  },
  cancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#b9dfab',
    width: '28%',
    height: vs(45),
    borderRadius: s(25),
  },
  deleteBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: s(3),
    borderColor: '#b9dfab',
    width: '30%',
    height: vs(45),
    borderRadius: s(25),
  },
});