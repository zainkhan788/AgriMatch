import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

const LOGO = require('@/assets/images/Agrimatch-logo.png');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 350,
    height: 350,
  },
});
