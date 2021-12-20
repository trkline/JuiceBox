const {  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser
} = require('./index');  



//this function shuold call a query which drops all tables from our database
async function dropTables(){
  try {
    console.log('Starting to drop tables...');
    await client.query(`
      DROP TABLE IF EXISTS posts;
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
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id),
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
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
    await createUser({
      username: 'albert', 
      password: 'bertie99', 
      name:'Albert', 
      location:'Texas'
    });
    await createUser({
      username: 'sandra', 
      password:'2sandy4me', 
      name:'Sandra', 
      location:'Texas'
    });
    await createUser({
      username: 'glamgal', 
      password:'soglam', 
      name:'Glamgal',
      location:'France'
    });
 
    console.log('finished creating new users!');
    
  } catch(error){
    console.error('Error creating users!');
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();
    console.log('Starting to create posts...');
    await createPost({
      authorId: albert.id,
      title: 'How does this work??',
      content: 'This is my first post. I hope I love writing blogs as much as I like writing them.'
    });
    await createPost({
      authorId: sandra.id,
      title: 'First Post',
      content: 'Serisouly, does this even do anything?'
    });
    await createPost({
      authorId: glamgal.id,
      title: 'Living that glamgirl life.',
      content: 'Do you even? I feel l ike most of you are posing.'
    });
    console.log('Finished creating posts!');
  } catch (error){
    console.log('Error creating posts!');
    throw error;
  }
}

async function rebuildDB(){
  try{
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error){
    console.log('Error during rebuildDB.')
    throw error;
  } 
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}



rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());