// main.js
// Initializes and runs the experiment

// TODO: write CSV helper functions
// TODO: cleanup

// Firebase params
var config = {
    apiKey: "KEY_GOES_HERE",
    databaseURL: "https://PROJECT-NAME.firebaseio.com/",
    storageBucket: "gs://PROJECT-NAME.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();

var params = getAllUrlParams();
var surveyCode = guid();

// Hold/format response data
var subjectData = []
var sharedData = {'workerId': params.workerId, 'surveyCode': surveyCode};

var d = new Date();

// Reference for saving CSV
var dataRef = storageRef.child('sample/sample-study/' + d.getDate() + d.getMonth() + d.getYear() + '/' + params.workerId + '.csv');

// Function below is executed at run time of the HTML
$(document).ready(function() {

    if(!checkWorker(params.workerId)) {
        $('#browser').hide();
        $('#error').show();
        return 0;
    }
    $("#insert-code").html('TURK' + surveyCode);

    // Generate HTML
    generateQuestions(qualities, polarities, params);

    // Set up callbacks
    $('button.browser').click(onBrowserNext);
    $('button.no-consent').click(onNoConsentClicked);
    $('button.consent').click(onConsentClicked);

    $('button.btn-next-instruction').click(function(e) {
        e.preventDefault();

        $('#tweets-carousel').carousel('next');
        document.getElementById("SRPAudioID1").autoplay = true;
        document.getElementById("SRPAudioID1").load();
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

        var birthYear = $('#ProfileYear').val();
        if(birthYear === '2000 or later' || birthYear === '1975 or earlier') {
          $('#tweets-carousel').hide();
          $('#demographic-error').show();
        }

        if(valid){
            _.each(select_boxes, function (box) {
                sharedData[$(box).attr("id")] = $(box).val();
            });
            location.href = '#top'
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
        location.href = '#top'
        $('#tweets-carousel').carousel('next');
    })

    $('#submitButton').appendTo($('div#submit-button-container'));

    // Validation for rating questions
    $('button.btn-next-tweet').click(function(e){
        e.preventDefault();

        var buttonName = $(this).attr('name');
        var currentQuestion = parseInt(buttonName, 10);
        var nextQuestion = currentQuestion + 1;

        // Add our shared data to the line
        var trialData = {}
        _.each(sharedData, function(value, key) {
            trialData[key] = value;
        });

        // Record trial number and audio name
        trialData['trialPos'] = currentQuestion;
        trialData['audioName'] = $('#SRPAudio' + currentQuestion).html();

        var validf = true;
        _.each(qualities, function(quality) {
            var radio_name = quality[0] + buttonName;
            if(!$('input[name=' + radio_name + ']').is(':checked'))
                validf=false;
            else
                trialData[quality[0]] = $('input[name=' + radio_name + ']:checked').val();
        });

        if($('input[name=region' + currentQuestion + ']:checked').length < 1) {
          validf = false;
        }
        else {
          _.each($('input[name=region' + currentQuestion + ']'), function(checkbox, num) {
            trialData[$(checkbox).val()] = 0;
          });
          _.each($('input[name=region' + currentQuestion + ']:checked'), function(checkbox, num) {
            trialData[$(checkbox).val()] = 1;
          });
        }

        if(validf){ // If all questions have been answered
            subjectData.push(trialData);
            if(currentQuestion % 8 == 0 || currentQuestion == 1) { // Save data every 8 questions
                saveData(objArrayToCSV({data: subjectData}), dataRef);
                if(currentQuestion == audioNames.length) { // If they're done, add them to the database
                    addWorker(params.workerId, 1);
                }
            }

            $('#tweets-carousel').carousel('next'); // Goto next question
            if(buttonName !== String(audioNames.length)){
                document.getElementById("SRPAudioID" + nextQuestion).autoplay = true;
                document.getElementById("SRPAudioID" + nextQuestion).load();
            }
        }
        else { // Wait for answers
            alert("Please answer all of the questions.");
        }
    });
});
