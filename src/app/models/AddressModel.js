const getAllAddress = "SELECT * FROM address";
const getAddressById = "SELECT * FROM address WHERE id = $1";
const addAddress =
  'INSERT INTO address (user_id, "firstName", "lastName", "numberPhone", province, district, ward, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
const updateAddress =
  'UPDATE address SET "firstName" = $1, "lastName" = $2, "numberPhone" = $3, province = $4, district = $5, ward = $6, address = $7 WHERE id = $8 AND user_id = $9 RETURNING *';
const deleteAddress = "DELETE FROM address WHERE id = $1 AND user_id = $2";

module.exports = {
  getAllAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
};
