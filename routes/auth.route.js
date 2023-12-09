import dbPool from "../db.js";
//const auth = require("../controllers/auth.controller");

//const router = express.Router();

export const login = async (dataObj) => {
  const q = "SELECT * FROM tb_users WHERE usr_email = ? ";
  const result = await dbPool.query(q, [dataObj.email]);
  return result[0];
};

export const refresh = async (token) => {
  const q = "SELECT * FROM tb_users WHERE usr_refresh_token = ? ";
  const result = await dbPool.query(q, [token]);
  return result[0];
};

export const logout = async (token) => {
  const q = "SELECT * FROM tb_users WHERE usr_refresh_token = ? ";
  const result = await dbPool.query(q, [token]);
  return result[0];
};

// router.post("/login", auth.login);
// router.post("/logout", auth.logout);

//module.exports = router;
