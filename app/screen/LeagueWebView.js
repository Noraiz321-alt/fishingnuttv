import React, { useEffect, useState, useRef } from 'react';
import {  View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeagueWebView = ({ route }) => {
  const { url, title } = route.params;
  const navigation = useNavigation();
  console.log('url>>>>', url)




  const webViewRef = useRef(null); // Ref for WebView
  const [finalUrl, setFinalUrl] = useState(null); // Final URL after params
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    checkRedirectParams();
  }, []);

  const checkRedirectParams = async () => {
    try {
      const savedParams = await AsyncStorage.getItem('redirect_params');
      if (savedParams) {
        const cleanedParams = savedParams.replace(/'/g, '');
        const fullUrl = `${url}&${cleanedParams}`; 


        console.log('Final URL with redirect params:', fullUrl);

        setFinalUrl(fullUrl);
      } else {
        setFinalUrl(url);
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
      setFinalUrl(url);
    }
  };


  // ✅ iOS Zoom Fix Script
  const injectZoomFix = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    document.getElementsByTagName('head')[0].appendChild(meta);

    const style = document.createElement('style');
    style.innerHTML = 'input, textarea, select { font-size: 16px !important; }';
    document.head.appendChild(style);
    true;
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 🔻 Custom Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
          {title}
        </Text>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* 🌐 WebView Content */}
      <WebView
        ref={webViewRef}
        source={{ uri: title === 'Join League' && finalUrl ? finalUrl : url }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        injectedJavaScript={injectZoomFix}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(injectZoomFix);
          }
        }}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.5)',
          }}>
          <ActivityIndicator size="large" color="#b9dfab" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LeagueWebView;
