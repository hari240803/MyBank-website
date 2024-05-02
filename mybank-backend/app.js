require("dotenv").config()
const path = require('path');
const fs = require("fs");

const redis = require("redis");
let redisClient;
(async () => {
    redisClient = redis.createClient({url: process.env.REDIS_URL});
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    redisClient.on("connect", () => console.log("Redis connected"));
    await redisClient.connect();
})();
module.exports = {redisClient};

const relativePath = 'mybank-react-firebase-adminsdk-3ctvu-0629e6443c.json';
const absolutePath = path.resolve(__dirname, relativePath);
process.env.GOOGLE_APPLICATION_CREDENTIALS = absolutePath;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MyBank API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3001/",
            },
            {
                url: "https://mybank-backend.onrender.com/"
            }
        ],
    },
    apis: ["./Routers/user.js", "./Routers/admin.js", "./Routers/staff.js", "./app.js"],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);

const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./Routers/user");
const adminRoutes = require("./Routers/admin");
const staffRoutes = require("./Routers/staff");

const mongooseModule = require("./config/mongodb");

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "development") {
    const logDirectory = path.join(__dirname, "log");
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }
    const accessLogStream = fs.createWriteStream(path.join(logDirectory, "logfile.log"), {flags: "a"});
    app.use(morgan("combined", {stream: accessLogStream}));
}

app.use(cors({origin: ["http://localhost:3000", "https://my-bank-react.vercel.app"]}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [Basic]
 *     responses:
 *       200:
 *         description: Welcome to MyBank!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The welcome message
 */
app.get("/", function (req, res) {
    res.send({message: "Welcome to MyBank!"});
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the user
 *     tags: [Basic]
 *     parameters:
 *       - in: header
 *         name: user-token
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's token
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
app.get("/logout", function (req, res) {
    const token = req.header("user-token");
    redisClient.del(token);
    res.sendStatus(200);
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/staff", staffRoutes);

/**
 * @swagger
 * /*:
 *   get:
 *     summary: Default route for non-existing endpoints
 *     tags: [Basic]
 *     responses:
 *       200:
 *         description: No valid request point
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
app.get("*", function (req, res) {
    res.send({message: "No valid request point!"});
});

app.listen(PORT, function () {
    mongooseModule.connect();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = {app};
