import { getUsers, deleteUser, updateUser, createUser } from "./http.js";

window.addEventListener("load", initApp);
let users;

function initApp() {
	updateUsersGrid();

	document.querySelector("#createUser").addEventListener("click", showCreateUserDialog);
	document.querySelector("#form-delete-user").addEventListener("submit", deleteUserClicked);
	document.querySelector("#form-update-user").addEventListener("submit", updateUserClicked);
	document.querySelector("#sort-by").addEventListener("change", sortByChanged);
	document.querySelector("#filter-by").addEventListener("change", filterByChanged);
	document.querySelector("#input-search").addEventListener("keyup", inputSearchChanged);
	document.querySelector("#input-search").addEventListener("search", inputSearchChanged);
}

/* Event functions */

function inputSearchChanged(event) {
	const value = event.target.value;
	const userToSearch = searchUser(value);
	displayUsers(userToSearch);
}

function showCreateUserDialog() {
	document.querySelector("#dialog-create-user").showModal();
	document.querySelector("#form-create-new-user").addEventListener("submit", createUserClicked);
}

async function createUserClicked(event) {
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
	const response = await createUser(image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple);
	if (response.ok) {
		console.log("User added to Firebase!");
		form.reset();
		document.querySelector("#dialog-create-user").close();
		updateUsersGrid();
	}
}

async function updateUserClicked(event) {
	event.preventDefault();
	const form = event.target;
	const name = form.name.value;
	const image = form.image.value;
	const age = form.age.value;
	const gender = form.gender_update.value;
	const role = form.role_update.value;
	const mail = form.mail.value;
	const city = form.city.value;
	const team = form.team_update.value;
	const meal = form.meal.value;
	const fun_fact = form.fact.value;
	const operatingSystem = form.operatingSystem.value;
	const pineapple = form.pineapple.value;
	const id = form.getAttribute("data-id");
	const response = await updateUser(id, image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple);
	if (response.ok) {
		console.log("User updated to Firebase");
		updateUsersGrid();
		document.querySelector("#dialog-update-user").close();
	}
}

async function deleteUserClicked(event) {
	const id = event.target.getAttribute("data-id");
	const response = await deleteUser(id);
	if (response.ok) {
		console.log("User deleted from Firebase");
		updateUsersGrid();
	}
}

function detailViewClicked(user) {
	document.querySelector("#detail-view-image").src = user.image;
	document.querySelector("#detail-view-name").textContent = user.name;
	document.querySelector("#detail-view-city").textContent = user.city;
	document.querySelector("#detail-view-team").textContent = user.team;
	document.querySelector("#detail-view-operatingSystem").textContent = user.operatingSystem;
	document.querySelector("#detail-view-funFact").textContent = user.fun_fact;
	document.querySelector("#detail-view-favoriteMeal").textContent = user.meal;
	document.querySelector("#detail-view-pineapple").textContent = user.pineapple;
	document.querySelector("#detail-view-gender").textContent = user.gender;
	document.querySelector("#detail-view-mail").textContent = user.mail;
	document.querySelector("#detail-view-age").textContent = user.age;
	document.querySelector("#detail-view-role").textContent = user.role;
	document.querySelector("#dialog-detail-view").showModal();
}

/* Get users functions */

async function updateUsersGrid() {
	users = await getUsers();
	displayUsers(users);
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
			<section class="transparent-user">
				<h2>${user.name}</h2>
				<p>Age: ${user.age}</p>
				<p>Mail: ${user.mail}</p>
				<p>Team: ${user.team}</p>
			</section>
			<section class="btns">
				<button class="btn-delete">Delete</button>
				<button class="btn-update">Update</button>
			</section>
		</article>
	`
	);

	document.querySelector("#users article:last-child .btn-delete").addEventListener("click", () => deleteClicked(user));
	document.querySelector("#users article:last-child .btn-update").addEventListener("click", () => updateClicked(user));
	document.querySelector("#users article:last-child img").addEventListener("click", () => detailViewClicked(user));
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
	updateForm.fact.value = user.fun_fact;
	updateForm.operatingSystem.value = user.operatingSystem;
	updateForm.pineapple.value = user.pineapple;

	updateForm.setAttribute("data-id", user.id);
	document.querySelector("#dialog-update-user").showModal();
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
	if (filterBy === "") {
		return users;
	} else {
		return users.filter((user) => user.team === filterBy);
	}
}

function filterByChanged(event) {
	const selectedValue = event.target.value;
	displayUsers(filterUsers(selectedValue));
}

function searchUser(searchValue) {
	searchValue = searchValue.toLowerCase();
	return users.filter((user) => user.name.toLowerCase().includes(searchValue));
}
