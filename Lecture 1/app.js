const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

logger("App Started");

const num1 = 10;
const num2 = 7;

if (isEven(num1)) {
  logger(num1 + " is Even");
} else {
  logger(num1 + " is Odd");
}

if (isEven(num2)) {
  logger(num2 + " is Even");
} else {
  logger(num2 + " is Odd");
}