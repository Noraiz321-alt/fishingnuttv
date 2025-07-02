import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import image from '../Utilis/image'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUp() {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [error, setError] = useState('');

  const handleSignUp = () => {
    // Validate form fields
    if (!firstName) {
      setError('Please enter your first name.');
    } else if (!lastName) {
      setError('Please enter your last name.');
    } else if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email address.');
    } else if (!mobileNumber || !/^\d{10,}$/.test(mobileNumber)) {
      setError('Invalid mobile number. Please enter a 10-digit mobile number.');
    } else if (password.length < 8) {
      setError('Password must be at least 8 characters long and include uppercase letters, numbers, and special characters.');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
      setError('Password must include uppercase letters, numbers, and special characters.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      const data = {
        first_name: firstName,
        last_name: lastName,
        telephone_no: mobileNumber,
        email_address: email,
        password: password,
      };
      SignUpPostApi(data)
      setError('');
    }
  };
  const SignUpPostApi = async (data) => {
    try {
      const formdata = new FormData();
      formdata.append('first_name', data.first_name);
      formdata.append('last_name', data.last_name);
      formdata.append('telephone_no', data.telephone_no);
      formdata.append('email_address', data.email_address);
      formdata.append('password', data.password);
      console.log('responce done', formdata)

      const response = await fetch('https://www.fishingnuttv.com/fntv-custom/fntvAPIs/refApi.php?auth=fntv7945@@-&act=memSignup', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data", // Fix the Content-Type header
        },
        body: formdata,
      });
      const responseData = await response.json();
      if (responseData.success) {
        Alert.alert(
          'Success',
          responseData.message,
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error so the caller can handle it if needed
    }
  }
  return (
   

      <SafeAreaView style={{ flex: 1 }}>
         <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false} // Add this line to hide vertical scroll indicator
    >
        <ImageBackground style={{ flex: 1 }} source={image.logo}>

          <ScrollView style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >

            <View style={{ flex: 1, }}>

              <View
                style={{
                  width: '100%',
                  height: 129,
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
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '700', paddingTop: 30 }}>Create New Account</Text>

                <View style={styles.textuser}>
                  <TextInput
                    placeholder='First Name'
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={text => setFirstName(text)}
                  />
                </View>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Last Name'
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={text => setLastName(text)}
                  />
                </View>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Email'
                    keyboardType='email-address'
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={text => setEmail(text)}
                  />
                </View>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Mobile Number'
                    keyboardType='numeric'  // This will show the numeric keyboard for mobile numbers
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={text => setMobileNumber(text)}
                  />
                </View>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Password'
                    secureTextEntry={showPassword}
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={pre => setPassword(pre)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {
                      showPassword == false ?

                        <FontAwesome name="eye" size={25} color="#1b6001" />
                        :
                        <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    }
                  </TouchableOpacity>
                </View>
                <View style={styles.textuser}>
                  <TextInput
                    placeholder='Confirm Password'
                    secureTextEntry={showConfirmPassword}
                    placeholderTextColor='#1b6001'
                    style={styles.textinput}
                    onChangeText={pre => setConfirmPassword(pre)}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {
                      showConfirmPassword == false ?
                        <FontAwesome name="eye" size={25} color="#1b6001" />
                        :
                        <FontAwesome name="eye-slash" size={25} color="#1b6001" />
                    }

                  </TouchableOpacity>
                </View>
                {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
                <TouchableOpacity onPress={handleSignUp} style={styles.Actbtnsignup}>
                  <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '500' }}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={{ marginBottom: 20, fontWeight: '700', fontSize: 16, color: '#1b6001' }}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
    </KeyboardAwareScrollView>
      </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  textuser: {
    width: wp(78),
    borderBottomWidth: 1,
    borderColor: '#1b6001',
    height: hp(6),
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textinput: {
    color: '#1b6001',
    flex: 1,
  },
  Actbtnsignup: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1b6001',
    width: wp(30),
    height: hp(8),
    borderRadius: 20,
    marginVertical: 40

  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#1b6001',
  },
})