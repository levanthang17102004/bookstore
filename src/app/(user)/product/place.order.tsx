import HeaderHome from "@/components/home/header.home";
import { useCurrentApp } from "@/context/app.context";
import { currencyFormatter, getURLBaseBackend, placeOrderAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-root-toast";

interface IOrderItem {
    book: string; // Book ID - required by backend
    title: string;
    author?: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
}

const safeFunction = (callback: Function, fallbackValue: any = null) => {
    try {
        return callback();
    } catch (error) {
        console.error("Error occurred:", error);
        return fallbackValue;
    }
};

const PlaceOrderPage = () => {
    const { restaurant, cart, setCart } = useCurrentApp();
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'paypal'>('cash');

    useEffect(() => {
        safeFunction(() => {
            if (cart && restaurant && restaurant._id && cart[restaurant._id]?.items) {
                const result: IOrderItem[] = [];
                for (const [menuItemId, currentItems] of Object.entries(cart[restaurant._id].items)) {
                    const menuItem = currentItems.data as IMenuItem;
                    
                    // For books, we don't have options/extra, so just add the item directly
                    if (currentItems.extra && menuItem.options && menuItem.options.length > 0) {
                        // Handle items with options (for backward compatibility)
                        for (const [key, value] of Object.entries(currentItems.extra)) {
                            const option = menuItem.options?.find(
                                item => `${item.title}-${item.description}` === key
                            );
                            const addPrice = option?.additionalPrice ?? 0;

                            // Handle category - could be string or object
                            const categoryStr = typeof menuItem.category === 'string' 
                                ? menuItem.category 
                                : (menuItem.category as any)?.name || (menuItem.category as any)?._id || '';

                            // Handle image - remove path prefix if present (backend expects just filename)
                            let imageName = menuItem.image || '';
                            if (imageName.includes('/')) {
                                imageName = imageName.split('/').pop() || imageName;
                            }

                            result.push({
                                book: menuItem._id, // Book ID - required
                                title: menuItem.title,
                                author: menuItem.author,
                                price: (menuItem.basePrice || menuItem.price || 0) + addPrice,
                                quantity: value as number,
                                image: imageName || undefined,
                                category: categoryStr || undefined
                            });
                        }
                    } else {
                        // Handle regular books (no options)
                        // Handle category - could be string or object
                        const categoryStr = typeof menuItem.category === 'string' 
                            ? menuItem.category 
                            : (menuItem.category as any)?.name || (menuItem.category as any)?._id || '';

                        // Handle image - remove path prefix if present (backend expects just filename)
                        let imageName = menuItem.image || '';
                        if (imageName.includes('/')) {
                            imageName = imageName.split('/').pop() || imageName;
                        }

                        result.push({
                            book: menuItem._id, // Book ID - required
                            title: menuItem.title,
                            author: menuItem.author,
                            price: menuItem.basePrice || menuItem.price || 0,
                            quantity: currentItems.quantity,
                            image: imageName || undefined,
                            category: categoryStr || undefined
                        });
                    }
                }
                setOrderItems(result);
            }
        });
    }, [cart, restaurant]);

    if (!cart || !restaurant || !restaurant._id || !cart[restaurant._id]?.items) {
        console.warn("Cart hoặc thông tin nhà sách không hợp lệ.");
        return;
    }



    const handlePlaceOrder = async () => {
        try {
            // Validate orderItems
            if (!orderItems || orderItems.length === 0) {
                console.warn("Danh sách sách không hợp lệ hoặc rỗng");
                return;
            }

            // Validate each item has required fields
            const invalidItems = orderItems.filter(item => !item.book || !item.title || !item.price || !item.quantity);
            if (invalidItems.length > 0) {
                console.warn("Một số sách trong đơn hàng không hợp lệ:", invalidItems);
                return;
            }

            const data = {
                totalPrice: cart?.[restaurant!._id].sum,
                totalQuantity: cart?.[restaurant!._id].quantity,
                detail: orderItems
            };

            console.log('Placing order with data:', JSON.stringify(data, null, 2));

            const res = await placeOrderAPI(data);
            
            // Check for error first (interceptor returns error.response.data)
            if (res.error || res.statusCode && res.statusCode >= 400) {
                const errorMsg = Array.isArray(res.error) 
                    ? res.error[0] 
                    : (res.error || res.message || 'Đã xảy ra lỗi khi đặt hàng');
                
                // Log validation errors to console instead of showing Toast
                if (errorMsg.includes("Danh sách sách") || errorMsg.includes("không hợp lệ") || errorMsg.includes("rỗng")) {
                    console.warn("Backend validation error:", errorMsg);
                    console.warn("Response data:", res);
                    return;
                }
                
                Toast.show(errorMsg, {
                    duration: Toast.durations.LONG,
                    textColor: 'white',
                    backgroundColor: "red",
                    opacity: 1
                });
                return;
            }
            
            if (res.data) {
                Toast.show("Đặt hàng thành công!", {
                    duration: Toast.durations.LONG,
                    textColor: 'white',
                    backgroundColor: APP_COLOR.ORANGE,
                    opacity: 1
                });
                if (restaurant) {
                    delete cart[restaurant._id];
                    setCart((prevCart: any) => ({ ...prevCart, ...cart }));
                }
                router.navigate("/order");
            } else {
                const m = Array.isArray(res.message) ? res.message[0] : (res.message || 'Đã xảy ra lỗi');
                Toast.show(m, {
                    duration: Toast.durations.LONG,
                    textColor: 'white',
                    backgroundColor: "red",
                    opacity: 1
                });
            }
        } catch (error: any) {
            console.error("Error placing order:", error);
            console.error("Error response:", error?.response?.data);
            console.error("Error message:", error?.message);
            
            // Extract error message from response
            let errorMessage = "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại!";
            
            if (error?.response?.data) {
                const errorData = error.response.data;
                if (errorData.error) {
                    errorMessage = Array.isArray(errorData.error) 
                        ? errorData.error[0] 
                        : errorData.error;
                } else if (errorData.message) {
                    errorMessage = Array.isArray(errorData.message) 
                        ? errorData.message[0] 
                        : errorData.message;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            Toast.show(errorMessage, {
                duration: Toast.durations.LONG,
                textColor: 'white',
                backgroundColor: "red",
                opacity: 1
            });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                padding: 10
            }}>
                <HeaderHome />
            </View>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "600" }}>{restaurant?.name}</Text>
            </View>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                {safeFunction(() => orderItems.map((item, index) => (
                    <View key={index}
                        style={{
                            gap: 10,
                            flexDirection: "row",
                            borderBottomColor: "#eee",
                            borderBottomWidth: 1,
                            paddingVertical: 10
                        }}>
                        <Image
                            style={{ height: 50, width: 50 }}
                            source={{ 
                                uri: item.image 
                                    ? `${getURLBaseBackend()}/images/book/${item.image}` 
                                    : `${getURLBaseBackend()}/images/book/default.png`
                            }}
                        />
                        <View>
                            <Text style={{ fontWeight: "600" }}>
                                {item.quantity} x
                            </Text>
                        </View>
                        <View style={{ gap: 10, flex: 1 }}>
                            <Text>{item.title}</Text>
                            {item.author && (
                                <Text style={{ fontSize: 12, color: APP_COLOR.GREY }}>
                                    Tác giả: {item.author}
                                </Text>
                            )}
                            {item.category && (
                                <Text style={{ fontSize: 12, color: APP_COLOR.GREY }}>
                                    Danh mục: {item.category}
                                </Text>
                            )}
                        </View>
                    </View>
                )), [])}
                {orderItems?.length > 0 && (
                    <View style={{ marginVertical: 15 }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{ color: APP_COLOR.GREY }}>
                                Tổng cộng ({restaurant && cart?.[restaurant._id] && cart?.[restaurant._id].quantity} cuốn sách)
                            </Text>
                            <Text>
                                {currencyFormatter(restaurant && cart?.[restaurant._id] && cart?.[restaurant._id].sum)}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: "600", marginBottom: 5 }}>Phương thức thanh toán:</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                    <Pressable onPress={() => setPaymentMethod('cash')} style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: paymentMethod === 'cash' ? APP_COLOR.ORANGE : 'white',
                        borderRadius: 3,
                        borderColor: APP_COLOR.ORANGE,
                        borderWidth: 1,
                        marginRight: 5,
                    }}>
                        <Text style={{ textAlign: 'center', color: paymentMethod === 'cash' ? 'white' : APP_COLOR.ORANGE }}>
                            Tiền mặt
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => setPaymentMethod('paypal')} style={{
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: paymentMethod === 'paypal' ? APP_COLOR.ORANGE : 'white',
                        borderRadius: 3,
                        borderColor: APP_COLOR.ORANGE,
                        borderWidth: 1,
                    }}>
                        <Text style={{ textAlign: 'center', color: paymentMethod === 'paypal' ? 'white' : APP_COLOR.ORANGE }}>
                            Ví PayPal
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View style={{
                gap: 20,
                marginBottom: 15,
                padding: 10
            }}>
                <Pressable
                    onPress={handlePlaceOrder}
                    style={({ pressed }) => ({
                        opacity: pressed === true ? 0.5 : 1,
                        padding: 10,
                        backgroundColor: APP_COLOR.ORANGE,
                        borderRadius: 3
                    })}
                >
                    <Text style={{
                        color: "white",
                        textAlign: "center"
                    }}>
                        Đặt hàng - {currencyFormatter(cart && restaurant && cart?.[restaurant._id] && cart?.[restaurant._id].sum)}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default PlaceOrderPage;