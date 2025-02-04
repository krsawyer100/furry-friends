const db = require("../config/connection");

async function createFavorite(userId, petId, name, type, age, gender, size) {
    await db.query(`INSERT INTO favorites (petId, userId, name, type, age, gender, size) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [petId, userId, name, type, age, gender, size]
    );
    return findByUserId(userId);
}

async function removeFavorite(userId, petId) {
    await db.query(`DELETE FROM favorites WHERE userId=? AND petId=?`, [userId, petId]);
    return findByUserId(userId)
}

async function findByUserId(userId) {
    const [favorites] = await db.query(
        `SELECT * FROM favorites WHERE userId=?`, [userId]
    );
    return favorites
}

module.exports = {
  createFavorite,
  findByUserId,
  removeFavorite
};
