import { useCurrentApp } from "@/context/app.context";
import { currencyFormatter, getURLBaseBackend } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

interface IUpdatedItem {
    image: string;
    title: string;
    option: string;
    price: number;
    quantity: number;
}

const UpdateModalPage = () => {
    const { restaurant, cart, setCart } = useCurrentApp();
    const { menuItemId } = useLocalSearchParams();
    const [menuItem, setMenuItem] = useState<IMenuItem | null>(null);
    const [updatedItems, setUpdatedItems] = useState<IUpdatedItem[]>([]);

    useEffect(() => {
        if (restaurant && menuItemId) {
            for (let i = 0; i < restaurant.menu.length; i++) {
                const menu = restaurant.menu[i];
                for (let j = 0; j < menu.menuItem.length; j++) {
                    if (menu.menuItem[j]._id === menuItemId) {
                        setMenuItem(menu.menuItem[j]);
                        return; // Thoát ngay khi tìm thấy  
                    }
                }
            }
        }
    }, [restaurant, menuItemId]);

    useEffect(() => {
        if (menuItem && restaurant) {
            const currentItems = cart[restaurant._id]?.items[menuItem._id];
            if (currentItems?.extra) {
                const result = [];
                for (const [key, value] of Object.entries(currentItems.extra)) {
                    const option = menuItem.options?.find(item => `${item.title}-${item.description}` === key);
                    const addPrice = option?.additionalPrice ?? 0;
                    const basePrice = menuItem.basePrice || menuItem.price || 0;
                    result.push({
                        image: menuItem.image,
                        title: menuItem.title,
                        option: key,
                        price: basePrice + addPrice,
                        quantity: value
                    });
                }
                setUpdatedItems(result);
            }
        }
    }, [menuItem, cart, restaurant]);

    const handlePressItem = (item: IUpdatedItem, action: "MINUS" | "PLUS") => {
        const foundItem = updatedItems.find(x => x.option === item.option);
        const foundIndex = updatedItems.findIndex(x => x.option === item.option);
        let shouldCloseModal = false;

        if (foundItem) {
            const total = action === "MINUS" ? -1 : 1;
            const newQuantity = foundItem.quantity + total;

            if (newQuantity < 0) return; // Ngăn không cho số lượng trở thành âm  

            if (newQuantity === 0) {
                const temp = updatedItems.filter(x => x.option !== item.option);
                setUpdatedItems(temp);
                shouldCloseModal = temp.length === 0;
            } else {
                const temp = [...updatedItems];
                temp[foundIndex] = { ...foundItem, quantity: newQuantity }; // Cập nhật số lượng cho item  
                setUpdatedItems(temp);
            }

            // Cập nhật giỏ hàng  
            updateCart(total, foundItem.option, foundItem.price);
            if (shouldCloseModal) router.back();
        }
    };

    const updateCart = (total: number, keyOption: string, price: number) => {
        if (restaurant?._id && menuItem) {
            const item = menuItem;

            // Cập nhật tổng và số lượng trong giỏ hàng
            cart[restaurant._id].sum += total * price;
            cart[restaurant._id].quantity += total;

            const currentQuantity = Math.max(
                0,
                (cart[restaurant._id].items[item._id]?.quantity || 0) + total
            );

            const i = cart[restaurant._id].items[item._id];
            let currentExtraQuantity = 0;

            if (i?.extra) {
                const existingQuantity = i.extra[keyOption] || 0;
                currentExtraQuantity = Math.max(0, existingQuantity + total);

            }

            cart[restaurant._id].items[item._id] = {
                data: menuItem,
                quantity: currentQuantity,
                extra: {
                    ...i?.extra,
                    [keyOption]: currentExtraQuantity,
                },
            };

            // Xóa key nếu số lượng bằng 0
            if (currentExtraQuantity <= 0) {
                delete cart[restaurant._id].items[item._id].extra?.[keyOption];
            }

            // Xóa sản phẩm nếu tổng số lượng bằng 0
            if (currentQuantity <= 0 && updatedItems.length === 1) {
                delete cart[restaurant._id].items[item._id];
            }

            setCart((prevState: any) => ({ ...prevState, ...cart }));
        }
    };


    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: '#00000040',
            }}
        >
            <Pressable onPress={() => router.back()} style={StyleSheet.absoluteFill} />

            <Animated.View
                entering={SlideInDown}
                style={{
                    height: '60%',
                    width: '100%',
                    backgroundColor: 'white',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                }}
            >
                <View
                    style={{
                        borderBottomColor: '#eee',
                        borderBottomWidth: 1,
                        flexDirection: 'row',
                        padding: 10,
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: 16,
                            }}
                        >
                            Chỉnh sửa số lượng
                        </Text>
                    </View>
                    <AntDesign
                        onPress={() => router.back()}
                        name="close"
                        size={24}
                        color="grey"
                    />
                </View>

                <ScrollView
                    style={{
                        flex: 1,
                        borderBottomColor: '#eee',
                        borderBottomWidth: 1,
                    }}
                >
                    {updatedItems.length > 0 ? (
                        updatedItems.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: 10,
                                    paddingVertical: 15,
                                    borderBottomColor: '#eee',
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Image
                                    source={{ uri: `${getURLBaseBackend()}/images/menu-item/${item.image}` }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 10,
                                        marginRight: 10,
                                    }}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item?.title}</Text>
                                    <Text style={{ color: 'gray' }}>{item?.option}</Text>
                                    <View
                                        style={{
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: APP_COLOR.ORANGE, fontWeight: 'bold' }}>
                                            {currencyFormatter(item?.price)}
                                        </Text>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                gap: 5,
                                            }}
                                        >
                                            <Pressable
                                                onPress={() => handlePressItem(item, 'MINUS')}
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.5 : 1,
                                                })}
                                            >
                                                <AntDesign
                                                    name="minus-square"
                                                    size={24}
                                                    color={APP_COLOR.ORANGE}
                                                />
                                            </Pressable>

                                            <Text style={{ fontSize: 16 }}>
                                                {item?.quantity || 0}
                                            </Text>
                                            <Pressable
                                                onPress={() => handlePressItem(item, 'PLUS')}
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.5 : 1,
                                                })}
                                            >
                                                <AntDesign
                                                    name="plus-square"
                                                    size={24}
                                                    color={APP_COLOR.ORANGE}
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 20,
                            }}
                        >
                            <Text style={{ color: 'gray', fontSize: 16 }}>
                                Không có sản phẩm nào để chỉnh sửa.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </Animated.View>
        </Animated.View>
    );
};

export default UpdateModalPage;