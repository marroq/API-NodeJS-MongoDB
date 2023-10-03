const loadTemplate = () => {
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
        <button type="submit">Enter</button>
    </form>
    <ul id="user-list"></ul>
    `

    const body = document.getElementsByTagName('body')[0];
    body.innerHTML = template;
}

const getUsers = async () => {
    const response = await fetch('/users');
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
    const response = await fetch('/users');
    const users = await response.json();

    users.forEach(user => {
        const userNode = document.querySelector(`[data-id="${user._id}"]`)
        userNode.onclick = async (e) => {
            const response = await fetch(`/users/${user._id}`, {
                method: 'DELETE',
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
                'Content-Type': 'application/json'
            }
        })

        if (response.status == 201) {
            console.log(`User ${data} created`);
        }
        
        userForm.reset();
        resetStatus();
    }
}

const resetStatus = () => {
    getUsers();
    removeUser();
}

window.onload = () => {
    loadTemplate();
    addFormListener();
    resetStatus();
}