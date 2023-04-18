"use strict";

window.addEventListener("load", initApp);

const ENDPOINT = "https://crud-app-group-project-default-rtdb.europe-west1.firebasedatabase.app/";

async function initApp() {
	console.log("Running");
	const users = await getUsers(`${ENDPOINT}/users.json`);
	console.log(users);
	/* createUser("", "Sebastian Juel Sefort", 24); */
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
