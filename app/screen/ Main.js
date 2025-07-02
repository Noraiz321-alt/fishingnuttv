import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TouchableOpacity, Alert, Linking,ActivityIndicator,StatusBar} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import image from '../Utilis/image';
import { useNavigation, DrawerActions, useFocusEffect } from '@react-navigation/native'
import axios from 'react-native-axios'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

import EvilIcons from 'react-native-vector-icons/EvilIcons'

const Main = ({ route }) => {
  const navigation = useNavigation();
  const responseData = route.params?.responseData || null;
  console.log('show responce data///', responseData)
  const [profileImage, setProfileImage] = useState(responseData.prof_image);
  const url = 'https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=qrLink&memberStatus=' + responseData.memberStatus + '&memberID=' + responseData.memberID;
  const [vari, setVari] = useState('');
  const [expirdata, setExpirData] = useState('');
  const [updateexpiry,setUpdateExpiry] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
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
  const handleButtonPress = () => {
    if (updateexpiry) {
      const redirectUrl = updateexpiry.redirect_url?.trim(); // remove extra spaces
  
      if (redirectUrl && redirectUrl !== '') {
        // If redirect_url exists and is not empty, navigate
        navigation.navigate('LeagueWebView', {
          url: redirectUrl,
          title: 'Extend Membership'
        });
      } else if (typeof updateexpiry.message === 'string' && updateexpiry.message !== '') {
        // If redirect_url is empty and message is present, show alert
        Alert.alert(
          'Details',
          updateexpiry.message.substring(0, 500), // show first 500 characters
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Unexpected response format.');
      }
    } else {
      Alert.alert('Error', 'No response received.');
    }
  };

  // const handleButtonPress = () => {
  //   if (typeof updateexpiry === 'string') {
  //     // Show alert with message
  //     Alert.alert(
  //       'Details',
  //       updateexpiry.substring(0, 500) , // show first 500 chars
  //       [{ text: 'OK' }]
  //     );
  //   } else if (updateexpiry && updateexpiry.redirect_url) {
  //     if (Platform.OS === 'android') {
  //       if (updateexpiry?.redirect_url) {
  //         navigation.navigate('LeagueWebView', {
  //           url: updateexpiry.redirect_url,
  //           title: 'Extend Membership'
  //         });
  //       } else {
  //         Alert.alert('Error', 'No URL found');
  //       }
  //     }
  //     else if (Platform.OS === 'ios') {
  //       sendPostRequest(); // iOS logic
  //     }
  //   } else {
  //     Alert.alert('Error', 'Unexpected response format.');
  //   }
  // };

  
 
  // const handleButtonPress = () => {
  //   if (Platform.OS === 'android') {
  //     const url = updateexpiry.redirect_url;
  //     Linking.openURL(url)
  //       .then((data) => {
  //         // Do something if the URL was opened successfully
  //         console.log('URL Opened:', data);
  //       })
  //       .catch((error) => {
  //         // Handle errors when trying to open the URL
  //         console.error('Error opening URL:', error);
  //       });
  //   } else if (Platform.OS === 'ios') {
    
  //     sendPostRequest()
  //     // navigation.navigate('SignUp');
  //   }
  // };
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
    <>
     <StatusBar
          backgroundColor="#000000" // Android
          barStyle="#ffffff"   // iOS + Android icon color
          translucent={false}  />
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
              size={140} // Set the size of the QR code (optional)
              color="black" // Set the color of the QR code (optional)
              backgroundColor="white" // Set the background color (optional)
              logo={{ uri: 'https://example.com/logo.png', backgroundColor: 'transparent' }} // Add a logo to the center of the QR code (optional)
            />
            
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', color: '#1b6001', fontSize: 25, paddingBottom: 20 }} >Membership expiry</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',flexWrap:'wrap',gap:10,paddingHorizontal:10 }}>
                    <View>
                      <Text style={{ fontSize: 20, color: 'red' }} >{expirdata.membership_expiry_date}</Text>
                    </View>
                    <TouchableOpacity onPress={handleButtonPress} style={{ paddingHorizontal: 10, backgroundColor: '#1b6001', borderRadius: 5, paddingVertical: 5,alignItems:'center' }}>
                    {loading ?
                    <ActivityIndicator size="small" color="white" />
                    :
                      <Text style={{ fontSize: 15, color: 'white',}} >Extend Membership</Text>
                    }
                    </TouchableOpacity>
                  </View>
              </View>
          
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
    </>
  );
}
export default Main;
const styles = StyleSheet.create({
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
    height: 180,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: -15,
    alignContent: 'center',
  },
  logoImage: {
    width: '90%',
    height: 60,
  },
  headerContainer: {
    marginTop: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: 100,
    flex: 1,
    width: '100%',
    backgroundColor: '#b9dfab',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardImageContainer: {
    borderWidth: 4,
    borderRadius: 120,
    borderColor: '#1b6001',
  },
  cardImage: {
    width: 140,
    height: 140,
    borderRadius: 120,
  },
  cardText: {
    fontWeight: '700',
    color: '#1b6001',
    fontSize: 25,
    // paddingVertical: 20s
    // paddingBottom: 25,
  },
  cardText1: {
    fontWeight: '700',
    color: '#1b6001',
    fontSize: 25,
    top: 10,

    // paddingVertical: 20
    // paddingBottom: 25,
  },
  cardText2: {
    color: '#1b6001',
    fontSize: 25,
    top: 10,

    // paddingVertical: 20
    // paddingBottom: 25,
  },
});
