const express = require('express');
const mongoose = require('mongoose');
const app = express();

const server = require('http').createServer(app); // Create an HTTP server
const io = require('socket.io')(server); // Create a WebSocket server


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://dtsits:QqWwPpOo1414@cluster0.82ctett.mongodb.net/?retryWrites=true&w=majority";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// Connect to MongoDB
mongoose.connect('mongodb://localhost/whatsapp_orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a MongoDB schema and model for orders
const orderSchema = new mongoose.Schema({
  orderNo: String,
  date: Date,
  text: String,
  submitted: Boolean,
});

const Order = mongoose.model('Order', orderSchema);

// const newOrder = new Order({
//   orderNo: '1001',
//   date: new Date('2023-10-31'),
//   text: 'Sample Text 1',
//   submitted: false,
// });

// newOrder.save()
//   .then(() => {
//     console.log('Order saved successfully');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

 // Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

// API to get orders from MongoDB
app.get('/api/orders', async (req, res) => {
    try {
        const filter = req.query.filter;
        let query = {};

        if (filter === 'true') {
            query = { submitted: true };
        } else if (filter === 'false') {
            query = { submitted: false };
        }

        const orders = await Order.find(query);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching orders.' });
    }
});

app.use(express.json()); // Add this line to parse JSON data
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        
        const orderId = req.params.orderId;
        console.log('Updating order with ID:', orderId);
        console.log('heheheh');
        console.log(req.params);

        const submitted = req.body.submitted;

        
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { submitted }, { new: true });
        console.log('Updatingorder:', updatedOrder);

        if (!updatedOrder) {
            // If the order with the given ID is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Check if 'updatedOrder' is defined before accessing the 'submitted' property
        if (updatedOrder && updatedOrder.submitted !== undefined) {
            res.json(updatedOrder);
        } else {
            res.status(500).json({ error: 'Failed to update the order.' });
        }
    } catch (error) {
        // Log the error to the console for debugging
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the order.' });
    }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});