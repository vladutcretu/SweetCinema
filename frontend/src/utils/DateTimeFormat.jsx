// Components here


export const formatDate = (datetime) =>
  new Date(datetime).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
})

export const formatTime = (datetime) =>
  new Date(datetime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
})