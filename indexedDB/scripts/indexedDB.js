// This is what our customer data looks like.
const users = [
    { phone: "+18888888881", name: "Bill Gate", age: 35, email: "billgate1@example.com" },
    { phone: "+19999999991", name: "Donna Roy", age: 32, email: "donnaroy2@example.com" }
];

const DBName = "default_DB";
const version = 1;
let DB = null;
let request = indexedDB.open(DBName, version);

request.onsuccess = function (event) {
    console.log('DB is opened successFully');
    DB = event.target.result;

    // Store values in the newly created objectStore.
    // addNewUsers(users);
};

request.onerror = function (event) {
    console.log('Error in opening DB');
    console.error("Database error: " + event.target.error);
};

request.onupgradeneeded = function (event) {
    console.log('On upgrade needed called');
    DB = event.target.result;

    const objectStore = DB.createObjectStore(["USERS_data"], { autoIncrement: true });

    // var myIDBIndex = objectStore.createIndex(indexName, keyPath, objectParameters);
    objectStore.createIndex("email", "email", { unique: true });
    objectStore.createIndex("phone", "phone", { unique: true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("age", "age", { unique: false });

    // Use transaction oncomplete to make sure the objectStore creation is 
    // finished before adding data into it.
};


let addNewUsers = (users) => {

    let transaction = DB.transaction("USERS_data", "readwrite");
    let USERS_data_ObjectStore = transaction.objectStore("USERS_data");

    users.forEach( (user, index) => {
        let req = USERS_data_ObjectStore.add(user);
        req.onsuccess =  () => console.error(`${index} data Added`);
        req.onerror = event => console.error(event.target.error);
    });

    transaction.oncomplete = () => console.log("All done!");
    // transaction.onerror = event =>  console.log(event.target.error);
}