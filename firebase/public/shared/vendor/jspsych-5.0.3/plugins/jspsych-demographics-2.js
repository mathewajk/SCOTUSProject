/**
 * jspsych-demographics-2
 *
 * Plugin for displaying a demographic questionnaire
 *
 *
 **/

jsPsych.plugins["demographics-2"] = (function() {

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
        <h1>Demographic Information (Cont.)</h1>
        <p class="lead">Please complete this short questionnaire about your background before beginning the experiment. Please answer the questions accurately.</p>
      </div>
      <div class="container">
      <form>
        <div class="form-group">
          <label for="Headphones" class="col-form-label">1. What kind of headphones are you using? <span style="color: magenta;">*</span></label>
          <div id="error-Headphones" class="form-error"></div>
          <div>
            <input type="text" class="col-sm-3 form-control" class="form-control" name="Headphones" id="Headphones" placeholder="" required="required">
          </div>
        </div>
        <div class="form-group">
        <label for="BirthState" class="col-form-label">2. In which state did you grow up (i.e. from birth through age 12)? <span style="color: magenta;">*</span></label>
        <div id="error-BirthState" class="form-error"></div>
          <select style="width: 200px;" class="form-control" id="BirthState" name="BirthState" required="required">
              <option value="">Please select...</option><option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="District Of Columbia">District Of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="MD">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>
          </select>
          <small class="form-text text-muted">
            If you have lived in multiple states, try to choose the one you spent the most time in.
          </small>
        </div>
        <div class="form-group">
          <label for="CurrentState" class="col-form-label">3. In which state do you currently reside? <span style="color: magenta;">*</span></label>
          <div id="error-CurrentState" class="form-error"></div>
          <select style="width: 200px;" class="form-control" id="CurrentState" name="CurrentState" required="required">
              <option value="">Please select...</option><option value="Alabama">Alabama</option><option value="Alaska">Alaska</option><option value="Arizona">Arizona</option><option value="Arkansas">Arkansas</option><option value="California">California</option><option value="Colorado">Colorado</option><option value="Connecticut">Connecticut</option><option value="Delaware">Delaware</option><option value="District Of Columbia">District Of Columbia</option><option value="Florida">Florida</option><option value="Georgia">Georgia</option><option value="Hawaii">Hawaii</option><option value="Idaho">Idaho</option><option value="Illinois">Illinois</option><option value="Indiana">Indiana</option><option value="Iowa">Iowa</option><option value="Kansas">Kansas</option><option value="Kentucky">Kentucky</option><option value="Louisiana">Louisiana</option><option value="Maine">Maine</option><option value="MD">Maryland</option><option value="Massachusetts">Massachusetts</option><option value="Michigan">Michigan</option><option value="Minnesota">Minnesota</option><option value="Mississippi">Mississippi</option><option value="Missouri">Missouri</option><option value="Montana">Montana</option><option value="Nebraska">Nebraska</option><option value="Nevada">Nevada</option><option value="New Hampshire">New Hampshire</option><option value="New Jersey">New Jersey</option><option value="New Mexico">New Mexico</option><option value="New York">New York</option><option value="North Carolina">North Carolina</option><option value="North Dakota">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="Oregon">Oregon</option><option value="Pennsylvania">Pennsylvania</option><option value="Rhode Island">Rhode Island</option><option value="South Carolina">South Carolina</option><option value="South Dakota">South Dakota</option><option value="Tennessee">Tennessee</option><option value="Texas">Texas</option><option value="Utah">Utah</option><option value="Vermont">Vermont</option><option value="Virginia">Virginia</option><option value="Washington">Washington</option><option value="West Virginia">West Virginia</option><option value="Wisconsin">Wisconsin</option><option value="Wyoming">Wyoming</option>
          </select>
        </div>
        <fieldset class="form-group">
          <label>4. Do you speak, or have you studied, any languages other than English? <span style="color: magenta;">*</span></label>
          <div id="error-ForeignLanguages" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="ForeignLanguages" id="ForeignLanguages1" value="Yes" required="required">
              Yes
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="ForeignLanguages" id="ForeignLanguages2" value="No" required="required">
              No
            </label>
          </div>
        </fieldset>
        <div class="form-group">
          <label for="ForeignLanguagesText" class="col-form-label">If "yes", please list the languages you speak or have studied here.</label>
          <div>
            <input type="text" class="form-control" name="ForeignLanguagesText" id="ForeignLanguagesText" placeholder="">
          </div>
        </div>
        <fieldset class="form-group">
          <legend class="col-form-legend">5. Are you left-handed or right-handed? <span style="color: magenta;">*</span></legend>
          <div id="error-Handedness" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Handedness" id="Handedness1" value="Left-handed" required="required">
              Left-handed
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Handedness" id="Handedness2" value="Right-handed" required="required">
              Right-handed
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Handedness" id="Handedness3" value="Both" required="required">
              Comfortable with both hands
            </label>
          </div>
        </fieldset>
        <fieldset class="form-group">
          <label>6. Have you had any musical training? <span style="color: magenta;">*</span></label>
          <div id="error-MusicalTraining" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="MusicalTraining" id="MusicalTraining1" value="Yes" required="required">
              Yes
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="MusicalTraining" id="MusicalTraining2" value="No" required="required">
              No
            </label>
          </div>
        </fieldset>
        <div class="form-group">
          <label for="MusicalTrainingText" class="col-form-label">If "yes", for which instruments or techniques?</label>
          <div>
            <input type="text" class="form-control" name="MusicalTrainingText" id="MusicalTrainingText" placeholder="">
          </div>
        </div>
        <div class="form-group">
          <label for="MusicalTrainingYears" class="col-form-label">And for how many years?</label>
          <div>
            <input type="text" class="form-control" name="MusicalTrainingYears" id="MusicalTrainingYears" placeholder="">
          </div>
        </div>
        <div class="form-group">
          <label for="FriendsGeneral" class="col-form-label">7. Please list the first names of individuals whom you contact with varying degrees of frequency. <span style="color: magenta;">*</span></label>
          <div id="error-FriendsGeneral" class="form-error"></div>
            <input type="text" class="form-control" name="FriendsGeneral" id="FriendsGeneral" placeholder="" required="required">
        </div>
        <div class="form-group">
          <label for="FriendsClose" class="col-form-label">8. Please list the first names of individuals whom you rely on for advice and/or help at the personal level. <span style="color: magenta;">*</span></label>
          <div id="error-FriendsClose" class="form-error"></div>
          <input type="text" class="form-control" name="FriendsClose" id="FriendsClose" placeholder="" required="required">
        </div>
        <fieldset class="form-group">
          <legend class="col-form-legend">9. Please select your highest educational attainment. <span style="color: magenta;">*</span></legend>
          <div id="error-EducationLevel" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel1" value="Doctoral degree" required="required">
              Doctoral degree
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel2" value="Professional degree" required="required">
              Professional degree
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel3" value="Master's degree" required="required">
              Master's degree
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel4" value="Bachelor's degree" required="required">
            Bachelor's degree
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel5" value="Associate's degree" required="required">
              Associate's degree
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel6" value="Some college" required="required">
              Some college
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel7" value="Graduated high school" required="required">
              Graduated high school
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel8" value="Some high school" required="required">
              Some high school
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="EducationLevel" id="EducationLevel9" value="No high school-level education" required="required">
              No high school-level education
            </label>
          </div>
        </fieldset>
        <fieldset class="form-group">
          <legend class="col-form-legend">10. What is your race or ethnicity? <span style="color: magenta;">*</span></legend>
          <div id="error-Ethnicity" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity1" value="African American" required="required">
              African American
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity2" value="American Indian or Native American" required="required">
              American Indian or Native American
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity3" value="Asian" required="required">
              Asian
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity4" value="Hispanic or Latinx" required="required">
              Hispanic or Latinx
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity5" value="Native Hawai'ian or Pacific Islander" required="required">
              Native Hawai'ian or Pacific Islander
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity6" value="White" required="required">
              White
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Ethnicity" id="Ethnicity7" value="Other"" required="required">
              Other
            </label>
          </div>
        </fieldset>
        <fieldset class="form-group">
          <legend class="col-form-legend">11. What is your annual household income? <span style="color: magenta;">*</span></legend>
          <div id="error-Income" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Income" id="Income1" value="Less than $20,000" required="required">
              Less than $20,000
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Income" id="Income2" value="Between $20,000 and $30,000" required="required">
              Between $20,000 and $30,000
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Income" id="Income3" value="Between $30,001 and $40,000" required="required">
              Between $30,001 and $40,000
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Income" id="Income4" value="Between $40,001 and $60,000" required="required">
            Between $40,001 and $60,000
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Income" id="Income5" value="Greater than $60,000" required="required">
              Greater than $60,000
            </label>
          </div>
        </fieldset>
      </form>
      </div>
    <div class="footer">
      <div class="col-sm-12 text-center">
        <button id="submit-demographics" class="btn btn-light"><i class="fa fa-check-square" aria-hidden="true"></i>
 Submit and Continue</button>
      </div>
    </div>
    `
    );

    $('#submit-demographics').on('click', function(e) {
      e.preventDefault();
      validate();
    });

    $(':required').on('click', function(e) {
      var name = $(this).attr('name');
      $('#error-' + name).html('');
      $('input[name=' + name + ']').removeAttr('invalid');
      $('input[name=' + name + ']').removeClass('is-invalid');
    });

    // store response
    var response = {
      rt: -1
    }

    var demographics = {};

    // start time
    var start_time = 0;

    // function to handle responses by the subject
    function validate() {

      var valid = true;

      _.each($(':required'), function(obj, index, list) {

        var form_element = $(obj);
        var name = form_element.attr('name');

        if((form_element.attr('type') === "radio" && $('input[name=' + name + ']:checked').length == 0) || form_element.val() === "") {
          $('#error-' + name).html('This field is required.');

          form_element.prop('invalid');
          form_element.addClass('is-invalid');

          valid = false;
        }
      });

      if(valid === false) return;

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      demographics.Headphones = $('input[name=Headphones]').val();
      demographics.BirthState = $('select[name=BirthState]').val();
      demographics.CurrentState = $('select[name=CurrentState]').val();
      demographics.ForeignLanguages = $('input[name=ForeignLanguages]:checked').val();
      demographics.ForeignLanguagesText = $('input[name=ForeignLanguagesText]').val();
      demographics.Handedness = $('input[name=Handedness]:checked').val();
      demographics.MusicalTraining = $('input[name=MusicalTraining]:checked').val();
      demographics.MusicalTrainingText = $('input[name=MusicalTrainingText]').val();
      demographics.MusicalTrainingYears = $('input[name=MusicalTrainingYears]').val();
      demographics.FriendsGeneral = $('input[name=FriendsGeneral]').val();
      demographics.FriendsClose = $('input[name=FriendsClose]').val();
      demographics.Education = $('input[name=Education]:checked').val();
      demographics.Ethnicity = $('input[name=Ethnicity]:checked').val();
      demographics.Income = $('input[name=Income]:checked').val();

      console.log(demographics);

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
        "rt": response.rt
      };

      // We want the demographic info on every line
      jsPsych.data.addProperties(demographics);

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
