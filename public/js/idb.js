// Global variables
const request = indexedDB.open("budget_tracker", 1);
//  database variable to be used later
let db;

// function to create an object to store all the pending upgrades and set an auto increment
request.onupgradeneeded = e => {
    db = e.target.result;
    db.createObjectStore("pending_transaction", { autoIncrement: true });
};
// function to run the update transactions function upon establishing a connection
request.onsuccess = e => {
    db = e.target.result
    if (navigator.onLine) {
        updateTransactions();
    }
};
//  function to log any errors
request.onerror = e => {
    console.log(e.target.errorCode);
};
