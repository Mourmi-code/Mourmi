const characters = window.CHARACTERS || [];

const categories = ["tous", "héros", "enfants", "alliés", "antagonistes", "habitants de Clairval"];
let selectedCategory = "tous";
let selectedId = characters[0]?.id || null;

const listEl = document.getElementById("characterList");
const detailEl = document.getElementById("characterDetail");
const searchEl = document.getElementById("searchInput");
const filtersEl = document.getElementById("filters");

function filteredCharacters() {
  const q = searchEl.value.trim().toLowerCase();
  return characters.filter(
    (c) =>
      (selectedCategory === "tous" || c.categories.includes(selectedCategory)) &&
      c.nom.toLowerCase().includes(q)
  );
}

function renderFilters() {
  filtersEl.innerHTML = "";
  categories.forEach((cat) => {
    const b = document.createElement("button");
    b.textContent = cat;
    if (cat === selectedCategory) b.className = "active";
    b.onclick = () => {
      selectedCategory = cat;
      const v = filteredCharacters();
      selectedId = v[0]?.id || null;
      render();
    };
    filtersEl.appendChild(b);
  });
}

function renderList() {
  const visible = filteredCharacters();
  listEl.innerHTML = "";
  visible.forEach((c) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.innerHTML = `<strong>${c.nom}</strong><br><small>${c.identite.rolePrincipal}</small>`;
    b.onclick = () => {
      selectedId = c.id;
      renderDetail();
    };
    li.appendChild(b);
    listEl.appendChild(li);
  });
  if (!visible.length) listEl.innerHTML = "<li>Aucun personnage trouvé.</li>";
}

function buildPrompt(c) {
  return [
    `Portrait cartoon chaleureux dans l'univers Mourmiverse de ${c.nom}.`,
    `Identité: ${c.identite.espece}, ${c.identite.ageCanon}, ${c.identite.rolePrincipal}.`,
    `Apparence canon: ${c.apparenceCanon}`,
    `Tenue canon: ${c.tenueCanon}`,
    `Personnalité visible: ${c.personnalite}`,
    `Relations clés: ${c.relations}`,
    `Voix/ton suggéré visuellement: ${c.voixTon}`,
    `Mots-clés visuels: ${c.motsClesVisuels.join(", ")}`,
    `Mots-clés émotionnels: ${c.motsClesEmotionnels.join(", ")}`,
    `Citation canon: "${c.phraseCanon}"`,
    "Style: clair, moderne, cartoon, chaleureux, lumières douces, ambiance Clairval, quotidien + merveilleux."
  ].join("\n");
}

function renderDetail() {
  const c = filteredCharacters().find((x) => x.id === selectedId);
  if (!c) {
    detailEl.innerHTML = "<p>Sélectionne un personnage dans la liste.</p>";
    return;
  }

  detailEl.innerHTML = `
    <h3>${c.nom}</h3>
    <div class="chips">${c.categories.map((cat) => `<span class="chip">${cat}</span>`).join("")}</div>
    <div class="detail-section"><strong>Identité :</strong> ${c.identite.espece}, ${c.identite.ageCanon} · ${c.identite.statut}</div>
    <div class="detail-section"><strong>Lieux :</strong> vie (${c.identite.lieuVie}) · travail (${c.identite.lieuTravail}) · lieu-clé (${c.identite.lieuCle})</div>
    <div class="detail-section"><strong>Fonction narrative :</strong> ${c.fonctionNarrative}</div>
    <div class="detail-section"><strong>Apparence canon :</strong> ${c.apparenceCanon}</div>
    <div class="detail-section"><strong>Tenue canon :</strong> ${c.tenueCanon}</div>
    <div class="detail-section"><strong>Personnalité :</strong> ${c.personnalite}</div>
    <div class="detail-section"><strong>Forces :</strong> ${(c.forces || []).join(", ")}</div>
    <div class="detail-section"><strong>Failles :</strong> ${(c.failles || []).join(", ")}</div>
    <div class="detail-section"><strong>Relations :</strong> ${c.relations}</div>
    <div class="detail-section"><strong>Voix / ton :</strong> ${c.voixTon}</div>
    <div class="detail-section"><strong>Mots-clés visuels :</strong> ${c.motsClesVisuels.join(", ")}</div>
    <div class="detail-section"><strong>Citation canon :</strong> “${c.phraseCanon}”</div>
    <button id="promptBtn" class="prompt-btn">Générer le prompt visuel</button>
    <pre id="promptOutput" class="prompt-output" hidden></pre>
  `;

  const btn = document.getElementById("promptBtn");
  const out = document.getElementById("promptOutput");
  btn.onclick = () => {
    out.hidden = false;
    out.textContent = buildPrompt(c);
  };
}

function render() {
  renderFilters();
  renderList();
  renderDetail();
}

searchEl.addEventListener("input", () => {
  const v = filteredCharacters();
  if (!v.some((c) => c.id === selectedId)) selectedId = v[0]?.id || null;
  renderList();
  renderDetail();
});

render();
