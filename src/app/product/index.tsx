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

const ProductPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm</Text>
      <Text>Chi tiết sản phẩm sẽ hiển thị ở đây</Text>
    </View>
  );
};

export default ProductPage;

