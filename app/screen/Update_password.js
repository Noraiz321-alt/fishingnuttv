import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, ImageBackground, TextInput, TouchableOpacity, Alert, Linking, ActivityIndicator, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import image from '../Utilis/image';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation} from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Update_password = ({ route }) => {


  const user_id = route.params?.user_id || null;
  const navigation = useNavigation();

  console.log('update page user_id', user_id);
  const [show, setshow] = useState(false);
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  const hidepass = () => {
    setshow(pre => !pre);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};

  const handleUpdatePassword = () => {
    if (newpassword !== confirmpassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!validatePassword(newpassword)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long and include a lowercase letter, an uppercase letter, a digit, and a special character.');
      return;
  }
    // Call the function to update the password here
    updatePassword();
  };

  const updatePassword = async () => {
    try {
      // Handle the verification process here
      const formdata = new FormData();
      formdata.append('new_password', newpassword);
      formdata.append('user_id', user_id);
      console.log(formdata);

      const response = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/update_password.php', {
          method: 'POST',
          headers: {
              Accept: "application/json",
              'Content-Type': "multipart/form-data",
          },
          body: formdata
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('success data', responseData);

      if (responseData.message === "Password updated successfully") {
          // Show success message and navigate to the Login screen
          Alert.alert(
              'Success',
              responseData.message,
              [
                  { text: 'OK', onPress: () => navigation.navigate('Login') }
              ],
              { cancelable: false }
          );
      } else {
          // Handle other messages if necessary
          Alert.alert('Error', 'Unexpected response from the server.');
      }

  } catch (error) {
      console.error('Error during verification:', error);
      Alert.alert('Error', 'An error occurred during the verification process.');
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
                height: wp('55%'),
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
              <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '700', textAlign: 'center' }}>Update password</Text>

              <View style={{
                marginTop: 10,
                width: wp(100),
                alignItems: 'center'
              }}>
                <View style={styles.textpass}>
                  <TextInput placeholder='New Password'
                    placeholderTextColor={'#1b6001'}
                    style={styles.textinput1}
                    secureTextEntry={!show}
                    onChangeText={pre => setNewPassword(pre)}
                  />
                  <TouchableOpacity onPress={hidepass}>
                    {
                      show == false ?
                        <FontAwesome name="eye" size={25} color="#1b6001" />
                        :
                        <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    }
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 25 }}></View>
                <View style={styles.textpass}>
                  <TextInput placeholder='Confirm Password'
                    placeholderTextColor={'#1b6001'}
                    style={styles.textinput1}
                    secureTextEntry={!show}
                    onChangeText={pre => setConfirmPassword(pre)}
                  />
                  <TouchableOpacity onPress={hidepass}>
                    {
                      show == false ?
                        <FontAwesome name="eye" size={25} color="#1b6001" />
                        :
                        <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={styles.signin}
                  onPress={handleUpdatePassword}
                >
                  <Text style={{ color: '#b9dfab', fontWeight: '700', fontSize: 20 }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default Update_password;

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
});
