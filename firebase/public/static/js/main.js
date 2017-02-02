// main.js
// Initializes and runs the experiment

// TODO: write CSV helper functions
// TODO: cleanup

// Firebase params
var config = {
    apiKey: "AIzaSyBH6Dbghznz51BUaW_OcQNGoCB5pE2jQ9I",
    databaseURL: "https://utoronto-scripts.firebaseio.com/",
    storageBucket: "gs://utoronto-scripts.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();

var params = getAllUrlParams();

// Hold/format response data
var dataHeader = 'WorkerId';
var sharedData = params.workerId;
var fullData = "";

// Reference for saving CSV
var dataRef = storageRef.child('testing' + params.workerId + '.csv');

// Function below is executed at run time of the HTML
$(document).ready(function() {

    if(!checkWorker(params.workerId)) {
        $('#browser').hide();
        $('#error').show();
        return 0;
    }

    var surveyCode = guid();
    console.log(surveyCode);
    $("#insert-code").html('TURK' + surveyCode);;

    // Generate HTML
    //generateQuestions(qualities, polarities, params);
    
    // Set up callbacks
    $('button.browser').click(onBrowserNext);
    $('button.no-consent').click(onNoConsentClicked);
    $('button.consent').click(onConsentClicked);
    
    $('button.btn-next-instruction').click(function(e) {
        e.preventDefault();

        $('#tweets-carousel').carousel('next');
        document.getElementById("ScotusAudioID1").autoplay = true;
        document.getElementById("ScotusAudioID1").load();

        dataHeader += ',TrialIndex';
        _.each(qualityLabels, function(label) {
          dataHeader += ',' + label;
        });
        dataHeader += '\n';
        fullData += dataHeader;

        saveData(fullData, dataRef);
    });

    $('button.btn-next-profile').click(function(e) {
        e.preventDefault();

        var select_boxes = $('#profile').find('select');
        var valid = true;

        _.each(select_boxes, function (box) {
            if($(box).val() == ""){
                valid = false;
            }
        })

        if(valid){
            _.each(select_boxes, function (box) {
                    dataHeader += ',' + $(box).attr("id");
                    sharedData += ',' + $(box).val();
            });

            console.log(dataHeader + '\n' + sharedData);

            $('#tweets-carousel').carousel('next'); 
        } 
        else {
               alert("Please choose an option for each question before continuing.");
        }  
    });

    // Bootstrap Carousel implementation
    $.fn.carousel.Constructor.prototype.keydown = function () {}

    $('input[type=radio]').change(function(){ 
        var name = $(this).attr('name');
        var new_value = $(this).val();
        var select = $('select#' + name);
        select.val(new_value);
    });

    $('#tweets-carousel').on('slide.bs.carousel', function (e) {
        var current_slide = $(e.relatedTarget);
        var next_button = current_slide.find('button:first');
        var timeout_length = current_slide.data('timeout-length');
    });

    
    $('button.btn-next-carousel').click(function(e){
        e.preventDefault();
        $('#tweets-carousel').carousel('next');
    })

    $('#submitButton').appendTo($('div#submit-button-container'));

    // Validation for rating questions
    $('button.btn-next-tweet').click(function(e){
        e.preventDefault();

        var buttonName = $(this).attr('name');
        currentQuestion = parseInt(buttonName, 10);
        nextQuestion = currentQuestion+1;

        var validf = true;
        _.each(qualityLabels, function(label) {
            var radio_name = label + buttonName;
            if(!$('input[name=' + radio_name + ']').is(':checked'))
                validf=false;
        });

        if(validf){ // If all questions have been answered
            var trialData = ',' + currentQuestion;
            _.each(qualityLabels, function(label) {
                var radio_name = label + buttonName;
                trialData += ',' + $('input[name=' + radio_name + ']:checked').val();
            });
            fullData += sharedData + trialData + '\n';
            console.log(fullData);

            if(currentQuestion % 11 == 0) { // Save data every 1/6 of the way
                saveData(fullData, dataRef);
                if(currentQuestion == 66) { // If they're done, add them to the database
                    addWorker(workerId, 1);
                }
            }

            $('#tweets-carousel').carousel('next'); // Goto next question
            if(name != String(RatingPerHIT)){
                document.getElementById("ScotusAudioID" + nextQuestion).autoplay = true;
                document.getElementById("ScotusAudioID" + nextQuestion).load();
            }
        } 
        else { // Wait for answers
            alert("Please answer all of the questions.");
        }
    });
});