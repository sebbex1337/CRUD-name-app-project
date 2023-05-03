"use strict";

window.addEventListener("load", initApp);

const ENDPOINT = "https://crud-app-group-project-default-rtdb.europe-west1.firebasedatabase.app/";
let users;

function initApp() {
	updateUsersGrid();

	document.querySelector("#createUser").addEventListener("click", showCreateUserDialog);
	document.querySelector("#form-delete-user").addEventListener("submit", deleteUserClicked);
	document.querySelector("#form-update-user").addEventListener("submit", updateUserClicked);
	document.querySelector("#sort-by").addEventListener("change", sortByChanged);
	document.querySelector("#filter-by").addEventListener("change", filterByChanged);
}

/* Event functions */

function showCreateUserDialog() {
	document.querySelector("#dialog-create-user").showModal();
	document.querySelector("#form-create-new-user").addEventListener("submit", createUserClicked);
}

function createUserClicked(event) {
	event.preventDefault();
	const form = this;
	const name = form.name.value;
	const image = form.image.value;
	const age = form.age.value;
	const gender = form.gender_select.value;
	const role = form.role_select.value;
	const mail = form.mail.value;
	const team = form.team_select.value;
	const city = form.city.value;
	const meal = form.meal.value;
	const fun_fact = form.fun_fact.value;
	const operatingSystem = form.operatingSystem.value;
	const pineapple = form.pineapple.value;
	createUser(image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple);
	form.reset();
	document.querySelector("#dialog-create-user").close();
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
	if (response.ok) {
		updateUsersGrid();
	}
}

async function updateUser(id, image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple) {
	const userToUpdate = { image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple };
	const userAsJson = JSON.stringify(userToUpdate);
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, {
		method: "PUT",
		body: userAsJson,
	});
	if (response.ok) {
		updateUsersGrid();
	}
}

async function deleteUser(id) {
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, { method: "DELETE" });
	console.log(response);
	if (response.ok) {
		updateUsersGrid();
	}
}

/* UI functions */

function displayUsers(listOfUsers) {
	document.querySelector("#users").innerHTML = ""; // Reset users list in html

	for (const user of listOfUsers) {
		displayUser(user);
	}
}

function displayUser(user) {
	document.querySelector("#users").insertAdjacentHTML(
		"beforeend",
		/*html*/ `
		<article class="grid-item">
			<img src="${user.image}">
			<h2>${user.name}</h2>
			<p>Age: ${user.age}</p>
			<p>Mail: ${user.mail}</p>
			<p>Team: ${user.team}</p>
			<section class="btns">
				<button class="btn-delete">Delete</button>
				<button class="btn-update">Update</button>
			</section>
		</article>
	`
	);

	document.querySelector("#users article:last-child .btn-delete").addEventListener("click", () => deleteClicked(user));
	document.querySelector("#users article:last-child .btn-update").addEventListener("click", () => updateClicked(user));
}

function deleteClicked(user) {
	console.log("Delete button clicked");
	document.querySelector("#dialog-delete-user-title").textContent = user.name;
	document.querySelector("#form-delete-user").setAttribute("data-id", user.id);
	document.querySelector("#dialog-delete-user").showModal();
}

function updateClicked(user) {
	const updateForm = document.querySelector("#form-update-user");
	updateForm.name.value = user.name;
	updateForm.image.value = user.image;
	updateForm.age.value = user.age;
	updateForm.gender_update.value = user.gender;
	updateForm.role_update.value = user.role;
	updateForm.mail.value = user.mail;
	updateForm.team_update.value = user.team;
	updateForm.city.value = user.city;
	updateForm.meal.value = user.meal;
	updateForm.fact.value = user.fact;
	updateForm.operatingSystem.value = user.operatingSystem;
	updateForm.pineapple.value = user.pineapple;

	updateForm.setAttribute("data-id", user.id);
    document.querySelector("#dialog-update-user").showModal();
}
function updateUserClicked(event) {
	event.preventDefault();
	const form = event.target;
	const name = form.name.value
	const image = form.image.value
	const age  = form.age.value
	const gender = form.gender_update.value
	const role = form.role_update.value
	const mail = form.mail.value
	const city = form.city.value
	const team = form.team_update.value
	const meal = form.meal.value
	const fun_fact = form.fact.value
	const operatingSystem = form.operatingSystem.value
	const pineapple = form.pineapple.value

	const id = form.getAttribute("data-id")
	updateUser(id, image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple);
	document.querySelector("#dialog-update-user").close();
	
}

function deleteUserClicked(event) {
	const id = event.target.getAttribute("data-id");
	deleteUser(id);
}

//sortering//

function sortUsers(sortBy) {
	if (sortBy === "name") {
		return users.sort((userA, userB) => userA.name > userB.name);
	}
	if (sortBy === "age") {
		return users.sort((userA, userB) => userA.age > userB.age);
	}
	if (sortBy === "role") {
		return users.sort((userA, userB) => userA.role > userB.role);
	}
	if (sortBy === "team") {
		return users.sort((userA, userB) => userA.team > userB.team);
	}
}

function sortByChanged(event) {
	const selectedValue = event.target.value;
	console.log(selectedValue);
	displayUsers(sortUsers(selectedValue));
}

function filterUsers(filterBy) {
	return users.filter((user) => user.team === filterBy);
}

function filterByChanged(event) {
	const selectedValue = event.target.value;
	displayUsers(filterUsers(selectedValue));
}
