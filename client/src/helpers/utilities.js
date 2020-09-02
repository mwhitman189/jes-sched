// Check whether a cancellation took place on the same day of the class
const checkForSameDate = (eventStart) => {
  if (eventStart) {
    const todaysDate = new Date();
    return eventStart.getDate() === todaysDate.getDate();
  }
  return console.log('Event does not exist');
};

const protectAction = (user, action) => {
  if (user.user.role === 'staff') {
    return action;
  }
  return console.log("Not gonna do it. Wouldn't be prudent.");
};

const calcMinsToHours = (mins) => Math.round((mins / 60 + Number.EPSILON) * 100) / 100;

export { checkForSameDate, protectAction, calcMinsToHours };
