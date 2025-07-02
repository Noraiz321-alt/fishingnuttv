import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TextInput, TouchableOpacity, Alert, Linking, ActivityIndicator, Switch } from 'react-native'
import React, { useState, useEffect } from 'react'
import image from '../Utilis/image'
import { StackActions, useNavigation } from '@react-navigation/native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import TouchID from 'react-native-touch-id';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// sami@searlco.com
// Test123@
// andy@searlco.com
// @ndY1979??

const Login = ({ navigation }) => {

  const [show, setshow] = useState(false)
  const [email, setEmail] = useState('sami@searlco.com');
  const [password, setPassword] = useState('Test123@');
  const [valemail, setvalemail] = useState(false)
  const [valpass, setvalpass] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [signupUrl, setSignupUrl] = useState(null);

  useEffect(() => {
    loadFingerprintPreference();
    checkFingerprintStatus();
    console.log('update page')
    fetchSignupUrl();
  }, []);

  const fetchSignupUrl = async () => {
    try {
      const response = await fetch('https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=signup_link');
      const data = await response.json();
  
      console.log('Signup URL Response:', data);
  
      if (data?.signup_link) {
        setSignupUrl(data.signup_link);
      } else {
        Alert.alert('Error', 'Signup link not found in response.');
      }
    } catch (error) {
      console.error('Error fetching signup URL:', error);
      Alert.alert('Error', 'Something went wrong while fetching the signup URL.');
    }
  };

  
  const checkFingerprintStatus = async () => {
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      console.log('Fingerprint enabled status:', fingerprintEnabled);
      if (fingerprintEnabled === 'true') {
        authenticateWithFingerprint();
      } else {
        // navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error checking fingerprint status:', error);
    }
  };

  const authenticateWithFingerprint = async () => {
    const optionalConfigObject = {
      title: 'FishingNutTv',
      imageColor: '#1b6001', // Android
      imageErrorColor: 'red', // Android
      sensorDescription: 'Touch sensor', // Android
      sensorErrorDescription: 'Failed', // Android
      cancelText: 'Cancel', // Android
      fallbackLabel: '', // iOS (if empty, then label is hidden)
      unifiedErrors: false, // use unified error messages (default false)
      passcodeFallback: false, // iOS: allows the device to fall back to using the passcode if faceid or touch is not available.
      backgroundColor: '#FFF', // Background color of the authentication modal
    };
    const user = await AsyncStorage.getItem('user');
    if (user) {

      TouchID.authenticate('FishingNutTv Require TouchID for Verification ', optionalConfigObject)
        .then((response) => {
          console.log(response)

          checkLoginStatus();
        })
        .catch((error) => {
          // Handle authentication failure

          console.log('Error authenticating with fingerprint:', error);
        });
    } else {
      // User data is not present, show alert
      Alert.alert(
        'Please login',
        'Please login using your Logic Id and Password for the first time and accept our terms and conditions to enable your biometric login from next time onwards. You would need to tap on the biometric icon to login using your biometric identity.'
      );
    }
  };
  const checkLoginStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('User data from AsyncStorage:', user); // Log user data from AsyncStorage
      if (user !== null) {
        // If user details are stored in AsyncStorage, navigate to the 'NavigationDrawer' screen
        navigation.dispatch(
          StackActions.replace('NavigationDrawer', {
            responseData: JSON.parse(user),
          })
        );
        return; // Return early to prevent further execution
      }
      console.log('IsLoggedIn: null'); // Log login state
      // If user details are not stored in AsyncStorage, stay on the same screen
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  const loadFingerprintPreference = async () => {
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      setIsEnabled(fingerprintEnabled === 'true');
    } catch (error) {
      console.error('Error loading fingerprint preference:', error);
    }
  };

  const toggleFingerprint = async (value) => {
    setIsEnabled(value);
    if (!value) {
      // If disabling biometric login, show confirmation alert
      Alert.alert(
        'Disable Biometric Login',
        'You would need to enter your Login Id and Password to Login if you disable your biometric login. Are you sure you want to disable your biometric login?',
        [
          { text: 'No', onPress: () => setIsEnabled(true) },
          {
            text: 'Yes',
            onPress: async () => {
              setIsEnabled(false);
              try {
                // Remove user data if biometric login is disabled
                await AsyncStorage.removeItem('user');
                await AsyncStorage.setItem('fingerprintEnabled', 'false');
              } catch (error) {
                console.error('Error removing user data:', error);
              }
            },
          },
        ]
      );
    } else {
      // If enabling biometric login, show informational alert
      Alert.alert(
        'Enable Biometric Login',
        'Please login using your Logic Id and Password for the first time and accept our terms and conditions to enable your biometric login from next time onwards. You would need to tap on the biometric icon to login using your biometric identity.',
        [
          {
            text: 'OK',
            onPress: async () => {
              setIsEnabled(true);
              try {
                await AsyncStorage.removeItem('user');
                await AsyncStorage.setItem('fingerprintEnabled', 'true');
              } catch (error) {
                console.error('Error setting fingerprint preference:', error);
              }
            },
          },
        ]
      );
    }
  };


  const toggleSwitch = (value) => {
    setIsEnabled(value);
  };
  const handleButtonPress = () => {
    if (signupUrl) {
      navigation.navigate('LeagueWebView', {
        url: signupUrl,
        title: 'Sign Up'
      });
    } else {
      Alert.alert('Error', 'Signup URL not loaded yet.');
    }
  };
  // const handleButtonPress = () => {
  //   if (Platform.OS === 'android') {
  //     const url = 'https://www.fishingnuttv.com';
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
  //     navigation.navigate('SignUp');
  //     // navigation.navigate('PaypalButton');
  //   }
  // };


  
  const val = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  const valrst = val(email)
  const validation = () => {
    console.log("show Email", email)
    console.log("show password", password)
    if (email == '') {
      setvalemail(true)
      setvalpass(false)
    }
    else if (valrst == false) {
      setvalemail(false)
      // console.log(valrst,'---valrst---')
      Alert.alert('user@example.com type like this')
    }
    else if (password == '') {
      setvalemail(false)
      setvalpass(true)
    }
    else {
      setLoading(true)
      const data = {
        email: email,
        password: password,
      };
      MyAxiosPostRequest(data);
      setvalpass(false)
    }
  }
  const hidepass = () => {
    setshow(pre => !pre)
  }

  const updateDataInAsyncStorage = async (newData) => {
    try {
      // Get existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem('user');
      let parsedData = existingData ? JSON.parse(existingData) : {};

      // Merge new data with existing data
      const updatedData = { ...parsedData, ...newData };

      // Store updated data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedData));

      console.log('Data updated successfully in AsyncStorage:', updatedData);
    } catch (error) {
      console.log('Error updating data in AsyncStorage:', error);
    }
  };

  const checkNetworkConnectivity = async () => {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Handle the specific error when there is no network connectivity
      if (error instanceof TypeError && error.message === 'Network request failed') {
        return false;
      }
      console.error('Error checking network connectivity:', error);
      return false;
    }
  };
  const MyAxiosPostRequest = async data => {
    try {
      const isConnected = await checkNetworkConnectivity();

      if (!isConnected) {
        Alert.alert('Network Problem', 'Please check your internet connection.');
        setLoading(false);
        return;
      }
      const formdata = new FormData();
      formdata.append('email', data.email);
      formdata.append('password', data.password);

      fetch('https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=login', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          Content: "multipart/form-data",
        },
        body: formdata
      })
        .then(res => res.json())
        .then(async (data) => {
          setLoading(false)
          if (data.success) {
            // await AsyncStorage.setItem('user', JSON.stringify(data));
            // console.log('User data stored in AsyncStorage:', data);
            await updateDataInAsyncStorage(data);
            console.log('User data stored in AsyncStorage:', data);
            navigation.dispatch(
              StackActions.replace('NavigationDrawer', {
                responseData: data,
              })
            );
            // checkLoginStatus(); // Call checkLoginStatus after storing user data
          } else {
            console.log('Navigation error');
            if (data.membership_type == 0) {
              setIsEnabled(false);
              try {
                // Remove user data if biometric login is disabled
                await AsyncStorage.removeItem('user');
                await AsyncStorage.setItem('fingerprintEnabled', 'false');
              } catch (error) {
                console.error('Error removing user data:', error);
              }
              Alert.alert(data.message);
            } else {
              Alert.alert(data.message);
            }

          }
        })
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      throw error; // Rethrow the error so the caller can handle it if needed
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        shows
      >
        <ImageBackground style={{ flex: 1 }} source={image.logo}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: '100%',
                height: wp('54%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={image.backimg}
                resizeMode='contain'
                style={{
                  width: '90%',
                  height: 60,

                }}
              />
            </View>

            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#b9dfab',
                borderTopRightRadius: 35,
                borderTopLeftRadius: 35,
                justifyContent: 'space-around',
                // alignItems: 'center'
              }}
            >
              <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '700', textAlign: 'center' }}>SIGN IN</Text>

              <View style={{

                marginTop: 10,
                // height: hp(35),
                width: wp(100),
                alignItems: 'center'
              }}>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Email'
                    keyboardType={'email-address'}
                    placeholderTextColor={'#1b6001'}
                    style={styles.textinput}
                    onChangeText={pre => setEmail(pre)}
                  />
                </View>
                {valemail === true && (
                  <Text style={{ color: 'red', alignSelf: 'flex-start', marginLeft: 40 }}>enter the email</Text>
                )}
                <View style={styles.textpass}>
                  <TextInput placeholder='Password'
                    placeholderTextColor={'#1b6001'}
                    style={styles.textinput1}
                    secureTextEntry={!show}
                    onChangeText={pre => setPassword(pre)}
                  />
                  <TouchableOpacity
                    onPress={hidepass}>
                    {
                      show == false ?

                        <FontAwesome name="eye" size={25} color="#1b6001" />
                        :
                        <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    }
                  </TouchableOpacity>
                </View>
                {valpass === true && (
                  <Text style={styles.enterpass}>enter the password</Text>
                )}
              </View>

              <TouchableOpacity onPress={() => navigation.navigate('Fpass')}>
                <Text style={{ textAlign: 'right', paddingRight: 30, paddingVertical: 15, color: '#1b6001' }}>Forgot Password</Text>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: '#1b6001', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 2, alignItems: 'center' }}>
                  <TouchableOpacity onPress={checkFingerprintStatus} style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <MaterialIcons name="fingerprint" size={35} color="#1b6001" />
                    <Text style={{ borderLeftWidth: 1, borderColor: '#1b6001' }}></Text>
                    <MaterialIcons name="center-focus-weak" size={35} color="#1b6001" />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 16, color: "#1b6001" }}>  Biometric Login</Text>
                </View>
                <View>
                  <Switch
                    trackColor={{ false: "#767577", true: "white" }}
                    thumbColor={isEnabled ? "#1b6001" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleFingerprint}
                    value={isEnabled}
                  />
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.signin}
                  onPress={validation}
                  disabled={loading}
                >
                  {loading ?
                    <ActivityIndicator size="large" color="white" />
                    :
                    <Text style={{ color: '#b9dfab', fontWeight: '700', fontSize: 20 }}>
                      SIGN IN
                    </Text>
                  }
                </TouchableOpacity>
              </View>
              <View style={styles.headline}>
                <Text style={{ color: '#1b6001' }}>Don,t have an account?</Text>
                <TouchableOpacity
                  onPress={handleButtonPress}
                >
                  <Text style={{ fontSize: 15, color: '#1b6001' }}>Sign Up</Text>

                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
export default Login;

const styles = StyleSheet.create({
  signin: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 40,
    marginTop: 50,
    backgroundColor: '#1b6001'
  },
  headline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    width: wp(7),
    height: hp(7),
  },
  enterpass: {
    color: 'red',
    alignSelf: 'flex-start',
    marginTop: 30,
    marginLeft: 40,
  },
  textinput: {
    color: 'black',
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderColor: 'white',
    paddingLeft: 10,
    fontSize: 16,
  },
  textinput1: {
    height: '100%',
    width: '90%',
    alignSelf: 'center',
    borderColor: 'white',
    paddingLeft: 10,
    color: 'black'
  },
  textpass: {
    flexDirection: 'row',
    width: wp(85),
    borderBottomWidth: 2,
    borderColor: '#1b6001',
    alignItems: "center",
    height: hp(6)
  },
  textuser: {
    flexDirection: 'row',
    width: wp(85),
    borderBottomWidth: 2,
    borderColor: '#1b6001',
    height: hp(7),
    marginVertical: 30,
  },
})
