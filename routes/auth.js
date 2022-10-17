/*
  Users Routes / Auth
  host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/fieldValidators");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

const {
	createUser,
	loginUser,
	revalidateToken,
} = require("../controllers/auth");

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

router.get(
	"/renew",
	[
		//Middlewares
		validateJWT,
	],
	revalidateToken
);

module.exports = router;
