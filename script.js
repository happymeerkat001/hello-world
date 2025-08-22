fetch('https://pokeapi.co/api/v2/pokemon/ditto')
  .then(response => response.json())
  .then(data => {
    const card = document.getElementById('pokemon-card');
    card.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <p>Height: ${data.height}</p>
      <p>Weight: ${data.weight}</p>
      <p>Base Experience: ${data.base_experience}</p>
    `;
  })
  .catch(error => {
    document.getElementById('pokemon-card').innerHTML = `<p>Error loading data</p>`;
    console.error(error);
  });

