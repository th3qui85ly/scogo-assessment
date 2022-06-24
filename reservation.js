const { MongoClient } = require('mongoose');
const Pizza = require('./model/Pizza');
const User = require('./model/User');
const Order = require('./model/Orders');
const { param } = require('./routes/routes');
require('dotenv').config({path: __dirname + '/.env'});
async function main() {
    const uri = process.env.DB_URI;
    const client = new MongoClient(uri);

    const userData = await User.findOne({_id: services._id});
    const pizzaData = await Pizza.findOne({_id: req.pizzaId });
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the DB calls
        await createReservation(client,
            userData,
            pizzaData,
            new Date(),
            true);

    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

/**
 * 
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the scogoApi database
 * @param {Object} user user who is making the order
 * @param {Object} pizza pizza item to be ordered
 * @param {Date} orderDate Date of the order
 * @param {Boolean} isFulfilled 
 */
async function createReservation(client, user, pizza, orderDate, isFulfilled) {

    /**
     * The orders collection in the scogoApi database
     */
    const ordersCollection = client.db("scogoApi").collection("orders");

    const session = client.startSession();

    // Step 2: Optional. Define options for the transaction
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {      
        const transactionResults = await session.withTransaction(async () => {
            // Add a reservation to the reservations array for the appropriate document in the users collection
            const usersUpdateResults = await ordersCollection.updateOne(
                { user: user },
                { pizza: pizza },
                { orderDate: orderDate },
                { isFulfilled: isFulfilled },
                { session });
        }, transactionOptions);

        if (transactionResults) {
            console.log("The reservation was successfully created.");
        } else {
            console.log("The transaction was intentionally aborted.");
        }
    } catch (e) {
        console.log("The transaction was aborted due to an unexpected error: " + e);
    } finally {
        // Step 4: End the session
        await session.endSession();
    }
}

/**
 * A helper function that generates a reservation document
 * @param {Object} user The name of the Airbnb listing to be reserved
 * @param {Object} pizza An object containing additional reservation details that need to be stored with the reservation
 * @param {Array.Date} orderDate An array of the date(s) for the reservation
 * @param {Boolean} isFulfilled A boolean to show if order is completed or not
 * @returns {Object} The reservation document
 */
function createReservationDocument(user, pizza) {
    // Create the reservation
    let reservation = {
        user: user,
        pizza: pizza,
        orderDate: new Date().toString(),
        isFulfilled: true
    }

    return reservation;
}