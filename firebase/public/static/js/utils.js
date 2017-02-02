// utils.js
// Functions to generate the experiment blocks

function saveData(filedata, dataRef){
    console.log("Saving...");
    dataRef.putString(filedata).then(function(snapshot) {
        console.log('Progress has been saved.');
    });
}

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

function generateAttentionTrials(num, objects) {
    var blocks = []
    for(var x = 0; x < objects.length + 1; x++) {
        var segments = []
        var colors = jsPsych.randomization.sample(["red", "blue"], num, true);
        for(var i = 0; i < num; i++) {
            console.log(colors[i]);
            segments.push({
                type: "attention",
                is_html: true,
                timeline: [{
                    stimulus: '<p><span style="font-size: 24pt; color:' + colors[i] + ';"><b>+</b></span></p>',
                    response_ends_trial: false,
                    timing_response: 500
                }, {
                    stimulus: '<p></p>',
                    prompt: '<p>What was the color of the "+" you just saw?<br/>Press <b>R</b> for <b>red</b> and <b>B</b> for <b>blue</b>.</p>',
                    data: {color: colors[i]},
                    on_finish: function(data) {
                        if(data.key_press == '82' && data.color == 'red') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else if (data.key_press == '66' && data.color == 'blue') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else {
                            jsPsych.data.addDataToLastTrial({correct: 0});
                        }
                    }
                }]
            });
        }
        blocks.push(segments);
    }
    return blocks;
}

function generateAudio(type, section, isPractice) {
    var trials = [];

    var stimuli;
    var instructions;
    var prompt = '';

    var path = experiment[type].path;
    var options = experiment[type].options;

    var timing_response_1 = experiment[type].timing_response_1;
    var timing_response_2 = experiment[type].timing_response_2;
    
    var answers = isPractice ? experiment[type].practiceAnswers : undefined;
    var response_ends_trial = experiment[type].skippable == undefined ? true : experiment[type].response_ends_trial;
    var skippable = experiment[type].skippable == undefined ? true : experiment[type].skippable;

    if(isPractice) {
        stimuli = experiment[type].practiceStimuli;
        instructions = '<p><b>This is a practice section.</b></p><br/>' + experiment[type].instructions + 
                       '</p><br/><p>To encourage quick responses, you will be given <b>three (3) seconds</b> to respond, not including the length of the audio clip.' + 
                       '<br/>In the real experiment, you will be required to respond to at least <b>80%</b> of the questions for your work to be approved.</p><br/>';
        prompt = experiment[type].prompt;
    }
    else {
        stimuli = experiment[type].stimuli;
        
        if(type != 'hearingTest')
            instructions = '<p><b>This is not a practice section.</b></p><br/>' + experiment[type].instructions + 
                       '<br/>There is no right or wrong answer, so please answer based on your first instinct.</p><br/>' + 
                       '<p>To encourage quick responses, you will be given <b>three (3) seconds</b> to respond, not including the length of the audio clip.' + 
                       '<br/>You must respond to at least <b>80%</b> of the questions for your work to be approved.</p><br/>';
        else
            instructions = experiment[type].instructions;

        if(experiment[type].always_show_prompt) {
            prompt = experiment[type].prompt == undefined ? '' : experiment[type].prompt;
        }
    }

    if(section > -1) {
        stimuli = stimuli[section];
    }

    trials.push({
        type: 'text',
        text: instructions + 
              '<p>There will be ' + stimuli.length + ' questions in this section.<br/>' + 
              'Responses will be collected via the keyboard. ' + 
              'Press <b>1</b> for "' + options[0] + '" and <b>0</b> for "' + options[1] + '".</p>' + 
              '<br/><p>Please press the <b>space bar</b> when you are ready to begin.</p>',
        choices: [' '],
        timing_post_trial: 1000
    });
    
    for(var i = 0; i < stimuli.length; i++) {
        var timeline = [];

        if(type == 'duration') {
            var temp = stimuli[i].split('_');
            timing_response_1 = parseInt(temp[1]) + parseInt(temp[2]) + 1500;
            var answer_string = '<br/><br/><br/><br/><br/><br/><br/><font color="lightgray">Press <b>1</b> for "' + options[0] + '"<br/>Press <b>0</b> for "' + options[1] + '"</font>';
        }
        else
            var answer_string = '<br/><br/><br/><br/><br/><br/><br/>Press <b>1</b> for "' + options[0] + '"<br/>Press <b>0</b> for "' + options[1] + '"';

        timeline.push({
            prompt: '<audio preload="auto" class="hidden" autoplay="autoplay"><source src="' + path + stimuli[i] + '.wav" type="audio/mp3" /> [NOT SUPPORTED]</audio>' + 
                    answer_string,
            stimulus: '<span style="font-size: 30px;">+</span>',
            response_ends_trial: response_ends_trial,
            timing_response: timing_response_1
        });
        timeline.push({
            timeline: [{
                stimulus: '<span style="font-size: 30px;"><br/></span>',
                prompt: prompt + '<br/><br/><br/><br/><br/><br/><br/>Press <b>1</b> for "' + options[0] + '"<br/>Press <b>0</b> for "' + options[1] + '"',
                choices: ['1', '0'],
                response_ends_trial: true,
                timing_response: timing_response_2
            }],
            conditional_function: function(){
                var data = jsPsych.data.getLastTrialData();
                if(data.response != '' && data.skippable){
                    jsPsych.data.addDataToLastTrial({skipped: true});
                    return false;
                } else {
                    return true;
                }
            }
        });

        trials.push({
            is_html: true,
            timeline: timeline,
            on_finish: function(data){
                var response = ''
                if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('1'))
                    response = data.options[0].toLowerCase();
                else if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode('0'))
                    response = data.options[1].toLowerCase();
                else
                    response = '';
                jsPsych.data.addDataToLastTrial({response: response});
            },
            data: {
                record: true,
                type: type,
                options: options,
                audio: stimuli[i],
                skippable: skippable,
                practice: isPractice,
                trial_num: i
            },
            choices: ['1', '0']
        });

        trials.push({
            timeline: [{
                is_html: true,
                response_ends_trial: false,
                timing_response: 500,
                stimulus: '<span style="font-size: 30px;"><br/></span>',
                prompt: '<br/><br/><br/><br/><br/><br/><br/><font color="lightgray">Press <b>1</b> for "' + options[0] + '"<br/>Press <b>0</b> for "' + options[1] + '"</font>'
            }],
            conditional_function: function(){
                var data = jsPsych.data.getLastTrialData();
                if(/*data.skipped != undefined && data.skipped &&*/ !isPractice){
                    return true;
                } else {
                    return false;
                }
            }
        });

        if(isPractice) {
            (function(i) {
                    trials.push({
                    is_html: true,
                    stimulus: function() {
                        var data = jsPsych.data.getLastTrialData();
                        console.log(data.response + ' ' + answers[i])
                        if (data.response == '')
                            return 'Try to answer more quickly!<br/><br/>Press the <b>space bar</b> to continue...';
                        else if (data.response == answers[i])
                            return 'Correct!<br/><br/>Press the <b>space bar</b> to continue...';
                        else
                            return 'Oops, not quite.<br/><br/>Press the <b>space bar</b> to continue...';
                    },
                    prompt: '<span style="font-size: 30px;"><br/></span><br/><br/><br/><br/><font color="lightgray">Press <b>1</b> for "' + options[0] + '"<br/>Press <b>0</b> for "' + options[1] + '"</font>',
                    response_ends_trial: true,
                    choices: [' ']
                });
            }(i));
        }
    }

    return {type: 'single-stim', timeline: trials, timing_post_trial: 0};
}

