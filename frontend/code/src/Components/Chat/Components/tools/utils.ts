export const formatTime = (backendDate: string) => {
  const currentDate = new Date();
  const date = new Date(backendDate);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? " PM" : " AM";
  const formattedHours = (hours % 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  if (date.toDateString() === currentDate.toDateString()) {
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  } else {
    return `${day} ${month} ${formattedHours}:${formattedMinutes}${ampm}`;
  }
};
