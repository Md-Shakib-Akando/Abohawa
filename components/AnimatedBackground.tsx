import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Circle,
  Path,
  Line,
  G,
  Ellipse,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { getThemeByTemperatureAndCondition, GradientTheme } from '../constants/colors';
import { WeatherCode } from '../types/weather';
import { useAppStore } from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

// 1. Background Rain Mist
const RAIN_MIST = Array.from({ length: 32 }).map((_, i) => ({
  id: i,
  cx: (i * 37) % width,
  cy: (i * 53) % (height * 0.9),
  r: i % 2 === 0 ? 1 : 1.4,
  opacity: i % 3 === 0 ? 0.45 : 0.22,
}));

// 2. Midground Rain Tear-Drops
const RAIN_TEARS = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  cx: (i * 41) % width,
  cy: (i * 67) % (height * 0.9),
  rx: 1.2,
  ry: i % 2 === 0 ? 5 : 7,
  opacity: i % 3 === 0 ? 0.65 : 0.35,
}));

// 3. Foreground Fast Rain Streaks
const RAIN_STREAKS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  x: (i * 29) % width,
  y: (i * 73) % (height * 0.9),
  length: i % 2 === 0 ? 14 : 10,
  slant: 4,
  opacity: i % 2 === 0 ? 0.8 : 0.45,
}));

// 4. Dribbble/Apple Weather Grade Photorealistic Celestial Starfield (60 Stars)
const CELESTIAL_STARS = Array.from({ length: 60 }).map((_, i) => {
  const isBlue = i % 4 === 0;
  const isAmber = i % 6 === 0;
  const isFlare = i % 7 === 0; // 4-Point Cross Flare Sparkle Stars
  const color = isBlue ? '#7DD3FC' : isAmber ? '#FEF08A' : '#FFFFFF';
  const size = isFlare ? 2.6 : i % 3 === 0 ? 1.8 : 1.0;
  const group = i % 2 === 0 ? 1 : 2;

  return {
    id: i,
    cx: (i * 47 + 19) % (width + 40) - 10,
    cy: (i * 29 + 13) % (height * 0.54),
    r: size,
    color,
    group,
    isFlare,
    baseOpacity: isFlare ? 0.95 : i % 3 === 0 ? 0.8 : 0.5,
  };
});

interface AnimatedBackgroundProps {
  conditionCode?: WeatherCode;
  tempC?: number;
  isHomeScreen?: boolean;
  scrollY?: SharedValue<number>;
  children?: React.ReactNode;
}

