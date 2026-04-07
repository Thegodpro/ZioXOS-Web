window.addEventListener("DOMContentLoaded", () => {

    const avatar = document.getElementById("avatar");
    const menu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");

    // ABRIR MENÚ
    if(avatar && menu && overlay){
        avatar.addEventListener("click", () => {
            menu.classList.add("show");
            overlay.classList.add("show");
            document.body.classList.add("menu-open");
        });

        // CERRAR MENÚ AL TOCAR EL FONDO
        overlay.addEventListener("click", closeMenu);
    }

    function closeMenu(){
        if(menu) menu.classList.remove("show");
        if(overlay) overlay.classList.remove("show");
        document.body.classList.remove("menu-open");
        
        window.scrollTo(0, scrollY);
        document.body.style.top = "";
    }

    // CARGAR TEMA Y DATOS
    loadTheme();
    
    if(typeof loadUserMenuData === "function"){
        loadUserMenuData();
    }
});

function goProfile(){
    location.href = "Cuenta.html";
}

async function logout(){
    await supabaseClient.auth.signOut();
    location.reload();
}

// CORRECCIÓN: Ahora guarda y lee correctamente "dark-mode"
function toggleTheme(){
    document.body.classList.toggle("dark-mode");
    
    let isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    applyLogo();
}

function loadTheme(){
    let theme = localStorage.getItem("theme");

    if(theme === "dark"){
        document.body.classList.add("dark-mode");
    }

    applyLogo();
}

function applyLogo(){
    let logo = document.querySelector(".logo img");
    if(!logo) return;

    if(document.body.classList.contains("dark-mode")){
        logo.src = "zioxos_logo_dark.png";
    } else {
        logo.src = "zioxos_logo.png";
    }
}

async function loadUserMenuData() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return; // Si no hay sesión, no hace nada

    const menuAvatar = document.getElementById("menuAvatar");
    const menuUsername = document.getElementById("menuUsername");

    // SOLUCIÓN: Usamos .limit(1) para ignorar los perfiles duplicados de las pruebas anteriores
    const { data: profiles, error } = await supabaseClient
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .limit(1);

    if (error) {
        console.error("Error al cargar nombre en el menú:", error.message);
    }

    if (menuUsername) {
        // Tomamos el primer perfil de la lista. Si existe y tiene nombre, lo usamos.
        const username = (profiles && profiles.length > 0 && profiles[0].username) ? profiles[0].username : "Usuario ZioX";
        menuUsername.textContent = username;
    }

    if (menuAvatar) {
        menuAvatar.src = `https://xcfpfdlkiistpugwflrz.supabase.co/storage/v1/object/public/avatars/${user.id}/avatar.png?${Date.now()}`;
        menuAvatar.onerror = () => menuAvatar.src = "avatar_default.png";
    }
}