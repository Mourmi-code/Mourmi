const characters = window.CHARACTERS || [];

const categories = ["tous", "héros", "enfants", "alliés", "antagonistes", "habitants de Clairval"];
let selectedCategory = "tous";
let selectedId = characters[0]?.id || null;

const listEl = document.getElementById("characterList");
const detailEl = document.getElementById("characterDetail");
const searchEl = document.getElementById("searchInput");
const filtersEl = document.getElementById("filters");

function listItems(items) {
  return `<ul class="detail-list">${(items || []).map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function fieldLine(label, value) {
  return value ? `<div class="identity-line"><strong>${label} :</strong> ${value}</div>` : "";
}

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
    if (c.id === selectedId) b.className = "selected";
    b.innerHTML = `<strong>${c.nom}</strong><br><small>${c.identite.rolePrincipal}</small>`;
    b.onclick = () => {
      selectedId = c.id;
      renderList();
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
    `Fonction narrative: ${c.fonctionNarrative}`,
    `Apparence canon: ${c.apparenceCanon}`,
    `Tenue canon: ${c.tenueCanon}`,
    `Personnalité visible: ${c.personnalite}`,
    `Forces à suggérer visuellement: ${(c.forces || []).join(", ")}`,
    `Failles à suggérer subtilement: ${(c.failles || []).join(", ")}`,
    `Relations principales: ${(c.relationsPrincipales || []).join(" | ")}`,
    `Voix/ton suggéré visuellement: ${c.voixTon}`,
    `Mots-clés visuels: ${c.motsClesVisuels.join(", ")}`,
    `Mots-clés émotionnels: ${c.motsClesEmotionnels.join(", ")}`,
    `Phrase canon / résumé: "${c.phraseCanon}"`,
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

    <section class="detail-section">
      <h4>Identité</h4>
      <div class="identity-grid">
        ${fieldLine("Nom complet", c.identite.nomComplet)}
        ${fieldLine("Espèce", c.identite.espece)}
        ${fieldLine("Âge canon", c.identite.ageCanon)}
        ${fieldLine("Rôle principal", c.identite.rolePrincipal)}
        ${fieldLine("Statut", c.identite.statut)}
        ${fieldLine("Lieu de vie", c.identite.lieuVie)}
        ${fieldLine("Lieu de travail", c.identite.lieuTravail)}
        ${fieldLine("Lieu-clé", c.identite.lieuCle)}
      </div>
    </section>

    <section class="detail-section"><h4>Fonction narrative</h4><p>${c.fonctionNarrative}</p></section>
    <section class="detail-section"><h4>Apparence canon</h4><p>${c.apparenceCanon}</p></section>
    <section class="detail-section"><h4>Tenue canon</h4><p>${c.tenueCanon}</p></section>
    <section class="detail-section"><h4>Personnalité</h4><p>${c.personnalite}</p></section>
    <section class="detail-section"><h4>Forces</h4>${listItems(c.forces)}</section>
    <section class="detail-section"><h4>Failles</h4>${listItems(c.failles)}</section>
    <section class="detail-section"><h4>Relations principales</h4>${listItems(c.relationsPrincipales)}<p>${c.relations}</p></section>
    <section class="detail-section"><h4>Voix / ton</h4><p>${c.voixTon}</p></section>
    <section class="detail-section"><h4>Mots-clés visuels</h4><div class="chips">${c.motsClesVisuels.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div></section>
    <section class="detail-section"><h4>Mots-clés émotionnels</h4><div class="chips emotional">${c.motsClesEmotionnels.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div></section>
    <section class="detail-section quote"><h4>Phrase canon / phrase-résumé</h4><p>“${c.phraseCanon}”</p></section>

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
