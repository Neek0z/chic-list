import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
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

export default Login;

