const toDoHeadStart = "Recurring Heading, calender week gets appended"
const permanentTags = ["recurring", "tags"];

// zuletzt erzeugtes isc-todo auswählen
const [lastWeek] = Draft.query(
  toDoHeadStart,
  "inbox",
  permanentTags,
  [],
  "created",
  true
);
const [, ...content] = lastWeek.content.split("\n");

// neues dokument anlegen
const newWeek = Draft.create();
newWeek.languageGrammar = "Taskpaper";
const timestamp = new Date();
// %V ist die ISO-Woche mit führender 0, %Y das (vierstellige) Jahr
[
  ...permanentTags,
  // additional tags: kw + calendar week, year
  "kw" + strftime(timestamp, "%V"),
  strftime(timestamp, "%Y")
].forEach(tag => newWeek.addTag(tag));
// den alten Content in Zeilen zerlegen, diese durchgehen
const heading = [toDoHeadStart, strftime(timestamp, "%V/%Y")].join(" ");
// erledigte tasks löschen (momentan bleiben die kommentare und projekte noch erhalten...)
const newContent = content.filter(line => !line.includes("@done"));
newWeek.content = [heading, ...newContent].join("\n");
newWeek.update();

// altes dokument ins archiv
lastWeek.isArchived = true;
lastWeek.update();