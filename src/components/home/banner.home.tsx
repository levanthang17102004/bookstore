import * as React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";

import bn1 from "@/assets/banner/bn1.jpg";
import bn2 from "@/assets/banner/bn2.jpg";
import bn3 from "@/assets/banner/bn3.jpg";

function BannerHome() {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const width = Dimensions.get("window").width;

    const sliders = [
        { id: 1, source: bn1 },
        { id: 2, source: bn2 },
        { id: 3, source: bn3 },
    ];

    // Tự động chạy carousel  
    React.useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (Math.round(progress.value) + 1) % sliders.length;
            ref.current?.scrollTo({ count: nextIndex, animated: true });
        }, 3000); // Thay đổi mỗi 3 giây  

        return () => clearInterval(interval); // Dọn dẹp khi component unmount  
    }, [progress]);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <View style={styles.container}>
            <Carousel
                ref={ref}
                width={width}
                height={width / 3}
                data={sliders}
                onProgressChange={progress}
                renderItem={({ item }) => (
                    <Image
                        style={styles.image}
                        source={item.source}
                    />
                )}
            />
            <Pagination.Basic
                progress={progress}
                data={sliders}
                dotStyle={styles.dotStyle}
                containerStyle={styles.paginationContainer}
                onPress={onPressPagination}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    image: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width / 3,
        resizeMode: 'cover',
    },
    dotStyle: {
        height: 5,
        width: 5,
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 50,
    },
    paginationContainer: {
        gap: 5,
        marginTop: 10,
    },
    iconContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        transform: [{ translateY: -50 }], // Đẩy biểu tượng lên giữa banner  
    },
    icon: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ cho biểu tượng  
        borderRadius: 50,
        padding: 10,
    }
});

export default BannerHome;