const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: "User already exist with that email",
			});
		}

		user = new User(req.body);

		//Encrypt Password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		//Generate Token
		const token = await generateJWT(user.id, user.name);

		return res.status(201).json({
			ok: true,
			msg: "register",
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Please contact with support",
		});
	}
};

const loginUser = async (req = request, res = response) => {
	const { password, email } = req.body;

	try {
		//Check if user exist
		let user = await User.findOne({ email });

		//If not exist return status 400
		if (!user) {
			return res.status(400).json({
				ok: false,
				//msg: "Email or Password wrong",
				msg: "Email invalid",
			});
		}

		//Check password
		const validPassword = bcrypt.compareSync(password, user.password);

		//
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				//msg: "Email or Password wrong",
				msg: "Password invalid",
			});
		}

		//Generate Token
		const token = await generateJWT(user.id, user.name);

		//Generate JWT
		return res.json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Please contact with support",
		});
	}
};

const revalidateToken = async (req = request, res = response) => {
	const { uid, name } = req;

	//Generate New Token
	const token = await generateJWT(uid, name);

	return res.json({
		ok: true,
		msg: "renew",
		uid,
		name,
		token,
	});
};

module.exports = {
	createUser,
	loginUser,
	revalidateToken,
};
