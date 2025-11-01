import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';

interface ImageUploadProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelected, 
  currentImage 
}) => {
  const [imageUri, setImageUri] = useState<string | undefined>(currentImage);
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width * 0.3, 120);

  const pickImage = async () => {
    try {
      // Solicita permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher uma imagem.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0].uri;
        setImageUri(selectedImage);
        onImageSelected(selectedImage);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.imageContainer, { width: imageSize, height: imageSize }]} 
        onPress={pickImage}
      >
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={[styles.image, { width: imageSize, height: imageSize }]}
          />
        ) : (
          <View style={[styles.placeholder, { width: imageSize, height: imageSize }]}>
            <Text style={styles.placeholderText}>+</Text>
            <Text style={styles.placeholderSubtext}>Foto</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.helpText}>Toque para alterar a foto</Text>
    </View>
  );
};