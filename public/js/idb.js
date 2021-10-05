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
// function to record & add transactions to your storewhen there is no internet connection
function saveRecord(record) {
    const transaction = db.transaction(["pending_transaction"], "readwrite");
    const storedTransactions = transaction.objectStore("pending_transaction");
    storedTransactions.add(record);
};
// function to upload all the saved transactions
function updateTransactions() {
    // variabes to access the database and get the records from the store 
    const transaction = db.transaction(["pending_transaction"], "readwrite")
    const storedTransactions = transaction.objectStore("pending_transaction")
    const getAll = storedTransactions.getAll()
    // runs function if getAll method is successfull
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json" 
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse)
                }
                const transaction = db.transaction(["pending_transaction"], "readWrite")
                const storedTransactions = transaction.objectStore("pending_transaction")
                storedTransactions.clear()
                alert("All saved transactions have been submitted")
            })
            .catch(err => {
                console.log(err)
                response.status(400).json(err)
            });
        };
    };
};

// Add event listener for when the user re-establishes a connection
window.addEventListener("online", updateTransactions)