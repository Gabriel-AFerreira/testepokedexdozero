import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF0000',
    alignItems: 'center',
    paddingLeft: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    flexDirection: 'row', // Para alinhar título e botões
    justifyContent: "space-between", // Para separar título e botões
    paddingHorizontal: 20, // Adicionado padding horizontal
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1, // Para ocupar espaço disponível
    textAlign: 'left', // Alinha título a esquerda
    marginTop: 25, // Adiciona uma margem ao topo
  },
  // Container para os botões
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  // Botão de pesquisa
  searchButton: {
    padding: 10,
    //marginTop: 25,
    marginRight: 60, // Espaço entre lupa e hamburger
  },
  searchButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});