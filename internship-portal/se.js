document.addEventListener("DOMContentLoaded", function(){

let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");
let title = document.getElementById("formTitle");

window.showRegister = function(){
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  title.innerText = "Register";
};

window.showLogin = function(){
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  title.innerText = "Login";
};

// REGISTER
registerForm.addEventListener("submit", async function(e){
e.preventDefault();

let data = {
  usn: regUSN.value,
  email: regEmail.value,
  role: regRole.value,
  password: regPassword.value
};

let res = await fetch("http://localhost:8000/register", {
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body: JSON.stringify(data)
});

alert(await res.text());
showLogin();
});

// LOGIN
loginForm.addEventListener("submit", async function(e){
e.preventDefault();

let usn = loginUSN.value;
let password = loginPassword.value;
let role = loginRole.value;

let res = await fetch("http://localhost:8000/login", {
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body: JSON.stringify({ usn, password, role })
});

let data = await res.json();

if(data.message === "Login success"){

  localStorage.setItem("currentUser", JSON.stringify({ usn, role }));

  if(role==="student") location.href="student.html";
  if(role==="mentor") location.href="mentor.html";
  if(role==="hod") location.href="hod.html";
  if(role==="coordinator") location.href="coordinator.html";

}else{
  alert("Login Failed");
}

});

});