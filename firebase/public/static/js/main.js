// main.js
// Initializes and runs the experiment

var RatingPerHIT =66;

var dataHeader = "";
var sharedData = "";
var fullData = "";

// Function below is executed at run time of the HTML
$(document).ready(function() {

    var params = getAllUrlParams();

    dataHeader += 'WorkerId';
    sharedData += params.workerId;
    console.log(dataHeader + "\n" + sharedData);

    var qualityLabels = ["ScotusMasculine", "ScotusConfident", "ScotusAttractive", "ScotusAggressive", "ScotusIntelligent", "ScotusTrustworthy", "ScotusWin", "ScotusQuality"];
    
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

    $('button.browser').click(function(e){
        e.preventDefault();
        $('#browser').hide();
        $('#consent').show();
    });

    $('button.no-consent').click(function(e){
        e.preventDefault();
        $('#consent').hide();
        $('#no-consent').show();
    });

    $('button.consent').click(function(e) {
        e.preventDefault();

        $('#consent').hide();
        $('#main').show();
    });

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
    });

    $('button.btn-next-profile').click(function(e){
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

    $('button.btn-next-instruction').click(function(e){
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

        saveData(fullData, storageRef);
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