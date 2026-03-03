import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TextInput, TouchableOpacity, Alert, Linking,
ActivityIndicator, Switch, StatusBar, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
import { ScaledSheet, s, vs, ms } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { setUser, updateUser, clearUser } from '../store/authSlice';
import { consumePendingNotificationIfAuthenticated } from '../Notification/pendingNotification';


// sami@searlco.com
// Test123@
// andy@searlco.com
// @ndY1979??
// semi.u786@gmail.com
// noraizshamshad60@gmail.com




const Login = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [show, setshow] = useState(false)



  const [email, setEmail] = useState('semi.u786@gmail.com');
  const [password, setPassword] = useState('Test123@');

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const [valemail, setvalemail] = useState(false)
  const [valpass, setvalpass] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [signupUrl, setSignupUrl] = useState(null);

  useEffect(() => {

     if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('#000000', true); // black background
            StatusBar.setBarStyle('light-content', true);  // white text/icons
          } else if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('dark-content', true);   // black text/icons
            // iOS doesn't support setting background color directly from JS
            // So you can adjust it using your View background or Navigation options
          }
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
      // Alert.alert('Error', 'Something went wrong while fetching the signup URL.');
    }
  };

  
  const checkFingerprintStatus = async () => {
    if (route.params?.fromLogout) return;
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      console.log('Fingerprint enabled status:', fingerprintEnabled);
      if (fingerprintEnabled === 'true') {
        authenticateWithFingerprint();
      }
    } catch (error) {
      console.error('Error checking fingerprint status:', error);
    }
  };

  const onBiometricIconPress = async () => {
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      if (fingerprintEnabled === 'true') {
        await authenticateWithFingerprint();
      } else {
        Alert.alert(
          'Biometric Login',
          'Please enable Biometric Login with the switch above, then login with email/password once. After that you can use fingerprint to login.'
        );
      }
    } catch (e) {
      console.error('Biometric press error:', e);
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
        const parsed = JSON.parse(user);
        await refreshMemberFromExpiry(parsed);
        navigation.dispatch(StackActions.replace('NavigationDrawer'));
        // Kill mode: thodi der wait karke consume — pending pehle save ho jaye (headless / getInitialNotification)
        await new Promise(r => setTimeout(r, 600));
        await consumePendingNotificationIfAuthenticated();
        return;
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
                dispatch(clearUser());
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
                dispatch(clearUser());
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

  // Login / fingerprint ke baad hamesha latest status laane ke liye Expiry API call
  const refreshMemberFromExpiry = async (baseUser) => {
    try {
      const memberID = baseUser?.memberID;
      if (!memberID) {
        console.warn('refreshMemberFromExpiry: memberID missing, using baseUser only');
        await AsyncStorage.setItem('user', JSON.stringify(baseUser));
        dispatch(setUser(baseUser));
        return;
      }

      const url = `https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=Expiry&user_id=${memberID}`;
      const res = await fetch(url);
      const latest = await res.json();
      console.log('🔄 Expiry API response:', latest);

      const toStore = latest?.success ? latest : baseUser;
      await AsyncStorage.setItem('user', JSON.stringify(toStore));
      dispatch(setUser(toStore));
    } catch (error) {
      console.error('refreshMemberFromExpiry error:', error);
      try {
        await AsyncStorage.setItem('user', JSON.stringify(baseUser));
      } catch (e) {
        console.error('fallback save baseUser error:', e);
      }
      dispatch(setUser(baseUser));
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
          console.log('🔐 Login API response:', data);
          if (data.success) {
            await refreshMemberFromExpiry(data);
            navigation.dispatch(
              StackActions.replace('NavigationDrawer')
            );
            // Kill mode: thodi der wait karke consume — pending pehle save ho jaye
            await new Promise(r => setTimeout(r, 600));
            await consumePendingNotificationIfAuthenticated();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: '#b9dfab' }]}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#b9dfab' }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 16 }]}
      >
        <ImageBackground style={styles.bg} source={image.logo}>
          <View style={styles.container}>
  
            {/* TOP IMAGE BOX */}
            <View style={styles.topBox}>
              <Image
                source={image.backimg}
                resizeMode="contain"
                style={styles.topImage}
              />
            </View>
  
            {/* WHITE CARD AREA */}
            <View style={styles.whiteCard}>
  
              <Text style={styles.signText}>SIGN IN</Text>
  
              {/* INPUTS */}
              <View style={styles.inputWrapper}>
  
                {/* Email */}
                <View style={styles.textuser}>
                  <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor="#1b6001"
                    style={styles.textinput}
                    onChangeText={pre => setEmail(pre)}
                  />
                </View>
  
                {valemail === true && (
                  <Text style={styles.errorText}>enter the email</Text>
                )}
  
                {/* Password */}
                <View style={styles.textpass}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#1b6001"
                    secureTextEntry={!show}
                    style={styles.textinput1}
                    onChangeText={pre => setPassword(pre)}
                  />
  
                  <TouchableOpacity onPress={hidepass}>
                    {show ? (
                      <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    ) : (
                      <FontAwesome name="eye" size={25} color="#1b6001" />
                    )}
                  </TouchableOpacity>
                </View>
  
                {valpass === true && (
                  <Text style={styles.errorPass}>enter the password</Text>
                )}
  
              </View>
  
              {/* FORGOT PASSWORD */}
              <TouchableOpacity onPress={() => navigation.navigate('Fpass')}>
                <Text style={styles.forgotText}>Forgot Password</Text>
              </TouchableOpacity>
  
              {/* BIOMETRIC BOX */}
              <View style={styles.biometricBox}>
  
                <View style={styles.bioLeft}>
                  <TouchableOpacity
                    onPress={onBiometricIconPress}
                    style={styles.bioIcons}
                  >
                    <MaterialIcons name="fingerprint" size={35} color="#1b6001" />
                    <MaterialIcons
                      name="center-focus-weak"
                      size={35}
                      color="#1b6001"
                      style={styles.bioSecondIcon}
                    />
                  </TouchableOpacity>
  
                  <Text style={styles.bioText} allowFontScaling={false}>Biometric Login</Text>
                </View>
  
                <Switch
                  trackColor={{ false: "#767577", true: "white" }}
                  thumbColor={isEnabled ? "#1b6001" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleFingerprint}
                  value={isEnabled}
                />
              </View>
  
              {/* SIGN IN BUTTON */}
              <View style={styles.signinWrapper}>
                <TouchableOpacity
                  style={styles.signin}
                  onPress={validation}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text style={styles.signBtnText}>SIGN IN</Text>
                  )}
                </TouchableOpacity>
              </View>
  
              {/* BOTTOM LINE */}
              <View style={styles.bottomLine}>
                <Text style={styles.bottomText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={handleButtonPress}>
                  <Text style={styles.bottomSignup}>Sign Up</Text>
                </TouchableOpacity>
              </View>
  
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
  
}
export default Login;

