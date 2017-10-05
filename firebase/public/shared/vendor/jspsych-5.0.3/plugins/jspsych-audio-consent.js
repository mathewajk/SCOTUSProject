/**
 * jspsych-audio-consent
 * Josh de Leeuw
 *
 * Plugin for displaying an audio records release form.
 *
 *
 **/

jsPsych.plugins["audio-consent"] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    display_element.html(
      `
      <div class="header mb-4">
        <h1>Audio Records Release Form</h1>
        <p class="lead">As part of this Mechanical Turk Speech Task, you will be recording yourself speaking a sentence in English. We would like you to indicate below what uses of this recording you are willing to consent to. This is completely up to you. We will only use the records in ways that you agree to.</p>
      </div>
      <div class="container">
      <form>
        <fieldset class="form-group row consent">
          <label for="consent-1" class="form-label">1. Do we have permission to record you?</label>
          <div class="col-10">
            <div class="form-check">
              <label class="form-check-label">
              <input type="radio" class="form-check-input" name="consent-1" value="1">
                Yes
              </label>
              </div>
          </div>
          <div class="col-10">
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="consent-1" value="0">
                No
              </label>
            </div>
          </div>
        </fieldset>
          <div class="form-group row">
              <label class="form-label row-md-12">2. The audio recordings can be studied by the research team for use in the research project.</label>
          </div>
          <div class="form-group row">
              <label class="form-label row-md-12">3. The audio recordings can be used for publications.</label>
          </div>
          <div class="form-group row">
              <label class="form-label row-lg-12">4. The audio recordings can be used by people interested in learning about English pronunciation for non-commercial purposes. (Recordings will never be used for commercial purposes.)</label>
          </div>
          <div class="form-group row">
              <label class="form-label row-md-12">5. The audio recordings can be archived.</label>
          </div>
          <div class="form-group row">
              <label class="form-label row-md-12">6. The audio recordings can be used in a multimedia publically available web-accessible database.</label>
          </div>
        <fieldset class="form-group row consent">
          <label for="consent-2" class="form-label">7. Once again, do we have permission to record you?</label>
          <div class="col-10">
            <div class="form-check">
              <label class="form-check-label">
              <input type="radio" class="form-check-input" name="consent-2" value="1">
                Yes
              </label>
            </div>
            </div>
          <div class="col-10">
            <div class="form-check">
              <label class="form-check-label">
                <input type="radio" class="form-check-input" name="consent-2" value="0">
              No
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <div class="footer">
      <div class="d-flex justify-content-around">
        <div class="p-2">
          <button id="btn-consent" type="button" class="row-md-3 btn btn-light">
            <span class="fa fa-check" aria-hidden="true"></span>
            I would like to proceed with this study.
          </button>
        </div>
        <div class="p-2">
          <button id="btn-no-consent" type="button" class="row-md-3 btn btn-light">
            <span class="fa fa-ban"></span>
            I no longer wish to do this study.
          </button>
        </div>
      </div>
    </div>
  </div>
    `
    );

    $('#btn-consent').on('click', function(e) {
      e.preventDefault();
      validate();
    });

    $('#btn-no-consent').on('click', function(e) {
      e.preventDefault();
      endExperiment();
    });

    $('.consent').on('click', function(e) {
      console.log(this);
      if($(this).children(':last').hasClass('form-error'))
        $(this).children(':last').remove();
    });

    // store response
    var response = {
      rt: -1,
      consented: false
    }

    // start time
    var start_time = 0;

    function endExperiment() {
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      response.consented = 0;

      end_trial();

    }

    // function to handle responses when the consent button is pressed
    function validate() {

      var valid = true;
      $('.consent').each(function(i) {
        var fieldset = $(this);
        var checked = fieldset.find(':checked');
        if(checked.length == 0) {
          valid = false;
          if(!fieldset.children(':last').hasClass('form-error')) {
            fieldset.append($('<div>', {
              html: 'Please choose a response.',
              class: 'form-error'
            }));
          }
        }
        else if($(checked).val() === '0') {
          valid = false;
          if(!fieldset.children(':last').hasClass('form-error')) {
            fieldset.append($('<div>', {
              html: 'Please select "Yes" if you intend to continue the study.',
              class: 'form-error'
            }));
          }
        }
      });

      if(valid === false) return;

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      response.consented = 1;

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
        "consented": response.consented
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
