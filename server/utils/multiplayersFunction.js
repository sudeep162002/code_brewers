export const assignProfile = function assignProfile(
  ProfileArray,
  PlayersArray
) {
  const object = {};
  for (const value of ProfileArray) {
    object[value] = "";
  }
  for (const value of PlayersArray) {
    const addedPlayers = Object.values(object);
    if (!addedPlayers.includes(value)) {
      for (const val in object) {
        if (!object[val]) {
          object[val] = value;
          break;
        }
      }
    }
  }
  return object;
};

export const playerProfileArray = [
  "https://i.pinimg.com/750x/9f/21/d1/9f21d13162049d55bece312d055c494c.jpg",
  "https://i.pinimg.com/564x/a7/09/6a/a7096ae80193a2f629b897ae41fca047.jpg",
  "https://i.pinimg.com/564x/d3/cf/2c/d3cf2c4018f082954aa1242489866895.jpg",
  "https://i.pinimg.com/564x/22/d5/b7/22d5b72cd6405a5ae2edc4feacdd08cd.jpg",
  "https://i.pinimg.com/736x/26/e4/5a/26e45ac8d7e40ed25811f4d0cd130765.jpg",
];
// export const assignProfile = function assignProfile(prevObject, ProfileArray) {
//   const object = { ...prevObject };
//   for (const value of PlayersArray) {
//     const asingnedProfile = Object.values(object);
//     for (const image of ProfileArray) {
//       if (!asingnedProfile.includes(image)) {
//         object[value] = image;
//       }
//     }
//     return object;
//   }
// };
