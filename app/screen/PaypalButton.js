import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import PaypalApi from '../api/PaypalApi'
import WebView from 'react-native-webview';
import queryString from 'query-string';




export default function PaypalButton() {
    const [paypalUrl, setPaypalUrl] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(false);

    const onPressPaypal = async () => {

        try {
            setLoading(true);
            const token = await PaypalApi.generateToken()
            const res = await PaypalApi.createOrder(token)
            setAccessToken(token)
            console.log("token>>>", res)
            setLoading(false);
            if (!!res?.links) {
                const findUrl = res.links.find(data => data?.rel == "approve")
                console.log('findUrl',findUrl)


                setPaypalUrl(findUrl.href)
            }

        } catch (error) {
            setLoading(false);
            console.log("error", error)
        }
    }
    const onUrlChange = (webviewState) => {
        console.log("webviewStatewebviewState", webviewState)
        if (webviewState.url.includes('https://example.com/cancel')) {
            clearPaypalState()
            return;
        }
        if (webviewState.url.includes('https://example.com/return')) {

            const urlValues = queryString.parseUrl(webviewState.url)
            console.log("my urls value", urlValues)
            const { token } = urlValues.query
            if (!!token) {
                paymentSucess(token)
            }

        }

    }

    const paymentSucess = async (id) => {
        try {
            console.log('display id',id)
            const res = PaypalApi.capturePayment(id, accessToken)
            console.log("capturePayment res++++", res)
            alert("Payment sucessfull...!!!")
            clearPaypalState()
        } catch (error) {
            console.log("error raised in payment capture", error)
        }
    }

    const clearPaypalState = () => {
        setPaypalUrl(null)
        setAccessToken(null)
    }
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={onPressPaypal} style={styles.btn}>
                {loading ?
                    <ActivityIndicator size="small" color="white" />
                    :
                    <Text style={styles.text}>PaypalButton</Text>
                }
            </TouchableOpacity>
            
            
            <Modal
                visible={!!paypalUrl}
            >
                <TouchableOpacity
                    onPress={clearPaypalState}
                    style={{ marginTop: 24, marginLeft: 10 }}
                >
                    <Text >Closed</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, paddingVertical: 20 }}>
                    <WebView
                        source={{ uri: paypalUrl }}
                        onNavigationStateChange={onUrlChange}

                    />
                </View>

            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        backgroundColor: 'blue',
        paddingHorizontal: 90,
        paddingVertical: 10,
        borderRadius: 5
    },
    text: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    }
})