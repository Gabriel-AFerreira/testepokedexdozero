import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

interface HamburgerMenuProps {
  onSelectOption: (option: string) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onSelectOption }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { width } = useWindowDimensions();

  const menuOptions = [
    { id: 'perfil', label: 'PokePerfil' },
    { id: 'dex', label: 'PokeDex' },
    { id: 'party', label: 'PokeParty' },
    { id: 'logout', label: 'Logout' },
  ];

  const handleOptionSelect = (option: string) => {
    setIsVisible(false);
    onSelectOption(option);
  };

  return (
    <View style={styles.container}>
      {/* Botão Hamburguer */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => setIsVisible(true)}
      >
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </TouchableOpacity>

      {/* Modal do Menu */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={[styles.menuContainer, { right: width * 0.05 }]}>
            {menuOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.menuItem}
                onPress={() => handleOptionSelect(option.id)}
              >
                <Text style={styles.menuItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
  },
  hamburgerButton: {
    padding: 10,
  },
  hamburgerLine: {
    width: 25,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginVertical: 2,
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});