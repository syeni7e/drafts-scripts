const tpContext = 'Context';
const toDoHeadStart =
    tpContext + ': Recurring Heading, calender week gets appended';
const permanentTags = [tpContext.toLowerCase(), 'recurring', 'tags'];

// zuletzt erzeugtes isc-todo auswählen
const [lastWeek] = Draft.query(
    toDoHeadStart,
    'inbox',
    permanentTags,
    [],
    'created',
    true,
);
const [, ...content] = lastWeek.content.split('\n');

// neues dokument anlegen
const newWeek = Draft.create();
newWeek.languageGrammar = 'Taskpaper';
const timestamp = new Date();
// %V ist die ISO-Woche mit führender 0, %Y das (vierstellige) Jahr
[
    ...permanentTags,
    'kw' + strftime(timestamp, '%V'),
    strftime(timestamp, '%Y'),
].forEach(tag => newWeek.addTag(tag));
// den alten Content in Zeilen zerlegen, diese durchgehen
const heading = [toDoHeadStart, strftime(timestamp, '%V/%Y')].join(' ');
// erledigte tasks löschen (momentan bleiben die kommentare und projekte noch erhalten...)
const newContent = content.filter(line => !line.includes('@done'));
newWeek.content = [heading, ...newContent].join('\n');
newWeek.update();

// altes dokument ins archiv
lastWeek.isArchived = true;
lastWeek.update();

// jetzt noch die id in icloud speichern
uuid = newWeek.uuid;
app.openURL(
    'copied://x-callback-url/save?text=' +
        uuid +
        '&x-success=drafts5://open?uuid=' +
        uuid,
);

// uuid auch in der icloud speichern
const fmCloud = FileManager.createCloud();
fmCloud.writeString(`./${tpContext.toLowerCase()}.uuid`, uuid);
