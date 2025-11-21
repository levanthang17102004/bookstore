import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff", // Thay đổi thành nền trắng để nổi bật hơn  
        gap: 5,
        flexDirection: "row",
        margin: 5,
        paddingHorizontal: 10, // Tăng padding ngang cho thoải mái hơn  
        paddingVertical: 10, // Tăng padding dọc  
        borderRadius: 5, // Tăng kích thước viền bo góc  
        shadowColor: "#000", // Thêm bóng  
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Bóng đổ trên Android  
    },
    text: {
        color: "#707070",
        fontSize: 16, // Tăng kích thước chữ  
        flex: 1, // Cho phép văn bản chiếm hết không gian còn lại  
        marginLeft: 10, // Khoảng cách giữa biểu tượng và văn bản  
    },
});

const SearchHome = () => {
    return (
        <Pressable
            onPress={() => router.navigate("/(auth)/search")}
            style={styles.container}
        >
            <EvilIcons name="search" size={24} color={APP_COLOR.ORANGE} />
            <Text style={styles.text}>Deal Hot Hôm Nay Từ 0đ...</Text>
            <AntDesign name="right" size={16} color={APP_COLOR.ORANGE} />
        </Pressable>
    );
}

export default SearchHome;