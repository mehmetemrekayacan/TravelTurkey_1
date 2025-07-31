import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { usePreferences } from '../store';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  showSearch = false,
  showNotification = false,
  onMenuPress,
  onSearchPress,
  onNotificationPress,
  rightComponent,
  style,
  transparent = false,
}) => {
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const handleBack = () => {
    // Navigation functionality removed for compatibility
  };

  const handleMenu = () => {
    if (onMenuPress) {
      onMenuPress();
    } else {
      // Navigation functionality removed for compatibility
      console.warn('Menu functionality disabled');
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: transparent
      ? 'transparent'
      : isDark
      ? '#1A1A1A'
      : '#FFFFFF',
    borderBottomColor: transparent
      ? 'transparent'
      : isDark
      ? '#2C2C2C'
      : '#E0E0E0',
  };

  const titleStyle: TextStyle = {
    ...styles.title,
    color: isDark ? '#FFFFFF' : '#212121',
  };

  const subtitleStyle: TextStyle = {
    ...styles.subtitle,
    color: isDark ? '#B0B0B0' : '#757575',
  };

  const iconColor = isDark ? '#FFFFFF' : '#212121';

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          transparent ? 'transparent' : isDark ? '#1A1A1A' : '#FFFFFF'
        }
        translucent={transparent}
      />

      <View style={[styles.content, style]}>
        {/* Left Side */}
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconText, { color: iconColor }]}>←</Text>
            </TouchableOpacity>
          )}

          {showMenu && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleMenu}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconText, { color: iconColor }]}>☰</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.centerContainer}>
          <Text style={titleStyle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={subtitleStyle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Side */}
        <View style={styles.rightContainer}>
          {rightComponent}

          {showSearch && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconText, { color: iconColor }]}>🔍</Text>
            </TouchableOpacity>
          )}

          {showNotification && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.iconText, { color: iconColor }]}>🔔</Text>
              {/* Badge for unread notifications */}
              {/* <View style={styles.notificationBadge} /> */}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D62828',
  },
  iconText: {
    fontSize: 24,
    fontWeight: '400',
  },
});

export default Header;
