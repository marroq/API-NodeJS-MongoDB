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

    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const addFormListener = () => {
    const userForm = document.getElementById('user-form')
    userForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(userForm)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
    }
}

window.onload = () => {
    loadTemplate()
    addFormListener()
}