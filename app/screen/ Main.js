import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity, Alert, Linking, ActivityIndicator, StatusBar } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import image from '../Utilis/image';
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native'
import axios from 'react-native-axios'
import { ScaledSheet, s, vs } from 'react-native-size-matters';



const Main = ({ route }) => {
  const navigation = useNavigation();
  const responseData = route.params?.responseData || null;
  console.log('show responce data///', responseData)
  const [profileImage, setProfileImage] = useState(responseData.prof_image);
  const url = 'https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=qrLink&memberStatus=' + responseData.memberStatus + '&memberID=' + responseData.memberID;
  const [vari, setVari] = useState('');
  const [expirdata, setExpirData] = useState('');
  const [updateexpiry, setUpdateExpiry] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#000000', true); // black background
        StatusBar.setBarStyle('light-content', true);  // white text/icons
      } else if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content', true);   // black text/icons
        // iOS doesn't support setting background color directly from JS
        // So you can adjust it using your View background or Navigation options
      }
      getUserProfile();
      expirydata();
      update_expiry();
      return () => {
      };
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
    // console.log('URL: ', url)
    // console.log("This is response7 data: ", res.data)
    setVari(res.data)
  }


  const update_expiry = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/signupWizard/update_memExpiry.php?id=${responseData.memberID}`);
      console.log('display url >>>>x>>>>>', response.data);
      setUpdateExpiry(response.data); // can be string or object
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };



  const expirydata = async () => {
    try {
      const response = await axios.get(`https://www.fishingnuttv.com/fntv-custom/fntv-apis-lar/public/api/membership-expiry-date/${responseData.memberID}`);
      // console.log('User Profile Image :', response.data);
      response.data;
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
  // const handleButtonPress = () => {
  //   if (updateexpiry) {
  //     const redirectUrl = updateexpiry.redirect_url?.trim(); // remove extra spaces

  //     if (redirectUrl && redirectUrl !== '') {
  //       // If redirect_url exists and is not empty, navigate
  //       navigation.navigate('LeagueWebView', {
  //         url: redirectUrl,
  //         title: 'Extend Membership'
  //       });
  //     } else if (typeof updateexpiry.message === 'string' && updateexpiry.message !== '') {
  //       // If redirect_url is empty and message is present, show alert
  //       Alert.alert(
  //         'Details',
  //         updateexpiry.message.substring(0, 500), // show first 500 characters
  //         [{ text: 'OK' }]
  //       );
  //     } else {
  //       Alert.alert('Error', 'Unexpected response format.');
  //     }
  //   } else {
  //     Alert.alert('Error', 'No response received.');
  //   }
  // };

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
          <View style={styles.cardContainer}>
            <View style={styles.cardImageContainer}>
              <Image source={{ uri: profileImage }} style={styles.cardImage} />
            </View>
            <Text style={styles.cardText}>{responseData.first_name} {responseData.last_name}</Text>
            <QRCode
              value={vari.qrcode}
              size={160}
              color="black"
              backgroundColor="white"
              logo={image.logo1}
              logoSize={40}
              logoBackgroundColor="transparent"
              logoBorderRadius={100} // ✅ Yeh line logo ko gol bana degi
            />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: '#1b6001', fontSize: 25, paddingBottom: 20 }} >Membership expiry</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingHorizontal: 10 }}>
                <View>
                  <Text style={{ fontSize: 20, color: 'red' }} >{expirdata.membership_expiry_date}</Text>
                </View>
                <TouchableOpacity onPress={handleButtonPress} style={{ paddingHorizontal: 10, backgroundColor: '#1b6001', borderRadius: 5, paddingVertical: 5, alignItems: 'center' }}>
                  {loading ?
                    <ActivityIndicator size="small" color="white" />
                    :
                    <Text style={{ fontSize: 15, color: 'white', }} >Extend Membership</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: '#b9dfab',
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
    fontWeight: '700',
    color: '#1b6001',
    fontSize: s(25),
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
