import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function NotificationDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.notification || {};

  const title = item?.title || item?.notification_title || 'Notification';
  const body = item?.body || item?.description || item?.message || item?.notification_body || '';
  const imageUrl = item?.image || item?.image_url || item?.notification_image || null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.nav}>
          <AntDesign name="left" size={wp('5%')} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Details</Text>
        <Image style={styles.nav1} source={require('../image/logooo.png')} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.detailImage}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.contentBox}>
          <Text style={styles.boxTitle}>{title}</Text>
          <Text style={styles.boxDescription}>{body || 'No content.'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2%',
    justifyContent: 'space-between',
  },
  nav: {
    width: '45@s',
    height: '45@s',
    borderRadius: '25@s',
    backgroundColor: '#b9dfab',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nav1: {
    width: '45@s',
    height: '45@s',
    borderRadius: '100@s',
  },
  headerTitle: { fontSize: wp('5%'), fontWeight: 'bold', color: 'black' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  detailImage: {
    width: '100%',
    height: vs(200),
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#e8f0e5',
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 16,
  },
  boxTitle: { fontSize: wp('5%'), fontWeight: 'bold', color: 'black', marginBottom: 10 },
  boxDescription: { fontSize: s(14), color: '#333', lineHeight: 22 },
});
