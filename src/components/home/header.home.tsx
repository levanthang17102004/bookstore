import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 10, // Thêm padding ngang  
        backgroundColor: '#ffffff', // Màu nền trắng để nổi bật  
        borderBottomWidth: 1,
        borderBottomColor: '#eee', // Đường viền dưới  
        gap: 5,
    },
    location: {
        flexDirection: "row",
        alignItems: "center", // Sử dụng center để căn giữa biểu tượng và chữ  
    },
    locationText: {
        marginLeft: 5, // Khoảng cách giữa biểu tượng và văn bản  
        fontSize: 16, // Kích thước chữ lớn hơn một chút  
        color: '#333', // Màu chữ tối hơn  
    },
});

const HeaderHome = () => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: APP_COLOR.ORANGE }}>Giao đến:</Text>
                <View style={styles.location}>
                    <AntDesign name="environment" size={20} color={APP_COLOR.ORANGE} />
                    <Text style={styles.locationText}>12 Chùa Bộc, Tây Sơn, Đống Đa, Hà Nội</Text>
                    <AntDesign name="check-circle" size={20} color="green" style={{ marginLeft: 10 }} />
                </View>
            </View>
        </View>
    );
};

export default HeaderHome;