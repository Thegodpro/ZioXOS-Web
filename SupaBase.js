const supabaseClient = supabase.createClient(
  "https://xcfpfdlkiistpugwflrz.supabase.co",
  "sb_publishable_tSoaoSQ_a7EQy--0_glOhw_0IT9ztX1"
);

async function loadNavbarUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const loginBtn = document.getElementById("linkCuenta");
    const avatar = document.getElementById("avatar");

    if (!user) {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (avatar) avatar.style.display = "none";
        return;
    }

    // Usuario logueado
    if (loginBtn) loginBtn.style.display = "none";
    if (avatar) {
        avatar.style.display = "block";
        avatar.src = `https://xcfpfdlkiistpugwflrz.supabase.co/storage/v1/object/public/avatars/${user.id}/avatar.png?${Date.now()}`;
        avatar.onerror = () => avatar.src = "avatar_default.png";
    }

    // Opcional: Si quieres mostrar el nombre en el Navbar
    const navName = document.getElementById("navUsername");
    if (navName) {
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('username')
            .eq('user_id', user.id)
            .single();
        if (profile) navName.textContent = profile.username;
    }
}
window.addEventListener("DOMContentLoaded", () => {
    loadNavbarUser();
});