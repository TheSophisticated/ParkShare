import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
  'https://wbtzkgpkcigqaecdjlbn.supabase.co',
  'sb_publishable_SSZqqiwFwnPispVtOBqbpg_gr01dRlX'
)

const signupForm = document.getElementById("login-form");
signupForm.addEventListener('submit', signup);

async function signup(event){
  event.preventDefault();
  const user_input =  document.getElementById('email');
  const pwd_input =  document.getElementById('password');

  const email = user_input.value;
  const pwd = pwd_input.value;

  const userDetails = {
    email: email,
    password: pwd
  };

  console.log(email);
  console.log(pwd);

  const{data, error} = await supabase.auth.signUp({
    body: userDetails,
  });

  console.log("Gello");

}

