const showUsersTemplate = () => {
    const template = 
    `
    <h1>Users</h1>
    <form id="user-form">
        <div>
            <label>Name: </label>
            <input name="name"/>
        </div>
        <div>
            <label>LastName: </label>
            <input name="lastName"/>
        </div>
        <button type="submit">Search</button>
    </form>
    <ul id="user-list"></ul>
    `

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const loadRegisterTemplate = () => {
    const template = 
    `
    <h1>Register</h1>
    <form id="register-form">
        <div>
            <label>User Name: </label>
            <input name="username"/>
        </div>
        <div>
            <label>Password: </label>
            <input name="password" type="password"/>
        </div>
        <button type="submit">Register</button>
    </form>
    <a href="#" id="login">Log In</a>
    <div id="err"></div>
    `

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const loadLoginTemplate = () => {
    const template = 
    `
    <h1>Login</h1>
    <form id="login-form">
        <div>
            <label>User Name: </label>
            <input name="username"/>
        </div>
        <div>
            <label>Password: </label>
            <input name="password" type="password"/>
        </div>
        <button type="submit">Log in</button>
    </form>
    <a href="#" id="register">Sign up</a>
    <div id="err"></div>
    `

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getUsers = async () => {
    const response = await fetch('/users', {
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
        }
    });
    const users = await response.json();
    const template = user => `
        <li>
            ${user.name} ${user.lastName} <button data-id="${user._id}">Remove</button>
        </li>
    `

    const userList = document.getElementById('user-list');
    userList.innerHTML = users.map(user => template(user)).join('');
}

const removeUser = async () => {
    const response = await fetch('/users', {
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
        }
    });
    const users = await response.json();

    users.forEach(user => {
        const userNode = document.querySelector(`[data-id="${user._id}"]`)
        userNode.onclick = async (e) => {
            const response = await fetch(`/users/${user._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                }
            })
            
            if (response.status == 204) {
                userNode.parentNode.remove();
                alert('Element deleted successfully');
            }
        }
    })
}

const addFormListener = () => {
    const userForm = document.getElementById('user-form')
    userForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        const data = Object.fromEntries(formData.entries());
        
        const response = await fetch('/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            }
        })

        if (response.status == 201) {
            console.log(`User ${data} created`);
        }
        
        userForm.reset();
        resetStatus();
    }
}

const addLoginListener = () => {
    const loginForm = document.getElementById('login-form');

    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const responseData = await response.json();

        if(response.status == 401 || response.status == 500) {
            const error = document.getElementById('err');
            error.innerHTML = responseData;
        } else {
            console.log(responseData["jwt"]);
            localStorage.setItem('token', `Bearer ${responseData["jwt"]}`);
            loadMenu();
        }
    }
}

const goToRegisterListener = () => {
    const goToRegister = document.getElementById('register');

    goToRegister.onclick = (e) => {
        e.preventDefault();
        registerPage();
    }
}

const resetStatus = () => {
    getUsers();
    removeUser();
}

const loadMenu = () => {
    showUsersTemplate();
    addFormListener();
    resetStatus();
}

const addRegisterListener = ()  => {
    const registerForm = document.getElementById('register-form');

    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const responseData = await response.text();

        if(response.status == 401 || response.status == 500) {
            const error = document.getElementById('err');
            error.innerHTML = responseData;
        } else {
            loginPage();
        }
    }
}

const goToLoginListener = ()  => {
    const goToLogin = document.getElementById('login');

    goToLogin.onclick = (e) => {
        e.preventDefault();
        loginPage();
    }
}

const registerPage = () => {
    loadRegisterTemplate();
    addRegisterListener();
    goToLoginListener();
}

const loginPage = () => {
    loadLoginTemplate();
    addLoginListener();
    goToRegisterListener();
}

const checkLogin = () => localStorage.getItem("token");

window.onload = () => {
    const isLoggedIn = checkLogin();

    if (isLoggedIn) {
        loadMenu();
    } else {
        loginPage();
    }
}
