import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useUIStore, usePreferences } from '../store';
import { useTranslation } from 'react-i18next';

export type TabType = 'Explore' | 'Favorites' | 'Map' | 'Profile';

interface TabItem {
  id: TabType;
  titleKey: string;
  emoji: string;
}

const TABS: TabItem[] = [
  { id: 'Explore', titleKey: 'tabs.explore', emoji: '🏠' },
  { id: 'Favorites', titleKey: 'tabs.favorites', emoji: '❤️' },
  { id: 'Map', titleKey: 'tabs.map', emoji: '🗺️' },
  { id: 'Profile', titleKey: 'tabs.profile', emoji: '👤' },
];

const TabNavigation: React.FC = () => {
  const { t } = useTranslation();
  const currentTab = useUIStore(state => state.currentTab);
  const setCurrentTab = useUIStore(state => state.setCurrentTab);
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const handleTabPress = (tabId: TabType) => {
    setCurrentTab(tabId);
  };

  const themeColors = {
    light: {
      background: '#FFFFFF',
      border: '#E5E5E5',
      activeTab: '#D62828',
      inactiveTab: '#757575',
      activeBackground: '#FFE8E8',
      text: '#000000',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      background: '#1A1A1A',
      border: '#2A2A2A',
      activeTab: '#D62828',
      inactiveTab: '#999999',
      activeBackground: '#2A1A1A',
      text: '#FFFFFF',
      shadow: 'rgba(255, 255, 255, 0.1)',
    },
  };

  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {TABS.map(tab => {
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isActive && { backgroundColor: colors.activeBackground },
              ]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabEmoji,
                  { opacity: isActive ? 1 : 0.6 } as any,
                ]}
              >
                {tab.emoji}
              </Text>
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? colors.activeTab : colors.inactiveTab,
                    fontWeight: isActive ? '600' : '400',
                  } as any,
                ]}
              >
                {t(tab.titleKey)}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.activeTab },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginHorizontal: 2,
    position: 'relative',
    minHeight: 60,
  },
  tabEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});

export default TabNavigation;
