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

const checkLogin = () => localStorage.getItem("token");

const responseStatusValidation = (response) => {
    switch(response.status) {
        case 401:
            localStorage.removeItem('token');
            loginPage();
            return false;
        default:
            return true;
    }
}

const authListener = (action) => {
    const form = document.getElementById(`${action}-form`);

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`/${action}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const responseData = await response.json();

        if(response.status == 401 || response.status == 500) {
            const error = document.getElementById('err');
            error.innerHTML = responseData["err"];
        } else {
            switch(action) {
                case "login":
                    localStorage.setItem('token', `Bearer ${responseData["jwt"]}`);
                    loadUsersPage();
                    break;
                case "register":
                    loginPage();
                    break;
            }
        }
    }
}

const getUsers = async () => {
    try {
        const response = await fetch('/users', {
            headers: {
                Authorization: `${localStorage.getItem('token')}`,
            }
        });
        
        if(!responseStatusValidation(response)) {
            return;
        }

        const users = await response.json();
        const template = user => 
        `
            <li>
                ${user.name} ${user.lastName} <button data-id="${user._id}">Remove</button>
            </li>
        `

        const userList = document.getElementById('user-list');
        userList.innerHTML = users.map(user => template(user)).join('');
    } catch(err) {
        console.log(err)
    }
}

const removeUser = async () => {
    try {
        const response = await fetch('/users', {
            headers: {
                Authorization: `${localStorage.getItem('token')}`,
            }
        });
    
        if(!responseStatusValidation(response)) {
            return;
        }
    
        const users = await response.json();
        users.forEach(user => {
            const userNode = document.querySelector(`[data-id="${user._id}"]`)
            userNode.onclick = async (e) => {
                if (!confirm("Are you sure?")) return;
                
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
    } catch(err) {
        console.log(err)
    }
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
            console.log(`User ${data["name"]} ${data["lastName"]} created`);
        }
        
        userForm.reset();
        reload();
    }
}

const goToForm = (action) => {
    const goto = document.getElementById(action);

    goto.onclick = (e) => {
        e.preventDefault();
        switch(action) {
            case 'register':
                registerPage();
                break;
            default:
                loginPage();
                break;
        }
    }
}

const reload = () => {
    getUsers();
    removeUser();
}

const loadUsersPage = () => {
    showUsersTemplate();
    addFormListener();
    reload();
}

const registerPage = () => {
    loadRegisterTemplate();
    authListener('register');
    goToForm('login');
}

const loginPage = () => {
    loadLoginTemplate();
    authListener('login');
    goToForm('register');
}

window.onload = () => {
    const isLoggedIn = checkLogin();

    if (isLoggedIn) {
        loadUsersPage();
    } else {
        loginPage();
    }
}
