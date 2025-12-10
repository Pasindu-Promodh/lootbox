import { supabase } from "../supabase";

const LoginButton = () => {
  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) console.error(error.message);

};

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default LoginButton;
