var UserSQL = {
    insert:'INSERT INTO users(user,pass) VALUES(?,?)',
    queryALl:'SELECT * FROM Users',
    getUserById:'SELECT * FROM users WHERE user = ? AND pass = ? LIMIT 1',
};

module.exports = UserSQL;
