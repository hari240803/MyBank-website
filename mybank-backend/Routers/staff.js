const {Router} = require("express");
const router = Router();
const {redisClient} = require("../app");

const {
    staffLoginCollection,
    queriesCollection,
    balanceCollection,
    transactionCollection, accountOpenRequests, accountCollection, loanRequestCollection
} = require("../config/mongodb");

const getStaff = async (userId) => {
    const staff = await staffLoginCollection.findOne({UID: userId});
    if (!staff) return false;
    return staff.name;
}

/**
 * @swagger
 * /staff/login:
 *   post:
 *     summary: Login for staff
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               password:
 *                 type: string
 *                 description: The staff's password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UID:
 *                   type: string
 *                   description: The staff's UID
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/login", async function (req, res) {
    const id = req.body.id;
    const password = req.body.password;
    const user = await staffLoginCollection.findOne({UID: id});
    if (!user) return res.send(false);
    else {
        if (password === user.password) {
            return res.send(user.UID);
        } else {
            return res.send(false);
        }
    }
});

/**
 * @swagger
 * /staff/getName:
 *   get:
 *     summary: Get the staff's name
 *     tags: [Staff]
 *     parameters:
 *       - in: header
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff's id
 *     responses:
 *       200:
 *         description: Successfully retrieved the staff's name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The staff's name
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/getName", async function (req, res) {
    const staffId = req.header("id");
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        return res.send({name: name});
    }
});

/**
 * @swagger
 * /staff/getNumberQueries:
 *   get:
 *     summary: Get the number of queries
 *     tags: [Staff]
 *     parameters:
 *       - in: header
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff's id
 *     responses:
 *       200:
 *         description: Successfully retrieved the number of queries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The number of queries
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/getNumberQueries", async function (req, res) {
    const staffId = req.header("id");
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        try {
            const count = await redisClient.get(`queriesCount`);
            if (count) {
                return res.send({count: count});
            } else {
                const count = await queriesCollection.countDocuments({status: "Pending"});
                await redisClient.set(`queriesCount`, count.toString());
                return res.send({count: count});
            }
        } catch (error) {
            console.error('Error counting documents:', error);
            return res.status(500).send({error: 'Internal Server Error'});
        }
    }
});

/**
 * @swagger
 * /staff/depositMoney:
 *   post:
 *     summary: Deposit money into an account
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - accountNumber
 *               - amount
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               accountNumber:
 *                 type: string
 *                 description: The account number to deposit to
 *               amount:
 *                 type: number
 *                 description: The amount to deposit
 *     responses:
 *       200:
 *         description: Successfully deposited money
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/depositMoney", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send({message: "Error Occurred"});
    } else {
        const accountNumber = req.body.accountNumber;
        const amount = req.body.amount;
        await balanceCollection.updateOne({accountNumber: accountNumber}, {$inc: {balance: amount}});
        await transactionCollection.create({
            sender_acc_no: accountNumber,
            amount: amount,
            recipient: accountNumber,
            date: new Date().toLocaleDateString("en-GB"),
            time: new Date().toLocaleTimeString("en-US", {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            }),
        });
        redisClient.del(`user:${accountNumber}`);
        return res.send({message: "Transaction Complete"});
    }
});

/**
 * @swagger
 * /staff/getForms:
 *   get:
 *     summary: Get the forms
 *     tags: [Staff]
 *     parameters:
 *       - in: header
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff's id
 *     responses:
 *       200:
 *         description: Successfully retrieved the forms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: The forms
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/getForms", async function (req, res) {
    const staffId = req.header("id");
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const users = await redisClient.get(`formList`);
        if (users) {
            return res.send({body: JSON.parse(users)});
        } else {
            const users = await accountOpenRequests.find({status: "Pending"});
            await redisClient.set(`formList`, JSON.stringify(users));
            return res.send({body: users});
        }
    }
});

/**
 * @swagger
 * /staff/formAccept:
 *   post:
 *     summary: Accept a form
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - formId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               formId:
 *                 type: string
 *                 description: The form's id
 *     responses:
 *       200:
 *         description: Successfully accepted the form
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                   description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/formAccept", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const form = await accountOpenRequests.findOneAndUpdate(
            {_id: req.body.formId},
            {$set: {status: "Accepted"}},
            {new: true}
        );
        const user = await accountCollection.create({
            eMail: form.email,
            firstName: form.first_name,
            lastName: form.last_name,
            password: "NewAccount@123",
            profilePassword: "ProfilePassword@123",
            phone: form.phone,
        });
        await balanceCollection.create({
            accountNumber: user._id,
            balance: 0
        });
        return res.send(true);
    }
});

/**
 * @swagger
 * /staff/formReject:
 *   post:
 *     summary: Reject a form
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - formId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               formId:
 *                 type: string
 *                 description: The form's id
 *     responses:
 *       200:
 *         description: Successfully rejected the form
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/formReject", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await accountOpenRequests.deleteOne({_id: req.body.formId});
        return res.send(true);
    }
});

/**
 * @swagger
 * /staff/getQueries:
 *   get:
 *     summary: Get the queries
 *     tags: [Staff]
 *     parameters:
 *       - in: header
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff's id
 *     responses:
 *       200:
 *         description: Successfully retrieved the queries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: The queries
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/getQueries", async function (req, res) {
    const staffId = req.header("id");
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const queries = await redisClient.get(`queries`);
        if (queries) {
            return res.send({body: JSON.parse(queries)});
        } else {
            const queries = await queriesCollection.find({status: "Pending"});
            await redisClient.set(`queries`, JSON.stringify(queries));
            return res.send({body: queries});
        }
    }
});

/**
 * @swagger
 * /staff/sendMessage:
 *   post:
 *     summary: Send a message in response to a query
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - queryId
 *               - response
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               queryId:
 *                 type: string
 *                 description: The query's id
 *               response:
 *                 type: string
 *                 description: The response message to the query
 *     responses:
 *       200:
 *         description: Successfully sent the message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                   description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/sendMessage", async function (req, res) {
    const staffId = req.body.id;
    const queryId = req.body.queryId;
    const response = req.body.response;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await queriesCollection.updateOne({_id: queryId}, {$set: {response: response}});
        return res.send(true);
    }
});

/**
 * @swagger
 * /staff/resolveQuery:
 *   post:
 *     summary: Resolve a query
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - queryId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               queryId:
 *                 type: string
 *                 description: The query's id
 *     responses:
 *       200:
 *         description: Successfully resolved the query
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/resolveQuery", async function (req, res) {
    const staffId = req.body.id;
    const queryId = req.body.queryId;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        redisClient.del(`queriesCount`);
        redisClient.del(`queries`);
        await queriesCollection.updateOne({_id: queryId}, {$set: {status: "Resolved"}});
        return res.send(true);
    }
});

/**
 * @swagger
 * /staff/viewLoan:
 *   get:
 *     summary: View pending loan requests
 *     tags: [Staff]
 *     parameters:
 *       - in: header
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The staff's id
 *     responses:
 *       200:
 *         description: Successfully retrieved the loan requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: The loan requests
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.get("/viewLoan", async function (req, res) {
    const staffId = req.header("id");
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        const list = await loanRequestCollection.find({status: "Pending"});
        return res.send({body: list});
    }
});

/**
 * @swagger
 * /staff/acceptLoan:
 *   post:
 *     summary: Accept a loan request
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - loanId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               loanId:
 *                 type: string
 *                 description: The loan request's id
 *     responses:
 *       200:
 *         description: Successfully accepted the loan request
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/acceptLoan", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await loanRequestCollection.updateOne({_id: req.body.loanId}, {$set: {status: "Accepted"}});
        return res.send(true);
    }
});

/**
 * @swagger
 * /staff/rejectLoan:
 *   post:
 *     summary: Reject a loan request
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - loanId
 *             properties:
 *               id:
 *                 type: string
 *                 description: The staff's id
 *               loanId:
 *                 type: string
 *                 description: The loan request's id
 *     responses:
 *       200:
 *         description: Successfully rejected the loan request
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: The success status
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/rejectLoan", async function (req, res) {
    const staffId = req.body.id;
    const name = await getStaff(staffId);
    if (!name) {
        return res.send(false);
    } else {
        await loanRequestCollection.updateOne({_id: req.body.loanId}, {$set: {status: "Rejected"}});
        return res.send(true);
    }
});

module.exports = router;