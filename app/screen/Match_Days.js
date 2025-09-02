import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
    RefreshControl
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Match_Days({ route }) {
    const navigation = useNavigation();
    const { leagueId } = route.params;

    console.log('leauge id ',leagueId)

    const [matchDays, setMatchDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [tempMessage, setTempMessage] = useState('');

    const fetchMatchDays = async () => {
        try {
            const response = await fetch(
                `https://www.fishingnuttv.com/fntv-custom/fntvAPIs/get_match_days.php?league_id=${leagueId}&page=1`
            );
            const json = await response.json();
            // console.log('Match Days Data >>:', json?.message);
            if (json?.data?.length > 0) {
                setMatchDays(json.data);
                setTempMessage('');
            } else {
                setMatchDays([]);
                setTempMessage(json?.message || 'No data available');
            }
        } catch (error) {
            console.error('❌ Error fetching match days:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMatchDays();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMatchDays();
    };

    const renderMatchCard = ({ item }) => {
        // if (item.name !== "Sunday May 4th 2025") return null;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>

                    <Text style={styles.activeTag}>active</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="location-pin" size={18} color="#444" />
                    <Text style={styles.location}>{item.venue}</Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome name="calendar" size={16} color="#444" />
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>

                <View style={styles.row}>
                    <MaterialIcons name="schedule" size={16} color="#444" />
                    <Text style={styles.timeText}>
                        {item.start_time} to {item.end_time}
                    </Text>
                </View>

                <View style={styles.row}>
                    <FontAwesome name="list-alt" size={16} color="#444" />
                    <Text style={styles.noteText}>
                        <Text style={{ fontWeight: 'bold', color: '#333' }}>Notes: </Text>
                        {item.notes}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.activeTag, { alignSelf: 'center', marginTop: wp('4%'), borderRadius: wp('2%') }]}
                    onPress={() => navigation.navigate('Match_result', { id: item.id })}
                >
                    <Text style={{ color: '#fff', fontWeight: '600', paddingHorizontal: 7, paddingVertical: 2, fontSize: wp('4%') }}>
                        View result
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={wp('5%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Match Days</Text>
                <Image style={styles.logo} source={require('../image/logooo.png')} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: wp('10%') }} />
            ) : (
                <FlatList
                    data={matchDays}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMatchCard}
                    contentContainerStyle={{ padding: wp('4%') }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        !loading && (
                            <Text style={{ textAlign: 'center', marginTop: wp('60%'), fontSize: wp('4%'), color: '#888' }}>
                               {tempMessage}
                            </Text>
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%'),
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: 'black',
    },
    nav: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#b9dfab',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: wp('12%'),
        height: wp('14%'),
        borderRadius: wp('6%'),
    },
    card: {
        backgroundColor: '#b9dfab',
        borderRadius: 20,
        padding: wp('4%'),
        marginBottom: wp('4%'),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: wp('2%'),
    },
    cardTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
    },
    activeTag: {
        backgroundColor: '#2e7d32',
        color: '#fff',
        fontWeight: '600',
        paddingHorizontal: wp('3%'),
        paddingVertical: wp('1%'),
        // borderRadius: wp('2%'),
        fontSize: wp('3.5%'),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: wp('2%'),
    },
    location: {
        marginLeft: wp('2%'),
        fontSize: wp('4%'),
        color: '#000',
    },
    dateText: {
        marginLeft: wp('2%'),
        fontSize: wp('4%'),
        color: '#000',
    },
    timeText: {
        marginLeft: wp('2%'),
        fontSize: wp('4%'),
        color: '#000',
    },
    noteText: {
        marginLeft: wp('2%'),
        fontSize: wp('3.8%'),
        color: '#000',
        fontStyle: 'italic',
    },
});
