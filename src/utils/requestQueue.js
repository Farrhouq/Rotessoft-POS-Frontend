import axios from "axios";
import apiClient from "../apiClient";

const dbName = "requestQueueDB";
const storeName = "requestQueue";

// Open or create IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };
  });
}

// Add request to the IndexedDB queue
async function addToQueue(request) {
  return openDB()
    .then((db) => {
      const tx = db.transaction(storeName, "readwrite");
      const queueStore = tx.objectStore(storeName);

      queueStore.add(request);

      return tx.complete;
    })
    .then(() => console.log("Request added to queue"))
    .catch((err) => console.error("Error adding request to queue:", err));
}

// Send all requests in the queue and remove successful ones
async function processQueue() {
  await openDB()
    .then((db) => {
      const tx = db.transaction(storeName, "readwrite");
      const queueStore = tx.objectStore(storeName);
      // console.log(queueStore);

      const cursorRequest = queueStore.openCursor();

      cursorRequest.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const request = cursor.value;
          // console.log(request, "is the request being done...");
          // Attempt to send the request using axios
          apiClient({
            method: request.method,
            url: request.url,
            data: request.data,
          })
            .then((response) => {
              // console.log("Request succeeded:", response);
              // Re-open the transaction for the delete operation
              const deleteTx = db.transaction(storeName, "readwrite");
              const deleteStore = deleteTx.objectStore(storeName);
              let curr = cursor.key;
              const deleteRequest = deleteStore.delete(curr);

              deleteRequest.onsuccess = function () {
                // console.log("Request deleted from queue");
                processQueue();
              };
            })
            .catch((error) => {
              if (!(error.code == "ERR_NETWORK")) {
                // console.log("Request failed, keeping in queue:", error.response);
                const deleteTx = db.transaction(storeName, "readwrite");
                const deleteStore = deleteTx.objectStore(storeName);
                let curr = cursor.key;
                const deleteRequest = deleteStore.delete(curr);

                deleteRequest.onsuccess = function () {
                  // console.log("Request deleted from queue");
                  processQueue();
                };
                console.error("Request failed, keeping in queue:", error);
              }
            });
        } else {
          // console.log("No more requests in queue");
        }
      };

      cursorRequest.onerror = function (event) {
        console.error("Cursor error:", event.target.error);
      };
    })
    .catch((err) => console.error("Error processing the queue:", err));
}

// Example function to simulate adding requests to the queue
function addRequestToQueue(method, url, data) {
  const request = { method, url, data };
  addToQueue(request).then(() => {
    // console.log("Request added:", request);
  });
}

function printQueue() {
  openDB()
    .then((db) => {
      const tx = db.transaction(storeName, "readonly");
      const queueStore = tx.objectStore(storeName);

      const allRequests = [];

      queueStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          allRequests.push(cursor.value);
          cursor.continue(); // Move to the next item
        } else {
          // No more entries
          // console.log("Current Queue:", allRequests);
        }
      };
    })
    .catch((err) => console.error("Error printing the queue:", err));
}

export { addRequestToQueue, processQueue };
