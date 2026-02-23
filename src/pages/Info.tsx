import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  }),
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Info = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        className="max-w-lg mx-auto px-4 py-6 pb-24"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.header
          className="mb-6 flex items-center justify-between"
          variants={item}
        >
          <h1 className="text-xl font-semibold">Infos</h1>
          <Link
            to="/"
            className="text-sm text-primary hover:underline"
          >
            Retour à la liste
          </Link>
        </motion.header>

        <motion.div
          className="space-y-4 text-sm text-muted-foreground"
          variants={container}
        >
          <motion.section
            className="rounded-2xl bg-card border border-border p-4 space-y-2"
            variants={item}
          >
            <h2 className="text-base font-semibold text-foreground">1. Ajouter des articles</h2>
            <p>
              Appuie sur le bouton <span className="font-semibold">“Ajouter un article”</span>, saisis le nom,
              la quantité et le rayon, puis valide avec le bouton <span className="font-semibold">“Ajouter”</span>.
            </p>
          </motion.section>

          <motion.section
            className="rounded-2xl bg-card border border-border p-4 space-y-2"
            variants={item}
          >
            <h2 className="text-base font-semibold text-foreground">2. Cocher et nettoyer la liste</h2>
            <p>
              Appuie sur un article pour le cocher/décocher. Les articles cochés apparaissent dans la section
              <span className="font-semibold"> “Terminés”</span>. Tu peux ensuite les supprimer avec le bouton
              prévu pour nettoyer la liste.
            </p>
          </motion.section>

          <motion.section
            className="rounded-2xl bg-card border border-border p-4 space-y-2"
            variants={item}
          >
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
          </motion.section>

          <motion.section
            className="rounded-2xl bg-card border border-border p-4 space-y-2"
            variants={item}
          >
            <h2 className="text-base font-semibold text-foreground">4. Mode clair / sombre</h2>
            <p>
              Le bouton avec l’icône de lune/soleil en haut à droite permet de basculer entre le
              <span className="font-semibold"> mode clair</span> et le <span className="font-semibold">mode sombre</span>.
            </p>
          </motion.section>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Info;

