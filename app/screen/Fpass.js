import { SafeAreaView, TouchableOpacity, StyleSheet, Text, View, ImageBackground, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import image from '../Utilis/image';
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
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={image.logo}>
                <View style={{ flex: 1 }}>

                    <View
                        style={{
                            width: '100%',
                            height: 240,
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
                            // justifyContent: 'space-around',
                            alignItems: 'center'
                        }}
                    >
                        <View style={styles.textuser}>
                            <TextInput
                                placeholder='Send Email'
                                keyboardType={'email-address'}
                                placeholderTextColor={'#1b6001'}
                                style={styles.textinput}
                                onChangeText={pre => setEmail(pre)}
                            />
                        </View>
                        <TouchableOpacity onPress={Eforget} style={styles.Actbtnsignup}>
                            {loading ?
                                <ActivityIndicator size="large" color="#1b6001" />
                                :
                                <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '500' }}>Send</Text>
                            }
                        </TouchableOpacity>



                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ marginTop: 50, fontWeight: '700', fontSize: 16, color: '#1b6001' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    textinput: {
        color: 'black',
        // height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderColor: 'white',
        paddingLeft: 10,
        fontSize: 16,
    },
    textuser: {
        flexDirection: 'row',
        width: wp(85),
        borderBottomWidth: 2,
        borderColor: '#1b6001',
        height: hp(7),
        marginVertical: 30,
    },
    Actbtnsignup: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1b6001',
        width: wp(70),
        height: hp(8),
        borderRadius: 20,
        marginVertical: 40
    },
});
