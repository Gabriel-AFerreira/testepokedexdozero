import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  pokemonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pokemonCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative', // Importante para posicionar o botão absoluto
  },
  // ✅ NOVO: Botão de Remover
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
    marginTop: -1,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  pokemonInfo: {
    alignItems: 'center',
    width: '100%',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  typesContainer: {
    marginBottom: 5,
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    margin: 2,
  },
  typeChip: {
    backgroundColor: '#4CAF50',
  },
  weaknessChip: {
    backgroundColor: '#FF5252',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});