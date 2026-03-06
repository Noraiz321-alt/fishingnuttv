import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity, Alert, Linking, ActivityIndicator, StatusBar, Modal, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import image from '../Utilis/image';
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native'
import axios from 'react-native-axios'
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { useSelector } from 'react-redux';

const Main = ({ route }) => {
  const navigation = useNavigation();
  const reduxUser = useSelector(state => state.auth.user);
  console.log('redux',reduxUser)
  // Preference: Redux user, fallback to params
  const responseData = reduxUser || route.params?.responseData || null;
  const [showTestModal, setShowTestModal] = useState(false);
  const [notificationInfo, setNotificationInfo] = useState(null);

  const [profileImage, setProfileImage] = useState(responseData?.prof_image || '');

  const url = 'https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=qrLink&memberStatus=' + responseData?.memberStatus + '&memberID=' + responseData?.memberID;
  const [vari, setVari] = useState('');
  const [expirdata, setExpirData] = useState('');
  const [updateexpiry, setUpdateExpiry] = useState('');
  const [loading, setLoading] = useState(false);

  // Notification ka data is page tak — dekho console mein
  useEffect(() => {
    const notifData = route?.params?.notificationData || route?.params?.data;
    const { fromNotification, showMembershipModal } = route?.params || {};

    console.log('🔔 Main - notification data: ', notifData);

    if (!notifData) return;

    setNotificationInfo(notifData);

    if (fromNotification && showMembershipModal) {
      setShowTestModal(true);
    }
  }, [route?.params]);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#000000', true);
        StatusBar.setBarStyle('light-content', true);
      } else if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content', true);
      }
      console.log('12345678910');
      getUserProfile();
      expirydata();
      update_expiry();
      return () => { };
    }, [])
  );

  useEffect(() => {
    update_expiry();
    getdata();
  }, [navigation]);

  const getdata = async () => {
    const res = await axios({
      method: 'get',
      url: ('https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=qrLink&memberStatus=' + responseData.memberStatus + '&memberID=' + responseData.memberID),
    });
    setVari(res.data)
  }


  const update_expiry = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/signupWizard/update_memExpiry.php?id=${responseData.memberID}`);
      console.log('display url >>>>x>>>>>', response.data);
      setUpdateExpiry(response.data);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };



  const expirydata = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/membership-expiry-date/${responseData.memberID}`);
      console.log('expair data', response.data);
      setExpirData(response.data);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
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



  const handleButtonPress = () => {
    if (typeof updateexpiry === 'string') {
      Alert.alert(
        'Details',
        updateexpiry.substring(0, 500),
        [{ text: 'OK' }]
      );
    } else if (
      updateexpiry &&
      typeof updateexpiry === 'object' &&
      updateexpiry.redirect_url
    ) {
      navigation.navigate('LeagueWebView', {
        url: updateexpiry.redirect_url,
        title: 'Extend Membership'
      });
    } else {
      Alert.alert('Error', 'Unexpected response format.');
    }
  };


  // Membership status helpers
  const status = (responseData?.memberStatus || '').toLowerCase();
  const isPendingOrSuspended =
    status === 'pending' || status === 'suspend' || status === 'suspended';

  const cardBgColor = isPendingOrSuspended ? '#FFA500' : '#b9dfab';

  const expiryTextColor = isPendingOrSuspended ? 'red' : '#1b6001';


  // const sendPostRequest = async () => {
  //   try {
  //     setLoading(true)

  //     const formdata = new FormData();
  //     formdata.append('id',responseData.memberID );
  //     console.log('id show!!!!!',formdata )

  //     const response = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/memExpiryMail.php', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: formdata,
  //     });
  //     setLoading(false)
  //     const data = await response.json();
  //     console.log('Response:', data);
  //     Alert.alert('Response',data);
  //   } catch (error) {
  //     setLoading(false)
  //     console.error('Error:', error);
  //     Alert.alert('Error', error.message);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.background} source={image.logo}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View>
            <TouchableOpacity style={{ paddingLeft: 7, paddingTop: 40 }}>
              {/* <EvilIcons name="navicon" size={40} color='white' /> */}
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Image source={image.backimg} resizeMode='contain' style={styles.logoImage} />
          </View>
          <View style={[styles.cardContainer, { backgroundColor: cardBgColor }]}>
            {/* <Text
              style={{
                fontWeight: '700',
                fontSize: s(22),
                textAlign: 'center',
                color: '#1b6001',
              }}
            >
              Membership Status{' '}
            </Text> */}

            <View
              style={{
                alignSelf: 'center', // center me hi rahe
                borderWidth: 2,
                borderColor:
                  responseData?.memberStatus === 'approved'
                    ? '#1b6001'
                    : 'red',
                paddingHorizontal: 35,
                paddingVertical: 7,
                borderRadius: 20,
                marginTop: 6,
                // backgroundColor:
                // responseData?.memberStatus === 'approved'
                // ? '#1b6001'
                // : 'red',
              }}
            >
              <Text
                style={{
                  color:
                    responseData?.memberStatus === 'approved'
                      ? '#1b6001'
                      : 'red',
                  fontSize: s(20),
                  fontWeight: 'bold',
                }}
              >
                {responseData?.memberStatus?.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.cardText}>{responseData?.first_name} {responseData?.last_name}</Text>
            <View style={styles.cardImageContainer}>
              <Image source={{ uri: profileImage }} style={styles.cardImage} />
            </View>

            {(() => {
              // QR value: pehle API ka qrcode, warna memberID, warna ek default text
              const qrValue =
                vari?.qrcode ||
                (responseData?.memberID
                  ? String(responseData.memberID)
                  : 'FNTV-MEMBER');

              return (
                <QRCode
                  value={qrValue}
                  size={160}
                  color="black"
                  backgroundColor="white"
                  logo={image.logo1}
                  logoSize={40}
                  logoBackgroundColor="transparent"
                  logoBorderRadius={100} // ✅ Yeh line logo ko gol bana degi
                />
              );
            })()}
            <View style={{ alignItems: 'center' }}>

              <View style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingHorizontal: 10 }}>
                <View>
                  {((responseData?.memberStatus === 'approved') && (expirdata?.membership_expiry_date === '0000-00-00')) ? (
                    <View style={{ backgroundColor: '#1b6001', borderRadius: 50, paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                        {expirdata?.membership_expiry_date}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: expiryTextColor }}>
                      {expirdata?.membership_expiry_date}
                    </Text>
                  )}
                </View>
                {!((responseData?.memberStatus === 'approved') && (expirdata?.membership_expiry_date === '0000-00-00')) && (
                  <TouchableOpacity onPress={handleButtonPress} style={{ paddingHorizontal: 50, backgroundColor: '#1b6001', borderRadius: 50, paddingVertical: 10, alignItems: 'center' }}>
                    {loading ?
                      <ActivityIndicator size="small" color="white" />
                      :
                      <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }} >Renew Membership</Text>
                    }
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal
          visible={showTestModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTestModal(false)}
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
                    {notificationInfo?.title || 'Membership Update'}
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
                <Image
                  source={{ uri: notificationInfo.image }}
                  style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                  resizeMode="cover"
                />
              ) : null}

              {/* BODY – SCROLLABLE TEXT */}
              <View
                style={{
                  flex: 1,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#d5ebcb',
                  backgroundColor: '#ffffff',
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  marginBottom: 12,
                }}>
                <ScrollView
                  style={{ maxHeight: 180 }}
                  contentContainerStyle={{ paddingBottom: 4 }}
                  showsVerticalScrollIndicator={true}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                      lineHeight: 20,
                    }}>
                    {notificationInfo?.body || ''}
                  </Text>
                </ScrollView>
              </View>

              {/* BUTTONS ROW */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setShowTestModal(false)}
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

                {/* Agar baad me koi action lena ho (e.g. Go to Membership) */}
                {/* <TouchableOpacity
          onPress={() => {
            setShowTestModal(false);
            // yahan se koi navigate waghera karna ho to
          }}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 999,
            backgroundColor: '#1b6001',
          }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
            View Details
          </Text>
        </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Modal>

      </ImageBackground>
    </SafeAreaView>

  );
}
export default Main;
const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  logoContainer: {
    width: '100%',
    height: vs(180),  // vertical scaling
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: vs(-15),
    alignContent: 'center',
  },
  logoImage: {
    width: '70%',
    height: vs(60),
  },
  headerContainer: {
    marginTop: vs(10),
  },
  headerText: {
    textAlign: 'center',
    fontSize: s(30),  // scale according to width
    color: 'white',
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: vs(100),
    flex: 1,
    width: '100%',
    // backgroundColor: '#b9dfab',
    borderTopRightRadius: s(35),
    borderTopLeftRadius: s(35),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  cardImageContainer: {
    borderWidth: s(4),
    borderRadius: s(120),
    borderColor: '#1b6001',
  },
  cardImage: {
    width: s(140),
    height: s(140),
    borderRadius: s(120),
  },
  cardText: {
    fontWeight: 'bold',
    color: '#1b6001',
    fontSize: s(22),
  },
  cardText1: {
    fontWeight: '700',
    color: '#1b6001',
    fontSize: s(25),
    top: vs(10),
  },
  cardText2: {
    color: '#1b6001',
   
   
    fontSize: s(25),
    top: vs(10),
  },
});
