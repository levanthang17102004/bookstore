import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

const OrderPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng</Text>
      <Text>Danh sách đơn hàng của bạn sẽ hiển thị ở đây</Text>
    </View>
  );
};

export default OrderPage;