function generateLikert(type, section) {
    var trials = [];

    var questions = experiment[type].questions;
    var polarities = experiment[type].polarities;
    var labels = experiment[type].labels;
    if(section > -1) {
        questions = questions[section];
        polarities = polarities[section];
    }
    var instructions = experiment[type].instructions;
    
    trials.push({
        type: 'text',
        text: instructions + 
              '<br/><p>There will be ' + questions.length + ' questions in this section.<br/>' + 
              'Responses will be collected via buttons on the screen.</p>' + 
              '<br/><p>Please press the <b>space bar</b> when you are ready to begin.</p>',
        choices: [' '],
        timing_post_trial: 1000
    });

    for(var i = 0; i < questions.length; i++) {
        trials.push({
            type: 'survey-likert',
            questions: [questions[i]],
            required: [true],
            labels: labels,
            polarities: [polarities[i]],
            data: {
                record: true,
                type: type
            }
        });
    }

    return {type: 'text', timeline: trials, timing_post_trial: 0};
}

function generateMultichoice(type, section) {
    var trials = []

    var questions = experiment[type].questions;
    if(section > -1) {
        questions = questions[section];
    }
    var instructions = experiment[type].instructions;
    var labels = experiment[type].labels;

    trials.push({
        type: 'text',
        text: instructions + 
              '<br/><p>There will be ' + questions.length + ' questions in this section.<br/>' + 
              'Responses will be collected via radio buttons on the screen.</p>' + 
              '<br/><p>Please press the <b>space bar</b> when you are ready to begin.</p>',
        choices: [' '],
        timing_post_trial: 1000,
        data: {
                record: true,
                type: type
            }
    });

    for(var i = 0; i < questions.length; i++) {
        trials.push({
            type: 'survey-multi-choice',
            questions: ['<img alt="" src="http://lucian.uchicago.edu/blogs/phonlab/files/2012/09/' + questions[i] + '.gif" width="400"/>'],
            options: [labels[i]],
            required: [true],
            horizontal: true,
            data: {
                record: true,
                type: type
            }
        });
    }

    return {type: 'text', timeline: trials, timing_post_trial: 0};
}