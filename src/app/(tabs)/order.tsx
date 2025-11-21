import {
    currencyFormatter,
    getOrderHistoryAPI,
    getURLBaseBackend,
} from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";


const LIMIT = 10;


const OrderPage = () => {
    const [orderHistory, setOrderHistory] = useState<IOrderHistory[]>([]);

    //Trước cải tiến
    // useEffect(() => {
    //     const fetchOrderHistory = async () => {
    //         const start = Date.now(); // bắt đầu đo thời gian


    //         const res = await getOrderHistoryAPI();


    //         const end = Date.now(); // kết thúc đo thời gian


    //         console.log("⏱ Thời gian tải dữ liệu đơn hàng (frontend):", end - start, "ms");


    //         if (res.data) {
    //             setOrderHistory(res.data);
    //         }


    //         // Optional: nếu bạn có backend trả về `duration`, log cả 2 để so sánh
    //         if (res.duration) {
    //             console.log("⏱ Thời gian xử lý ở backend:", res.duration);
    //         }
    //     };


    //     fetchOrderHistory();
    // }, []);

    //Sau cải tiến
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    //Sau cải tiến
    const fetchOrders = async () => {
        if (loading || !hasMore) return;


        const frontendStart = performance.now();
        setLoading(true);


        try {
            const res = await getOrderHistoryAPI(page, LIMIT);
            const frontendEnd = performance.now();


            if (res.data) {
                const newOrders = res.data;
                setOrderHistory((prev) => [...prev, ...newOrders]);


                if (newOrders.length < LIMIT) setHasMore(false);
                else setPage((prev) => prev + 1);


                const backendDuration = res.duration ?? 0;
                const frontendDuration = frontendEnd - frontendStart;
                const networkAndRender = frontendDuration - backendDuration;


                console.log(`⏱ Backend xử lý: ${backendDuration}ms`);
                console.log(`📡 Network + Render: ${networkAndRender.toFixed(0)}ms`);
                console.log(`🧩 Tổng thời gian: ${frontendDuration.toFixed(0)}ms`);
            }
        } catch (error) {
            console.error("❌ Fetch order history failed:", error);
        }


        setLoading(false);
    };


    useEffect(() => {
        fetchOrders();
    }, []);


    const handleScroll = ({ nativeEvent }: any) => {
        const isBottom =
            nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 20;
        if (isBottom) fetchOrders();
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <MaterialIcons name="history" size={24} color={APP_COLOR.ORANGE} />
                    <Text style={styles.headerText}>Lịch sử đơn hàng</Text>
                </View>


                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.orderList}
                    onScroll={handleScroll}
                    scrollEventThrottle={400}
                >
                    {orderHistory.map((item) => (
                        <View key={item._id} style={styles.orderItem}>
                            {/* Order Header */}
                            <View style={styles.orderHeader}>
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderId}>
                                        Đơn hàng #{item._id.slice(-8).toUpperCase()}
                                    </Text>
                                    <Text style={styles.orderDate}>
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    <Text style={[
                                        styles.statusText,
                                        item.status === 'delivered' && styles.statusDelivered,
                                        item.status === 'processing' && styles.statusProcessing,
                                        item.status === 'cancelled' && styles.statusCancelled
                                    ]}>
                                        {item.status === 'pending' && 'Chờ xử lý'}
                                        {item.status === 'processing' && 'Đang giao'}
                                        {item.status === 'delivered' && 'Đã giao'}
                                        {item.status === 'cancelled' && 'Đã hủy'}
                                    </Text>
                                    {item.paymentStatus === 'paid' && (
                                        <Text style={styles.paidBadge}>Đã thanh toán</Text>
                                    )}
                                </View>
                            </View>

                            {/* Order Details - List of Books */}
                            <View style={styles.booksList}>
                                {item.detail && item.detail.map((book, bookIndex) => (
                                    <View key={`${item._id}-${bookIndex}-${book.book || bookIndex}`} style={styles.bookItem}>
                                        <Image
                                            source={{
                                                uri: book.image
                                                    ? `${getURLBaseBackend()}/images/book/${book.image}`
                                                    : `${getURLBaseBackend()}/images/book/default.png`
                                            }}
                                            style={styles.bookImage}
                                        />
                                        <View style={styles.bookInfo}>
                                            <Text style={styles.bookTitle}>{book.title}</Text>
                                            {book.author && (
                                                <Text style={styles.bookAuthor}>Tác giả: {book.author}</Text>
                                            )}
                                            <Text style={styles.bookQuantity}>
                                                Số lượng: {book.quantity} x {currencyFormatter(book.price)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Order Footer */}
                            <View style={styles.orderFooter}>
                                <View style={styles.orderSummary}>
                                    <Text style={styles.summaryText}>
                                        Tổng số sách: {item.totalQuantity} cuốn
                                    </Text>
                                    <Text style={styles.totalPrice}>
                                        Tổng tiền: {currencyFormatter(item.totalPrice)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}


                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={APP_COLOR.ORANGE} />
                        </View>
                    )}


                    {/* ✅ Hiển thị số trang */}
                    {!loading && (
                        <View style={styles.pageIndicator}>
                            <Text style={{ color: APP_COLOR.ORANGE }}>Trang hiện tại: {page - 1}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: APP_COLOR.ORANGE,
        marginLeft: 10,
    },
    orderList: {
        paddingBottom: 20,
    },
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 10,
        padding: 15,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 12,
        color: "#666",
    },
    statusBadge: {
        alignItems: "flex-end",
        gap: 5,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        color: APP_COLOR.ORANGE,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: "#fff3e0",
    },
    statusDelivered: {
        color: "#4caf50",
        backgroundColor: "#e8f5e9",
    },
    statusProcessing: {
        color: "#2196f3",
        backgroundColor: "#e3f2fd",
    },
    statusCancelled: {
        color: "#f44336",
        backgroundColor: "#ffebee",
    },
    paidBadge: {
        fontSize: 11,
        color: "#4caf50",
        fontWeight: "600",
    },
    booksList: {
        gap: 10,
        marginBottom: 15,
    },
    bookItem: {
        flexDirection: "row",
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    bookImage: {
        height: 80,
        width: 80,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    bookInfo: {
        flex: 1,
        justifyContent: "center",
        gap: 5,
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    bookAuthor: {
        fontSize: 12,
        color: "#666",
    },
    bookQuantity: {
        fontSize: 13,
        color: APP_COLOR.ORANGE,
        fontWeight: "600",
    },
    orderFooter: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    orderSummary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryText: {
        fontSize: 14,
        color: "#666",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: APP_COLOR.ORANGE,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    pageIndicator: {
        padding: 10,
        alignItems: "center",
    },
});


export default OrderPage;

