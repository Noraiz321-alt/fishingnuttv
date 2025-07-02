import React, { useState, useCallback, useRef } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, ScrollView, LayoutAnimation,
    Platform, UIManager, ActivityIndicator, Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { ScaledSheet, s, vs } from 'react-native-size-matters';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LeaderBoard() {
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState({});
    const [paginationData, setPaginationData] = useState({});
    const [tableLoading, setTableLoading] = useState({});
    const [currentPage, setCurrentPage] = useState({});
    const [participantDetails, setParticipantDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [ongoingDivisions, setOngoingDivisions] = useState([]);

    useFocusEffect(
        useCallback(() => {
            fetchLeagueData();
        }, [])
    );

    const parseCustomDate = (dateStr) => {
        const monthMap = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        const parts = dateStr.split(' '); // ["14", "May", "2025"]
        if (parts.length !== 3) return new Date('Invalid');

        const day = parseInt(parts[0], 10);
        const monthName = parts[1].substring(0, 3); // Always take first 3 chars
        const month = monthMap[monthName];
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date('Invalid');
        return new Date(year, month, day);
    };
    const fetchLeagueData = async () => {

        console.log('heelo ')
        try {
            const response = await fetch('https://fishingnuttv.com/design/api/ongoing_league_names.php');
            const data = await response.json();

            const currentDate = new Date();
            console.log('🔵 Current Date:', currentDate.toISOString());

            const ongoingLeagues = [];
            const previousLeagues = [];

            data.forEach(league => {
                const startDate = parseCustomDate(league.start_date);
                const endDate = parseCustomDate(league.end_date);

                console.log(`📘 League: ${league.name} (${league.id})`);
                console.log(`Start: ${startDate} | End: ${endDate}`);

                if (startDate <= currentDate && endDate >= currentDate) {
                    console.log('✅ Classified as: ongoing', league.id);
                    ongoingLeagues.push(league);
                    fetchLeaderboard(league.id);
                } else if (endDate < currentDate) {
                    console.log('➡️ Classified as: previous', league.id);
                    previousLeagues.push(league);
                } else {
                    console.log('📅 Classified as: upcoming or future', league.id);
                }
            });

            setDivisions(previousLeagues);
            setOngoingDivisions(ongoingLeagues);
        } catch (error) {
            console.error('❌ API Error:', error);
        } finally {
            setLoading(false);
        }
    };



    const fetchLeaderboard = async (leagueId, page = 1) => {

        console.log('leagueId', leagueId);

        // if (leaderboardData[leagueId]?.[page]) return;

        setTableLoading(prev => ({ ...prev, [leagueId]: true }));

        try {
            const response = await fetch(
                `https://fishingnuttv.com/fntv-custom/fntvAPIs/leaderboard.php?action=leaderboard&league_id=${leagueId}&page=${page}`
            );
            const result = await response.json();

            console.log('ss', result)

            setLeaderboardData(prev => ({
                ...prev,
                [leagueId]: {
                    ...prev[leagueId],
                    [page]: result.data || []
                }
            }));
            setPaginationData(prev => ({
                ...prev,
                [leagueId]: result.pagination || {}
            }));
        } catch (error) {
            console.error('Leaderboard API Error:', error);
        } finally {
            setTableLoading(prev => ({ ...prev, [leagueId]: false }));
        }
    };
    const toggleDropdown = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDropdownVisible(!dropdownVisible);
    };
    // const handleSelect = (item) => {
    //     setSelectedDivision(item);
    //     setDropdownVisible(false);
    //     setCurrentPage(prev => ({ ...prev, [item.id]: 1 }));
    //     fetchLeaderboard(item.id, 1);
    // };
    const handleSelect = (item) => {
        setSelectedDivision(item);
        setDropdownVisible(false);
        setCurrentPage({ [item.id]: 1 }); // ⬅️ Reset to only selected league's page
        fetchLeaderboard(item.id, 1);
    }

    const handlePageChange = (leagueId, page) => {
        setCurrentPage(prev => ({
            ...prev,
            [leagueId]: page
        }));
        fetchLeaderboard(leagueId, page);
    };
    const handleParticipantClick = async (participantId, leagueId) => {
        setIsLoadingDetails(true);
        setModalVisible(true); // show modal immediately with loader

        try {
            const response = await fetch(
                `https://fishingnuttv.com/fntv-custom/fntvAPIs/leaderboard.php?action=detailed_result&id=${participantId}&league_id=${leagueId}`
            );
            const result = await response.json();

            if (result.status === 'success') {
                setParticipantDetails({
                    name: result.data.name,
                    results: result.data.results,
                });
            } else {
                setParticipantDetails(null);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoadingDetails(false);
        }
    };





    const renderPagination = (leagueId) => {
        const pagination = paginationData[leagueId];
        if (!pagination) return null;

        const totalPages = pagination.total_pages;
        const page = currentPage[leagueId] || 1;

        const maxButtonsPerRow = 5;
        const startPage = Math.floor((page - 1) / maxButtonsPerRow) * maxButtonsPerRow + 1;
        const endPage = Math.min(startPage + maxButtonsPerRow - 1, totalPages);

        const pageButtons = [];

        const isPrevDisabled = page === 1;
        const isNextDisabled = page === totalPages;

        pageButtons.push(
            <TouchableOpacity
                key="prev"
                onPress={() => {
                    if (!isPrevDisabled) handlePageChange(leagueId, page - 1);
                }}
                disabled={isPrevDisabled}
                style={[styles.pageButton, isPrevDisabled && styles.disabledButton]}
            >
                <Text style={isPrevDisabled ? styles.disabledText : styles.pageText}>{'<<'}</Text>
            </TouchableOpacity>
        );

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handlePageChange(leagueId, i)}
                    style={[styles.pageButton, page === i && styles.activePage]}
                >
                    <Text style={page === i ? styles.activeText : styles.pageText}>{i}</Text>
                </TouchableOpacity>
            );
        }

        pageButtons.push(
            <TouchableOpacity
                key="next"
                onPress={() => {
                    if (!isNextDisabled) handlePageChange(leagueId, page + 1);
                }}
                disabled={isNextDisabled}
                style={[styles.pageButton, isNextDisabled && styles.disabledButton]}
            >
                <Text style={isNextDisabled ? styles.disabledText : styles.pageText}>{'>>'}</Text>
            </TouchableOpacity>
        );

        return <View style={styles.paginationRow}>{pageButtons}</View>
        // (
        //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        //         <View style={styles.paginationRow}>{pageButtons}</View>
        //     </ScrollView>
        // );
    };

    const renderTable = (data, leagueName, start_date, end_date, leagueId) => {
        const loadingThisTable = tableLoading[leagueId];
        const pageData = data || [];

        return (
            <View key={leagueId} style={{ marginBottom: 40 }}>
                <Text style={styles.selectedLabel}>{leagueName}</Text>
                <Text style={styles.selectedLabel1}>({start_date} - {end_date})</Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell1, { flex: 2 }]}>Name</Text>
                    <Text style={styles.tableCell1}>Matches</Text>
                    <Text style={styles.tableCell1}>Weight</Text>
                    <Text style={styles.tableCell1}>Points</Text>
                    <Text style={styles.tableCell1}>POS</Text>
                </View>

                {loadingThisTable && (
                    <View style={{ alignItems: 'center', padding: 10 }}>
                        <ActivityIndicator size="small" color="black" />
                    </View>
                )}

                {!loadingThisTable && (
                    pageData.length === 0 ? (
                        <View style={{ padding: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#999', fontSize: 14 }}>No result found.</Text>
                        </View>
                    ) : (
                        pageData.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <TouchableOpacity
                                    onPress={() => handleParticipantClick(item.participant_id, leagueId)}
                                    style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }]}
                                >
                                    <Image
                                        source={
                                            item.profile_image?.startsWith('http')
                                                ? { uri: item.profile_image }
                                                : require('../image/logooo.png')
                                        }
                                        style={styles.profileImage}
                                    />
                                    <Text style={styles.nameText1}>{item.name}</Text>
                                </TouchableOpacity>
                                <Text style={styles.tableCell}>{item.matches_played}</Text>
                                <Text style={styles.tableCell}>{item.total_weight}</Text>
                                <Text style={styles.tableCell}>{item.total_points}</Text>
                                <Text style={styles.tableCell}>{item.rank}</Text>
                            </View>
                        ))
                    )
                )}
                {paginationData[leagueId]?.total_pages >= 2 && renderPagination(leagueId)}
            </View>
        );
    };
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color="#b9dfab" />
            ) : (
                <>
                    <View style={{ position: 'relative', zIndex: 10 }}>
                        <View style={styles.dropdownButton} >
                            <Text style={styles.dropdownText}>{selectedDivision?.name || 'Select Previous Year Results'}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={toggleDropdown}>
                                    <AntDesign name={dropdownVisible ? 'up' : 'down'} size={18} color="#2c3e50" style={styles.icon} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedDivision(null);
                                        setDropdownVisible(false);
                                        fetchLeagueData();

                                        if (selectedDivision?.id) {
                                            fetchLeaderboard(selectedDivision.id, 1, true);
                                        }
                                    }}
                                >
                                    <EvilIcons style={styles.icon} name="refresh" size={30} color='#2c3e50' />
                                </TouchableOpacity>
                            </View>

                        </View>

                        {dropdownVisible && (
                            <View style={styles.dropdownMenuAbsolute}>
                                <ScrollView>
                                    {divisions.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => handleSelect(item)}
                                            style={[styles.dropdownItem, item.id === selectedDivision?.id && styles.selectedItem]}
                                        >
                                            <Text style={styles.dropdownItemText}>{item.name} {item.id === selectedDivision?.id ? '✅' : ''}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <ScrollView style={{ marginTop: 30 }} contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                        {/* ✅ Only show ongoing leagues if NO league is selected */}
                        {selectedDivision === null && ongoingDivisions.length > 0 && (
                            <View style={{ marginBottom: 20 }}>
                                {ongoingDivisions.map(div => (
                                    <View key={div.id}>
                                        {renderTable(
                                            leaderboardData[div.id]?.[currentPage[div.id] || 1] || [],
                                            div.name,
                                            div.start_date,
                                            div.end_date,
                                            div.id
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* ✅ If league selected, show only that one */}
                        {selectedDivision && (
                            <View key={selectedDivision.id}>
                                {renderTable(
                                    leaderboardData[selectedDivision.id]?.[currentPage[selectedDivision.id] || 1] || [],
                                    selectedDivision.name,
                                    selectedDivision.start_date,
                                    selectedDivision.end_date,
                                    selectedDivision.id
                                )}
                            </View>
                        )}

                    </ScrollView>

                </>
            )}

            {modalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {isLoadingDetails ? (
                            <ActivityIndicator size="large" color="#1b6001f" />
                        ) : (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <Text style={styles.modalTitle}>{participantDetails?.name}</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} >

                                        <EvilIcons style={{ marginBottom: 10 }} name="close-o" size={s(30)} color='black' />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.tableHeader1}>
                                    <Text style={styles.tableHeaderText}>Date</Text>
                                    <Text style={styles.tableHeaderText}>Match</Text>
                                    <Text style={styles.tableHeaderText}>Weight</Text>
                                    <Text style={styles.tableHeaderText}>Big Fish Weight</Text>
                                    <Text style={styles.tableHeaderText}>Points</Text>
                                </View>

                                <ScrollView style={{ maxHeight: 300 }}>
                                    {participantDetails?.results?.map((match, index) => (
                                        <View key={index} style={styles.tableRow1}>
                                            <Text style={styles.tableCell}>{match.match_date}</Text>
                                            <Text style={styles.tableCell}>{match.match_name}</Text>
                                            <Text style={styles.tableCell}>{match.total_weight}</Text>
                                            <Text style={styles.tableCell}>{match.big_fish_weight}</Text>
                                            <Text style={styles.tableCell}>{match.points}</Text>
                                        </View>
                                    ))}
                                </ScrollView>


                            </>
                        )}
                    </View>
                </View>
            )}


        </View>


    );
}

const styles = StyleSheet.create({
    container: { padding: 15, flex: 1, backgroundColor: '#fff' },
    selectedLabel: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 2 },
    selectedLabel1: { fontSize: 14, color: '#2c3e50', paddingBottom: 20 },
    dropdownButton: {
        flexDirection: 'row', alignItems: 'center', borderColor: '#E0E0E0',
        borderWidth: 1, borderRadius: 12, paddingHorizontal: 16,
        paddingVertical: 12, backgroundColor: '#FFFFFF', elevation: 2
    },
    dropdownText: { flex: 1, fontSize: 16, color: '#34495E' },
    icon: { marginLeft: 8 },
    dropdownMenuAbsolute: {
        position: 'absolute', top: 55, left: 0, right: 0, borderRadius: 12,
        backgroundColor: '#FFFFFF', maxHeight: 200, borderColor: '#E0E0E0',
        borderWidth: 1, elevation: 5, zIndex: 100,
    },
    dropdownItem: {
        paddingVertical: 14, paddingHorizontal: 16,
        borderBottomColor: '#F0F0F0', borderBottomWidth: 1,
    },
    dropdownItemText: { fontSize: 16, color: '#34495E' },
    selectedItem: { backgroundColor: '#b9dfab' },
    tableHeader: {
        flexDirection: 'row', backgroundColor: '#b9dfab',
        paddingVertical: 10, paddingHorizontal: 8,
        borderTopLeftRadius: 8, borderTopRightRadius: 8,
    },
    tableRow: {
        flexDirection: 'row', borderBottomWidth: 1,
        borderColor: '#eee', paddingVertical: 10,
        paddingHorizontal: 8,backgroundColor: '#f2f2f2',

        alignItems: 'center'
    },
    tableCell: { flex: 1, textAlign: 'center', color: '#333', fontSize: 14 },
    tableCell1: { flex: 1, textAlign: 'center', color: 'black', fontSize: 14 },
    profileImage: {
        width: 32, height: 32, borderRadius: 16,
        marginRight: 8, backgroundColor: '#ccc',
    },
    nameText: { fontSize: 14, color: '#333', flexShrink: 1 },
    nameText1: { fontSize: 14, color: '#1b6001', flexShrink: 1, },
    paginationRow: {
        flexDirection: 'row', justifyContent: 'center',
        flexWrap: 'wrap', marginTop: 10,
    },
    pageButton: {
        paddingHorizontal: 12, paddingVertical: 8,
        margin: 4, backgroundColor: '#eee', borderRadius: 6,
    },
    activePage: { backgroundColor: '#b9dfab' },
    disabledButton: {
        backgroundColor: '#ddd',
        opacity: 0.6,
    },
    disabledText: {
        color: '#aaa',
    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageText: {
        color: '#333',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        paddingBottom: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2c3e50',
    },
    resultRow: {
        marginBottom: 10,
    },
    resultText: {
        fontSize: 14,
        color: '#34495E',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 5,
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: '#b9dfab',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
    }, tableHeader1: {
        flexDirection: 'row',
        backgroundColor: '#b9dfab',
        paddingVertical: 8,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        fontSize: 13,
    },
    tableRow1: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 6,
        borderBottomWidth: 1,
        alignItems: 'center',
        borderBottomColor: '#ddd',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        color: '#000',
    }
});


