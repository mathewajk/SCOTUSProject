// utils.js
// Functions to facilitate Firebase actions and URL data

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

function guid() {
  return s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
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

function generateQuestions(qualities, polarities, params) {
    var ordered_qualities = window.knuthShuffle(qualities.slice(0));

    // Randomize polarity
    // Number of elements must match the number of qualities
    // 1 = positive to negative; 0 = negative to positive
    var ordered_polarities = window.knuthShuffle(polarities.slice(0));

    // Generate HTML for each rating with Handlebars
    var context, temp;
    var source = $("#generate-html").html();
    var template = Handlebars.compile(source);
    for (var i=1;i<(RatingPerHIT + 1);i++) {
        var inputs = [];
        
        for (var j=0;j<6;j++){ // Upper bound of the loop should match number of qualities
            if (ordered_polarities[j]) {
                temp = {
                    quality: ordered_qualities[j][0],
                    qualfier1: ordered_qualities[j][2], qualfier2: ordered_qualities[j][1],
                    num: String(i),
                    rate1: "1", rate2: "2", rate3: "3", rate4: "4", rate5: "5", rate6: "6", rate7: "7"
                }
                inputs.push(jQuery.extend(true, {}, temp));
            }
            else {
                temp = {
                    quality: ordered_qualities[j][0],
                    num: String(i),
                    qualfier2: ordered_qualities[j][2], qualfier1: ordered_qualities[j][1],
                    rate1: "7", rate2: "6", rate3: "5", rate4: "4", rate5: "3", rate6: "2", rate7: "1"
                }
                inputs.push(jQuery.extend(true, {}, temp));
            }
        }

        // Create and append the HTML
        context = {num: String(i), total: String(RatingPerHIT), audio_name: audioNames[parseInt(params['a' + i], 10)], rating: inputs};
        $('#last_carousel').before(template(context));
    }
}

/******************
 * Click Handlers *
 ******************/

function onBrowserNext(e) {
  e.preventDefault();
  $('#browser').hide();
  $('#consent').show();
}

function onNoConsentClicked(e) {
  e.preventDefault();
  $('#consent').hide();
  $('#no-consent').show();
}

function onConsentClicked(e) {
  e.preventDefault();
  $('#consent').hide();
  $('#main').show();
}