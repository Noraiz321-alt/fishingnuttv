import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, ActivityIndicator,TouchableOpacity,
    Image, RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScaledSheet } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const League = ({ route }) => {
    const navigation = useNavigation();
    const { filterType = 'ongoing' } = route?.params || {};

    const [upcomingLeagues, setUpcomingLeagues] = useState([]);
    const [previousLeagues, setPreviousLeagues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Agar pagination chaiye toh usko bhi split karna hoga, yahan simplification ke liye skip kiya

    useFocusEffect(
        useCallback(() => {
            fetchLeagues(true);
        }, [filterType])
    );

    const fetchLeagues = async (isRefresh = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntvAPIs/get_leagues.php?page=1`);
            const data = await res.json();

            if (filterType === 'combined') {
                setUpcomingLeagues(data.leagues.Upcoming || []);
                setPreviousLeagues(data.leagues.Previous || []);
            } else {
                let newLeagues = [];
                switch (filterType) {
                    case 'ongoing':
                        newLeagues = data.leagues.OnGoing || [];
                        break;
                    case 'upcoming':
                        newLeagues = data.leagues.Upcoming || [];
                        break;
                    case 'previous':
                        newLeagues = data.leagues.Previous || [];
                        break;
                    default:
                        newLeagues = data.leagues.OnGoing || [];
                }
                setUpcomingLeagues(newLeagues); // single list state use karo
                setPreviousLeagues([]); // clear previous leagues if not combined
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    };

    const renderItem = ({ item }) => {
        const isLeagueFull = item.league_full === "1";
    
        // Button disable karne ki condition
        const isDisabled =
            filterType === 'ongoing' ||
            item.section === 'Previous' ||
            (filterType === 'combined' && isLeagueFull) ||
            (filterType !== 'ongoing' && item.section !== 'Previous' && isLeagueFull);
    
        // Button ka background color
        let buttonBackgroundColor = '#2e7d32'; // default blue
        let borderColor = '#2e7d32';
    
        if (filterType === 'ongoing' || item.section === 'Previous') {
            buttonBackgroundColor = 'gray';
            borderColor = 'gray';
        } else if (isLeagueFull) {
            buttonBackgroundColor = '#ff0000'; // red
            borderColor = '#ff0000';
        }
    
        return (
            <View style={styles.card}>
                <View
                    style={[
                        styles.badgeContainer,
                        item.status === 'inactive' && { backgroundColor: 'red' }
                    ]}
                >
                    <Text style={styles.badgeText}>{item.status || 'Ongoing'}</Text>
                </View>
    
                <Image source={{ uri: item.image_url }} style={styles.logo} />
                <Text style={styles.leagueName}>{item.name}</Text>
    
                <View style={styles.dateBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calendar" size={25} color="white" />
                        <Text style={[styles.dateText, { marginLeft: 6 }]}>{item.date}</Text>
                    </View>
                </View>
    
                <TouchableOpacity
                    style={[
                        styles.joinButton,
                        {
                            backgroundColor: buttonBackgroundColor,
                            borderColor: borderColor
                        }
                    ]}
                    onPress={() => {
                        if (!isDisabled) {
                            navigation.navigate('LeagueWebView', {
                                url: item.league_url,
                                title: 'Join League',
                            });
                        }
                    }}
                    disabled={isDisabled}
                >
                    <Text style={styles.joinButtonText}>
                        {item.section === 'Previous'
                            ? 'Join League'
                            : isLeagueFull
                                ? 'League Full'
                                : 'Join League'}
                    </Text>
                </TouchableOpacity>
    
                {item.section !== 'Previous' && (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Match_Days', { leagueId: item.id })}
                    >
                        <Text style={styles.viewMore}>Match Days ❯</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    
    return (
        <SafeAreaView style={styles.container}>
            {filterType === 'combined' ? (
               <FlatList
               data={[
                   { type: 'heading', section: 'Upcoming' },
                   ...upcomingLeagues.map(item => ({ ...item, section: 'Upcoming', type: 'item' })),
                   { type: 'heading', section: 'Previous' },
                   ...previousLeagues.map(item => ({ ...item, section: 'Previous', type: 'item' })),
               ]}
               keyExtractor={(item, index) => `${item.type}-${item.id || index}`}
               renderItem={({ item }) => {
                   if (item.type === 'heading') {
                       return (
                           <Text style={styles.heading}>
                               {item.section === 'Upcoming' ? 'Upcoming' : 'Previous Seasons'}
                           </Text>
                       );
                   }
           
                   return renderItem({ item });
               }}
               refreshControl={
                   <RefreshControl
                       refreshing={refreshing}
                       onRefresh={() => fetchLeagues(true)}
                   />
               }
               ListEmptyComponent={
                   !loading && (
                       <Text style={{ textAlign: 'center', marginTop: 30 }}>
                           No leagues found.
                       </Text>
                   )
               }
               ListFooterComponent={
                   loading && <ActivityIndicator style={{ margin: 10 }} />
               }
           />
           
            ) : (
                <FlatList
                    data={upcomingLeagues}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListHeaderComponent={() => (
                        <Text style={styles.heading}>
                            {filterType === 'ongoing'
                                ? 'Current Leagues'
                                : filterType === 'upcoming'
                                    ? 'Upcoming'
                                    : 'Previous Seasons'}
                        </Text>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchLeagues(true)}
                        />
                    }
                    ListEmptyComponent={
                        !loading && (
                            <Text style={{ textAlign: 'center', marginTop: 50 }}>
                                No leagues found.
                            </Text>
                        )
                    }
                    ListFooterComponent={
                        loading && <ActivityIndicator style={{ margin: 10 }} />
                    }
                />

            )}

            {/* {loading && <ActivityIndicator style={{ margin: 10 }} />} */}
        </SafeAreaView>

    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    heading: {
        fontSize: '20@s',
        fontWeight: '600',
        padding: '10@s',
        // backgroundColor: '#d4edda',
        // backgroundColor: 
        color: 'rgba(13, 11, 11, 0.84)',
    },
    card: {
        backgroundColor: '#b9dfab',
        borderRadius: '16@s',
        margin: '12@s',
        padding: '16@s',
        elevation: 4,
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        top: '10@s',
        right: '10@s',
        backgroundColor: '#2e7d32',
        borderRadius: '8@s',
        paddingVertical: '4@vs',
        paddingHorizontal: '10@s',
        zIndex: 1,
    },
    badgeText: {
        color: '#fff',
        fontSize: '12@s',
        fontWeight: '600',
    },
    logo: {
        width: '100@s',
        height: '100@s',
        borderRadius: '50@s',
        alignSelf: 'center',
        marginBottom: '10@vs',
        resizeMode: 'cover',
    },
    leagueName: {
        fontSize: '17@s',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '4@vs',
        color: '#1b6001',
    },
    dateBox: {
        backgroundColor: '#2e7d32',
        borderRadius: '12@s',
        paddingVertical: '6@vs',
        paddingHorizontal: '12@s',
        alignSelf: 'center',
        marginBottom: '10@vs',
    },
    dateText: {
        fontSize: '14@s',
        fontWeight: '500',
        color: '#ffffff',
    },
    viewMore: {
        fontSize: '15@s',
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
        marginTop: '8@vs',
    },
    joinButton: {
        backgroundColor: '#2e7d32',
        borderRadius: '8@s',
        paddingVertical: '8@vs',
        paddingHorizontal: '20@s',
        alignSelf: 'center',
        marginBottom: '8@vs',
        borderWidth: 1,
        borderColor: '#b9dfab',
    },
    joinButtonText: {
        fontSize: '14@s',
        fontWeight: '600',
        color: '#ffffff',
    },
});

export default League;
