import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ScaledSheet } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsUpload from './NewsUpload';

export default function Blog() {
  const isAdminRef = useRef(false);
  const navigation = useNavigation();

  const [ApiData, setApiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCurrentPage(1);
      fetchNews(1);
    }, [])
  );

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          isAdminRef.current = parsedData.custom_admin === 20;
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchNews = async (page = 1) => {
    try {
      if (!refreshing) setLoading(true);

      const response = await axios.get(
        `https://fishingnuttv.com/fntv-custom/fntvAPIs/news.php?category=blog&page=${page}&t=${new Date().getTime()}`
      );

      const posts = response.data.posts || [];
      setApiData(posts);
      setCategory(response.data.category || '');
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('❌ Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchNews(1);
  };

  const handlePrevPages = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchNews(currentPage - 1);
    }
  };

  const handleNextPages = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchNews(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchNews(page);
    }
  };

  const renderPagination = () => {
    if (!totalPages || totalPages < 1) return null;

    let pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity key={i} onPress={() => handlePageClick(i)}>
          <Text style={i === currentPage ? styles.activePage : styles.page}>{i}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePrevPages} disabled={currentPage <= 1}>
          <Text style={[styles.page, currentPage <= 1 && styles.disabledPage]}>{'<<'}</Text>
        </TouchableOpacity>
        {pages}
        <TouchableOpacity onPress={handleNextPages} disabled={currentPage >= totalPages}>
          <Text style={[styles.page, currentPage >= totalPages && styles.disabledPage]}>{'>>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.newsItemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('NewsPage', { itemData: item })}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
      </TouchableOpacity>

      {isAdminRef.current && (
        <View style={styles.flexx}>
          <TouchableOpacity onPress={() => navigation.navigate('NewsUpload', { editData: item })}>
            <AntDesign name="edit" size={20} color={'#1b6001'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              'Delete News',
              'Are you sure you want to delete this news?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteNews(item.id, item.image_url) }
              ],
              { cancelable: true }
            );
          }}>
            <AntDesign name="delete" size={20} color={'red'} />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.date}>{item.date}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('NewsPage', { itemData: item })}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.paragraph} numberOfLines={2}>{item.content}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
          <ActivityIndicator size="small" color="#b9dfab" />
        </View>
      ) : (
        <FlatList
        data={ApiData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{  alignItems: 'center',paddingBottom: 20  }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#b9dfab']} />
        }
        ListEmptyComponent={<Text style={styles.noDataText}>No News Available</Text>}
        ListFooterComponent={
          <>
            {loading && !refreshing && (
              <ActivityIndicator size="small" color="#b9dfab" style={{ marginVertical: 10 }} />
            )}
              {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                {renderPagination()}
              </View>
              )}
          </>
        }
      />
      
      )}

     
    </SafeAreaView>
  );
}


const styles = ScaledSheet.create({
  flexx: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: '10@s', paddingTop: '10@s' },
  listContainer: { alignItems: 'center' },
  newsItemContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '20@vs',
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: '6@s',
    borderWidth: '0.5@s',
    borderColor: 'lightgray',
    borderRadius: '8@s',
  },
  image: { width: '100%', height: '170@vs' },
  date: { margin: '10@s', fontSize: '12@s', color: '#666', textAlign: 'right' },
  title: { marginHorizontal: '10@s', color: 'black', fontWeight: 'bold', fontSize: '16@s' },
  paragraph: { margin: '10@s', fontSize: '14@s', color: '#333' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  },
  page: { fontSize: '16@s', color: 'black', marginHorizontal: '5@s', padding: '10@s', borderRadius: '20@s', borderWidth: '1@s', borderColor: '#ccc', textAlign: 'center' },
  activePage: { fontSize: '16@s', color: '#444', marginHorizontal: '5@s', padding: '10@s', borderRadius: '20@s', backgroundColor: '#b9dfab', borderWidth: '1@s', borderColor: '#ccc', textAlign: 'center' },
  disabledPage: { color: 'lightgray' },
 
  noDataText: { marginTop: 20, fontSize: 16, color: '#666' },
});
