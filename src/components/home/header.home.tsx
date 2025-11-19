import { APP_COLOR } from "@/utils/constant";
import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        gap: 3
    },
    location: {
        flexDirection: "row",
        alignItems: "flex-end"
    }
});

const HeaderHome = () => {
    return (
        <View>
            <View style={styles.container}>
                <Text style={{ paddingLeft: 5 }}>Giao đến:</Text>
                <View style={styles.location}>
                    <AntDesign name="environment" size={20} color={APP_COLOR.ORANGE} />
                    <Text>669 Hoàn Kiếm, Hà Nội</Text>
                </View>
            </View>
        </View>
    )
}

export default HeaderHome;