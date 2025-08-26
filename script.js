// ===== Target (DOM) =====
const tableBody  = document.querySelector('#pokemon-table tbody');
const pagination = document.getElementById('pagination');
const modal      = document.getElementById('modal');
const modalBody  = document.getElementById('modal-body');

// ===== Trigger (load-time) → Controller =====
let currentPage = 1;
const perPage   = 20;

fetchPage(currentPage);
setupPagination();

// ===== Controller: build one page of rows =====
async function fetchPage(page) {
  const offset = (page - 1) * perPage;

  // View: loading state
  tableBody.innerHTML = `<tr><td colspan="5">Loading…</td></tr>`;

  try {
    // Request → Response (list)
    const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${perPage}`);
    const list    = await listRes.json(); // { results: [{ name, url }, ...] }

    // Request → Response (details, in parallel)
    const detailPromises = list.results.map(p => fetch(p.url).then(r => r.json()));
    const details = await Promise.all(detailPromises);

    // View: success — render table
    tableBody.innerHTML = '';
    details.forEach((detail, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${offset + index + 1}</td>
        <td>${detail.name}</td>
        <td>${detail.types.map(t => t.type.name).join(', ')}</td>
        <td>${detail.weight}</td>
        <td>${detail.base_experience}</td>
      `;
      // Trigger (user) → Controller (showModal)
      row.addEventListener('click', () => showModal(detail));
      tableBody.appendChild(row);
    });
  } catch (err) {
    // View: error
    tableBody.innerHTML = `<tr><td colspan="5" class="error">Failed to load Pokémon.</td></tr>`;
    console.error(err);
  }
}

// ===== Controller: build pagination + wire triggers =====
function setupPagination() {
  pagination.innerHTML = ''; // View

  for (let i = 1; i <= 66; i++) {
    const btn = document.createElement('button'); // View
    btn.textContent = i;
    btn.className   = 'page-btn';
    btn.disabled    = (i === currentPage);

    // Trigger (user) → Controller
    btn.addEventListener('click', () => {
      currentPage = i;
      fetchPage(currentPage); // Controller → (Request → Response → View)
      setupPagination();      // Controller → View
    });

    pagination.appendChild(btn); // View
  }
}

// ===== Controller: show modal (View only) =====
function showModal(pokemon) {
  const img = pokemon.sprites.front_default || '';
  modalBody.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    ${img ? `<img src="${img}" alt="${pokemon.name}" />` : ''}
    <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Weight:</strong> ${pokemon.weight}</p>
    <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
  `;
  modal.classList.remove('hidden'); // View
}
const closeModal = document.getElementById('close');


// ===== Trigger (user): close modal → View =====
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden'); // View
});
