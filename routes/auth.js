/*
  Users Routes / Auth
  host + /api/auth
*/
//Dependencies
const { Router } = require("express");
const { check } = require("express-validator");

//Require Middlewares
const { validateFields } = require("../middlewares/fieldValidators");
const { validateJWT } = require("../middlewares/validateJWT");

//Require Controllers
const {
	createUser,
	loginUser,
	revalidateToken,
} = require("../controllers/auth");

//Router
const router = Router();

/* Auth Enpoints */

//Create User
router.post(
	"/new",
	[
		//Middlewares
		check("name", "The name is required").not().isEmpty(),
		check("email", "The email is not valid").isEmail(),
		check("password", "The password must be 6 characters at least").isLength({
			min: 6,
		}),
		validateFields,
	],
	createUser
);

//Login User
router.post(
	"/",
	[
		//Middlewares
		check("email", "The email is not valid").isEmail(),
		check("password", "The password must be 6 characters at least").isLength({
			min: 6,
		}),
		validateFields,
	],
	loginUser
);

//Renew JWT
router.get(
	"/renew",
	[
		//Middlewares
		validateJWT,
	],
	revalidateToken
);

module.exports = router;
