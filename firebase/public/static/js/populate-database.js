$.getJSON("static/json/workerIds.json", function(json) {
    _.each(Object.keys(json.workers), function(worker) {
        addWorker(worker, json.workers[worker]);
    });
});

/* Firebase initialization */
var config = {
    apiKey: "AIzaSyAZLQJ2Ht53jjPvQjV1RD6FmSeS64c45bs",
    databaseURL: "https://scotus-project.firebaseio.com/",
    storageBucket: "gs://scotus-project.appspot.com"
};

firebase.initializeApp(config);
var database = firebase.database();

function addWorker(workerId, value) {
    var tokenRef = database.ref('workers/' + workerId);
    tokenRef.set({
        complete : value
    });
    console.log("Added " + workerId + " to database with completion value 1.");
}