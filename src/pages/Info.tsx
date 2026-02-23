const Info = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Infos</h1>
          <a
            href="/"
            className="text-sm text-primary hover:underline"
          >
            Retour à la liste
          </a>
        </header>

        <div className="space-y-4 text-sm text-muted-foreground">
          <section className="rounded-2xl bg-card border border-border p-4 space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Ajouter des articles</h2>
            <p>
              Appuie sur le bouton <span className="font-semibold">“Ajouter un article”</span>, saisis le nom,
              la quantité et le rayon, puis valide avec le bouton <span className="font-semibold">“Ajouter”</span>.
            </p>
          </section>

          <section className="rounded-2xl bg-card border border-border p-4 space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Cocher et nettoyer la liste</h2>
            <p>
              Appuie sur un article pour le cocher/décocher. Les articles cochés apparaissent dans la section
              <span className="font-semibold"> “Terminés”</span>. Tu peux ensuite les supprimer avec le bouton
              prévu pour nettoyer la liste.
            </p>
          </section>

          <section className="rounded-2xl bg-card border border-border p-4 space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. Listes partagées</h2>
            <p>
              En haut de l’écran, utilise le sélecteur de liste pour créer plusieurs listes (par exemple “Courses
              maison”, “Soirée”, etc.).
            </p>
            <p>
              Chaque liste a un <span className="font-mono font-bold">code de partage</span>. Envoie ce code à une
              autre personne&nbsp;: elle peut le saisir via le bouton <span className="font-semibold">“Rejoindre”</span> pour
              voir et modifier la même liste en temps réel.
            </p>
          </section>

          <section className="rounded-2xl bg-card border border-border p-4 space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Mode clair / sombre</h2>
            <p>
              Le bouton avec l’icône de lune/soleil en haut à droite permet de basculer entre le
              <span className="font-semibold"> mode clair</span> et le <span className="font-semibold">mode sombre</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Info;

