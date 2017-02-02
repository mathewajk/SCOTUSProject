// main.js
// Initializes and runs the experiment

/* Firebase initialization */

/* TODO: 
 *       Add gap to all questions?
 */

var config = {
    apiKey: "AIzaSyCTN6pTd4DI-fbNFPKGCzk_MH9gkf9Y9IU",
    databaseURL: "https://phonology-lab-scripts.firebaseio.com/",
    storageBucket: "gs://phonology-lab-scripts.appspot.com"
};
firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();

var RatingPerHIT =66;

// Below is a function required by for Unique Turker
function turkGetParam( name ) {
    name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
    var regexS = "[?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

// Below function is exceuted at run time of the html
$(document).ready(function() {

    //randomize order
    var qualities = [["Attractive", "Very Attractive", "Very Unattractive"], ["Aggressive", "Very Aggressive", "Very Unaggressive"], ["Intelligent", "Intelligent", "Not Intelligent"], ["Masculine", "Very Masculine", "Not At All Masculine"], ["Trustworthy", "Trustworthy", "Not Trustworthy"], ["Confident", "Very Confident", "Very Timid"]]
    var ordered_qualities = window.knuthShuffle(qualities.slice(0)); // randomize
    //ordered_qualities = ordered_qualities.slice(1,4); // select only first 3 qualities

    //randomize polarity
    var polarities = [1,1,1,0,0,0]; //Number of elements must match the number of qualities
    //numbers of 1 and 0 decides how many rating has positive to negative and how many rating has negative to positive attribute.
    var polarity = window.knuthShuffle(polarities.slice(0)); //randomize

    //Generate HTML for each rating with Handlebars
    var context, temp;
    var source = $("#generate-html").html();
    var template = Handlebars.compile(source);
    for (var i=1;i<(RatingPerHIT + 1);i++) {
        var inputs = [];
        for (var j=0;j<6;j++){ // change number to the numbrer of qualities
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
        context = {num: String(i), total: String(RatingPerHIT), audio_name: $("#audio" + String(i)).html(), rating: inputs};
        $('#last_carousel').before(template(context));
    }

    //Unique Turker Implementation
    var ut_id = "f0b0070cc04aff49fd28cb73d09e3cdf"; //Use a new id obtained from Unique Turker for a new release
    var assignmentId = turkGetParam('assignmentId', '');
    if (assignmentId != '' && assignmentId != 'ASSIGNMENT_ID_NOT_AVAILABLE') {
        var workerId = turkGetParam('workerId', '');
        var url = '//uniqueturker.myleott.com/'+ut_id+'/'+workerId+'/'+assignmentId;
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send();
        if (request.responseText != '1' && workerId != "ADKT3VGSIZR5B") { // Change this workerId to the requester's id such that the account won't be blocked during testing
            $("#workerNotFound").hide();
            $("#beforeAccept").hide();
            $("#workerFound").show();
            $("#submitButton").hide();
        }
        else {
            $("#workerNotFound").show();
            $("#beforeAccept").hide();
            $("#workerFound").hide();
            $("#submitButton").show();
        }
    }
    else {
        $("#workerNotFound").hide();
        $("#beforeAccept").show();
        $("#workerFound").hide();
        $("#submitButton").hide();
    }
});
</script><script rel="text/javascript">


$( document ).ready(function() {
    //Bootstrap Carousel Implementation No need to
///////////////////////////////////////////////////////////////////////////// 
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
////////////////////////////////////////////////////////////////////


    // Validation for each ratings
    $('button.btn-next-tweet').click(function(e){
        e.preventDefault();

        var name = $(this).attr('name');
        name_next = parseInt(name, 10);
        name_next = name_next+1;
        var validf = true;
        // Validatoin for radio buttons for ScotusMasuline
        var radio_name = "ScotusMasculine" + name;
        if(!$('input[name=' + radio_name + ']').is(':checked')) {
            validf=false;
        }
        // Validation for radio buttons for ScotusConfident
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
        if(validf){
            $('#tweets-carousel').carousel('next');
            if(name != String(RatingPerHIT)){
                document.getElementById("ScotusAudioID" + name_next).autoplay = true;
                document.getElementById("ScotusAudioID" + name_next).load();
            } 
        } 
        else {
            alert("Please complete the questions.");
        }
    });

});