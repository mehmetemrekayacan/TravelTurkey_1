import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens (will be created)
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LocationDetailScreen from '../screens/LocationDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AuthScreen from '../screens/AuthScreen';

// Types
import {
  RootStackParamList,
  MainTabParamList,
  DrawerParamList,
} from '../types';

// Store
import { useAppStore } from '../store';

// Navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Custom Tab Bar Icon Component
interface TabIconProps {
  name: string;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, color, size }) => (
  <Icon name={name} size={size} color={color} />
);

// Helper functions for icon rendering
const getTabIcon = (routeName: string, color: string, size: number) => {
  let iconName: string;

  switch (routeName) {
    case 'Explore':
      iconName = 'explore';
      break;
    case 'Favorites':
      iconName = 'favorite';
      break;
    case 'Map':
      iconName = 'map';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help';
  }

  return <TabIcon name={iconName} color={color} size={size} />;
};

const getDrawerIcon =
  (iconName: string) =>
  ({ color, size }: { color: string; size: number }) =>
    <TabIcon name={iconName} color={color} size={size} />;

// Main Tab Navigator
const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
        tabBarActiveTintColor: '#D62828',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: t('navigation.explore'),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: t('navigation.favorites'),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: t('navigation.map'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer Navigator (for side menu)
const DrawerNavigator = () => {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FAFAFA',
        },
        drawerActiveTintColor: '#D62828',
        drawerInactiveTintColor: '#757575',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          drawerLabel: t('navigation.explore'),
          drawerIcon: getDrawerIcon('explore'),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: t('common.settings'),
          drawerIcon: getDrawerIcon('settings'),
        }}
      />
    </Drawer.Navigator>
  );
};

// Root Stack Navigator
const RootNavigator = () => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
        }),
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LocationDetail"
            component={LocationDetailScreen}
            options={{
              headerShown: true,
              headerTitle: '',
              headerTransparent: true,
              headerBackTitleVisible: false,
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerBackTitleVisible: false,
              headerTintColor: '#D62828',
              headerStyle: {
                backgroundColor: '#FAFAFA',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#E0E0E0',
              },
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
