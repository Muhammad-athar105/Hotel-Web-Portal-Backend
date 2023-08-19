const Hotel = require('../models/hotel.model');
const Review = require('../models/review.model');
const Room = require('../models/room.model');

exports.searchHotels = async (req, res) => {
  try {
    const { hotelName, hotelAddress, category, country, roomType, occupancy, bedTypes, price, amenities, checkIn, checkOut } = req.query;

    const hotelFilters = {};

    if (hotelName) {
      hotelFilters.hotelName = { $regex: hotelName, $options: 'i' };
    }

    if (hotelAddress) {
      hotelFilters.hotelAddress = { $regex: hotelAddress, $options: 'i' };
    }

    if (category) {
      hotelFilters.category = { $regex: category, $options: 'i' };
    }

    if (country) {
      hotelFilters.country = { $regex: country, $options: 'i' };
    }

    const roomFilters = {};

    if (roomType) {
      roomFilters.roomType = { $regex: roomType, $options: 'i' };
    }

    if (occupancy) {
      roomFilters.occupancy =  { $gte: occupancy } ;
    }

    if (bedTypes) {
      roomFilters.bedTypes = { $regex: bedTypes, $options: 'i' };
    }

    if (price) {
      roomFilters.price = { $gte: price };
    }

    if (amenities) {
      roomFilters.amenities = { $regex: amenities, $options: 'i' };
    }

    roomFilters.availability = true;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
    
      roomFilters.$and = [
        { roomAvailability: { $lte: checkInDate } },
        { roomAvailability: { $gte: checkOutDate } }
      ];
    }
    
    const hotels = await Hotel.aggregate([
      { $match: hotelFilters },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'hotelId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' }
        }
      },
      { $sort: { averageRating: -1 } }
    ]);

    const rooms = await Room.find(roomFilters);

    res.json({ hotels, rooms });

  } catch (error) {
    console.error('Error occurred while searching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



















































// exports.hotelSearch = async (searchQuery) => {
//   try {y
//     const hotels = await Hotel.find({ $or: [{ hotelName: searchQuery }, { hotelAddress: searchQuery }] });
//     const rooms = await Room.find({ $or: [{ roomType: searchQuery }, { occupancy: searchQuery }] });

//     return { hotels, rooms };
//   } catch (error) {
//     throw new Error(`Error searching: ${error.message}. Additional information: ${searchQuery}`);
//   }
// };




// //search for available rooms between check-in and check-out dates
// const searchAvailableRooms = async (req, res) => {
//   const { checkIn, checkOut } = req.query;

//   try {
//     const availableRooms = await Room.find({
//       availability: true,
//       $or: [
//         { checkIn: { $gt: checkOut } },
//         { checkOut: { $lt: checkIn } },
//       ],
//     });

//     res.json(availableRooms);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };



// // Get top-rated hotels
// const getTopRatedHotels = async (req, res) => {
//   try {
//     const hotels = await Hotel.find().sort({ rating: -1 }).limit(10);
//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// const hotelSearch = async (req, res) => {
//   try {
//     console.log(req.params.key);
//     let data = await Hotel.find({
//       $and: [
//         {
//           "$or": [
//             { "hotelName": { $regex: req.params.key, $options: 'i' } },
//             { "hotelAddress": { $regex: req.params.key, $options: 'i' } },
//             { "category": { $regex: req.params.key, $options: 'i' } },
//             { "country": { $regex: req.params.key, $options: 'i' } }
//           ]
//         },
//         {
//           "Room": {
//             $elemMatch: {
//               $or: [
//                 { "roomType": { $regex: req.params.key, $options: 'i' } },
//                 { "occupancy": { $regex: req.params.key, $options: 'i' } },
//                 { "bedTypes": { $regex: req.params.key, $options: 'i' } },
//                 { "price": { $regex: req.params.key, $options: 'i' } },
//                 { "amenities": { $regex: req.params.key, $options: 'i' } }
//               ]
//             }
//           }
//         }
//       ]
//     });
//     res.send(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = { hotelSearch, searchAvailableRooms };



// const hotelSearch = async (req, res) => {
//   try {
//     const search = req.body.search;
//     const hotel_data = await Hotel.find({
//       $or: [
//         { "hotelName": { $regex: req.params.key, $options: 'i' } },
//         { "hotelAddress": { $regex: req.params.key, $options: 'i' } },
//         { "category": { $regex: req.params.key, $options: 'i' } },
//         { "country": { $regex: req.params.key, $options: 'i' } }
//       ]
//     });
//     const room_data = await Room.find({
//       $or: [
//         { "roomType": { $regex: req.params.key, $options: 'i' } },
//         { "occupancy": { $regex: req.params.key, $options: 'i' } },
//         { "bedTypes": { $regex: req.params.key, $options: 'i' } },
//         { "amenities": { $regex: req.params.key, $options: 'i' } },
//         { "price": { $regex: req.params.key, $options: 'i' } }
//       ]
//     });
//     if (hotel_data.length > 0) {
//       res.status(200).send({ success: true, msg: "Hotels details", data: hotel_data });
//     } else {
//       res.status(200).send({ success: true, msg: "Hotel not found!" });
//     }
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error.message });
//   }
// }


