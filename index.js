const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("Services");
  const testimonialCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("testimonial");
  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("orders");
  const adminsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admins");
  //Get Service Method
  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((error, services) => {
      res.send(services);
    });
  });

  //post Service Method
  app.post("/addService", (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //Get Testimonial Method Method
  app.get("/testimonials", (req, res) => {
    testimonialCollection.find({}).toArray((error, testimonials) => {
      res.send(testimonials);
    });
  });
  //post testimonial Method
  app.post("/addTestimonial", (req, res) => {
    const newTestimonial = req.body;
    testimonialCollection.insertOne(newTestimonial).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //get single service
  app.get("/singleService/:id", (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, item) => {
      res.send(item[0])
    })
  })
  //post add order
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  //get specific order list

  app.get("/showOrder", (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, order) => {
      res.send(order)
    })
  })

  //get all order
  app.get("/allOrder", (req, res) => {
    ordersCollection.find({})
    .toArray((err, orderList) => {
      res.send(orderList)
    })
  })
  //Update Status
  app.patch('/updateOrderStatus', (req, res) => {
    ordersCollection.updateOne({ _id: ObjectId(req.body.id) }, {
        $set: { status: req.body.status }
    })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
  })
  //add admin
app.post('/makeAdmin',(req, res) => {
  const adminEmail = req.body;
  adminsCollection.insertOne(adminEmail).then((result) => {
    res.send(result.insertedCount > 0);
  })
});


app.post("/isAdmin", (req, res) => {
  const email = req.body.email;
  adminsCollection.find({ email: email }).toArray((err, admins) => {
    res.send(admins.length > 0);
  });
});

app.delete("/delete/:id", (req, res) => {
  serviceCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
    .then((result) => {
      res.send(result.deletedCount > 0);
    });
});

  console.log("connected");
});

app.get("/", (req, res) => {
  res.send("welcome to backend");
});

app.listen(port, () => {
  console.log(`App listening at localhost:${port}`);
});
