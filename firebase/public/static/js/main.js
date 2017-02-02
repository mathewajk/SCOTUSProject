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

/* jsPsych data */

var params = getAllUrlParams();
var workerId = params.workerId;
var part = params.part;
if(workerId == undefined || workerId == "")
    workerId = "TEST";
if(part == undefined || part == "")
    part = '0';

var code = 'TURK' + jsPsych.randomization.randomID(10);
var dataRef = storageRef.child('production_pilot1/' + workerId + '.csv');
console.log("Worker ID: " + workerId + "\nCode:      " + code);


/* Generic blocks */

var welcome_block = {
    type: "text",
    text: '<p>Thank you for doing our study!</p><p>This study has multiple sections. Each section is only a few minutes long. In between sections, you can take short breaks if you need to, but please do not take breaks within a section. When you are ready to begin, please press the <b>space bar</b>.</p>',
    choices: [' ']
};

/* Generic end block for the other sections */
var end_block = {
    type: "text",
    choices: [' '],
    text: "<p>You have finished this section. You can take a short break now if you want to.</p><p>Please press the <b>space bar</b> when you are ready to continue.</p>",
    on_finish: function(data){ 
        saveData(jsPsych.data.getDataAsCSV({record: true}), dataRef);
    }
};

var end_block_final = {
    type: "text",
    choices: [' '],
    text: "<p>You have finished the final section. <p>Please press the <b>space bar</b> to proceed to the final page, where you will receive your survey code.</p>",
    on_finish: function(data){ 
        saveData(jsPsych.data.getDataAsCSV({record: true}), dataRef);
    }
};

var end_block_practice = {
    type: "text",
    choices: [' '],
    text: "<p>You have finished the practice section.</p><p>Please press the <b>space bar</b> when you are ready to continue.</p>"
};

var final_block = {
    type: "text",
    choices: [' '],
    text: function(){
        return "<p>You have finished the experiment! Your responses have been saved.</p><p>Your survey code is <b>" + code + "</b>. Please enter this code into your HIT. You may then close this window.</p><p>If you have any questions or concerns, feel free to contact the lab at <a href='mailto:phonlab@gmail.com'>phonlab@gmail.com</a>.";
    }
}

var audio_test_block = {
    timeline: [{
        type: "text",
        choices: ['1', '0'],
        text: '<p>The following section requires you to listen to some audio clips. ' + 
              'Please put on your headphones now if you have not yet done so.<br/>' +
              'You can use this audio clip to adjust your volume:</p>' + 
              '<p><audio controls="controls" preload="auto">' + 
              '<source src="http://hum.uchicago.edu/phonlab/MTURKTASKS/VAS/practice_be300_33.wav" type="audio/wav" />[NOT SUPPORTED]</audio></p>' +  
              '<br/><br/><p><b>Have you put on your headphones?</b><br/>' + 
              'Press <b>1</b> for "yes" and <b>0</b> for "no".</p>',
        timing_post_trial: 1000
        }],
    loop_function: function(data){
        if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('m') == data[0].key_press)
            return true;
        else 
            return false;
    }
};

var main_blocks;
if(part == '1') {
    main_blocks = [
        {type: 'hearingTest', section: -1, practice: false, audio: true, generator: generateAudio},
        {type: 'duration', section: -1, practice: true, audio: true, generator: generateAudio},
        {type: 'duration', section: -1, practice: false, audio: true, generator: generateAudio},
        {type: 'ravenA', section: -1, practice: false, audio: false, generator: generateMultichoice},
        {type: 'frequency', section: -1, practice: true, audio: true, generator: generateAudio},
        {type: 'frequency', section: -1, practice: false, audio: true, generator: generateAudio}
    ];
}
else if(part == '2'){
    main_blocks  = [
        {type: 'hearingTest', section: -1, practice: false, audio: true, generator: generateAudio},
        {type: 'AQ', section: 0, practice: false, audio: false, generator: generateLikert},
        {type: 'cueWeighting', section: -1, practice: true, audio: true, generator: generateAudio},
        {type: 'cueWeighting', section: 0, practice: false, audio: true, generator: generateAudio},
        {type: 'AQ', section: 1, practice: false, audio: false, generator: generateLikert},
        {type: 'cueWeighting', section: 1, practice: false, audio: true, generator: generateAudio},
        {type: 'AQ', section: 2, practice: false, audio: false, generator: generateLikert},
        {type: 'cueWeighting', section: 2, practice: false, audio: true, generator: generateAudio},
        {type: 'AQ', section: 3, practice: false, audio: false, generator: generateLikert},
        {type: 'cueWeighting', section: 3, practice: false, audio: true, generator: generateAudio},
        {type: 'AQ', section: 4, practice: false, audio: false, generator: generateLikert},
        {type: 'cueWeighting', section: 4, practice: false, audio: true, generator: generateAudio},
        {type: 'big5', section: -1, practice: false, audio: false, generator: generateLikert}
    ];
}
else {
    main_blocks = [];
}

/* Experiment */

/* Holds the experiment structure */
var experiment_blocks = [];

/* Initial statements */
experiment_blocks.push(welcome_block);

for(var i = 0; i < main_blocks.length; i++) {
    if(main_blocks[i].audio)
        if(i == 0 || !main_blocks[i-1].practice)
            experiment_blocks.push(audio_test_block);
    experiment_blocks.push(main_blocks[i].generator(main_blocks[i].type, main_blocks[i].section, main_blocks[i].practice));
    if(main_blocks[i].practice)
        experiment_blocks.push(end_block_practice);
    else if(i != main_blocks.length - 1)
        experiment_blocks.push(end_block);
}

experiment_blocks.push(end_block_final);
experiment_blocks.push(final_block);

$( document ).ready(function() {
    $('#progress-bar').hide();
    $('#jspsych-target').hide();
    $('#no-consent').hide();
    $('#demographics').hide();
    $('#consent').hide();

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
        $('#header').hide();
        $('#progress-bar').show();
        $('#jspsych-target').show();

        /* Initialize experiment */
        jsPsych.init({
            timeline: experiment_blocks,
            show_progress_bar: true,
        });

        /* Append data */
        jsPsych.data.addProperties({
            workerId: workerId,
            code: code
        });
    });
});