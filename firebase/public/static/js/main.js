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
    // Generate HTML
    
    generateQuestions(qualities, polarities, params);
    
    // Set up callbacks
    $('button.browser').click(onBrowserNext);
    $('button.no-consent').click(onNoConsentClicked);
    $('button.consent').click(onConsentClicked);
    $('button.btn-next-profile').click(onProfileNext);
    $('button.btn-next-instruction').click(onInstructionsNext);

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

        var name = $(this).attr('name');
        name_next = parseInt(name, 10);
        name_next = name_next+1;
        var validf = true;

        _.each(qualityLabels, function(label) {
            var radio_name = label + name;
            if(!$('input[name=' + radio_name + ']').is(':checked'))
                validf=false;
        });

        if(validf){ // If all questions have been answered
            var trialData = '';
            trialData += ',' + (name_next - 1);
            _.each(qualityLabels, function(label) {
                var radio_name = label + name;
                trialData += ',' + $('input[name=' + radio_name + ']:checked').val();
            });
            fullData += sharedData + trialData + '\n';
            console.log(fullData);

            $('#tweets-carousel').carousel('next'); // Goto next question
            if(name != String(RatingPerHIT)){
                document.getElementById("ScotusAudioID" + name_next).autoplay = true;
                document.getElementById("ScotusAudioID" + name_next).load();
            }
        } 
        else { // Wait for answers
            alert("Please answer all of the questions.");
        }
    });
});