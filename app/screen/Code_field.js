import { StyleSheet, Text, View,TouchableOpacity,Alert, } from 'react-native'
import React, { useState,useEffect } from 'react'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { useNavigation} from '@react-navigation/native'
import Update_password from './Update_password';

export default function Code_field({ route }) {
   
    const navigation = useNavigation();
    const user_id = route.params?.responseData.user_id || null;

    console.log('user_id', user_id);
    

    const CELL_COUNT = 6;
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    }); 
    const handleVerify = async () => {
        try {
            // Handle the verification process here
            const formdata = new FormData();
            formdata.append('code', value);
            console.log(formdata);
    
            const response = await fetch('https://www.fishingnuttv.com/fntv-custom/signupWizard/verify_code.php', {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    'Content-Type': "multipart/form-data",
                },
                body: formdata
            });
    
            // Ensure the response is successful before parsing JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseData = await response.json();
            console.log('display data', responseData);
    
            // Check the value of responseData.message and navigate or show a message accordingly
            if (responseData.message === 1) {
                navigation.navigate('Update_password', { user_id: user_id });
            } else if (responseData.message === 0) {
                Alert.alert('Invalid password', 'The Code you entered is invalid.');
            } else {
                Alert.alert('Error', 'An unknown error occurred.');
            }
    
        } catch (error) {
            console.error('Error during verification:', error);
            Alert.alert('Error', 'An error occurred during the verification process.');
        }
    };
    
    return (
        <View style={styles.root}>
            <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '700', textAlign: 'center'}}>Verification</Text>
            <View style={{alignContent:'center'}}>
            <Text style={styles.subTitle}>
                We have sent 6 digit code on your E-mail
                Please write the code below and hit Submit button.
            </Text>
            </View>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <View
                        onLayout={getCellOnLayoutHandler(index)}
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                    >
                        <Text style={styles.cellText}>
                            {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                    </View>
                )}
            />
            <TouchableOpacity onPress={handleVerify} style={styles.Actbtnsignup}>
                <Text style={{ color: '#1b6001', fontSize: 25, fontWeight: '500' }}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, padding: 20,justifyContent:'center', alignItems: 'center', backgroundColor: '#b9dfab' },
    subTitle: { fontSize: 16, marginBottom: 20, marginTop: 30, color: '#1b6001',alignItems:'center' },
    codeFieldRoot: { marginTop: 30, marginBottom: 60 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 2,
        borderColor: '#1b6001',
        color:'#1b6001',
        alignItems:'center',
        margin: 5,
    },
    focusCell: {
        borderColor: '#1b6001',
    },
    cellText: {
        fontSize: 24,
        color:'#1b6001',
    },
    Actbtnsignup: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1b6001',
        width: wp(40),
        height: hp(6),
        borderRadius: 20,
        // marginVertical: 40

    },
});

