import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pokemonNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  // ✅ NOVO: Container do Sprite
  spriteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  pokemonSprite: {
    width: 80,
    height: 80,
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // ✅ ATUALIZADO: Container dos botões reorganizado
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // ✅ BOTÃO FAVORITO MOVido para ESQUERDA
  favoriteButton: {
    backgroundColor: '#E0E0E0',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteButtonActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
  },
  favoriteButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // ✅ BOTÃO PARTY mantido na DIREITA
  partyButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  partyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});