import { SafeAreaView, StyleSheet, Text, View,ImageBackground,Image} from 'react-native'
import React,{useEffect} from 'react'
import image from '../Utilis/image';
import TouchID from 'react-native-touch-id';
import { StackActions, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';



const Sscreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkFingerprintStatus(); // Call checkFingerprintStatus when component mounts
  }, []);

  const checkFingerprintStatus = async () => {
    try {
      const fingerprintEnabled = await AsyncStorage.getItem('fingerprintEnabled');
      console.log('Fingerprint enabled status:', fingerprintEnabled);
      if (fingerprintEnabled === 'true') {
        authenticateWithFingerprint();
      } else {
        // navigation.navigate('Login');
        checkLoginStatus();
      }
    } catch (error) {
      console.error('Error checking fingerprint status:', error);
    }
  };

  const authenticateWithFingerprint = async () => {
    TouchID.authenticate('Authenticate with your fingerprint')
      .then((response) => {
        console.log(response)
        checkLoginStatus();
      })
      .catch((error) => {
        // Handle authentication failure
        console.log('Error authenticating with fingerprint:', error);
      });
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#1b6001', justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={image.backimg}
              resizeMode='contain'
              style={{
                width: '90%',
                height: 90,
                justifyContent: 'center'
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Sscreen;
