const checkPromotionEligibility = (product, promotion) => {
  const condition =
    typeof promotion.condition === "string"
      ? JSON.parse(promotion.condition)
      : promotion.condition;
  const { field, operator, value } = condition;

  if (product[field] === undefined || product[field] === null) return false;

  switch (operator) {
    case ">":
      return product[field] > value;
    case ">=":
      return product[field] >= value;
    case "<":
      return product[field] < value;
    case "<=":
      return product[field] <= value;
    case "==":
      return product[field] == value;
    case "!=":
      return product[field] != value;
    default:
      return false;
  }
};
module.exports = checkPromotionEligibility;
