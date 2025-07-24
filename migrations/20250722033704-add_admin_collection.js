module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    await db.collection("users").insertOne({
      first_name: "Admin",
      last_name: "User",
      email: "admin@admin.com",
      password: "$2a$10$lRG.sN74CAVnSBG/1aj2V.8w1PdlqpaqEsIzGjtDJF3L8UtHmgsem",
      address: "Address",
      phone: 1111111111,
      role: 1,
    });
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});

    await db
      .collection("users")
      .deleteOne({ first_name: "Admin", last_name: "User" });
  },
};
