const dropdown = document.getElementById('pokemonDropdown');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const card = document.getElementById('pokemon-card');

// Load all Pokémon names into dropdown
fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
  .then(res => res.json())
  .then(data => {
    dropdown.innerHTML = '<option value="">-- Select a Pokémon --</option>';
    data.results.forEach(pokemon => {
      const option = document.createElement('option');
      option.value = pokemon.name;
      option.textContent = pokemon.name;
      dropdown.appendChild(option);
    });
  });

// Handle dropdown change
dropdown.addEventListener('change', () => {
  if (dropdown.value) {
    fetchPokemon(dropdown.value);
  }
});

// Handle search button click
searchButton.addEventListener('click', () => {
  const name = searchInput.value.trim().toLowerCase();
  if (name) {
    fetchPokemon(name);
  }
});

// Fetch and display Pokémon
function fetchPokemon(name) {
  card.innerHTML = '<p>Loading...</p>';

  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      const imgUrl = data.sprites.front_default;
      const type = data.types.map(t => t.type.name).join(', ');
      card.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${imgUrl}" alt="${data.name}" />
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Weight:</strong> ${data.weight}</p>
        <p><strong>Base Experience:</strong> ${data.base_experience}</p>
      `;
    })
    .catch(err => {
      card.innerHTML = `<p class="error">Error: Pokémon not found</p>`;
      console.error(err);
    });
}