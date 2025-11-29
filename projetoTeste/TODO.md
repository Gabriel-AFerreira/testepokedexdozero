# Pokemon Party System Implementation

## Tasks
- [x] Add party database functions in utils/database.ts: create party table, savePartyPokemon, getPartyPokemons, removePartyPokemon
- [x] Update screens/PokeInfoScreen/index.tsx: implement handleAddToParty with 6 Pokemon limit check
- [x] Update screens/PokePartyScreen/index.tsx: load party from database instead of mock data
- [x] Update screens/PokePartyScreen/index.tsx: implement handleRemoveFromParty to remove from database
- [x] Modify savePartyPokemon to allow duplicates instead of blocking
- [x] Update handleAddToParty in PokeInfoScreen to show confirmation alert for duplicates
- [x] Update handleAddToParty in PokedexScreen to implement actual saving logic with duplicate confirmation
- [x] Restructure party table: position (1-6) as primary key, pokeid as foreign key
- [x] Update PartyPokemon interface to use position and pokeid
- [x] Update PartyPokemons component interface and logic
- [x] Update all party functions to work with new structure
- [x] Fix position gaps: when removing, shift higher positions down
- [x] Update removePartyPokemon to shift positions after removal
- [x] Update savePartyPokemon to add to next available position
- [ ] Test adding Pokemon to party from PokeInfoScreen (enforce 6 limit, allow duplicates with confirmation)
- [ ] Test adding Pokemon to party from PokedexScreen (enforce 6 limit, allow duplicates with confirmation)
- [ ] Test viewing party in PokePartyScreen
- [ ] Test removing Pokemon from party (ensure positions shift correctly)
- [ ] Verify state updates across screens
