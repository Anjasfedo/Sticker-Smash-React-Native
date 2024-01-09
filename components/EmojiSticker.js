import React from "react";
import { View, Image } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
  });

  const doubleTapGestureHandler = useAnimatedGestureHandler({
    onActive: () => {
      if (scaleImage.value !== 1) {
        scaleImage.value = withSpring(1);
      } else {
        scaleImage.value = withSpring(2);
      }
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(imageSize * scaleImage.value),
      height: withSpring(imageSize * scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[containerStyle]}>
          <TapGestureHandler
            onGestureEvent={doubleTapGestureHandler}
            numberOfTaps={2}
          >
            <Animated.View>
              <Animated.Image
                source={stickerSource}
                resizeMode="contain"
                style={[imageStyle, { width: imageSize, height: imageSize }]}
              />
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
