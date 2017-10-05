/**
 * jspsych-demographics
 * Josh de Leeuw
 *
 * Plugin for displaying a demographic questionnaire
 *
 *
 **/

jsPsych.plugins["demographics"] = (function() {

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
        <h1>Demographic Information</h1>
        <p class="lead">Please complete this short questionnaire about your linguistic background before beginning the experiment. Please answer the questions accurately.</p>
      </div>
      <div class="container">
      <form>
        <fieldset class="form-group">
          <label for="Gender">1. What is your gender? <span style="color: magenta;">*</span></label>
          <div id="error-Gender" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Gender" id="Gender1" value="Female" required="required">
              Female
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Gender" id="Gender2" value="Male" required="required">
              Male
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="Gender" id="Gender3" value="Other" required="required">
              Other
            </label>
          </div>
        </fieldset>
        <div class="form-group">
          <label for="Age">2. What is your age? <span style="color: magenta;">*</span></label>
          <div id="error-Age" class="form-error"></div>
          <input type="text" class="form-control  col-sm-3" name="Age" id="Age" placeholder="" required="required">
        </div>
        <fieldset class="form-group">
          <label class="label-primary">3. Did you grow up in the United States? (i.e., Were you born in the United States, and did you live there through age 12?) <span style="color: magenta;">*</span></label>
          <div id="error-BornUS" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="BornUS" id="BornUS1" value="1" required="required">
              Yes
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="BornUS" id="BornUS2" value="0" required="required">
              No
            </label>
          </div>
        </fieldset>
        <div class="form-group">
          <label class="label-primary" for="LanguageCheck">4. What language was primarily spoken by you and the members of your household while you were growing up (i.e. from birth through age 12)? <span style="color: magenta;">*</span></label>
          <div id="error-LanguageCheck" class="form-error"></div>
          <select style="width: 200px;" class="form-control" id="LanguageCheck" name="LanguageCheck" required="required">
              <option value="">Choose one...</option><option value="AF">Afrikaans</option><option value="SQ">Albanian</option><option value="AR">Arabic</option><option value="HY">Armenian</option><option value="EU">Basque</option><option value="BN">Bengali</option><option value="BG">Bulgarian</option><option value="CA">Catalan</option><option value="KM">Cambodian</option><option value="ZH">Chinese (Mandarin)</option><option value="HR">Croation</option><option value="CS">Czech</option><option value="DA">Danish</option><option value="NL">Dutch</option><option value="EN">English</option><option value="ET">Estonian</option><option value="FJ">Fiji</option><option value="FI">Finnish</option><option value="FR">French</option><option value="KA">Georgian</option><option value="DE">German</option><option value="EL">Greek</option><option value="GU">Gujarati</option><option value="HE">Hebrew</option><option value="HI">Hindi</option><option value="HU">Hungarian</option><option value="IS">Icelandic</option><option value="ID">Indonesian</option><option value="GA">Irish</option><option value="IT">Italian</option><option value="JA">Japanese</option><option value="JW">Javanese</option><option value="KO">Korean</option><option value="LA">Latin</option><option value="LV">Latvian</option><option value="LT">Lithuanian</option><option value="MK">Macedonian</option><option value="MS">Malay</option><option value="ML">Malayalam</option><option value="MT">Maltese</option><option value="MI">Maori</option><option value="MR">Marathi</option><option value="MN">Mongolian</option><option value="NE">Nepali</option><option value="NO">Norwegian</option><option value="FA">Persian</option><option value="PL">Polish</option><option value="PT">Portuguese</option><option value="PA">Punjabi</option><option value="QU">Quechua</option><option value="RO">Romanian</option><option value="RU">Russian</option><option value="SM">Samoan</option><option value="SR">Serbian</option><option value="SK">Slovak</option><option value="SL">Slovenian</option><option value="ES">Spanish</option><option value="SW">Swahili</option><option value="SV">Swedish </option><option value="TA">Tamil</option><option value="TT">Tatar</option><option value="TE">Telugu</option><option value="TH">Thai</option><option value="BO">Tibetan</option><option value="TO">Tonga</option><option value="TR">Turkish</option><option value="UK">Ukranian</option><option value="UR">Urdu</option><option value="UZ">Uzbek</option><option value="VI">Vietnamese</option><option value="CY">Welsh</option><option value="XH">Xhosa</option>
          </select>
        </div>
        <fieldset class="form-group">
          <label class="label-primary">5. Do you have a history of hearing loss, language disorders, or communication disorders? <span style="color: magenta;">*</span></label>
          <div id="error-LgDisorderCheck" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="LgDisorderCheck" id="LgDisorderCheck1" value="1" required="required">
              Yes
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="LgDisorderCheck" id="LgDisorderCheck2" value="0" required="required">
              No
            </label>
          </div>
        </fieldset>
        <fieldset class="form-group">
          <label class="label-primary">6. Do you have a history of substance dependence, stroke, mental retardation, traumatic brain injury (with loss of consciousness lasting for more than one hour), multiple sclerosis, Parkinson's disease, Alzheimer's disease, Huntington's disease, schizophrenia, bipolar, autism, or ADHD, or are you currently experiencing major depression? <span style="color: magenta;">*</span></label>
          <div id="error-MentalDisorderCheck" class="form-error"></div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="MentalDisorderCheck" id="MentalDisorderCheck1" value="1" required="required">
              Yes
            </label>
          </div>
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="radio" name="MentalDisorderCheck" id="MentalDisorderCheck2" value="0" required="required">
              No
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
    var eligible = true;

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

      var age = $('input[name=Age]').val();
      if((/\D/.test(age))){
        valid = false;

        $('input[name=Age]').addClass('is-invalid');
        $('input[name=Age]').prop('invalid');

        if(!$('input[name=Age]').next().hasClass("form-error")) {
          $('input[name=Age]').after($('<div>', {
            html: 'Age must be a number.',
            class: 'form-error'
          }));
        }
      }
      else if(age < 18 || age > 40) {
        eligible = false;
      }

      if(valid === false) return;

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      demographics.Gender = $('input[name=Gender]:checked').val();
      demographics.Age = age;

      var bornUs = $('input[name=BornUS]:checked').val();
      var langCheck = $('select[name=LanguageCheck]').val();
      var lgDisorder = $('input[name=LgDisorderCheck]:checked').val();
      var mentDisorder = $('input[name=MentalDisorderCheck]:checked').val();

      console.log(bornUs);
      console.log(langCheck);
      console.log(lgDisorder);
      console.log(mentDisorder);
      console.log(age);

      if(bornUs === '0' || langCheck !== 'EN' || lgDisorder === '1' || mentDisorder === '1') {
        eligible = false;
      }

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
        "eligible": eligible
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
