const ENDPOINT = "https://crud-app-group-project-default-rtdb.europe-west1.firebasedatabase.app/";

async function createUser(image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple) {
	const newUser = { image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple };
	const userAsJson = JSON.stringify(newUser);
	const response = await fetch(`${ENDPOINT}/users.json`, {
		method: "POST",
		body: userAsJson,
	});
	return response;
};

async function updateUser(id, image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple) {
	const userToUpdate = { image, name, age, gender, role, mail, team, city, meal, fun_fact, operatingSystem, pineapple };
	const userAsJson = JSON.stringify(userToUpdate);
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, {
		method: "PUT",
		body: userAsJson,
	});
	return response;
}

async function deleteUser(id) {
	const response = await fetch(`${ENDPOINT}/users/${id}.json`, { method: "DELETE" });
    return response;
}

async function getUsers() {
	const response = await fetch(`${ENDPOINT}/users.json`);
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
export{getUsers,deleteUser,updateUser,createUser}