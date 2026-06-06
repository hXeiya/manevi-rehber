import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import DiscoverDetailScreen from '../screens/DiscoverDetailScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function DiscoverStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DiscoverHome" component={DashboardScreen} />
      <Stack.Screen name="DiscoverDetail" component={DiscoverDetailScreen} />
    </Stack.Navigator>
  );
}
