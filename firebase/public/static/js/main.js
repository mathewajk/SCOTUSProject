// main.js
// Initializes and runs the experiment

var config = {
    apiKey: "AIzaSyBH6Dbghznz51BUaW_OcQNGoCB5pE2jQ9I",
    databaseURL: "https://utoronto-scripts.firebaseio.com/",
    storageBucket: "gs://utoronto-scripts.appspot.com"
};
firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();

var RatingPerHIT =66;

// Function below is executed at run time of the HTML
$(document).ready(function() {

    // Randomize order of qualities
    var qualities = [["Attractive", "Very Attractive", "Very Unattractive"], ["Aggressive", "Very Aggressive", "Very Unaggressive"], ["Intelligent", "Intelligent", "Not Intelligent"], ["Masculine", "Very Masculine", "Not At All Masculine"], ["Trustworthy", "Trustworthy", "Not Trustworthy"], ["Confident", "Very Confident", "Very Timid"]]
    var ordered_qualities = window.knuthShuffle(qualities.slice(0));
    // ordered_qualities = ordered_qualities.slice(1,4); // select only first 3 qualities

    // Randomize polarity
    // Number of elements must match the number of qualities
    // 1 = positive to negative; 0 = negative to positive
    var polarities = [1,1,1,0,0,0]; 
    var polarity = window.knuthShuffle(polarities.slice(0));

    // Generate HTML for each rating with Handlebars
    var context, temp;
    var source = $("#generate-html").html();
    var template = Handlebars.compile(source);
    for (var i=1;i<(RatingPerHIT + 1);i++) {
        var inputs = [];
        
        for (var j=0;j<6;j++){ // Upper bound of the loop should match number of qualities
            if (polarity[j]) {
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
        context = {num: String(i), total: String(RatingPerHIT), audio_name: $("#audio" + String(i)).html(), rating: inputs};
        $('#last_carousel').before(template(context));
    }

    // Bootstrap Carousel implementation
    $.fn.carousel.Constructor.prototype.keydown = function () {}
    var q_counter = 0;

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
        if(!timeout_length){ var timeout_length = 17000};

            setTimeout(function(){
                // Change button class.
                next_button.removeClass('btn-disabled').addClass('btn-success');
                // Undisable.
                next_button.removeAttr('disabled');
            }, timeout_length);
    });

    $('button.btn-next-profile').click(function(e){
        e.preventDefault();

        var select_boxes = $('#profile').find('select');
        var valid = true;

        select_boxes.each(function(){
            if($(this).val() == ""){
                valid = false;
            }
        })

        if(valid){
            $('#tweets-carousel').carousel('next'); 
        } 
        else {
            alert("Please choose an option for each question before continuing.");
        }           
    });

    $('button.btn-next-instruction').click(function(e){
        e.preventDefault();
        $('#tweets-carousel').carousel('next');
        document.getElementById("ScotusAudioID1").autoplay = true;
        document.getElementById("ScotusAudioID1").load();
    })

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

        // Check that each quality has a response
        var radio_name = "ScotusMasculine" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusConfident" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusAttractive" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusAggressive" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusIntelligent" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusTrustworthy" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusWin" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        radio_name = "ScotusQuality" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }

        if(validf){ // If all questions have been answered
            $('#tweets-carousel').carousel('next'); // Goto next question
            if(name != String(RatingPerHIT)){
                document.getElementById("ScotusAudioID" + name_next).autoplay = true;
                document.getElementById("ScotusAudioID" + name_next).load();
            } 
        } 
        else { // Wait for answers
            alert("Please complete the questions.");
        }
    });
});