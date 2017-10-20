// utils.js
// Functions to facilitate Firebase actions and URL data

/* Knuth Shuffle */
(function (exports) {
  'use strict';

  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    var currentIndex = array.length
      , temporaryValue
      , randomIndex
      ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  exports.knuthShuffle = shuffle;
}('undefined' !== typeof exports && exports || 'undefined' !== typeof window && window || global));


// Save results to Firebase
function saveData(filedata, dataRef){
    console.log("Saving...");
    dataRef.putString(filedata).then(function(snapshot) {
        console.log('Progress has been saved.');
    });
}

function objArrayToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}


// Check whether or not a worker has completed the experiment
function checkWorker(workerId) {
    return firebase.database().ref('rsp-workers/' + workerId).once('value').then(function(snapshot) {
        if(!snapshot.val()) {
            console.log("Worker not found.");
            return false;
        }
        console.log("Found!");
        if(snapshot.val().complete == 1) {
            console.log("Worker has completed the HIT.");
            $('#browser').hide();
            $('#error').show();
            return true;
        }
        console.log("Worker's completion value is not 1.");
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
    var tokenRef = database.ref('rsp-workers/' + workerId);
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

function generateQuestions(qualities, polarities) {
    var ordered_qualities = window.knuthShuffle(qualities.slice(0));

    // Randomize polarity
    // Number of elements must match the number of qualities
    // 1 = positive to negative; 0 = negative to positive
    var ordered_polarities = window.knuthShuffle(polarities.slice(0));

    // Generate HTML for each rating with Handlebars
    var context, temp;
    var source = $("#generate-html").html();
    var template = Handlebars.compile(source);

    var coin = Math.floor(Math.random() * 2) + 1;
    var die = Math.floor(Math.random() * 3) + 1;

    var s_cond = '';
    var word = '';

    if (coin === 1)
      s_cond = '_s';
    else (coin === 2)
      s_cond = '_sh';

    switch(die) {
      case 1:
        word = '_script';
        break;
      case 2:
        word = '_string';
        break;
      case 3:
        word = '_spritz';
        break;
    }

    for(i = 1; i <= 8; i++) {
      audioNames.push('00' + i + word + s_cond + '.wav');
    }

    knuthShuffle(audioNames);

    for (var i=1;i<(audioNames.length + 1);i++) {
        var inputs = [];

        for (var j=0;j<7;j++){ // Upper bound of the loop should match number of qualities
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
        context = {num: String(i), total: String(audioNames.length), audio_name: audioNames[i-1], rating: inputs};
        $('#last_carousel').before(template(context));
    }
}

/******************
 * Click Handlers *
 ******************/

function onBrowserNext(e) {
  e.preventDefault();
  location.href = '#top'
  $('#browser').hide();
  $('#consent').show();
}

function onNoConsentClicked(e) {
  e.preventDefault();
  location.href = '#top'
  $('#consent').hide();
  $('#no-consent').show();
}

function onConsentClicked(e) {
  e.preventDefault();
  location.href = '#top'
  $('#consent').hide();
  $('#main').show();
}
