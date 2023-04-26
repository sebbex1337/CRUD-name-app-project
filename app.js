"use strict";

window.addEventListener("load", initApp);

const ENDPOINT = "https://crud-app-group-project-default-rtdb.europe-west1.firebasedatabase.app/";
let users;

function initApp() {
	updateUsersGrid();

	document.querySelector("#createUser").addEventListener("click", createUserClicked);
}

/* Event functions */

function createUserClicked() {
	document.querySelector("#dialog-create-user").showModal();
}

/* Get users functions */

async function updateUsersGrid() {
	users = await getUsers(`${ENDPOINT}/users.json`);
	displayUsers(users);
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

/* CRUD functions */

async function createUser(image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple) {
	const newUser = { image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple };
	const userAsJson = JSON.stringify(newUser);
	const response = await fetch(`${ENDPOINT}/users.json`, {
		method: "POST",
		body: userAsJson,
	});
	const data = await response.json();
	console.log("User created " + data);
}

async function updateUser(id, image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple) {
	const userToUpdate = { image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple };
	const userAsJson = JSON.stringify(userToUpdate);
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, {
		method: "PUT",
		body: userAsJson,
	});
	const data = response.json();
	console.log(data);
}

async function deleteUser(id) {
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, { method: "DELETE" });
	if (response.ok) {
		updateUsersGrid();
	}
}

/* UI functions */

function displayUsers(users) {
	for (const user of users) {
		document.querySelector("#users").insertAdjacentHTML(
			"beforeend",
			/*html*/ `
		<article class="grid-item">
			<img src="${user.image}">
			<h2>${user.name}</h2>
			<p>Age: ${user.age}</p>
			<p>Mail: ${user.mail}</p>
			<p>Team: ${user.team}</p>
		</article>
	`
		);
	}
}
