const update = document.querySelector("#update-button");
//console.log(update);
if (update) {
  update.addEventListener("click", (_) => {
    fetch("/quotes", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Darth Vadar",
        quote: "I find your lack of faith disturbing.",
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((response) => {
        window.location.reload(true);
      });
  });
}
const deleteButton = document.querySelector("#delete-button");
const messageDiv = document.querySelector("#message");

deleteButton.addEventListener("click", (_) => {
  fetch("/quotes", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vadar",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      if (response === "No quote to delete") {
        messageDiv.textContent = "No Darth Vadar quote to delete";
      } else {
        window.location.reload(true);
      }
    })
    .catch(console.error);
});

function findRandomCharacter() {
  let randomNumber = Math.floor(Math.random() * 88 + 1);
  let request = "https://swapi.dev/api/people/" + randomNumber;
  fetch(request)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let name = document.getElementById("name");
      let gender = document.getElementById("gender");
      let vehicle = document.getElementById("vehicle");
      console.log(data);
      name.innerHTML = "Name: " + data.name;
      gender.innerHTML = "Gender: " + data.gender;
    });
  //console.log("random character");
}
const findCharacter = document.querySelector("#swapi-button");
console.log(findCharacter);
if (findCharacter === undefined) {
  console.log("No character found ! try again");
} else {
  findCharacter.addEventListener("click", findRandomCharacter);
}
