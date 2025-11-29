import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, PokedexScreen, CadastroScreen, PokePerfilScreen, PokePartyScreen, PokeInfoScreen } from './screens';
import { initDatabase } from './utils/database';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const initializeDB = async () => {
      await initDatabase();
    };
    initializeDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pokedex"
          component={PokedexScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PokePerfil"
          component={PokePerfilScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PokeParty"
          component={PokePartyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PokeInfo"
          component={PokeInfoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
