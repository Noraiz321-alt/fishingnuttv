import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Header from '../componnent/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Match_result({ route }) {
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMatchResults(currentPage);
    }, [currentPage]);

    const fetchMatchResults = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`https://www.fishingnuttv.com/fntv-custom/fntvAPIs/get_match_results.php?match_id=${id}&page=${page}`);
            const data = await response.json();
            console.log('API Response result:', data);

            if (data.success === false) {
                setErrorMessage(data.message || 'No data found.');
                setResults([]);
            } else {
                setResults(data?.data || []);
                setCurrentPage(data.page);
                setTotalPages(data.total_pages);
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error fetching match results:', error);
            Alert.alert('Error', `Failed to fetch match results: ${error.message || error.toString()}`, [{ text: 'OK' }]);
            setErrorMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.participant_name}</Text>
            <Text style={styles.cell}>{item.total_weight}</Text>
            <Text style={styles.cell}>{item.big_fish_weight}</Text>
            <Text style={styles.cell}>{item.points}</Text>
            <Text style={styles.cell}>{item.rank}</Text>
        </View>
    );

    const renderPagination = () => {
        const pagesToShow = 5;
        let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
        let endPage = Math.min(startPage + pagesToShow - 1, totalPages);
    
        if (endPage - startPage < pagesToShow - 1) {
            startPage = Math.max(endPage - pagesToShow + 1, 1);
        }
    
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        return (
            <View style={styles.paginationRow}>
                <TouchableOpacity
                    onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                    <Text style={currentPage === 1 ? styles.disabledText : styles.pageText}>{'<<'}</Text>
                </TouchableOpacity>
    
                {pageNumbers.map((num) => (
                    <TouchableOpacity
                        key={num}
                        onPress={() => setCurrentPage(num)}
                        style={[
                            styles.pageButton,
                            currentPage === num && styles.activePage,
                        ]}
                    >
                        <Text style={currentPage === num ? styles.activeText : styles.pageText}>{num}</Text>
                    </TouchableOpacity>
                ))}
    
                <TouchableOpacity
                    onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                >
                    <Text style={currentPage === totalPages ? styles.disabledText : styles.pageText}>{'>>'}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
    
            <View style={{ paddingTop: 10 }}>
                {/* Table Header - Always Show */}
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Participant</Text>
                    <Text style={styles.headerCell}>Total Weight</Text>
                    <Text style={styles.headerCell}>Big Fish Weight</Text>
                    <Text style={styles.headerCell}>Total Points</Text>
                    <Text style={styles.headerCell}>POS</Text>
                </View>
    
                {/* Table Data or Loader */}
                {loading ? (
                    <ActivityIndicator size="small" color="#000" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={() =>
                            errorMessage ? (
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.noDataCell]}>
                                        {errorMessage}
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
                )}
    
                {/* Pagination - Always Show */}
                {totalPages >= 2 && renderPagination()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#b9dfab',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center',
        color: 'black',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: '#f2f2f2',
        borderColor: '#ddd',
        paddingVertical: 5,
    },
    cell: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center',
    },
    noDataCell: {
        flex: 5,
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        paddingVertical: 10,
    },
    paginationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    pageButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
        backgroundColor: '#eee',
        borderRadius: 6,
    },
    activePage: {
        backgroundColor: '#b9dfab',
    },
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
    
});
