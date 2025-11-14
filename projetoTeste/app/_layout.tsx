import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../services/database';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Initialize database when app starts
    initDatabase().catch(console.error);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
        <Stack.Screen name="pokedex" options={{ title: 'Pokedex' }} />
        <Stack.Screen name="pokeinfo" options={{ title: 'Pokemon Info' }} />
        <Stack.Screen name="pokeparty" options={{ title: 'PokeParty' }} />
        <Stack.Screen name="pokeperfil" options={{ title: 'PokePerfil' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
