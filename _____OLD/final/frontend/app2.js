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
document.getElementById('form1').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password1 = document.getElementById('password1').value;
    const password = document.getElementById('password').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;


    if (password1 !== password) {
        alert('Passwords do not match. Please try again.');
        return;
    }


    if (!gender) {
        document.getElementById('message').innerText = 'Please select a gender.';
        return;
    }

    try {
        
        const response = await fetch('http://localhost:5001/api/signup/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, gender }),
        });
            
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            window.location.href = 'homepage.html';
        }

        const data = await response.json();
        document.getElementById('message').innerText = data.message;

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('message').innerText = 'Email already exists';
    }
});

