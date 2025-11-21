import { getFavoriteRestaurantAPI, getURLBaseBackend } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const FavoritePage = () => {
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        const fetchFavoriteRestaurants = async () => {
            const res = await getFavoriteRestaurantAPI();
            if (res.data) {
                const filteredRestaurants = res.data.filter(item => item.quantity % 2 !== 0);

                setFavoriteRestaurants(filteredRestaurants);
            }
        };
        fetchFavoriteRestaurants();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        const res = await getFavoriteRestaurantAPI();
        if (res.data) {
            const filteredRestaurants = res.data.filter(item => item.quantity % 2 !== 0);
            setFavoriteRestaurants(filteredRestaurants);
        }
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                <View style={styles.header}>
                    <MaterialIcons name="favorite" size={24} color={APP_COLOR.ORANGE} />
                    <Text style={styles.headerText}>Danh sách quán ăn yêu thích</Text>
                </View>


                <ScrollView
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={styles.restaurantList}
                >
                    {favoriteRestaurants.length > 0 ? (
                        favoriteRestaurants.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => router.push({
                                    pathname: "/product/[id]",
                                    params: { id: item.restaurant._id }
                                })}
                                style={styles.restaurantItem}
                            >

                                <Image
                                    source={{ uri: `${getURLBaseBackend()}/images/restaurant/${item.restaurant.image}` }}
                                    style={styles.restaurantImage}
                                />
                                <View style={styles.restaurantDetails}>
                                    <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
                                    <Text style={styles.restaurantAddress}>{item.restaurant.address}</Text>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <Text style={styles.noFavoriteText}>Không có quán ăn yêu thích nào.</Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: APP_COLOR.ORANGE,
        marginLeft: 10,
    },
    restaurantList: {
        paddingBottom: 20,
    },
    restaurantItem: {
        backgroundColor: "white",
        borderRadius: 10,
        margin: 10,
        padding: 15,
        flexDirection: 'row',
        gap: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    restaurantImage: {
        height: 100,
        width: 100,
        borderRadius: 10,
    },
    restaurantDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        color: "black",
        fontWeight: 'bold',
    },
    restaurantAddress: {
        fontSize: 14,
        color: '#666',
    },
    restaurantQuantity: {
        fontSize: 14,
        color: '#666',
    },
    noFavoriteText: {
        textAlign: 'center',
        margin: 20,
        fontSize: 16,
        color: '#666',
    },
});

export default FavoritePage;