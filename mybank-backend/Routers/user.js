const {Router} = require("express");
const {redisClient} = require("../app");
const {
    accountCollection,
    accountOpenRequests,
    balanceCollection,
    transactionCollection,
    loanRequestCollection,
    queriesCollection,
    activityTrackCollection
} = require("../config/mongodb");
const router = Router();
const {admin} = require("../config/firebase-admin-config");
const {getAuth} = require("firebase-admin/auth");

async function getAccountNumber(userToken) {
    try {
        const accountNumber = await redisClient.get(userToken.toString());
        if (accountNumber) {
            return accountNumber;
        } else {
            const auth = getAuth(admin);
            const decodeToken = await auth.verifyIdToken(userToken);
            const uid = decodeToken.uid;
            const user = await auth.getUser(uid);
            const phoneNumber = user.phoneNumber.slice(3);
            const mainUser = await accountCollection.findOne({
                phone: phoneNumber
            });
            await redisClient.set(userToken.toString(), mainUser._id.toString());
            return mainUser._id;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * @swagger
 * /user/trackLogin:
 *   post:
 *     summary: Track the user's login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The user's account number
 *     responses:
 *       200:
 *         description: Login tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                   description: The response message
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
router.post("/trackLogin", async function (req, res) {
    await activityTrackCollection.create({
        accountNumber: req.body.accountNumber,
        date: new Date().toLocaleDateString('en-GB'),
        time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }),
    });
    return res.send(true);
});

/**
 * @swagger
 * /user/getName:
 *   get:
 *     summary: Get the user's name
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: userToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's token
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The user's name
 *       404:
 *         description: User not found
 */
router.get("/getName", async function (req, res) {
    try {
        const userToken = req.header("userToken");
        const accountNumber = await getAccountNumber(userToken);
        try {
            const cacheData = await redisClient.get(`name:${accountNumber}`);
            if (cacheData) {
                return res.send({name: cacheData});
            } else {
                const user = await accountCollection.findOne({
                    _id: accountNumber
                });
                await redisClient.set(accountNumber, user.firstName);
                return res.send({name: user.firstName});
            }
        } catch (error) {
            const user = await accountCollection.findOne({
                _id: accountNumber
            });
            await redisClient.set(`name:${accountNumber}`, user.firstName.toString());
            return res.send({name: user.firstName});
        }
    } catch (error) {
        return res.sendStatus(404);
    }
});

router.post("/login", async function (req, res) {
    const accountNumber = req.body.accountNumber;
    const password = req.body.password;
    const user = await accountCollection.findOne({
        _id: accountNumber
    });
    if (!user) return res.send(false);
    else {
        if (password === user.password) {
            return res.send(user.phone);
        } else {
            return res.send(false);
        }
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login the user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - password
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: The user's account number
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 phone:
 *                   type: string
 *                   description: The user's phone number
 *       default:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post("/register", async function (req, res) {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const fileUrl = req.body.fileUrl;
        let user = await accountCollection.findOne({
            phone: phoneNumber
        });
        if (user) return res.send(false);
        const newRequest = new accountOpenRequests({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phoneNumber,
            formPath: fileUrl,
            status: "Pending",
            password: "NewAccount@123",
            profilePassword: "ProfilePassword@123"
        });
        const savedRequest = await newRequest.save();
        redisClient.del(`formList`);
        res.send(savedRequest._id);
    } catch (error) {
        res.send(false);
    }
});

/**
 * @swagger
 * /user/trackRequest:
 *   post:
 *     summary: Track the status of a user's account request
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingId
 *             properties:
 *               trackingId:
 *                 type: string
 *                 description: The tracking ID of the user's account request
 *     responses:
 *       200:
 *         description: Successfully retrieved the status of the account request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the account request
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The error message
 */
router.post("/trackRequest", async function (req, res) {
    try {
        const trackingId = req.body.trackingId;
        let request = await accountOpenRequests.findOne({_id: trackingId});
        if (request) {
            return res.send({status: `Your account status is: ${request.status}`});
        }
        return res.send({status: "Tracking Id doesn't match with any account!"});
    } catch (error) {
        return res.send({status: "Error Occurred"});
    }
});

/**
 * @swagger
 * /user/accountInfo:
 *   get:
 *     summary: Get the user's account information
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: userToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's token
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's account information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountNumber:
 *                   type: string
 *                   description: The user's account number
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *                 lastName:
 *                   type: string
 *                   description: The user's last name
 *                 balance:
 *                   type: number
 *                   description: The user's account balance
 *                 transactions_length:
 *                   type: number
 *                   description: The number of transactions
 *                 amount:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The amounts of the transactions
 *                 toFrom:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The recipients or senders of the transactions
 *                 date:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The dates of the transactions
 *                 time:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The times of the transactions
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
router.get("/accountInfo", async function (req, res) {
    try {
        const userToken = req.header("userToken");
        const accountNumber = await getAccountNumber(userToken);
        const cachedData = await redisClient.get(`user:${accountNumber}`);
        if (cachedData) {
            return res.send(JSON.parse(cachedData));
        } else {
            let user = await accountCollection.findOne({
                _id: accountNumber
            });
            const balanceDoc = await balanceCollection.findOne({accountNumber: accountNumber});
            const balance = balanceDoc.balance;
            const transactions = await transactionCollection.find({
                $or: [{sender_acc_no: accountNumber}, {recipient: accountNumber}],
            });
            let transactions_length = transactions.length;
            let amount = [];
            let to_from = [];
            let date = [];
            let time = [];
            for (let i = 0; i < transactions_length; i++) {
                if (accountNumber.toString() === transactions[i].sender_acc_no.toString() && accountNumber.toString() === transactions[i].recipient) {
                    amount.push("+" + transactions[i].amount.toString());
                    to_from.push("Self Credit");
                } else if (accountNumber.toString() === transactions[i].sender_acc_no.toString()) {
                    amount.push("-" + transactions[i].amount.toString());
                    to_from.push(transactions[i].recipient.toString());
                } else if (accountNumber.toString() === transactions[i].recipient) {
                    amount.push("+" + transactions[i].amount.toString());
                    to_from.push(transactions[i].sender_acc_no.toString());
                }
                date.push(transactions[i].date);
                time.push(transactions[i].time);
            }
            const data = {
                accountNumber: accountNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                balance: balance,
                transactions_length: transactions_length,
                amount: amount,
                toFrom: to_from,
                date: date,
                time: time,
            };
            await redisClient.set(`user:${accountNumber}`, JSON.stringify(data));
            return res.send(data);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
});

/**
 * @swagger
 * /user/submitQuery:
 *   post:
 *     summary: Submit a user query
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - title
 *               - message
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               title:
 *                 type: string
 *                 description: The title of the query
 *               message:
 *                 type: string
 *                 description: The message of the query
 *     responses:
 *       200:
 *         description: Successfully submitted the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the submitted query
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: boolean
 *                   description: The error message
 */
router.post("/submitQuery", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const title = req.body.title;
        const message = req.body.message;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({_id: accountNumber});
        const response = await queriesCollection.create({
            name: user.firstName + " " + user.lastName,
            phone: Number(user.phone),
            acc_no: accountNumber,
            title: title,
            message: message,
            status: "Pending",
            response: "Pending"
        });
        redisClient.del(`queriesCount`);
        redisClient.del(`queries`);
        return res.send(response._id);
    } catch (error) {
        console.log(error);
        return res.send(false);
    }
});

/**
 * @swagger
 * /user/getQueryStatus:
 *   post:
 *     summary: Get the status of a user's query
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - queryId
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               queryId:
 *                 type: string
 *                 description: The ID of the user's query
 *     responses:
 *       200:
 *         description: Successfully retrieved the status of the user's query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: string
 *                   description: The status of the user's query
 *       default:
 *         description: Error Occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: string
 *                   description: The error message
 */
router.post("/getQueryStatus", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const queryId = req.body.queryId;
        const accountNumber = await getAccountNumber(userToken);
        if (accountNumber) {
            const query = await queriesCollection.findOne({_id: queryId});
            if (query) {
                return res.send({body: `Your query status is: ${query.status}. Additional message from the staff: ${query.response}`});
            } else {
                return res.send({body: "No query found!"});
            }
        } else {
            return res.send({body: "You are not logged in!"});
        }
    } catch (error) {

    }
});

