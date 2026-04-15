function calculateSum(a, b) {
  const firstNumber = Number(a);
  const secondNumber = Number(b);

  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    throw new TypeError("Both values must be valid numbers.");
  }

  return firstNumber + secondNumber;
}

module.exports = {
  calculateSum
};