export function AnimatedBackground({
  conditionCode = 'PartlyCloudy',
  tempC,
  isHomeScreen = false,
  scrollY,
  children,
}: AnimatedBackgroundProps) {
  const reduceMotion = useAppStore(state => state.reduceMotion);

  // Dynamic Theme based on temperature + condition + time
  const theme: GradientTheme = getThemeByTemperatureAndCondition(tempC, conditionCode);

  // Running Cloud Animations
  const cloud1X = useSharedValue(-150);
  const cloud2X = useSharedValue(width * 0.3);
  const cloudYOffset = useSharedValue(0);

  // 3 Independent Parallax Rain Motion Controllers
  const rainMistY = useSharedValue(0);
  const rainTearsY = useSharedValue(0);
  const rainStreaksY = useSharedValue(0);

  // Dual-Phase Starlight Twinkle, Cosmic Drift & Shooting Star Meteor Animation
  const starSparkleGroup1 = useSharedValue(0.3);
  const starSparkleGroup2 = useSharedValue(0.95);
  const starDriftX = useSharedValue(0);

  const shootingStarProgress = useSharedValue(0);
  const shootingStarOpacity = useSharedValue(0);

  const lightningFlash = useSharedValue(0);

  const isRain = conditionCode === 'Rain' || conditionCode === 'HeavyRain' || conditionCode === 'Drizzle';
  const isThunder = conditionCode === 'Thunderstorm';
  const isBadWeather = isRain || isThunder;

  const hour = new Date().getHours();
  // Force Daytime mode when condition is Clear/MainlyClear/PartlyCloudy
  const isDaytimeCondition = conditionCode === 'Clear' || conditionCode === 'MainlyClear' || conditionCode === 'PartlyCloudy';
  const isNight = isDaytimeCondition ? false : (hour < 6 || hour >= 19);

  useEffect(() => {
    if (reduceMotion) return;

    // Reset & trigger Moving Cloud 1
    cloud1X.value = -150;
    cloud1X.value = withRepeat(
      withTiming(width + 180, { duration: 28000, easing: Easing.linear }),
      -1,
      false
    );

    // Reset & trigger Moving Cloud 2
    cloud2X.value = width * 0.3;
    cloud2X.value = withRepeat(
      withTiming(width + 180, { duration: 22000, easing: Easing.linear }),
      -1,
      false
    );

    cloudYOffset.value = withRepeat(
      withTiming(5, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Reset & trigger Rain Parallax Animations
    rainMistY.value = 0;
    rainMistY.value = withRepeat(
      withTiming(140, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );

    rainTearsY.value = 0;
    rainTearsY.value = withRepeat(
      withTiming(180, { duration: 600, easing: Easing.linear }),
      -1,
      false
    );

    rainStreaksY.value = 0;
    rainStreaksY.value = withRepeat(
      withTiming(220, { duration: 350, easing: Easing.linear }),
      -1,
      false
    );

    // Starlight Dual-Phase Twinkle Animations
    starSparkleGroup1.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    starSparkleGroup2.value = withRepeat(
      withTiming(0.25, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Slow Celestial Rotation Drift
    starDriftX.value = withRepeat(
      withTiming(-40, { duration: 50000, easing: Easing.linear }),
      -1,
      false
    );

    // Periodic Shooting Star Meteor Animation (Every 11s)
    if (isNight && !isBadWeather) {
      shootingStarProgress.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 7000 }),
          withTiming(1, { duration: 750, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 3250 })
        ),
        -1,
        false
      );

      shootingStarOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 7000 }),
          withTiming(0.9, { duration: 150 }),
          withTiming(0, { duration: 600 }),
          withTiming(0, { duration: 3250 })
        ),
        -1,
        false
      );
    }

    // Thunderstorm Lightning Sheet Flash
    if (isThunder) {
      lightningFlash.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 2500 }),
          withTiming(0.5, { duration: 90 }),
          withTiming(0.1, { duration: 70 }),
          withTiming(0.65, { duration: 110 }),
          withTiming(0, { duration: 180 })
        ),
        -1,
        false
      );
    } else {
      lightningFlash.value = 0;
    }
  }, [reduceMotion, isThunder, isRain, isBadWeather, isNight, conditionCode]);

  const animatedCloud1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: cloud1X.value },
      { translateY: cloudYOffset.value },
    ],
  }));

  const animatedCloud2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: cloud2X.value },
      { translateY: -cloudYOffset.value * 0.8 },
    ],
  }));

  const animatedMistStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rainMistY.value }],
  }));

  const animatedTearsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rainTearsY.value }],
  }));

  const animatedStreaksStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rainStreaksY.value }],
  }));

  const animatedStarGroup1 = useAnimatedStyle(() => ({
    opacity: starSparkleGroup1.value,
    transform: [{ translateX: starDriftX.value }],
  }));

  const animatedStarGroup2 = useAnimatedStyle(() => ({
    opacity: starSparkleGroup2.value,
    transform: [{ translateX: starDriftX.value }],
  }));

  const animatedShootingStarStyle = useAnimatedStyle(() => ({
    opacity: shootingStarOpacity.value,
    transform: [
      { translateX: shootingStarProgress.value * (width * 0.7) },
      { translateY: shootingStarProgress.value * 90 },
    ],
  }));

  const animatedLightning = useAnimatedStyle(() => ({
    opacity: lightningFlash.value,
  }));

  // Dynamic Scroll-Driven Sun/Moon Dimming Opacity
  const animatedSunMoonOpacity = useAnimatedStyle(() => {
    if (!isHomeScreen || !scrollY) {
      return { opacity: 1 };
    }
    const dimOpacity = Math.max(0.25, 1 - scrollY.value / 140);
    return { opacity: dimOpacity };
  });

  return (
    <View style={styles.container}>
      {/* MASTER BACKGROUND SKY CANVAS */}
      <View style={styles.backgroundCanvas} pointerEvents="none">
        <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="artSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors[0]} stopOpacity="1" />
              <Stop offset="50%" stopColor={theme.colors[1]} stopOpacity="1" />
              <Stop offset="100%" stopColor={theme.colors[2]} stopOpacity="1" />
            </LinearGradient>

            {/* Shooting Star Comet Tail Gradient */}
            <LinearGradient id="shootingStarTail" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <Stop offset="70%" stopColor="#BAE6FD" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </LinearGradient>

            {/* Depth Scrim Gradient */}
            <LinearGradient id="depthScrim" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
              <Stop offset="30%" stopColor="#000000" stopOpacity="0.05" />
              <Stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
            </LinearGradient>

            {/* Horizon Mountain Wave Gradients */}
            <LinearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
            </LinearGradient>

            <LinearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {/* 1. Base Sky Gradient */}
          <Rect x="0" y="0" width={width} height={height} fill="url(#artSkyGrad)" />

          {/* 4. Static Horizon Mountain Silhouettes */}
          <Path
            d={`M 0,${height - 120} Q ${width * 0.25},${height - 180} ${width * 0.5},${height - 130} T ${width},${height - 150} L ${width},${height} L 0,${height} Z`}
            fill="url(#mountainGrad2)"
          />
          <Path
            d={`M 0,${height - 80} Q ${width * 0.35},${height - 130} ${width * 0.7},${height - 90} T ${width},${height - 100} L ${width},${height} L 0,${height} Z`}
            fill="url(#mountainGrad1)"
          />

          {/* 5. Static Fixed Sky Clouds (Daytime OR Rain/Storm) */}
          {(!isNight || isBadWeather) && (
            <>
              <Path
                d="M 15 80 C 10 65, 25 57, 38 61 C 44 49, 68 47, 80 57 C 90 53, 102 61, 98 75 L 20 75 Z"
                fill={isBadWeather ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.16)'}
              />
              <Path
                d={`M ${width - 140} 145 C ${width - 145} 130, ${width - 130} 123, ${width - 118} 127 C ${width - 110} 115, ${width - 88} 113, ${width - 76} 123 C ${width - 65} 119, ${width - 55} 127, ${width - 60} 140 L ${width - 135} 140 Z`}
                fill={isBadWeather ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.12)'}
              />
            </>
          )}

          {/* Depth Scrim Overlay */}
          <Rect x="0" y="0" width={width} height={height} fill="url(#depthScrim)" />
        </Svg>

        {/* 2. Daytime Sun / Crescent Moon Layer */}
        {!reduceMotion && !isBadWeather && (
          <Animated.View style={[styles.celestialWrapper, animatedSunMoonOpacity]} pointerEvents="none">
            {!isNight ? (
              <Svg height="120" width="120" viewBox="0 0 120 120">
                <Defs>
                  <LinearGradient id="sunLocalCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <Stop offset="55%" stopColor="#FFF59D" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#FFC107" stopOpacity="1" />
                  </LinearGradient>
                </Defs>

                <G origin="60, 60">
                  {/* Sun Rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = 60 + Math.cos(rad) * 31;
                    const y1 = 60 + Math.sin(rad) * 31;
                    const x2 = 60 + Math.cos(rad) * 42;
                    const y2 = 60 + Math.sin(rad) * 42;

                    return (
                      <Line
                        key={idx}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#FFC107"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeOpacity="0.95"
                      />
                    );
                  })}
                  {/* Pure White-Gold Opaque Sun Core */}
                  <Circle
                    cx="60"
                    cy="60"
                    r="25"
                    fill="url(#sunLocalCoreGrad)"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r="25"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeOpacity="0.85"
                    fill="none"
                  />
                </G>
              </Svg>
            ) : (
              /* Exact Beloved Crescent Moon */
              <Svg height="120" width="120" viewBox="0 0 120 120">
                <Path
                  d="M 60 20 A 30 30 0 1 0 90 50 A 24 24 0 1 1 60 20 Z"
                  fill="rgba(255, 255, 255, 0.85)"
                />
              </Svg>
            )}
          </Animated.View>
        )}

        {/* 6. Dribbble/Apple Weather Grade Ultra-Photorealistic Celestial Night Sky */}
        {!reduceMotion && isNight && !isBadWeather && (
          <>
            {/* Star Field Group 1 (With 4-Point Cross Sparkle Flare Stars) */}
            <Animated.View style={[styles.sparkleContainer, animatedStarGroup1]}>
              <Svg height={height * 0.58} width={width + 60}>
                {CELESTIAL_STARS.filter(s => s.group === 1).map((star) => (
                  <G key={star.id}>
                    <Circle
                      cx={star.cx}
                      cy={star.cy}
                      r={star.r}
                      fill={star.color}
                      opacity={star.baseOpacity}
                    />
                    {/* 4-Point Diamond Flare Rays for Major Bright Stars */}
                    {star.isFlare && (
                      <Path
                        d={`M ${star.cx - 5} ${star.cy} L ${star.cx + 5} ${star.cy} M ${star.cx} ${star.cy - 5} L ${star.cx} ${star.cy + 5}`}
                        stroke={star.color}
                        strokeWidth="0.8"
                        strokeOpacity="0.75"
                      />
                    )}
                  </G>
                ))}
              </Svg>
            </Animated.View>

            {/* Star Field Group 2 */}
            <Animated.View style={[styles.sparkleContainer, animatedStarGroup2]}>
              <Svg height={height * 0.58} width={width + 60}>
                {CELESTIAL_STARS.filter(s => s.group === 2).map((star) => (
                  <G key={star.id}>
                    <Circle
                      cx={star.cx}
                      cy={star.cy}
                      r={star.r}
                      fill={star.color}
                      opacity={star.baseOpacity}
                    />
                    {/* 4-Point Diamond Flare Rays for Major Bright Stars */}
                    {star.isFlare && (
                      <Path
                        d={`M ${star.cx - 5} ${star.cy} L ${star.cx + 5} ${star.cy} M ${star.cx} ${star.cy - 5} L ${star.cx} ${star.cy + 5}`}
                        stroke={star.color}
                        strokeWidth="0.8"
                        strokeOpacity="0.75"
                      />
                    )}
                  </G>
                ))}
              </Svg>
            </Animated.View>

            {/* Dynamic Shooting Star Meteor Comet Streak */}
            <Animated.View style={[styles.shootingStarWrapper, animatedShootingStarStyle]}>
              <Svg height="40" width="80" viewBox="0 0 80 40">
                <Line
                  x1="5"
                  y1="35"
                  x2="75"
                  y2="5"
                  stroke="url(#shootingStarTail)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <Circle cx="75" cy="5" r="2" fill="#FFFFFF" />
              </Svg>
            </Animated.View>
          </>
        )}

        {/* 7. Dynamic Moving Overcast Clouds (Daytime OR Rain/Storm) */}
        {!reduceMotion && (!isNight || isBadWeather) && (
          <>
            <Animated.View style={[styles.cloud, { top: 95 }, animatedCloud1]}>
              <Svg height="110" width="240" viewBox="0 0 220 90">
                <Path
                  d="M 20 68 C 12 48, 35 38, 50 44 C 58 26, 92 18, 115 30 C 130 18, 165 20, 178 35 C 192 30, 212 42, 205 62 C 212 68, 202 78, 180 75 L 30 75 C 20 75, 12 72, 20 68 Z"
                  fill={isBadWeather ? 'rgba(224, 242, 254, 0.38)' : 'rgba(255, 255, 255, 0.22)'}
                />
              </Svg>
            </Animated.View>

            <Animated.View style={[styles.cloud, { top: 165 }, animatedCloud2]}>
              <Svg height="100" width="220" viewBox="0 0 200 80">
                <Path
                  d="M 15 60 C 10 42, 28 35, 42 40 C 48 24, 78 18, 98 28 C 112 16, 142 18, 155 32 C 168 28, 185 38, 180 55 C 188 60, 180 70, 160 68 L 25 68 C 15 68, 10 65, 15 60 Z"
                  fill={isBadWeather ? 'rgba(224, 242, 254, 0.28)' : 'rgba(255, 255, 255, 0.14)'}
                />
              </Svg>
            </Animated.View>
          </>
        )}

        {/* 8. Ultra-Realistic 3-Layer Volumetric Parallax Rain Particle System */}
        {!reduceMotion && isBadWeather && (
          <>
            {/* Layer A: Background Rain Mist */}
            <Animated.View style={[styles.rainContainer, animatedMistStyle]} pointerEvents="none">
              <Svg height={height + 200} width={width}>
                {RAIN_MIST.map((dot) => (
                  <Circle
                    key={dot.id}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.r}
                    fill="rgba(224, 242, 254, 0.7)"
                    opacity={dot.opacity}
                  />
                ))}
              </Svg>
            </Animated.View>

            {/* Layer B: Midground Rain Tear Drops */}
            <Animated.View style={[styles.rainContainer, animatedTearsStyle]} pointerEvents="none">
              <Svg height={height + 220} width={width}>
                {RAIN_TEARS.map((tear) => (
                  <Ellipse
                    key={tear.id}
                    cx={tear.cx}
                    cy={tear.cy}
                    rx={tear.rx}
                    ry={tear.ry}
                    fill="rgba(186, 230, 253, 0.85)"
                    opacity={tear.opacity}
                  />
                ))}
              </Svg>
            </Animated.View>

            {/* Layer C: Foreground Slanted Rain Streaks */}
            <Animated.View style={[styles.rainContainer, animatedStreaksStyle]} pointerEvents="none">
              <Svg height={height + 250} width={width}>
                {RAIN_STREAKS.map((streak) => (
                  <Line
                    key={streak.id}
                    x1={streak.x}
                    y1={streak.y}
                    x2={streak.x - streak.slant}
                    y2={streak.y + streak.length}
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={streak.opacity}
                  />
                ))}
              </Svg>
            </Animated.View>
          </>
        )}

        {/* 9. Thunderstorm Ambient Lightning Sheet Flash Overlay */}
        {!reduceMotion && isThunder && (
          <Animated.View
            style={[styles.lightningOverlay, animatedLightning]}
            pointerEvents="none"
          />
        )}
      </View>

      {/* FOREGROUND WEATHER CONTENT LAYER */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E14',
  },
  backgroundCanvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  celestialWrapper: {
    position: 'absolute',
    top: 25,
    right: 5,
    width: 120,
    height: 120,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  shootingStarWrapper: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 80,
    height: 40,
  },
  cloud: {
    position: 'absolute',
    left: 0,
  },
  rainContainer: {
    position: 'absolute',
    top: -150,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lightningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
