const playersArray = ["player1"];

const ArrayOfProfile = [
  "PROFILE1",
  "PROFILE2",
  "PROFILE3",
  "PROFILE4",
  "PROFILE5",
  "PROFILE6",
];

let playerCount = 1;

const object = {};
for (const value of ArrayOfProfile) {
  object[value] = "";
}

// for (const val in object) {
//   if (!object[val]) {
//     console.log("condition satisfiedS");
//     break;
//   }
// }

function checkifexist(player) {
  const addedUsers = Object.keys(object);
  for (const val of addedUsers) {
    if (val == player) {
      return true;
    }
  }
}

setInterval(() => {
  let word = "player" + (playerCount += 1);
  playersArray.push(word);

  for (const value of playersArray) {
    const addedPlayers = Object.values(object);
    console.log("addedPlayers", addedPlayers);
    if (!addedPlayers.includes(value)) {
      for (const val in object) {
        if (!object[val]) {
          object[val] = value;
          break;
        }
      }
    }
  }
  console.log(object);
  console.log(playersArray);
}, 2000);
