import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthScreen, HomeScreen } from '../screens';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTintColor: colors.slate900,
        headerStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'BeamSync' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