const styles = ScaledSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  /* TOP LOGO AREA */
  topBox: {
    width: '100%',
    height: hp('30%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  topImage: {
    width: wp('80%'),
    height: hp('12%'),
  },

  /* WHITE AREA */
  whiteCard: {
    flex: 1,
    width: '100%',
    backgroundColor: '#b9dfab',
    borderTopRightRadius: '35@ms',
    borderTopLeftRadius: '35@ms',
    justifyContent: 'space-around',
  },

  signText: {
    color: '#1b6001',
    fontSize: '25@ms',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '10@vs',
  },

  inputWrapper: {
    width: wp('100%'),
    alignItems: 'center',
    marginTop: '5@vs',
  },

  /* EMAIL INPUT */
  textuser: {
    flexDirection: 'row',
    width: wp('85%'),
    borderBottomWidth: 2,
    borderColor: '#1b6001',
    height: hp('7%'),
    marginVertical: '20@vs',
  },

  textinput: {
    color: 'black',
    height: '100%',
    width: '100%',
    paddingLeft: '10@s',
    fontSize: '16@ms',
  },

  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: '40@s',
  },

  /* PASSWORD INPUT */
  textpass: {
    flexDirection: 'row',
    width: wp('85%'),
    borderBottomWidth: 2,
    borderColor: '#1b6001',
    alignItems: 'center',
    height: hp('6%'),
  },

  textinput1: {
    height: '100%',
    width: '90%',
    paddingLeft: '10@s',
    color: 'black',
    fontSize: '16@ms',
  },

  errorPass: {
    color: 'red',
    alignSelf: 'flex-start',
    marginTop: '10@vs',
    marginLeft: '40@s',
  },

  forgotText: {
    textAlign: 'right',
    paddingRight: '30@s',
    paddingVertical: '15@vs',
    color: '#1b6001',
  },

  /* BIOMETRIC BOX */
  biometricBox: {
    marginHorizontal: '20@s',
    borderWidth: 1,
    borderColor: '#1b6001',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10@s',
    borderRadius: '10@ms',
  },

  bioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bioIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bioSecondIcon: {
    marginLeft: '10@s',
  },

  bioText: {
    fontSize: '16@ms',
    color: '#1b6001',
    marginLeft: '10@s',
  },

  /* SIGN IN BUTTON */
  signinWrapper: {
    alignItems: 'center',
  },

  signin: {
    width: wp('50%'),
    height: '50@vs',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '40@ms',
    marginTop: '40@vs',
    backgroundColor: '#1b6001',
  },

  signBtnText: {
    color: '#b9dfab',
    fontWeight: '700',
    fontSize: '20@ms',
  },

  /* BOTTOM AREA */
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10@vs',
  },

  bottomText: {
    color: '#1b6001',
  },

  bottomSignup: {
    fontSize: '15@ms',
    color: '#1b6001',
    marginLeft: '5@s',
  },

});
          