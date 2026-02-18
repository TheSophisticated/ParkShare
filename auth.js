import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)
  
//Fetches the Sign-Up form from the DOM
const signupForm = document.getElementById("sign-up");
signupForm.addEventListener('submit', signup);

const signInForm = document.getElementById("sign-in");
signInForm.addEventListener('submit', signIn);

const signoutBtn = document.getElementById("signout-btn");
signoutBtn.addEventListener('click', signout);

//Get Email and Password from Input fields and make User
async function signup(event){
  event.preventDefault();
  const email_input =  document.getElementById('email').value;
  const username_input = document.getElementById('username').value;
  const pwd_input =  document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp({
    email: email_input,
    password: pwd_input,
    options: {
      data : {
        display_name: username_input,
      }
    }
  })

  if(error){
    console.log("Something Went Wrong!", error.message);
  }
  else{
    alert("Account Made Successfully!");
  }
}

async function signIn(event) {
  
  event.preventDefault();
  const email_input =  document.getElementById('signIn-email').value;
  const pwd_input =  document.getElementById('signIn-password').value;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email_input,
    password: pwd_input,
  })

  if(error){
    console.log("Something Went Wrong!", error.message);
  }
  else{
    alert("Signed In Successfully!");
  }

}

async function signout(event){
  const { error } = await supabase.auth.signOut();
  if(error){
    console.log("Something Went Wrong!", error.message);
  }
  else{
    alert("Signed Out Successfully!");
  }
}