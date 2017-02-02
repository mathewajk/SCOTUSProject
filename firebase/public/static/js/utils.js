// utils.js
// Functions to facilitate Firebase actions and URL data

// Firebase params
var config = {
    apiKey: "AIzaSyBH6Dbghznz51BUaW_OcQNGoCB5pE2jQ9I",
    databaseURL: "https://utoronto-scripts.firebaseio.com/",
    storageBucket: "gs://utoronto-scripts.appspot.com"
};
firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();
var database = firebase.database();

// Save results to Firebase
function saveData(filedata, dataRef){
    console.log("Saving...");
    dataRef.putString(filedata).then(function(snapshot) {
        console.log('Progress has been saved.');
    });
}

// Check whether or not a worker has completed the experiment
function checkWorker(workerId) {
    return firebase.database().ref('workers/' + workerId).once('value').then(function(snapshot) {
        if(!snapshot.val()) {
            console.log("Not found!");
            return false;
        }
        console.log("Found!");
        if(snapshot.val().complete == 1) {
            console.log("They've done the thing!");

            $('#browser').hide();
            $('#error').show();
            
            return true;
        }
        return false;
    });
}

// Add a worker to the database with the specified completion value
function addWorker(workerId, value) {
    var tokenRef = database.ref('workers/' + workerId);
    tokenRef.set({
        complete : value
    });
    console.log("Added worker " + workerId + " with completion value " + value + ".");
}

// Update a worker's completion value
function updateStatus(workerId, value) {
    var updates = {};
    updates['workerId/' + complete] = value;
    firebase.database().ref().update(updates);
    console.log("Updated worker " + workerId + " to completion value " + value + ".");
}

// Read the URL parameters
function getAllUrlParams(url) {
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  var obj = {};
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}