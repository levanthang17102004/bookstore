import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import CollectionHome from "@/components/home/collection.home";
import HeaderHome from "@/components/home/header.home";
import SearchHome from "@/components/home/search.home";
import TopListHome from "@/components/home/top.list.home";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const data = [
    {
        key: 1,
        name: "Top Nhà Sách Rating 5* tuần này",
        description: "Gợi ý nhà sách được độc giả đánh giá 5*",
        refAPI: "top-rating"
    },
    {
        key: 2,
        name: "Nhà Sách Mới Lên Sàn",
        description: "Khám phá ngay hàng loạt nhà sách mới",
        refAPI: "newcommer"
    },
    {
        key: 3,
        name: "Mua Sách Thỏa Thích, Freeship 0Đ",
        description: "Tiểu thuyết, sách giáo khoa, sách ngoại ngữ, ...",
        refAPI: "top-freeship"
    },
];

const HomeTab = () => {
    useEffect(() => {
        router.navigate("/(auth)/popup.sale" as any);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomFlatList
                data={data}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.collectionContainer}>
                        <CollectionHome
                            name={item.name}
                            description={item.description}
                            refAPI={item.refAPI}
                        />
                    </View>
                )}
                HeaderComponent={<HeaderHome />}
                StickyElementComponent={<SearchHome />}
                TopListElementComponent={<TopListHome />}
            />
        </SafeAreaView>
    );
};

export default HomeTab;

const styles = StyleSheet.create({
    list: {
        overflow: "hidden"
    },
    collectionContainer: {
        marginVertical: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Giữa tiêu đề và nút "Xem tất cả"  
    },
    icon: {
        marginRight: 10, // Khoảng cách giữa biểu tượng và tên  
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1, // Để tên có thể chiếm không gian còn lại  
    },
    seeAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllText: {
        color: "#5a5a5a",
        paddingRight: 5,
    },
});