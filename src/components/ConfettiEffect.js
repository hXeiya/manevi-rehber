import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 30;

export default function ConfettiEffect({ active, onComplete }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Generate random particle settings
    const newParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      return {
        id: i,
        x: Math.random() * width,
        yAnim: new Animated.Value(height + 50),
        opacityAnim: new Animated.Value(0),
        scaleAnim: new Animated.Value(Math.random() * 0.8 + 0.4),
        color: ['#F5C469', '#D4AF37', '#FFD700', '#FFF8DC'][Math.floor(Math.random() * 4)],
        delay: Math.random() * 1200,
      };
    });

    setParticles(newParticles);

    // Create parallel animations
    const animations = newParticles.map((p) => {
      // 1. Move upwards
      const yAnim = Animated.timing(p.yAnim, {
        toValue: height * 0.1 + Math.random() * 100,
        duration: 2500 + Math.random() * 1000,
        delay: p.delay,
        useNativeDriver: true,
      });

      // 2. Fade in then fade out
      const opacityAnim = Animated.sequence([
        Animated.timing(p.opacityAnim, {
          toValue: 0.8,
          duration: 600,
          delay: p.delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacityAnim, {
          toValue: 0,
          duration: 1500 + Math.random() * 500,
          useNativeDriver: true,
        }),
      ]);

      return Animated.parallel([yAnim, opacityAnim]);
    });

    // Start all animations in parallel
    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete();
    });

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Animated.View
          key={p.id}
          style={[
            styles.particle,
            {
              backgroundColor: p.color,
              transform: [
                { translateX: p.x },
                { translateY: p.yAnim },
                { scale: p.scaleAnim },
              ],
              opacity: p.opacityAnim,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
