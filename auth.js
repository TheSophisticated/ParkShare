import { createClient } from 'https://esm.sh/@supabase/supabase-js'

let currentUser = null;

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

supabase.auth.onAuthStateChange((event, session) => {
  const login_link = document.getElementById('login-link');
  const logout_btn = document.getElementById('logout-btn');
  
  if(session){
    currentUser = session.user;
    if(login_link) {
        login_link.innerText = currentUser.user_metadata.display_name || "Profile";
        login_link.href = "userdashboard.html"; 
    }
    if(logout_btn) logout_btn.style.display = "inline-block";
    
  } else {
    currentUser = null;
    if(login_link) {
        login_link.innerText = "Login/Sign-Up";
        login_link.href = "login.html";
    }
    if(logout_btn) logout_btn.style.display = "none";
  }
});

async function signup(event){
  event.preventDefault();

  const email_input = document.getElementById('email').value;
  const username_input = document.getElementById('username').value;
  const pwd_input = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp({
    email: email_input,
    password: pwd_input,
    options: { 
      data : { display_name: username_input } 
    }
  });

  if(error){
    alert(error.message);
  }
  else {
    // 🔥 ADD THIS LINE (SAFE)
    localStorage.setItem("username", username_input);

    alert("Account Made! Redirecting...");
    window.location.href = "index.html";
  }
}

async function signIn(event) {
  event.preventDefault();

  const email_input = document.getElementById('signIn-email').value;
  const pwd_input = document.getElementById('signIn-password').value;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email_input,
    password: pwd_input,
  });

  if(error){
    alert(error.message);
  }
  else {
    // 🔥 GET NAME FROM SUPABASE
    const name = data.user.user_metadata?.display_name;

    if(name){
      localStorage.setItem("username", name);
    } else {
      localStorage.setItem("username", email_input.split("@")[0]);
    }

    window.location.href = "index.html"; 
  }
}

async function signout(){
  const { error } = await supabase.auth.signOut();
  if(error) alert(error.message);
  else {
    window.location.reload(); 
  }
}

document.getElementById("sign-up")?.addEventListener('submit', signup);
document.getElementById("sign-in")?.addEventListener('submit', signIn);
document.getElementById("logout-btn")?.addEventListener('click', signout);