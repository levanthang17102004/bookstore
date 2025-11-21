import { filterRestaurantAPI, getRestaurantByNameAPI, getURLBaseBackend } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import debounce from "debounce";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View
} from "react-native";


const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchInitData = async () => {
            const res = await filterRestaurantAPI(`current=1&pageSize=${pageSize}`)
            if (res.data) {
                setRestaurants(res.data.results)
            }
        }
        fetchInitData();
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            const res = await filterRestaurantAPI(`current=${currentPage}&pageSize=${pageSize}`);
            if (res.data) {
                setRestaurants([...restaurants, ...res.data.results]);
            }
        };

        if (currentPage > 1) {
            fetchData();
        }
    }, [currentPage]);

    const handleSearch = debounce(async (text: string) => {

        setSearchTerm(text);
        if (!text) return;

        const res = await getRestaurantByNameAPI(text);
        if (res.data) {
            setRestaurants(res.data.results)
        }
    }, 300)

    const handleEndReached = async () => {
        setCurrentPage(prev => prev + 1);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                padding: 10
            }}>
                <MaterialIcons
                    onPress={() => router.back()}
                    name="arrow-back"
                    size={24}
                    color={APP_COLOR.ORANGE}
                />
                <TextInput
                    placeholder="Tìm kiếm nhà sách..."
                    onChangeText={(text: string) => handleSearch(text)}
                    style={{
                        flex: 1,
                        backgroundColor: "#f0f0f0", // Màu nền  
                        paddingVertical: 8, // Giảm khoảng cách theo chiều dọc  
                        paddingHorizontal: 10, // Giảm khoảng cách bên trái và bên phải  
                        borderRadius: 5, // Bo tròn  
                        fontSize: 16, // Giảm kích thước font chữ  
                        borderWidth: 1, // Đường viền  
                        borderColor: "#ccd0d5", // Màu viền  
                        elevation: 2, // Thêm hiệu ứng bóng đổ 
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                {loading ? ( // Hiển thị spinner khi đang tải  
                    <ActivityIndicator size="large" color={APP_COLOR.ORANGE} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        onEndReachedThreshold={0.5}
                        onEndReached={handleEndReached}
                        data={restaurants}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/product/[id]",
                                    params: { id: item._id }
                                })}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    padding: 10,
                                    gap: 10,
                                    borderBottomColor: "#eee",
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Image
                                    source={{ uri: `${getURLBaseBackend()}/images/restaurant/${item.image}` }}
                                    style={{ height: 100, width: 100, borderRadius: 10 }}
                                />
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    flex: 1,
                                    marginLeft: 10
                                }}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );

}

export default RestaurantsPage