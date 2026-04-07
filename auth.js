supabaseClient.auth.getSession().then(({ data }) => {

let session = data.session;

let avatar = document.getElementById("avatar");
let loginBtn = document.getElementById("linkCuenta");

if(session){

loginBtn.style.display="none";

avatar.style.display="block";

avatar.src=`https://xcfpfdlkiistpugwflrz.supabase.co/storage/v1/object/public/avatars/${session.user.id}/avatar.png?${Date.now()}`;

}

});