/**
 * @swagger
 * /user/profileDetails:
 *   get:
 *     summary: Get the user's profile details
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: userToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's token
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The user's first name
 *                 lastName:
 *                   type: string
 *                   description: The user's last name
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 phone:
 *                   type: string
 *                   description: The user's phone number
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
router.get("/profileDetails", async function (req, res) {
    try {
        const userToken = req.header("userToken");
        const accountNumber = await getAccountNumber(userToken);
        const cachedData = await redisClient.get(`profile:${accountNumber}`);
        if (cachedData) {
            return res.send(JSON.parse(cachedData));
        } else {
            let user = await accountCollection.findOne({
                _id: accountNumber
            });
            const data = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.eMail,
                phone: user.phone
            };
            await redisClient.set(`profile:${accountNumber}`, JSON.stringify(data));
            return res.send(data);
        }
    } catch (error) {
        console.log(error);
        return false;
    }
});

/**
 * @swagger
 * /user/changePassword:
 *   post:
 *     summary: Change the user's password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               oldPassword:
 *                 type: string
 *                 description: The user's old password
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *     responses:
 *       200:
 *         description: Successfully changed the password
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
router.post("/changePassword", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: accountNumber
        });
        if (oldPassword !== user.password) return res.send({message: "Old password is incorrect!"});
        await accountCollection.updateOne({_id: accountNumber}, {password: newPassword});
        res.send({message: "Password updated successfully!"});
    } catch (error) {
        return res.send({message: "Error Occurred!"});
    }
});

/**
 * @swagger
 * /user/changeProfilePassword:
 *   post:
 *     summary: Change the user's profile password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               oldPassword:
 *                 type: string
 *                 description: The user's old profile password
 *               newPassword:
 *                 type: string
 *                 description: The user's new profile password
 *     responses:
 *       200:
 *         description: Successfully changed the profile password
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
router.post("/changeProfilePassword", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const accountNumber = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: accountNumber
        });
        if (oldPassword !== user.profilePassword) return res.send({message: "Old password is incorrect!"});
        await accountCollection.updateOne({_id: accountNumber}, {profilePassword: newPassword});
        res.send({message: "Profile Password updated successfully!"});
    } catch (error) {
        return res.send({message: "Error Occurred!"});
    }
});

/**
 * @swagger
 * /user/transfer:
 *   post:
 *     summary: Transfer amount from the user's account to another account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - accountNumber
 *               - password
 *               - amount
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               accountNumber:
 *                 type: string
 *                 description: The recipient's account number
 *               password:
 *                 type: string
 *                 description: The user's profile password
 *               amount:
 *                 type: number
 *                 description: The amount to be transferred
 *     responses:
 *       200:
 *         description: Successfully transferred the amount
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
router.post("/transfer", async function (req, res) {
    try {
        const userToken = req.body.userToken;
        const accountNumber = req.body.accountNumber;
        const password = req.body.password;
        const amount = Number(req.body.amount);
        const senderAccount = await getAccountNumber(userToken);
        let user = await accountCollection.findOne({
            _id: senderAccount
        });
        if (user.profilePassword !== password) return res.send({message: "Password Incorrect!"});
        const sender_balance_doc = await balanceCollection.findOne({
            accountNumber: user._id
        });
        const senderBalance = sender_balance_doc.balance;
        if (senderBalance < amount) {
            return res.send({message: "Balance Insufficient"});
        } else {
            await balanceCollection.updateOne({accountNumber: accountNumber}, {$inc: {balance: amount}});
            await balanceCollection.updateOne({accountNumber: user._id}, {$inc: {balance: -amount}});
            const object = await transactionCollection.create({
                sender_acc_no: user._id,
                amount: amount,
                recipient: accountNumber,
                date: new Date().toLocaleDateString('en-GB'),
                time: new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true
                }),
            });
            redisClient.del(`user:${user._id}`);
            redisClient.del(`user:${accountNumber}`);
        }
        return res.send({message: "Transaction Complete"});
    } catch (error) {
        console.log(error);
        return res.send({message: "Error Occurred!"});
    }
});

/**
 * @swagger
 * /user/getLoanDetails:
 *   get:
 *     summary: Get the user's loan details
 *     tags: [User]
 *     parameters:
 *       - in: header
 *         name: userToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's token
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's loan details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loanType:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The types of the user's loans
 *                 amount:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The amounts of the user's loans
 *                 loanStatus:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The statuses of the user's loans
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
router.get("/getLoanDetails", async function (req, res) {
    try {
        const userToken = req.header("userToken");
        const accountNumber = await getAccountNumber(userToken);
        const loans = await loanRequestCollection.find({
            acc_no: accountNumber
        });
        let amount = [];
        let status = [];
        let loan_type = [];
        let loan_length = loans.length;
        for (let i = 0; i < loan_length; i++) {
            amount.push(loans[i].loan_amount.toString());
            status.push(loans[i].status.toString());
            loan_type.push(loans[i].loan_type.toString());
        }
        return res.send({loanType: loan_type, amount: amount, loanStatus: status});
    } catch (error) {
        console.log(error);
    }
});

/**
 * @swagger
 * /user/applyLoan:
 *   post:
 *     summary: Apply for a loan
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userToken
 *               - loanAmount
 *               - loanType
 *               - reason
 *             properties:
 *               userToken:
 *                 type: string
 *                 description: The user's token
 *               loanAmount:
 *                 type: number
 *                 description: The amount of the loan
 *               loanType:
 *                 type: string
 *                 description: The type of the loan
 *               reason:
 *                 type: string
 *                 description: The reason for the loan
 *     responses:
 *       200:
 *         description: Successfully applied for the loan
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
router.post("/applyLoan", async function (req, res) {
    try {
        let userToken = req.body.userToken;
        let loanAmount = req.body.loanAmount;
        let loanType = req.body.loanType;
        let reason = req.body.reason;
        const accountNumber = await getAccountNumber(userToken);
        await loanRequestCollection.create({
            acc_no: accountNumber,
            loan_amount: loanAmount,
            loan_type: loanType,
            reason: reason,
            status: "Pending",
        });
        return res.send({message: "Request Sent Successfully!"});
    } catch (error) {
        console.log(error);
        return res.send({message: "Some Error Occurred!"});
    }
});

module.exports = router;