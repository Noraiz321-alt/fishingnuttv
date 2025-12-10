import { SafeAreaView, TouchableOpacity, StyleSheet, Text, View, ImageBackground, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import image from '../Utilis/image';
import { ScaledSheet, s, vs, ms } from 'react-native-size-matters';
import Code_field from './Code_field';



export default function Fpass({ navigation }) {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Email validation function
    const emailValidation = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const Eforget = async () => {
        try {
            if (!email) {
                Alert.alert('Please enter your email address');
                return;
            }
            if (!emailValidation(email)) {
                Alert.alert('Please enter a valid email address');
                return;
            }

            console.log(email);
            setLoading(true);

            const formdata = new FormData();
            formdata.append('email', email);
            console.log(formdata);

            const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/signupWizard/check_email.php?email=${email}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            const responseData = await response.json();
            console.log('display data', responseData);

            setLoading(false);

            if (responseData.message === "Password reset code sent successfully to your email.") {
                navigation.navigate('Code_field', { responseData: responseData,email: email });
            } else {
                Alert.alert('Error', responseData.error || 'An unknown error occurred.');
            }


        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            Alert.alert('An error occurred. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
          <ImageBackground style={styles.bg} source={image.logo}>
            <View style={styles.container}>
      
              {/* TOP LOGO */}
              <View style={styles.topBox}>
                <Image
                  source={image.backimg}
                  resizeMode='contain'
                  style={styles.logo}
                />
              </View>
      
              {/* WHITE CARD */}
              <View style={styles.whiteCard}>
      
                <View style={styles.textuser}>
                  <TextInput
                    placeholder="Send Email"
                    keyboardType="email-address"
                    placeholderTextColor="#1b6001"
                    style={styles.textinput}
                    onChangeText={pre => setEmail(pre)}
                  />
                </View>
      
                {/* SEND BUTTON */}
                <TouchableOpacity onPress={Eforget} style={styles.Actbtnsignup}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#1b6001" />
                  ) : (
                    <Text style={styles.sendText}>Send</Text>
                  )}
                </TouchableOpacity>
      
                {/* LOGIN BUTTON */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
      
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      );
}

const styles = ScaledSheet.create({
    safe: {
      flex: 1,
    },
  
    bg: {
      flex: 1,
    },
  
    container: {
      flex: 1,
    },
  
    /* TOP LOGO BOX */
    topBox: {
      width: '100%',
      height: hp('30%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    logo: {
      width: wp('80%'),
      height: hp('12%'),
    },
  
    /* WHITE CARD */
    whiteCard: {
      flex: 1,
      width: '100%',
      backgroundColor: '#b9dfab',
      borderTopRightRadius: '35@ms',
      borderTopLeftRadius: '35@ms',
      alignItems: 'center',
      paddingTop: '40@vs',
    },
  
    /* INPUT BOX */
    textuser: {
      flexDirection: 'row',
      width: wp('85%'),
      borderBottomWidth: 2,
      borderColor: '#1b6001',
      height: hp('7%'),
      marginVertical: '30@vs',
    },
  
    textinput: {
      width: '100%',
      height: '100%',
      paddingLeft: '10@s',
      fontSize: '16@ms',
      color: 'black',
    },
  
    /* SEND BUTTON */
    Actbtnsignup: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#1b6001',
      width: wp('70%'),
      height: hp('8%'),
      borderRadius: '20@ms',
      marginVertical: '40@vs',
    },
  
    sendText: {
      color: '#1b6001',
      fontSize: '25@ms',
      fontWeight: '500',
    },
  
    /* LOGIN BUTTON */
    loginText: {
      marginTop: '20@vs',
      fontSize: '16@ms',
      fontWeight: '700',
      color: '#1b6001',
    },
  });
  
