import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    paddingLeft: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  headerText: {
    fontWeight: 'bold',
    // fontSize e color são definidos dinamicamente no componente
  },
});