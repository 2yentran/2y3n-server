import axios from 'axios';

class Pokemon {
  /**
   * Search for a Pokemon using the pokeapi.
   *
   * @param search
   */
  async find(search) {
    try {
      const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`);
      return await this.updateSpeciesData(data);
    } catch (e) {
      // Next search by type if regular search fails
      return this.findByType(search);
    }
  }

  /**
   * Search for a Pokemons base on a type using the pokeapi.
   *
   * @param search
   */
  async findByType(search) {
    try {
      const { data } = await axios.get('https://pokeapi.co/api/v2/type/' + search);
      const pokemons = [];

      // Check each Pokemon found for type
      data.pokemon.forEach((pokemon) => {
        // Sample URL: https://pokeapi.co/api/v2/pokemon/147/
        const id = pokemon.pokemon.url.slice(34, -1);

        // TODO: check to see if we need to do this
        // Search for each Pokemon by id.
        const pokemon = await this.getPokemon(id);
        if (pokemon !== null) {
          pokemons[id] = pokemon;
        }
      });

      return pokemons;
    } catch (e) {
      // None found
      return null;
    }
  }

  /**
   * Get the species data for the Pokemon.
   *
   * @param search
   */
  async getSpecies(search) {
    return axios.get('https://pokeapi.co/api/v2/pokemon-species/' + search, (data, response) => {
        if (response.statusCode != 200) {
          return null; // Nothing found
        } else {
          return data;
        }
      }
    );
  }

  /**
   * Update the Pokemon data with the habitat and flavor text information.
   *
   * @param pokemon
   */
  async updateSpeciesData(pokemon) {
    // Need to get information about the Pokemon's habitat and flavor text
    const species = await this.getSpecies(pokemon.species.name);

    if (species === null) {
      return null;
    }

    if (species !== null) {
      pokemon.habitat = species.habitat.name;

      

      const englishTextEntry = species.flavor_text_entries.find((textEntry) => {
        return textEntry.language.name === 'en';
      });

      pokemon.flavor_text = englishTextEntry.flavor_text;
    } else {
      // default to empty string if data wasn't able to be retrieved
      pokemon.habitat = '';
      pokemon.flavor_text = '';
    }

    return pokemon;
  }
}

export default Pokemon;
