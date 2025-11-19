import { useRef } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export const useStickyHeader = () => {  
    const headerHeight = useRef(new Animated.Value(0)).current; // Reference to header height  
    const scrollY = useRef(new Animated.Value(0)).current; // Reference to scroll position  

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {  
        scrollY.setValue(event.nativeEvent.contentOffset.y);  
    };  

    return {  
        headerHeight,  
        scrollY,  
        handleScroll,  
    };  
};