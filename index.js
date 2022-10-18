const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");

require("dotenv").config();

//Create express server
const app = express();

//Database
dbConnection();

//Cors
app.use(cors());

//Public Directory
app.use(express.static("public"));

//Body read and parse
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

//Listen requests
app.listen(process.env.PORT, () => {
	console.log(`Server running in port: ${process.env.PORT}`);
});
