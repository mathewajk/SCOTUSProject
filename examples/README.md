# Survey Gizmo Examples

These are obsolete now that we have switched to Firebase post- SG's changes to its pricing model.

## Tables

### How to make a randomized "semantic differential" question

1. From the "INSERT" panel, or at the bottom of a survey page, click "Question".
2. Choose the "Semantic Differential" question type.
3. Fill in the question title, columns, and rows as desired.
4. Click "Validation" and select "Required".
5. Click "Layout" and check "Randomize row order".

### How to copy randomization to another question

1. Make a copy of the semantic differential question you'd like to base the order on.
2. In the "Layout" tab, _uncheck_ "Randomize row order".
3. On the same page, select "Action" from the "INSERT" panel, and select "Custom Script".
4. Paste in the following code:

```
%%table = -1; // TODO: ID of table to be randomized
%%reftable = -1; // TODO: ID of table that's being copied

sgapiSetTableOrderByTable(%%table,%%reftable);
```

Tip: You can see the IDs of individual questions by clicking "Customize" in the top right corner of the page and checking "Question IDs".

## Audio

### How to insert the name of an audio file using URL parameters

1. From the "INSERT" panel, or at the bottom of a survey page, click "Text/Media".
2. On the "Layout" tab, deselect "Automatically verify and fix this question's HTML".
3. Paste the following code into the "Text/Instructions" field under the "Media" tab:

```
<center>
<p><audio class="insert-audio-1" controls=""> </audio></p>
</center>
```

4. On the same page, select "Action" from the "INSERT" panel, and select "Custom JavaScript".
5. Paste in the following code:

```
$SG(document).ready(function(){
  	var audio1 = $SG( '.insert-audio-1' );
  	audio1.html('<source src="AUDIO_PATH_HERE' + '[url("a1")]' + '.wav"></source>');
 });
```

6. When accessing the survey, be sure to add the following to the end of the URL:

```
?a1=AUDIO_NAME_HERE
```

### How it works

By giving each audio its own class, `insert-audio-i`, we can easily access the `i`th audio player. We assign a URL param `ai` and insert this into the player's source using a combination of jQuery and SurveyGizmo's built-in method for accessing parameters.

In the code above, `audio1` is a reference to the player. Calling `html()` allows us to edit the HTML between the `<audio>` tags. There, we insert a `<source>` tag that includes the path to the audio file, the name of the audio file (referenced via SurveyGizmo's `[url("PARAM_NAME")]` format), and `.wav`. (Passing `FILE_NAME.wav` into the parameters would be needlessly redundant.) This inserts the correct audio into the correct player. Randomization can be handled through the input CSV uploaded to Mechanical Turk.