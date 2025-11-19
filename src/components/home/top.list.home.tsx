import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import BannerHome from "./banner.home";

// Placeholder icon - replace with actual icons when available
const placeholderIcon = require("@/assets/images/icon.png");

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
        backgroundColor: 'lightblue',
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const data1 = [
    { key: 1, name: "Hot Deal", source: placeholderIcon },
    { key: 2, name: "Quán Ngon", source: placeholderIcon },
    { key: 3, name: "Tích Điểm", source: placeholderIcon },
    { key: 4, name: "Ngọt Xỉu", source: placeholderIcon },
    { key: 5, name: "Quán Tiền Bối", source: placeholderIcon },
    { key: 6, name: "Bún, Mì, Phở", source: placeholderIcon },
    { key: 7, name: "BBQ", source: placeholderIcon },
    { key: 8, name: "Fast Food", source: placeholderIcon },
    { key: 9, name: "Pizza", source: placeholderIcon },
    { key: 10, name: "Burger", source: placeholderIcon },
    { key: 11, name: "Sống Khỏe", source: placeholderIcon },
    { key: 12, name: "Giảm 50k", source: placeholderIcon },
    { key: 13, name: "99k Off", source: placeholderIcon },
    { key: 14, name: "No Bụng", source: placeholderIcon },
    { key: 15, name: "Freeship", source: placeholderIcon },
    { key: 16, name: "Deal 0Đ", source: placeholderIcon },
    { key: 17, name: "Món 1Đ", source: placeholderIcon },
    { key: 18, name: "Ăn chiều", source: placeholderIcon },
    { key: 19, name: "Combo 199k", source: placeholderIcon },
    { key: 20, name: "Milk Tea", source: placeholderIcon },
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
                        <View style={{
                            padding: 5,
                            width: 100,
                            alignItems: 'center'
                        }}>
                            <Image
                                source={item.source}
                                style={{
                                    height: 35, width: 35
                                }}
                            />
                            <Text style={{ textAlign: "center" }}>
                                {item.name}
                            </Text>
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