const database = require('./index')

const initDatabase = async ()=>{
    await database.connect();

    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL
    )`;

    const createTokensTable = `CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        refreshToken TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`;

    const createProfilesTable = `CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        bio TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`;

    const createPostsTable = `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        profileId INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        FOREIGN KEY (profileId) REFERENCES profiles(id) ON DELETE CASCADE
    )`;

    try {
        await database.runQuery(createUsersTable);
        console.log('Table "users" checked/created successfully.');
        await database.runQuery(createTokensTable);
        console.log('Table "tokens" checked/created successfully.');
        await database.runQuery(createProfilesTable);
        console.log('Table "profiles" checked/created successfully.');
        await database.runQuery(createPostsTable);
        console.log('Table "posts" checked/created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

module.exports = initDatabase;
