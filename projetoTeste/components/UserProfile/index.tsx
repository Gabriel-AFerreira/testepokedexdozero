import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { styles } from './styles';
import { ImageUpload } from '../ImageUpload';

export interface UserData {
  nickname: string;
  nome: string;
  idade: string;
  email: string;
  profileImage?: string;
}

interface UserProfileProps {
  user: UserData;
  onImageSelected: (uri: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onImageSelected }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* Imagem de Perfil */}
      <View style={styles.imageSection}>
        <ImageUpload 
          onImageSelected={onImageSelected}
          currentImage={user.profileImage}
        />
      </View>

      {/* Informações do Usuário */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nickname:</Text>
          <Text style={styles.value}>{user.nickname}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user.nome}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.value}>{user.idade} anos</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>
    </View>
  );
};