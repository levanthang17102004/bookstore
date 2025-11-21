import { getNotificationsAPI } from "@/utils/api"; // Assume this function is defined  
import { APP_COLOR } from "@/utils/constant";
import { MaterialIcons } from '@expo/vector-icons'; // Thêm thư viện icon
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await getNotificationsAPI();
            if (res.data) setNotifications(res.data);
        };
        fetchNotifications();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <MaterialIcons name="notifications" size={24} color={APP_COLOR.ORANGE} />
                    <Text style={styles.headerText}>Thông báo</Text>
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.notificationList}>
                    {notifications.map((notification, index) => (
                        <View key={index} style={styles.notificationItem}>
                            <View style={styles.notificationHeader}>
                                <MaterialIcons name="info" size={20} color={APP_COLOR.ORANGE} />
                                <Text style={styles.notificationTitle}>{notification.message}</Text>
                            </View>
                            <Text style={styles.notificationDate}>
                                {new Date(notification.createdAt).toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: APP_COLOR.ORANGE,
        marginLeft: 10,
    },
    notificationList: {
        paddingBottom: 20,
    },
    notificationItem: {
        backgroundColor: APP_COLOR.GREY,
        borderRadius: 10,
        margin: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For Android shadow
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    notificationTitle: {
        fontSize: 16,
        color: "black",
        marginLeft: 10,
    },
    notificationDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
});

export default NotificationPage;