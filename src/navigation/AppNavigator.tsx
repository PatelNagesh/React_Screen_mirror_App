import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { AuthScreen, HomeScreen, ProfileScreen } from '../screens';
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
        options={({ navigation }) => ({
          title: 'BeamSync',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={{ padding: 8, marginRight: 8 }}
            >
              <FontAwesome5 name="user-circle" size={24} color={colors.slate700} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

