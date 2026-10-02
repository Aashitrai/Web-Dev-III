// Custom Logger Middleware
// Har request ka Method, URL aur Time console me print karta hai
const logger = (req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next(); // next() zaroori hai, nahi to request aage nahi jayegi
};

module.exports = logger;
