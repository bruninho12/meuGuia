import React, { useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  Animated,
  ImageBackground,
  StyleSheet,
} from "react-native";

const { width: W } = Dimensions.get("window");
const SLIDE_W = W;

type Slide = {
  title?: string;
  subtitle?: string;
  tag?: string;
  accent: string;
  image: any;
};

export const SLIDES: Slide[] = [
  {
    accent: "#ff8a3d",
    image: require("../../assets/slides/slide1.png"),
  },
  {
    title: "Destaques Premium",
    subtitle: "Apareça primeiro e aumente o fluxo no seu negócio.",
    tag: "Boost",
    accent: "#0f766e",
    image: require("../../assets/slides/slide2.png"),
  },
  {
    title: "Ofertas & Promoções",
    subtitle: "Publique promoções e ganhe mais cliques.",
    tag: "Campaigns",
    accent: "#7c3aed",
    image: require("../../assets/slides/slide1.png"),
  },
];

interface CarrosselLoginProps {
  slides?: Slide[];
}

export default function CarrosselLogin({
  slides = SLIDES,
}: CarrosselLoginProps = {}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % slides.length;
      flatListRef.current?.scrollToOffset({
        offset: currentIndex.current * SLIDE_W,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <View style={{ height: Dimensions.get("window").height * 0.3 }}>
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={(event) => {
          const offset = event.nativeEvent.contentOffset.x;
          currentIndex.current = Math.round(offset / SLIDE_W);
        }}
        renderItem={({ item }) => (
          <View style={{ width: SLIDE_W, padding: 18 }}>
            <ImageBackground
              source={item.image}
              resizeMode="cover"
              style={styles.slide}
              imageStyle={{ borderRadius: 26 }}
            >
              <View style={styles.barBg}>
                <View style={[styles.bar, { backgroundColor: item.accent }]} />
              </View>
            </ImageBackground>
          </View>
        )}
      />

      {/* DOTS */}
      <View style={styles.dots}>
        {slides.map((_, i) => {
          const inputRange = [
            (i - 1) * SLIDE_W,
            i * SLIDE_W,
            (i + 1) * SLIDE_W,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.8, 1],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ scale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: "100%",
    padding: 6,
    justifyContent: "flex-end",
  },
  barBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    marginTop: 14,
    overflow: "hidden",
  },
  bar: {
    width: "55%",
    height: "100%",
    borderRadius: 999,
    shadowColor: "#ff8a3d",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#ff8a3d",
  },
});
