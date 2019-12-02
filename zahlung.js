const enterPayment = Prompt.create();
enterPayment.title = 'Neue Zahlung';

const paymentFields = [
    [
        'addTextField',
        [
            'betrag',
            'Betrag',
            '-',
            { keyboard: 'numbersAndPunctuation', wantsFocus: 'true' },
        ],
    ],
    [
        'addTextField',
        ['empf', 'Empfänger*in', '', { autocapitalization: 'words' }],
    ],
    ['addTextField', ['zweck', 'Zweck', '', { autocapitalization: 'words' }]],
    ['addDatePicker', ['datum', 'Datum', Date.now(), { mode: 'date' }]],
    ['addButton', ['Zahlung erfassen', true]],
];

// felder ins formular aufnehmen
paymentFields.forEach(([method, params]) => {
    enterPayment[method](...params);
});

enterPayment.show();
if (enterPayment.buttonPressed !== true) {
    alert('canceled');
}

// das ging fast ein wenig eleganter noch ueber eine array-variante,
// da das datum-format aber noch bearbeitet werden muss, ist's so einfacher
const { betrag, empf, zweck, datum } = enterPayment.fieldValues;
// datumsformat YYYYMMDD
const newText = `${betrag};${empf};${zweck};${strftime(datum, '%Y%m%d')}`;

// dann das entsprechende draft finden, text ergänzen und speichern
const [paylog] = Draft.query('', 'inbox', ['paylog']);
paylog.content = paylog.content + '\n' + newText;
paylog.update();