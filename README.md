# SCOTUSSurveyGizmo
Shared code for SurveyGizmo testing.

## Tables

### How to make a randomized "semantic differential" question

1. From the "INSERT" panel, or at the bottom of a survey page, click "Question".
2. Choose the "Semantic Differential" question type.
3. Fill in the question title, columns, and rows as desired.
4. Click "Validation" and select "Required".
5. Click "Layout" and check "Randomize row order".

### How to copy randomization to another question

1. Make a copy of the semantic differential question you'd like to base the order on.
2. In the "Layout" tab, uncheck "Randomize row order".
3. On the same page as the new question, select "Action" from the "INSERT" panel, and select "Custom Script".
4. Paste in the following code:

```
%%table = -1; // TODO: ID of table to be randomized
%%reftable = -1; // TODO: ID of table that's being copied

sgapiSetTableOrderByTable(%%table,%%reftable);
```

Tip: You can see the IDs of individual questions by clicking "Customize" in the top right corner of the page and checking "Question IDs".

## Audio

### How to insert the name of an audio file using URL parameters