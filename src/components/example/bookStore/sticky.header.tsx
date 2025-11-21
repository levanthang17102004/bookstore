import { useCurrentApp } from "@/context/app.context";
import { likeRestaurantAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: sHeight, width: sWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Thêm các style nếu cần  
});

interface IProps {
    headerHeight: number;
    imageHeight: number;
    animatedBackgroundStyle: any;
    animatedArrowColorStyle: any;
    animatedStickyHeaderStyle: any;
    animatedHeartIconStyle: any;
}

const StickyHeader = (props: IProps) => {
    const insets = useSafeAreaInsets();
    const {
        headerHeight, imageHeight,
        animatedBackgroundStyle,
        animatedArrowColorStyle, animatedStickyHeaderStyle,
        animatedHeartIconStyle
    } = props;

    const [like, setLike] = useState<boolean>(false); // Khởi tạo trạng thái like là false  
    const { restaurant } = useCurrentApp();
    
    // Animation values
    const scale = useSharedValue(1);

    useEffect(() => {
        if (restaurant) {
            const isLiked = restaurant.isLike || false;
            setLike(isLiked); // Thiết lập lại trạng thái like khi restaurant thay đổi
        }
    }, [restaurant]);

    // Animated style for heart icon
    const animatedHeartStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handleLikeRestaurant = async () => {
        // Optimistic update - cập nhật UI ngay lập tức
        const newLikeState = !like;
        setLike(newLikeState);

        // Animation khi bấm - scale effect
        scale.value = withSequence(
            withSpring(1.3, { damping: 2, stiffness: 200 }),
            withSpring(1, { damping: 2, stiffness: 200 })
        );

        // Gọi API nếu có restaurant
        if (restaurant) {
            try {
                await likeRestaurantAPI(restaurant._id, newLikeState ? 1 : -1);
            } catch (error: any) {
                console.error('>>Like error:', error);
                // Rollback nếu có lỗi
                setLike(!newLikeState);
            }
        }
    };

    return (
        <>
            <View style={{
                zIndex: 11,
                paddingTop: insets.top + 10,
                paddingHorizontal: 10,
                flexDirection: "row",
                gap: 5,
                height: headerHeight,
                position: "absolute",
                width: sWidth,
            }}>
                <Pressable
                    style={({ pressed }) => ([{ opacity: pressed === true ? 0.5 : 1 }, { alignSelf: "flex-start" }])}
                    onPress={() => router.back()}>
                    <Animated.View
                        style={[animatedBackgroundStyle, {
                            height: 30,
                            width: 30,
                            borderRadius: 30 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                        }]}
                    >
                        <MaterialIcons
                            name="arrow-back" size={24}
                            color={APP_COLOR.ORANGE}
                        />
                    </Animated.View>
                </Pressable>
                <Animated.View style={[{ flex: 1 }, animatedStickyHeaderStyle]}>
                    <TextInput
                        placeholder={"Tìm sách tại nhà sách..."}
                        style={{
                            borderWidth: 1, borderColor: APP_COLOR.GREY, width: "100%",
                            borderRadius: 3,
                            paddingHorizontal: 10
                        }}
                    />
                </Animated.View>
            </View>


            <Animated.View style={[{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                height: headerHeight,
                backgroundColor: 'white',
            }, animatedStickyHeaderStyle]} />


            <Animated.View style={[{
                position: 'absolute',
                top: imageHeight + 80,
                right: 10,
                zIndex: 9,
            }, animatedHeartIconStyle]}>
                <Pressable
                    onPress={handleLikeRestaurant}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <Animated.View style={animatedHeartStyle}>
                        <MaterialIcons
                            name={like === true ? "favorite" : "favorite-border"}
                            size={20}
                            color={like ? APP_COLOR.ORANGE : "#000000"}
                        />
                    </Animated.View>
                </Pressable>
            </Animated.View>
        </>
    );
}

export default StickyHeader; 