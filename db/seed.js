const {client, getAllUsers, createUser} = require('./index');  



//this function shuold call a query which drops all tables from our database
async function dropTables(){
  try {
    console.log('Starting to drop tables...');
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error dropping tables!');
    throw error; //we pass the error up to the function that calls dropTables
  }
}


//this function should call a query which creates all tables for our database
async function createTables(){
  try {
    console.log('Starting to build tables..');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
    console.log('Finished building tables!');
  } catch (error) {
    console.error('Error building tables!');
    throw error; // we are passing the error up to the function that calls createTables
  }
}


//new function should attempt to create a few different users
async function createInitialUsers() {
  try {
    console.log('Starting to create new users...');
    await createUser({username: 'albert', password: 'bertie99', name:'Albert', location:'Texas'});
    await createUser({username: 'sandra', password:'2sandy4me', name:'Sandra', location:'Texas'});
    await createUser({username: 'glamgal', password:'soglam', name:'Glamgal', location:'France'});
 
    console.log('finished creating new users!');
    
  } catch(error){
    console.error('Error creating users!');
    throw error;
  }
}

async function rebuildDB(){
  try{
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error){
    throw error;
  } 
}

async function testDB() {
  try {
    console.log('Starting to test database...');

    // const {rows} = await client.query(`SELECT * FROM users;`);
    const users = await getAllUsers();

    console.log('getAllUsers', users);
    console.log('Finished testing database!');
  } catch (error) {
    console.error('Error testing database!');
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());