import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? getAuthErrorMessage(err.code)
          : "Une erreur est survenue. Réessaie ou vérifie que la connexion Google est activée dans la console Firebase.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-lg p-6 space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-foreground">ChickList</h1>
          <p className="text-sm text-muted-foreground">
            Connecte-toi pour accéder à tes listes de courses partagées.
          </p>
        </div>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-40 transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {loading ? "Connexion..." : "Se connecter avec Google"}
        </button>
      </div>
    </div>
  );
};

function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/popup-blocked":
      "La fenêtre de connexion a été bloquée. Autorise les popups pour ce site ou réessaie.",
    "auth/popup-closed-by-user": "Connexion annulée. Tu peux réessaier.",
    "auth/cancelled-popup-request": "Connexion annulée. Réessaie.",
    "auth/unauthorized-domain":
      "Ce domaine n’est pas autorisé. Ajoute-le dans Firebase Console > Authentication > Paramètres > Domaines autorisés.",
    "auth/operation-not-allowed":
      "La connexion Google n’est pas activée. Active « Connexion Google » dans Firebase Console > Authentication > Sign-in method.",
    "auth/network-request-failed": "Problème de connexion. Vérifie ton réseau et réessaie.",
    "auth/internal-error": "Erreur interne. Réessaie dans un instant.",
  };
  return messages[code] ?? `Erreur de connexion (${code}). Réessaie ou contacte le support.`;
}

export default Login;

