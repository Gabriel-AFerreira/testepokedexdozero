import { router } from 'expo-router';

export const navigateToScreen = (screenName: string) => {
  console.log('navigateToScreen called with screenName:', screenName);
  router.push(`/${screenName}`);
};

export const goBack = () => {
  router.back();
};

export const navigateToHome = () => {
  router.replace('/');
};

export const navigateToPokedex = () => {
  router.push('/pokedex');
};

export const navigateToParty = () => {
  router.push('/pokeparty');
};

export const navigateToProfile = () => {
  console.log('navigateToProfile called');
  router.push('/pokeperfil');
};

export const navigateToPokemonInfo = (pokemonId?: number) => {
  if (pokemonId) {
    router.push(`/pokeinfo?id=${pokemonId}`);
  } else {
    router.push('/pokeinfo');
  }
};

export const navigateToCadastro = () => {
  router.push('/cadastro');
};
