
// const mongoose = require('mongoose');
// const Hotel = require('../models/hotel.model');
// const Room = require('../models/room.model');

// //URLs
// const url1 = 'mongodb://127.0.0.1:27017/Super_Admin';
// const url2 = 'mongodb://127.0.0.1:27017/Hotel_Admin';

// async function connectDatabase() {
//   try {
//     const db1Connection = await mongoose.createConnection(url1, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 60000 });
//     const db2Connection = await mongoose.createConnection(url2, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 60000 });
    
//     //Hotel Model
//     const db1Schema = new mongoose.Schema(Hotel.schema.obj);
//     const db1Model = db1Connection.model('Hotel', db1Schema);
  
//     //Room Model
//     const db2Schema = new mongoose.Schema(Room.schema.obj);
//     const db2Model = db2Connection.model('Room', db2Schema);


//     console.log('Databases connected successfully!');
    
//   } catch (err) {
//     console.error('Error:', err);
//   }
// }

// connectDatabase();
// module.exports = connectDatabase;


const mongoose = require('mongoose');
const connectionString = process.env.MONGO_URI;

const connectDatabase = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // for mongoose 6.x
      // useFindAndModify: false, // for mongoose 6.x
    });

    console.log('Connection established to MongoDB database successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
  }
};

module.exports = connectDatabase;


// const MongoClient = require('mongodb');
// const client1 = new MongoClient('mongodb://localhost:27017/mydb');
// const client2 = new MongoClient('mongodb://localhost:27017/mydb2');
// client1.connect((err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Connected to MongoDB!');
// });
// client2.connect((err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Connected to MongoDB!');
// });


