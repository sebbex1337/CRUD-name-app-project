"use strict";

window.addEventListener("load", initApp);

const ENDPOINT = "https://crud-app-group-project-default-rtdb.europe-west1.firebasedatabase.app/";

async function initApp() {
	const users = await getUsers(`${ENDPOINT}/users.json`);
	for (const user of users) {
		displayUser(user);
	}
	/* createUser("https://images.unsplash.com/photo-1642049888276-9c9f0a1a8758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTA4MTB8MHwxfGFsbHwyfHx8fHx8Mnx8MTY0MjA3NTAwMQ&ixlib=rb-1.2.1&q=80&w=400", "Test", 99); */
}

async function getUsers(url) {
	const response = await fetch(url);
	const data = await response.json();
	const users = prepareUsersData(data);
	return users;
}

function prepareUsersData(dataObject) {
	const newData = [];
	for (const key in dataObject) {
		const user = dataObject[key];
		user.id = key;
		newData.push(user);
	}
	return newData;
}

async function createUser(image, name, age) {
	const newUser = { image, name, age };
	const userAsJson = JSON.stringify(newUser);
	const response = await fetch(`${ENDPOINT}/users.json`, {
		method: "POST",
		body: userAsJson,
	});
	const data = await response.json();
	console.log(data);
}

async function updateUser(id, image, name, age) {
	const userToUpdate = { image, name, age };
	const userAsJson = JSON.stringify(userToUpdate);
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, {
		method: "PUT",
		body: userAsJson,
	});
	const data = response.json();
	console.log(data);
}

function displayUser(user) {
	document.querySelector("#users").insertAdjacentHTML(
		"beforeend",
		/*html*/ `
		<article class="grid-item">
			<img src="${user.image}">
			<h2>${user.name}</h2>
			<p>Age: ${user.age}</p>
		</article>
	`
	);
}
