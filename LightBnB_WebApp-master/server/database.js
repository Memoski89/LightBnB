const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
  SELECT *   
  FROM users
  WHERE email LIKE $1
  `;
  const params = [`%${email}%`];
  return pool.query(queryString, params).then((res) => {
    if (!res.rows[0]) {
      // console.log(`there is no user with ${email}`);
      return null;
    } else {
      console.log(res.rows[0]);
      return res.rows[0];
    }
  });

  // let user = process.argv[2]
  //
  // .then(res => res.rows);

  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT *   
  FROM users
  WHERE id = $1
  `;
  const params = [id];
  return pool.query(queryString, params).then((res) => {
    if (!res.rows[0]) {
      // console.log(`there is no user with ${id}`);
      return null;
    } else {
      // console.log(res.rows[0])
      return res.rows[0];
    }
  });

  // return Promise.resolve(users[id]);
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
  INSERT INTO users(name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const params = [user.name, user.email, user.password];
  return pool.query(queryString, params).then((res) => {
    if (!res.rows[0]) {
      // console.log(`there is no user with ${id}`);
      return null;
    } else {
      // console.log(res.rows[0])
      return res.rows[0];
    }
  });
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**  const params = [`%${guest_id}%`];
  return pool.query(queryString, params).then((res) => {
    if (!res.rows[0]) {
      // console.log(`there is no user with ${id}`);
      return null;
    } else {
      // console.log(res.rows[0])
      return res.rows[0];
    }
  });A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `;

  const params = [guest_id, limit];
  return pool
    .query(queryString, params)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      return console.log("query error:", err);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length} `;
    }
  }

  // 4
  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);

  // return pool
  //   .query(
  //     `
  // SELECT * FROM properties
  // LIMIT $1
  // `,
  //     [limit]
  //   )
  //   .then((res) => res.rows);
  // // const limitedProperties = {};
  // // for (let i = 1; i <= limit; i++) {
  // //   limitedProperties[i] = properties[i];
  // // }
  // // return Promise.resolve(limitedProperties);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
