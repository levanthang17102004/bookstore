import { useCurrentApp } from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 50
    },
    languageOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    }
});

const ChangeLanguage = () => {
    const { appState, setAppState } = useCurrentApp();

    const handleChangeLanguage = (language: string) => {
        setAppState({
            ...appState,
            language: language
        });
        Toast.show(`Ngôn ngữ đã được thay đổi sang: ${language}`, {
            duration: Toast.durations.LONG,
            textColor: "white",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Pressable onPress={() => handleChangeLanguage('Vietnamese')} style={styles.languageOption}>
                        <Text>Tiếng Việt</Text>
                    </Pressable>
                    <Pressable onPress={() => handleChangeLanguage('English')} style={styles.languageOption}>
                        <Text>English</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangeLanguage;