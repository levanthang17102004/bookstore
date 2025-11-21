import { getTopRestaurantAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign'; // Đảm bảo đã import AntDesign  
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

const { height: sHeight, width: sWidth } = Dimensions.get('window');

interface IProps {
    name: String;
    description: string;
    refAPI: string;
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        color: APP_COLOR.ORANGE,
        fontSize: 16,
        fontWeight: "600",
    },
    seeAllText: {
        color: "#5a5a5a",
        fontSize: 14,
        marginRight: 5,
    },
    description: {
        color: '#5a5a5a',
        marginVertical: 5,
        fontSize: 14,
    },
    restaurantCard: {
        backgroundColor: "#efefef",
        borderRadius: 5,
        overflow: 'hidden', // Bo góc cho hình ảnh  
        alignItems: 'center',
    },
    restaurantImage: {
        height: 130,
        width: 130,
    },
    restaurantName: {
        fontWeight: "600",
        maxWidth: 130,
        textAlign: 'center',
    },
    sale: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: APP_COLOR.ORANGE,
        padding: 3,
        borderRadius: 3,
        alignSelf: "flex-start",
        flexDirection: 'row', // Thay đổi hướng của flex để hiển thị biểu tượng bên cạnh  
        alignItems: 'center', // căn giữa biểu tượng và văn bản  
    },
    saleText: {
        color: APP_COLOR.ORANGE,
        marginLeft: 5, // Khoảng cách giữa biểu tượng và văn bản  
    },
});

const CollectionHome = (props: IProps) => {
    const { name, description, refAPI } = props; // Gộp destructuring  
    const [restaurants, setRestaurants] = useState<ITopRestaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('>>CollectionHome: Fetching with refAPI:', refAPI);
                const res = await getTopRestaurantAPI(refAPI);
                console.log('>>CollectionHome: getTopRestaurantAPI response:', JSON.stringify(res, null, 2));
                
                // Axios interceptor returns response.data, so res is IBackendRes<ITopBookStore[]>
                // Handle different response structures
                let restaurantData: ITopRestaurant[] = [];
                
                if (res?.data && Array.isArray(res.data)) {
                    // Structure: { data: [...], message: "...", statusCode: ... }
                    restaurantData = res.data.map(item => ({
                        _id: item._id,
                        name: item.name,
                        phone: item.phone || '',
                        address: item.address || '',
                        email: item.email || '',
                        rating: item.rating || 0,
                        image: item.image || '',
                        isActive: item.isActive !== undefined ? item.isActive : true,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    } as ITopRestaurant));
                } else if (Array.isArray(res)) {
                    // Structure: [...] (direct array - should not happen with interceptor)
                    restaurantData = res as ITopRestaurant[];
                } else if (res?.data?.data && Array.isArray(res.data.data)) {
                    // Structure: { data: { data: [...] } }
                    restaurantData = res.data.data as ITopRestaurant[];
                }
                
                console.log('>>CollectionHome: Processed restaurantData:', restaurantData.length, 'items');
                if (restaurantData.length > 0) {
                    console.log('>>CollectionHome: First item:', restaurantData[0]);
                }
                setRestaurants(restaurantData);
            } catch (error: any) {
                console.error('>>CollectionHome: Error fetching restaurants:', error);
                console.error('>>CollectionHome: Error details:', {
                    message: error?.message,
                    response: error?.response,
                    data: error?.data
                });
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [refAPI]);

    const backend = Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_ANDROID_API_URL
        : process.env.EXPO_PUBLIC_IOS_API_URL;

    const baseImage = `${backend}/images/bookstore`;

    return (
        <>
            <View style={{ height: 10, backgroundColor: "#e9e9e9" }} />
            {!loading ? (
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{name}</Text>
                        <Pressable onPress={() => router.navigate("/(auth)/restaurants" as any)} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.seeAllText}>Xem tất cả</Text>
                            <MaterialIcons name="navigate-next" size={20} color="grey" />
                        </Pressable>
                    </View>
                    <Text style={styles.description}>{description}</Text>
                    <FlatList
                        data={restaurants}
                        horizontal
                        contentContainerStyle={{ gap: 5 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <Pressable onPress={() => router.navigate({ pathname: "/product/[id]", params: { id: item._id } })}>
                                    <View style={styles.restaurantCard}>
                                        <Image style={styles.restaurantImage} source={{ uri: `${baseImage}/${item.image}` }} />
                                        <View style={{ padding: 5 }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.restaurantName}>{item.name}</Text>
                                            <View style={styles.sale}>
                                                <AntDesign name="tags" size={16} color={APP_COLOR.ORANGE} />
                                                <Text style={styles.saleText}>Flash Sale</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        }}
                    />
                </View>
            ) : (
                <ContentLoader
                    speed={2}
                    width={sWidth}
                    height={230}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                    style={{ width: '100%' }}
                >
                    <Rect x="10" y="10" rx="5" ry="5" width={150} height={200} />
                    <Rect x="170" y="10" rx="5" ry="5" width={150} height={200} />
                    <Rect x="330" y="10" rx="5" ry="5" width={150} height={200} />
                </ContentLoader>
            )}
        </>
    );
}

export default CollectionHome;