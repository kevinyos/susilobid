const users = [];

// Join user to room
const userJoin = (id, username, room) => {
  
  const user = {id, username, room };

  users.push(user);

  // Dunno why everytime reload page, theres a null username, so this is the protection
  const noUsername = users.findIndex(user => !user.username);
  if (noUsername !== -1) users.splice(noUsername, 1)[0];
  
  return user;
};

// User leave room
const userLeave = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

// Get room users
const getRoomUsers = room => users.filter(user => user.room === room);

module.exports = {
  userJoin,
  userLeave,
  getRoomUsers
};