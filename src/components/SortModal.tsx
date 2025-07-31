import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { usePreferences } from '../store';

export type SortOption = 'rating' | 'popularity' | 'alphabetical' | 'distance';

interface SortModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentSort: SortOption;
  onSortSelect: (sort: SortOption) => void;
}

const sortOptions = [
  {
    key: 'rating' as SortOption,
    title: 'En Yüksek Puan',
    subtitle: 'Yıldız puanına göre',
    icon: '⭐',
  },
  {
    key: 'popularity' as SortOption,
    title: 'En Popüler',
    subtitle: 'Değerlendirme sayısına göre',
    icon: '🔥',
  },
  {
    key: 'alphabetical' as SortOption,
    title: 'Alfabetik',
    subtitle: 'A-Z sıralaması',
    icon: '🔤',
  },
  {
    key: 'distance' as SortOption,
    title: 'En Yakın',
    subtitle: 'Mesafeye göre (yakında)',
    icon: '📍',
  },
];

export const SortModal: React.FC<SortModalProps> = ({
  isVisible,
  onClose,
  currentSort,
  onSortSelect,
}) => {
  const preferences = usePreferences();
  const isDark = preferences.theme === 'dark';

  const backgroundColor = isDark ? '#1C1C1C' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#212121';
  const subtextColor = isDark ? '#B0B0B0' : '#666666';
  const selectedColor = '#D62828';

  const handleSortSelect = (sort: SortOption) => {
    onSortSelect(sort);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.modal, { backgroundColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              🔄 Sıralama Seçenekleri
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sort Options */}
          <View style={styles.content}>
            {sortOptions.map(option => {
              const isSelected = option.key === currentSort;
              const selectedBackgroundColor = isDark ? '#2C1810' : '#FFF3F3';
              const selectedTextColor = isSelected ? selectedColor : textColor;
              const selectedFontWeight = isSelected ? '600' : '500';

              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    isSelected && {
                      backgroundColor: selectedBackgroundColor,
                      borderColor: selectedColor,
                    },
                  ]}
                  onPress={() => handleSortSelect(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <View style={styles.optionText}>
                      <Text
                        style={[
                          styles.optionTitle,
                          {
                            color: selectedTextColor,
                            fontWeight: selectedFontWeight,
                          },
                        ]}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={[styles.optionSubtitle, { color: subtextColor }]}
                      >
                        {option.subtitle}
                      </Text>
                    </View>
                    {isSelected && (
                      <Text
                        style={[styles.checkIcon, { color: selectedColor }]}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    maxHeight: height * 0.7,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sortOption: {
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  checkIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default SortModal;
