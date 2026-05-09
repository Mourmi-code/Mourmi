const characters = window.CHARACTERS || [];

const categories = ["tous", "héros", "enfants", "alliés", "antagonistes", "habitants de Clairval"];
let selectedCategory = "tous";
let selectedId = characters[0]?.id || null;

const listEl = document.getElementById("characterList");
const detailEl = document.getElementById("characterDetail");
const searchEl = document.getElementById("searchInput");
const filtersEl = document.getElementById("filters");


function getInitials(name) {
  return name
    .split(/\s+|\//)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function categoryClass(character) {
  if (character.categories.includes("antagonistes")) return "cat-antagonistes";
  if (character.categories.includes("enfants")) return "cat-enfants";
  if (character.categories.includes("héros")) return "cat-heros";
  if (character.categories.includes("alliés")) return "cat-allies";
  return "cat-clairval";
}

function categoryLabel(cat) {
  return cat === "tous" ? `Tous · ${characters.length}` : `${cat} · ${characters.filter((c) => c.categories.includes(cat)).length}`;
}

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
    b.textContent = categoryLabel(cat);
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
    b.className = `character-card ${categoryClass(c)}${c.id === selectedId ? " selected" : ""}`;
    b.innerHTML = `
      <span class="portrait-mini" aria-hidden="true">${getInitials(c.nom)}</span>
      <span class="character-card-copy">
        <strong>${c.nom}</strong>
        <small>${c.identite.rolePrincipal}</small>
        <span class="card-categories">${c.categories.map((cat) => `<em>${cat}</em>`).join("")}</span>
      </span>
    `;
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
    <header class="detail-hero ${categoryClass(c)}">
      <div class="portrait-large" aria-hidden="true">
        <span>${getInitials(c.nom)}</span>
      </div>
      <div class="detail-title">
        <p class="eyebrow">Fiche canon</p>
        <h3>${c.nom}</h3>
        <p>${c.identite.rolePrincipal}</p>
        <div class="chips category-chips">${c.categories.map((cat) => `<span class="chip">${cat}</span>`).join("")}</div>
      </div>
    </header>

    <section class="detail-section identity-section">
      <h4><span>01</span> Identité</h4>
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

    <section class="detail-section"><h4><span>02</span> Fonction narrative</h4><p>${c.fonctionNarrative}</p></section>
    <section class="detail-section"><h4><span>03</span> Apparence canon</h4><p>${c.apparenceCanon}</p></section>
    <section class="detail-section"><h4><span>04</span> Tenue canon</h4><p>${c.tenueCanon}</p></section>
    <section class="detail-section"><h4><span>05</span> Personnalité</h4><p>${c.personnalite}</p></section>
    <section class="detail-section"><h4><span>06</span> Forces</h4>${listItems(c.forces)}</section>
    <section class="detail-section"><h4><span>07</span> Failles</h4>${listItems(c.failles)}</section>
    <section class="detail-section"><h4><span>08</span> Relations principales</h4>${listItems(c.relationsPrincipales)}<p>${c.relations}</p></section>
    <section class="detail-section"><h4><span>09</span> Voix / ton</h4><p>${c.voixTon}</p></section>
    <section class="detail-section"><h4><span>10</span> Mots-clés visuels</h4><div class="chips">${c.motsClesVisuels.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div></section>
    <section class="detail-section"><h4><span>11</span> Mots-clés émotionnels</h4><div class="chips emotional">${c.motsClesEmotionnels.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div></section>
    <section class="detail-section quote"><h4><span>12</span> Phrase canon / phrase-résumé</h4><p>“${c.phraseCanon}”</p></section>

    <section class="prompt-panel">
      <div>
        <p class="eyebrow">Prompt visuel généré</p>
        <h4>Créer une base d’illustration cohérente</h4>
      </div>
      <button id="promptBtn" class="prompt-btn">Générer le prompt visuel</button>
      <pre id="promptOutput" class="prompt-output" hidden></pre>
    </section>
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
