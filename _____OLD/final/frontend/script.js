let eye=document.getElementById("eye");
        let password=document.getElementById("password");
        eye.onclick= function(){
            if(password.type=="password"){
                password.type="text";
                eye.src="/images/eyeopen.png";
            }else{
                password.type="password";
                eye.src="/images/eyeclose.png";
            }
        }


document.getElementById('signin-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:5000/api/signup/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.status === 200) {
            localStorage.setItem('userDetails',JSON.stringify({userId:data.userId,email:email}));
            console.log('User ID Stored',data.userId);
            //localStorage.setItem('email',email);
            // Redirect to homepage or other action
            window.location.href = 'homepage.html'; // Redirect to homepage
        } else {
            document.getElementById('error-message').textContent = data.msg;
        }
    } catch (error) {
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
    }
});
