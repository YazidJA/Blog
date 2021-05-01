const getDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return {
    day: today.toLocaleString("en-US", options),
    year: today.getFullYear(),
  };
}

module.exports = getDate()