// module.exports = { getTopRatedHotels, hotelSearch };
  // console.log(req.params.key)
  // let data = await Hotel.find(
  //   {
  //     "$or": [

  //           { "hotelName": { $regex: req.params.key } }
  //           { "hotelAddress": { $regex: req.params.key } }

  //       ]
  //     }
  //   )



// const searchHotels = async (req, res) => {
//   try {
//     const {
//       hotelName,
//       hotelAddress,
//       minPrice,
//       maxPrice,
//       roomType, // Search by room type
//       amenities, // Search by amenities
//       sector,
//       checkIn,
//       checkOut,
//       occupancy,
//       rooms
//     } = req.query;
//     const query = {};

//     if (hotelName) {
//       query.hotelName = { $regex: hotelName, $options: 'i' };
//     }

//     if (hotelAddress) {
//       query.hotelAddress = { $regex: hotelAddress, $options: 'i' };
//     }

//     if (minPrice && maxPrice) {
//       query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
//     } else if (minPrice) {
//       query.price = { $gte: parseInt(minPrice) };
//     } else if (maxPrice) {
//       query.price = { $lte: parseInt(maxPrice) };
//     }

//     // Search by room type
//     if (roomType) {
//       query['rooms.roomType'] = { $regex: roomType, $options: 'i' };
//     }

//     // Search by amenities
//     if (amenities) {
//       query['rooms.amenities'] = { $regex: amenities, $options: 'i' };
//     }

//     if (sector) {
//       query.sector = { $regex: sector, $options: 'i' };
//     }

//     // Check-in and Check-out date filtering
//     if (checkIn && checkOut) {
//       query['rooms.availableDates.checkIn'] = { $lte: new Date(checkOut) };
//       query['rooms.availableDates.checkOut'] = { $gte: new Date(checkIn) };
//     }

//     // Number of persons filtering
//     if (occupancy) {
//       query['rooms.capacity.persons'] = { $gte: parseInt(occupancy) };
//     }

//     // Number of rooms filtering
//     if (rooms) {
//       query['rooms.quantity'] = { $gte: parseInt(rooms) };
//     }

//     const hotels = await Hotel.find(query).populate({
//       path: 'rooms',
//       match: {
//         roomType: { $regex: roomType, $options: 'i' }, // Match room type
//         amenities: { $regex: amenities, $options: 'i' } // Match amenities
//       },
//       select: 'roomType amenities occupancy'
//     });

//     if (hotels.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'Sorry, we cannot find any hotels matching your search criteria.' });
//     }

//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = { getTopRatedHotels, searchHotels };












// const searchHotels = async (req, res) => {
//   try {
//     const { hotelName, hotelAddress, minPrice, maxPrice, roomType, facilities, sector, checkIn, checkOut, persons, rooms, topRated } = req.query;
//     const queryBuilder = Hotel.find();

//     if (hotelName) {
//       queryBuilder.where('hotelName').equals(hotelName);
//     }

//     if (hotelAddress) {
//       queryBuilder.where('hotelAddress').regex(new RegExp(hotelAddress, 'i'));
//     }

//     if (minPrice && maxPrice) {
//       queryBuilder.where('rooms.price').gte(parseInt(minPrice)).lte(parseInt(maxPrice));
//     } else if (minPrice) {
//       queryBuilder.where('rooms.price').gte(parseInt(minPrice));
//     } else if (maxPrice) {
//       queryBuilder.where('rooms.price').lte(parseInt(maxPrice));
//     }

//     if (roomType) {
//       const roomId = await Room.distinct('_id', { roomType: new RegExp(roomType, 'i') });
//       queryBuilder.where('rooms').in(roomId);
//     }

//     if (facilities) {
//       queryBuilder.where('rooms.facilities').regex(new RegExp(facilities, 'i'));
//     }

//     if (sector) {
//       queryBuilder.where('sector').regex(new RegExp(sector, 'i'));
//     }

//     if (checkIn && checkOut) {
//       queryBuilder.where('rooms.checkIn').lte(new Date(checkOut));
//       queryBuilder.where('rooms.checkOut').gte(new Date(checkIn));
//     }

//     if (persons) {
//       queryBuilder.where('rooms.persons').gte(parseInt(persons));
//     }

//     if (rooms) {
//       queryBuilder.where('rooms.quantity').gte(parseInt(rooms));
//     }

//     if (topRated) {
//       queryBuilder.populate({
//         path: 'reviews',
//         model: 'Review',
//         options: { sort: { rating: -1 }, limit: 1 }
//       });
//     }

//     const hotels = await queryBuilder.exec();

//     if (hotels.length === 0) {
//       return res.status(404).json({ message: 'Sorry, we cannot find any hotels matching your search criteria.' });
//     }

//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = searchHotels;


// app.get('/hotels', async (req, res) => {
//   try {
//     const queryBuilder = Hotel.find();

//     // Example: Filter by hotel name
//     const hotelName = req.query.name;
//     if (hotelName) {
//       queryBuilder.where({ name: hotelName }).regex(new RegExp(hotelName, 'i'));
//     }

//     // Example: Sort by hotel rating
//     queryBuilder.sort('-rating');

//     // Example: Limit the number of results
//     const limit = parseInt(req.query.limit) || 10;
//     queryBuilder.limit(limit);

//     // Execute the query
//     const hotels = await queryBuilder.exec();

//     res.json(hotels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
