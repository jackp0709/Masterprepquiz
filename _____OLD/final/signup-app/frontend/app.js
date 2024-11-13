let eye=document.getElementById("eye");
        let password=document.getElementById("password");
        eye.onclick= function(){
            if(password.type=="password"){
                password.type="text";
                eye.src="images/eyeopen.png";
            }else{
                password.type="password";
                eye.src="images/eyeclose.png";
            }
        }



        document.getElementById('form1').addEventListener('submit', function(event) {
    var password1 = document.getElementById('password1').value;
    var password = document.getElementById('password').value;
    if (password1 !== password) {
        event.preventDefault();
        alert('Passwords do not match. Please try again.');
    }
});



document.getElementById('form1').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password1 = document.getElementById('password1').value;
    const password =document.getElementById('password').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    if (!gender) {
        document.getElementById('message').innerText = 'Please select a gender.';
        return;
    }


    const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password,gender}),
    });

    const data = await response.json();
    document.getElementById('message').innerText = data.message;
});
