import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, StyleSheet, Text, View } from "react-native";
import BannerHome from "./banner.home";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topList: {
        borderWidth: 5,
        minHeight: 100,
        marginBottom: 10,
        width: "100%",
        paddingTop: 10,
    },
    item: {
        padding: 10,
        margin: 5,
        backgroundColor: '#f0f8ff', // Màu nền nhẹ hơn 
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Bóng đổ nhẹ 
    },
    itemContainer: {
        padding: 6,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', // Màu nền sáng  
        borderRadius: 10, // Bo góc  
        marginHorizontal: 5, // Khoảng cách giữa các mục  
        shadowColor: '#000', // Màu bóng  
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3, // Độ mờ bóng  
        shadowRadius: 4, // Đường kính bóng  
        elevation: 5, // Đối với Android  
    },
    itemIcon: {
        marginBottom: 5,
    },
    itemName: {
        textAlign: "center",
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2, // Khoảng cách giữa tên và biểu tượng  
    },
});

// Icon mapping for bookstore category icons
const getCategoryIcon = (key: number, size: number = 40) => {
    const iconProps = { size, color: APP_COLOR.ORANGE };
    switch (key) {
        case 1: return <MaterialIcons name="flash-on" {...iconProps} />; // Hot Deal
        case 2: return <MaterialIcons name="book" {...iconProps} />; // Tiểu Thuyết
        case 3: return <MaterialIcons name="stars" {...iconProps} />; // Tích Điểm
        case 4: return <MaterialIcons name="menu-book" {...iconProps} />; // Sách Giáo Khoa
        case 5: return <MaterialIcons name="translate" {...iconProps} />; // Sách Ngoại Ngữ
        case 6: return <MaterialIcons name="science" {...iconProps} />; // Khoa Học
        case 7: return <MaterialIcons name="history-edu" {...iconProps} />; // Lịch Sử
        case 8: return <MaterialIcons name="auto-stories" {...iconProps} />; // Văn Học
        case 9: return <MaterialIcons name="child-care" {...iconProps} />; // Thiếu Nhi
        case 10: return <MaterialIcons name="trending-up" {...iconProps} />; // Kinh Tế
        case 11: return <MaterialIcons name="percent" {...iconProps} />; // Giảm 50k
        case 12: return <MaterialIcons name="new-releases" {...iconProps} />; // Sách Mới
        case 13: return <MaterialIcons name="local-shipping" {...iconProps} />; // Freeship
        case 14: return <MaterialIcons name="computer" {...iconProps} />; // Sách Online
        case 15: return <MaterialIcons name="local-offer" {...iconProps} />; // Deal 0Đ
        case 16: return <MaterialIcons name="attach-money" {...iconProps} />; // Sách 1Đ
        case 17: return <MaterialIcons name="collections-bookmark" {...iconProps} />; // Bộ Sách
        case 18: return <MaterialIcons name="card-giftcard" {...iconProps} />; // Combo 199k
        case 19: return <MaterialIcons name="favorite" {...iconProps} />; // Yêu Thích
        case 20: return <MaterialIcons name="school" {...iconProps} />; // Thư Viện
        default: return <MaterialIcons name="book" {...iconProps} />;
    }
};

const data1 = [
    { key: 1, name: "Hot Deal" },
    { key: 2, name: "Tiểu Thuyết" },
    { key: 3, name: "Tích Điểm" },
    { key: 4, name: "Sách Giáo Khoa" },
    { key: 5, name: "Sách Ngoại Ngữ" },
    { key: 6, name: "Khoa Học" },
    { key: 7, name: "Lịch Sử" },
    { key: 8, name: "Văn Học" },
    { key: 9, name: "Thiếu Nhi" },
    { key: 10, name: "Kinh Tế" },
    { key: 11, name: "Giảm 50k" },
    { key: 12, name: "Sách Mới" },
    { key: 13, name: "Freeship" },
    { key: 14, name: "Sách Online" },
    { key: 15, name: "Deal 0Đ" },
    { key: 16, name: "Sách 1Đ" },
    { key: 17, name: "Bộ Sách" },
    { key: 18, name: "Combo 199k" },
    { key: 19, name: "Yêu Thích" },
    { key: 20, name: "Bán Chạy" },
]


const TopListHome = () => {
    return (
        <View style={styles.container}>
            <BannerHome />
            <View>
                <FlatList
                    style={{ marginVertical: 15 }}
                    data={data1}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={true}
                    scrollEnabled={true}
                    renderItem={({ item, index }) => (
                        <View style={styles.itemContainer}>
                            <View style={styles.itemIcon}>
                                {getCategoryIcon(item.key)}
                            </View>
                            <Text style={styles.itemName}>
                                {item.name}
                            </Text>
                            <AntDesign name="check-circle" size={14} color={APP_COLOR.ORANGE} />
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                />
            </View>
        </View>
    );
}

export default TopListHome;