import { getTopBookStoreAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface IProps {
    name: String
    description: string,
    refAPI: string;
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    sale: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: APP_COLOR.ORANGE,
        padding: 3,
        borderRadius: 3,
        alignSelf: "flex-start"
    }
});

const CollectionHome = (props: IProps) => {
    const { name } = props
    const { description } = props
    const { refAPI } = props
    const [restaurants, setRestaurants] = useState<ITopBookStore[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getTopBookStoreAPI(refAPI);
            if (res.data) {
                setRestaurants(res.data)
            } else {
                //error
            }
        }
        fetchData()
    }, [refAPI])

    const backend = Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_ANDROID_API_URL
        : process.env.EXPO_PUBLIC_IOS_API_URL;

    const baseImage = `${backend}/images/restaurant`;
    return (
        <>
            <View style={{ height: 10, backgroundColor: "#e9e9e9" }}></View>
            <View style={styles.container}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <Text style={{
                        color: APP_COLOR.ORANGE,
                        fontSize: 16,
                        fontWeight: "600"
                    }}
                    >{name}
                    </Text>
                    <Text style={{ color: "#5a5a5a" }}>Xem tất cả</Text>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ color: '#5a5a5a' }}>{description}</Text>
                </View>
                <FlatList
                    data={restaurants}
                    horizontal
                    contentContainerStyle={{ gap: 5 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return (
                            <Pressable onPress={() => {
                                router.navigate("/product")
                            }}>

                                <View style={{ backgroundColor: "#efefef" }}>
                                    <Image
                                        style={{ height: 130, width: 130 }}
                                        source={{ uri: `${baseImage}/${item.image}` }}
                                    />
                                    <View style={{ padding: 5 }}>
                                        <Text
                                            numberOfLines={1} ellipsizeMode="tail"
                                            style={{ fontWeight: "600", maxWidth: 130 }}>{item.name}</Text>
                                        <View>
                                            <View style={styles.sale}>
                                                <Text style={{ color: APP_COLOR.ORANGE }}>Flash Sale</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        );
                    }}
                />
            </View>
        </>
    )
}

export default CollectionHome