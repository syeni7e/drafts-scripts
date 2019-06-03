// i use this to add tasks to my weekly to-do-taskpaper
//
// text is passed from airmail via this callback (%7c is the pipe character)
// drafts5://runAction?action=addToDo&text=[message_sender_name]%7c[message_subject]%7c[message_linkback]
// uebergebenen text auslesen
const taskpaperHeadText = 'headText';
const taskpaperTags = ['recurring', 'tags'];
const [sender, subject, link] = draft.content.split('|');
// todo-notiz-finden
const tasklist = Draft.query(taskpaperHeadText, 'inbox', taskpaperTags)[0];
const { uuid, title } = tasklist;

// prompt shows sender and subject as well as an inputbox for tags
// (space-separated)
p = Prompt.create();
p.title = sender;
p.message = subject;
p.addTextField('tags', 'Tags', '', { wantsFocus: true });
p.addButton('OK', 'ok', true);
p.show();
// after submitting the values prefix tags with @ and create the final text
const tags = p.fieldValues['tags']
    .split(' ')
    .filter(text => text !== '')
    .map(text => '@' + text)
    .join(' ');
const finalText = `- ${sender}: ${subject} ${tags} @start(${Date.today().toString(
    'yyyy-MM-dd',
)}) (${link})`;
// adding to the correct to do is not done yet
const newContent = tasklist.content
    .split('\n')
    .reduce(
        (acc, line, index) =>
            index === 3 ? [...acc, finalText, line] : [...acc, line],
        [],
    );
tasklist.content = newContent.join('\n');
tasklist.update();
