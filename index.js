const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { ObjectId } = require('bson');
const ObjectIdC = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('complainBox'));
app.use(fileUpload());
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Running Our Complain Box Server...')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjpam.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const usersCollection = client.db("complainBox").collection("users");
  const complainCollection = client.db("complainBox").collection("complains");
  const contactCollection = client.db("complainBox").collection("contact");
  const emergencyContactCollection = client.db("complainBox").collection("emergencyContact");
  
  app.post('/addUser', (req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    const userStatus = "user";

    usersCollection.insertOne({userName, userEmail, userPassword, userStatus})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addStaff', (req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPhone = req.body.userPhone;
    const userPassword = req.body.userPassword;
    const userAddress = req.body.userAddress;
    const userStatus = req.body.userStatus;
    const division = req.body.division;
    const district = req.body.district;
    const thana = req.body.thana;
    const union = req.body.union;
    const word = req.body.word;

    usersCollection.insertOne({userName, userEmail, userPhone, userPassword, userAddress, userStatus, division, district, thana, union, word})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addAdmin', (req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const userPhone = req.body.userPhone;
    const userPassword = req.body.userPassword;
    const userAddress = req.body.userAddress;
    const userStatus = "admin";

    usersCollection.insertOne({userName, userEmail, userPhone, userPassword, userAddress, userStatus})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addEmergencyContact', (req, res) => {
    const location = req.body.location;
    const police = req.body.police;
    const fire = req.body.fire;
    const hospital = req.body.hospital;

    emergencyContactCollection.insertOne({location, police, fire, hospital})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  app.post('/addContact', (req, res) => {
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;
    const subject = req.body.subject;
    const mailBody = req.body.mailBody;
    const readingStatus = 'Unread';

    contactCollection.insertOne({userName, userEmail, subject, mailBody, readingStatus})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addComplain', (req, res) => {
    const file = req.files.file;
    const userId = req.body.userId;
    const userName = req.body.userName;
    const complainTitle = req.body.complainTitle;
    const userEmail = req.body.userEmail;
    const division = req.body.division;
    const district = req.body.district;
    const thana = req.body.thana;
    const union = req.body.union;
    const word = req.body.word;
    const village = req.body.village;
    const seeComplain = req.body.seeComplain;
    const identity = req.body.identity;
    const description = req.body.description;
    const createdTime = req.body.createdTime;
    const day = req.body.day;
    const weekDay = req.body.weekDay;
    const month = req.body.month;
    const year = req.body.year;
    const status = "pending";
    const adminComments = "Have no comments";
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    complainCollection.insertOne({ userId, userName, userEmail, complainTitle, division, district, thana, union, word, village, seeComplain, identity, description, createdTime, day, weekDay, month, year, status, adminComments, image})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/userData', (req, res) => {
    usersCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/userQuery', (req, res) => {
    contactCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/emergencyContact', (req, res) => {
    emergencyContactCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/comlains', (req, res) => {
    complainCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectIdC(id)};
    const result = usersCollection.deleteOne(query);
    res.json(result);
  })

  app.delete('/complainDelete/:id', (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectIdC(id)};
    const result = complainCollection.deleteOne(query);
    res.json(result);
  })

  app.put('/statusUpdate/:id', (req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectIdC(id)};
    const options = {upsert: true}
    const updateDoc = {
        $set: {
            status: 'Accepted'
        },
    };
    const result = complainCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  })

  app.put('/updateComplain/:id', (req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectIdC(id)};
    const options = {upsert: true}
    const updateDoc = {
        $set: {
            status: 'Accepted',
            seeComplain: req.body.seeComplain,
            adminComments: req.body.adminComments,
        },
    };
    const result = complainCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  })

  app.put('/updateComplainStatus/:id', (req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectIdC(id)};
    const options = {upsert: true}
    const updateDoc = {
        $set: {
            status: req.body.status
        },
    };
    const result = complainCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  })

  app.put('/readingStatusUpdate/:id', (req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectIdC(id)};
    const options = {upsert: true}
    const updateDoc = {
        $set: {
          readingStatus: 'Read'
        },
    };
    const result = contactCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  })

  app.put('/staffAdminDataUpdate/:id', (req, res) => {
    const id = req.params.id;
    const filter = {_id: ObjectIdC(id)};
    const options = {upsert: true}
    const updateDoc = {
        $set: {
          userName: req.body.userName,
          userPhone: req.body.userPhone,
          userAddress: req.body.userAddress
        },
    };
    const result = usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  })

  app.delete('/contactDelete/:id', (req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectIdC(id)};
    const result = contactCollection.deleteOne(query);
    res.json(result);
  })

});

app.listen(port, () => {
  console.log(`Complain Box App listening on port ${port}`)
})