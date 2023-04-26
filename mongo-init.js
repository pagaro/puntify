db = db.getSiblingDB('puntify');

db.createUser(
    {
        user: 'api',
        pwd: 'api',
        roles: [{role: 'readWrite', db: 'puntify'}]
    }
);

db.createCollection('users')

db.users.insertMany([
    {
        email: 'toto@gmail.com',
        password: '$2b$12$RUdLXbmI.St3Rk/iIDw8q.ZicQFDavf2eJ6BGDn0pz4/82VhSNa3i',
        username: 'toto',
        admin: true,
    },
    {
        email: 'titi@gmail.com',
        password: '$2b$12$RUdLXbmI.St3Rk/iIDw8q.ZicQFDavf2eJ6BGDn0pz4/82VhSNa3i',
        username: 'titi',
        admin: false,
    }]);
