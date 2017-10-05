/**
 * jspsych-consent
 * Josh de Leeuw
 *
 * Plugin for displaying a consent form
 *
 *
 **/

jsPsych.plugins["consent"] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    // default trial parameters
    trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
    trial.requirements = trial.requirements || '{{REQUIREMENTS_APPEAR_HERE}}. '
    trial.purpose = trial.purpose || '{{PURPOSE_APPEARS_HERE}}. '
    trial.procedures = trial.procedures || '{{PROCEDURES_APPEAR_HERE}}. '
    trial.compensation = trial.compensation || '{{EXPERIMENT_COMPENSATION}}'
    trial.name = trial.name || '{{RESEARCHER_NAME}}'
    trial.address = trial.address || '{{RESEARCHER_ADDRESS}}'
    trial.phone = trial.phone || '{{RESEARCHER_PHONE}}'
    trial.email = trial.email || '{{RESEARCHER_EMAIL}}'

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    // consent_element holds the title, form, and buttons.
    consent_element = $('<div>', {
        class: '',
        id: 'consent',
    });

    // consent_block holds the actual text of the consent form
    consent_block = $('<div>', {
      class: ''
    });

    display_element.append($('<div>', {
      class: 'header'
    }).append($('<h1>', {
      class: 'title',
      html: 'We need your consent to proceed.'
    })).append($('<p>', {
      class: 'lead',
      html: trial.requirements + 'The results of this experiment may be summarized in scientific publications. Before you agree to participate, please read the terms under which you consent to participate.'
    })));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Introduction'
    }));
    consent_block.append($('<p>', {
      html: 'The Department of Linguistics of the University of Chicago is carrying out a research study to ' + trial.purpose + 'The researcher is Dr. Alan Yu (Professor of Linguistics).'
    }));
    consent_block.append($('<p>', {
      html: 'You are invited to take part in this research study. Before you decide to be a part of this study, you need to understand the risks and benefits. This consent form provides information about the research study. This process is known as informed consent. Your decision to take part in the study is voluntary. You are free to choose whether or not you will take part in the study.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Procedures'
    }));
    consent_block.append($('<p>', {
      html: trial.procedures
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Compensation'
    }));
    consent_block.append($('<p>', {
      html: trial.compensation
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Risks'
    }));
    consent_block.append($('<p>', {
      html: 'Your participation poses minimal risks to you. Your answers will be kept confidential and your responses will not be linked to you personally; they will be reported as a group.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Benefits'
    }));
    consent_block.append($('<p>', {
      html: 'There is no immediate benefit to you. A better understanding of the speech perception and production may help identify potential obstacles in first/second language acquisition, which in turn may help improving language teaching pedagogy.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Confidentiality'
    }));
    consent_block.append($('<p>', {
      class: 'mb-4',
      html: 'The information in the study records will be kept confidential. Data will be stored securely and will be made available only to persons conducting the study unless participants specifically give permission in writing to do otherwise. No reference will be made in oral or written reports which could link participants to the study.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Contact'
    }));
    consent_block.append($('<div>', {
      html: '<p>If you have questions about this research, you can contact ' + trial.name + ' via any of the following methods:</p>' +
            '<div class="row contact-info"><div class="col-2 text-right">Mailing address:</div><div class="col-10">' + trial.address + '</div></div>' +
            '<div class="row contact-info"><div class="col-2 text-right">Phone:</div><div class="col-10">' + trial.phone + '</div></div>' +
            '<div class="row contact-info"><div class="col-2 text-right">Email:</div><div class="col-10">' +
            '<a href="mailto:' + trial.email + '">' + trial.email + '</a></div></div>'
    }));
    consent_block.append($('<div>', {
      html: `<p>If you have any questions about your rights as a participant in this research,
        you can contact the following office at the University of Chicago:</p>
        <div class="row contact-info"><div class="col-2 text-right">Mailing address:</div>
        <div class="col-10">Social & Behavioral Sciences Institutional Review Board, University of Chicago, 1155 E. 60th street, Room 418, Chicago IL 60637</div></div>
        <div class="row contact-info"><div class="col-2 text-right">Phone:</div><div class="col-10">(773) 834-7835</div></div>
        <div class="row contact-info"><div class="col-2 text-right">Email:</div><div class="col-10">
        <a href="mailto:sbs-irb@uchicago.edu">sbs-irb@uchicago.edu</a></div></div>`
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Refusal or withdrawal of participation'
    }));
    consent_block.append($('<p>', {
      class: 'mb-4',
      html: 'Your participation in this study is voluntary; you may decline to participate without penalty. If you decide to participate, you may withdraw from the study at any time without penalty and without loss of benefits to which you are otherwise entitled. If you withdraw from the study before data collection is completed your data will be returned to you or destroyed.'
    }));

    button_container = $('<div>', {
      class: 'd-flex justify-content-around'
    });

    button_container.append($('<div>', {
      class: 'p-2'
    }).append($('<button>', {
        class: 'row-md-3 btn btn-light',
        html: '<span class="fa fa-check" aria-hidden="true"></span> Yes, I would like to proceed with this study.'
      })
      .on('click', function(e) {
        handle_response(true);
      })));
    button_container.append($('<div>', {
      class: 'p-2'
    }).append($('<button>', {
        class: 'row-md-3 btn btn-light',
        html: '<span class="fa fa-ban" aria-hidden="true"></span> No thanks, I do not want to do this study.'
      })
      .on('click', function(e) {
        handle_response(false);
      })));

    consent_element.append(consent_block);
    consent_element.append($('<div>', {
      class: 'footer text-center'
    }).append($('<p>', {
      class: 'lead',
      html: `<i>By participating in this experiment, I confirm that I meet its requirements
      and that I understand the purpose of the research, the study procedures that I will undergo, and
      the possible risks and discomforts and/or benefits that I may experience.
      I have read and understand these terms of consent. Therefore, I agree to give my consent
      to participate as a subject in this research project.</i><hr class="style-eight" />`
    })).append(button_container));

    display_element.append(consent_element);

    // store response
    var response = {
      rt: -1,
      button: -1
    };

    // start time
    var start_time = 0;

    // function to handle responses by the subject
    function handle_response(consented) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      trial.consented = consented;

      end_trial();
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "consented": trial.consented
      };

      // clear the display
      display_element.html('');

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // start timing
    start_time = Date.now();
  };

  return plugin;
})();
