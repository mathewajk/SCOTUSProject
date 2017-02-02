$.getJSON("static/js/workerIds.json", function(json) {
    _.each(Object.keys(json.workers), function(worker) {
    	writeUserData(worker);
    });
});

/* Firebase initialization */
var config = {
    apiKey: "AIzaSyBH6Dbghznz51BUaW_OcQNGoCB5pE2jQ9I",
    databaseURL: "https://utoronto-scripts.firebaseio.com/",
    storageBucket: "gs://utoronto-scripts.appspot.com"
};

firebase.initializeApp(config);
var database = firebase.database();

function addWorker(workerId) {
    var tokenRef = database.ref('workers/' + workerId);
    tokenRef.set({
        complete : 1
    });
    console.log("Added" + workerId + " to database with completion value 1.");
}