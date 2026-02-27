import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,

  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'react-native-axios';
import { ScaledSheet, s, vs } from 'react-native-size-matters';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://fishingnuttv.com/fntv-custom/signupWizard/all_firebase_notifications.php';
const DELETE_NOTIFICATION_API = 'https://fishingnuttv.com/fntv-custom/signupWizard/delete_notification.php';

export default function NotificationsList() {
  const navigation = useNavigation();
  const reduxUser = useSelector(state => state.auth.user);
  const userId = reduxUser?.memberID ?? reduxUser?.user_id ?? reduxUser?.id;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!userId) {
        console.log('NotificationsList: userId not available yet, skipping fetch');
        setList([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const url = `${API_URL}?user_id=${encodeURIComponent(userId)}`;
      const res = await axios.get(url);
      const data = res.data;
      console.log('show data',data)
      const arr = Array.isArray(data) ? data : data?.data || data?.notifications || [];
      setList(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.warn('Notifications API error:', err?.message);
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr.replace(' ', 'T'));
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (_) {
      return dateStr.split(' ')[0] || dateStr;
    }
  };

  const getItemId = (item) => item?.id ?? item?.notification_id;

  const toggleSelectItem = (item) => {
    const id = getItemId(item);
    if (id == null) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!Array.isArray(list) || list.length === 0) return;
    // If already all selected, clear; otherwise select all with valid ids
    const allIds = list
      .map(getItemId)
      .filter(id => id != null);
    const allSelected = selectedIds.size && allIds.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const handleBulkDelete = async () => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to delete notifications.');
      return;
    }
    if (!selectedIds.size) return;

    Alert.alert(
      'Delete notifications',
      `Are you sure you want to delete ${selectedIds.size} notification(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setBulkDeleting(true);
            try {
              const idsArray = Array.from(selectedIds);
              for (const notificationId of idsArray) {
                try {
                  const url = `${DELETE_NOTIFICATION_API}?user_id=${encodeURIComponent(
                    userId,
                  )}&notification_id=${encodeURIComponent(notificationId)}`;
                  const res = await axios.get(url);
                  if (res.data?.success === false) {
                    console.warn('Bulk delete failed for id:', notificationId, res.data);
                  }
                } catch (err) {
                  console.warn('Bulk delete API error for id:', notificationId, err?.message);
                }
              }
              setList(prev =>
                prev.filter(item => {
                  const id = getItemId(item);
                  return !selectedIds.has(id);
                }),
              );
              setSelectedIds(new Set());
              setSelectMode(false);
            } finally {
              setBulkDeleting(false);
            }
          },
        },
      ],
    );
  };

  const handleDelete = async (item) => {
    const notificationId = item?.id ?? item?.notification_id;
    if (!userId) {
      Alert.alert('Error', 'Please log in to delete notifications.');
      return;
    }
    if (notificationId == null) {
      setList((prev) => prev.filter((i) => i !== item));
      return;
    }
    setDeletingId(notificationId);
    try {
      const url = `${DELETE_NOTIFICATION_API}?user_id=${encodeURIComponent(userId)}&notification_id=${encodeURIComponent(notificationId)}`;
      const res = await axios.get(url);
      if (res.data?.success !== false) {
        setList((prev) => prev.filter((i) => (i?.id ?? i?.notification_id) !== notificationId));
      } else {
        Alert.alert('Error', res.data?.message || 'Could not delete.');
      }
    } catch (err) {
      console.warn('Delete API error:', err?.message);
      Alert.alert('Error', 'Could not delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderItem = ({ item }) => {
    const title = item?.title || item?.notification_title || 'Notification';
    const body = item?.body || item?.description || item?.message || item?.notification_body || '';
    const imageUrl = item?.image || item?.image_url || item?.notification_image || null;
    const dateStr = item?.created_at || item?.date || item?.createdAt || '';

    const itemId = getItemId(item);
    const isDeleting = deletingId === itemId;
    const isSelected = itemId != null && selectedIds.has(itemId);

    return (
      <View style={[styles.card, selectMode && isSelected && styles.cardSelected]}>
        <View style={styles.cardTopRow}>
          {selectMode && (
            <TouchableOpacity
              onPress={() => toggleSelectItem(item)}
              style={styles.checkboxWrap}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isSelected ? 'checkbox-outline' : 'square-outline'}
                size={s(22)}
                color={isSelected ? '#1b6001' : '#999'}
              />
            </TouchableOpacity>
          )}
          <View style={styles.iconWrap}>
            <Ionicons name="notifications" size={s(22)} color="#1b6001" />
          </View>
          <View style={styles.titleDateWrap}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            {dateStr ? (
              <Text style={styles.cardDate}>{formatDate(dateStr)}</Text>
            ) : null}
          </View>
          {!selectMode && (
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              disabled={isDeleting}
              style={styles.deleteIconWrap}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#c62828" />
              ) : (
                <Ionicons name="trash-outline" size={s(22)} color="#c62828" />
              )}
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            selectMode
              ? toggleSelectItem(item)
              : navigation.navigate('NotificationDetail', { notification: item })
          }
          onLongPress={() => {
            if (!selectMode) {
              setSelectMode(true);
              toggleSelectItem(item);
            }
          }}
          delayLongPress={300}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.cardFullImage}
              resizeMode="cover"
            />
          ) : null}
          <Text style={styles.cardDesc} numberOfLines={1}>{body || 'No description'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (selectMode ? setSelectMode(false) || setSelectedIds(new Set()) : navigation.goBack())} style={styles.nav}>
          <AntDesign name={selectMode ? 'close' : 'left'} size={wp('5%')} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectMode ? 'Select notifications' : 'Notifications'}
        </Text>
        {selectMode ? (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleSelectAll}
              style={styles.headerActionBtn}
              disabled={!list.length}
            >
              <Text style={styles.headerActionText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBulkDelete}
              style={styles.headerActionBtn}
              disabled={!selectedIds.size || bulkDeleting}
            >
              {bulkDeleting ? (
                <ActivityIndicator size="small" color="#c62828" />
              ) : (
                <Ionicons name="trash-outline" size={s(22)} color={selectedIds.size ? '#c62828' : '#ccc'} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setSelectMode(true)}
            style={styles.nav}
          >
            <Ionicons name="checkmark-done-outline" size={wp('5%')} color="black" />
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1b6001" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item, i) => item?.id?.toString() || item?.notification_id?.toString() || String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-off-outline" size={s(48)} color="#ccc" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1b6001']} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  loadingText: { marginTop: 10, fontSize: s(14), color: '#666' },
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  headerActionText: {
    fontSize: s(12),
    color: '#1b6001',
    fontWeight: '500',
  },
  listContent: { padding: 12, paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e8f0e5',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardSelected: {
    borderColor: '#1b6001',
    backgroundColor: '#f1f8e9',
  },
  checkboxWrap: {
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleDateWrap: {
    flex: 1,
  },
  deleteIconWrap: {
    padding: s(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: s(15), fontWeight: '700', color: '#1b6001' },
  cardDate: { fontSize: s(11), color: '#888', marginTop: 2 },
  cardFullImage: {
    width: '100%',
    height: vs(140),
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  cardDesc: { fontSize: s(13), color: '#555', lineHeight: 18 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { marginTop: 12, fontSize: s(14), color: '#999' },
});
