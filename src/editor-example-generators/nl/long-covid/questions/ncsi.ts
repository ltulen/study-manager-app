import { SurveyItem } from "survey-engine/lib/data_types";
import { QuestionGenerators } from "../../../../editor-engine/utils/question-type-generator";
import { generateLocStrings } from "../../../../editor-engine/utils/simple-generators";
import { GroupItemEditor } from "../../../../editor-engine/utils/survey-group-editor-helper";

export class NCSIGroup extends GroupItemEditor {

    constructor(parentKey: string, keyOverride?: string) {
        const groupKey = keyOverride ? keyOverride : 'NCSI';
        super(parentKey, groupKey);
        this.initQuestions();
    }

    initQuestions() {
        this.addItem(Q1(this.key, true))
        this.addItem(Q2(this.key, true))
        this.addItem(Q3(this.key, true))
        this.addItem(Q4(this.key, true))
    }
}

const Q1 = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const itemKey = keyOverride ? keyOverride : 'Q1';
    return QuestionGenerators.simpleLikertGroup({
        parentKey: parentKey,
        itemKey: itemKey,
        isRequired: isRequired,
        questionText: new Map([
            ["nl", "Geef aan hoe benauwd/ kortademig u zich de meeste dagen van de afgelopen maand voelde:"],
        ]),
        topDisplayCompoments: [{
            role: 'text',
            style: [{ key: 'className', value: 'mb-2' }],
            content: generateLocStrings(new Map([
                ["nl", "1 = helemaal niet benauwd/kortademig, 10 = heel erg benauwd/kortademig"],
            ]))
        }],
        scaleOptions: [
            {
                key: '1', content: new Map([
                    ["nl", "1"],
                ])
            }, {
                key: '2', content: new Map([
                    ["nl", "2"],
                ])
            }, {
                key: '3', content: new Map([
                    ["nl", "3"],
                ])
            }, {
                key: '4', content: new Map([
                    ["nl", "4"],
                ]),
            }, {
                key: '5', content: new Map([
                    ["nl", "5"],
                ])
            }, {
                key: '6', content: new Map([
                    ["nl", "6"],
                ])
            }, {
                key: '7', content: new Map([
                    ["nl", "7"],
                ])
            }, {
                key: '8', content: new Map([
                    ["nl", "8"],
                ])
            }, {
                key: '9', content: new Map([
                    ["nl", "9"],
                ])
            }, {
                key: '10', content: new Map([
                    ["nl", "10"],
                ])
            }
        ],
        rows: [
            {
                key: 'a', content: new Map([
                    ["nl", ""],
                ])
            },
        ]
    });
}

const Q2 = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const itemKey = keyOverride ? keyOverride : 'Q2';
    return QuestionGenerators.simpleLikertGroup({
        parentKey: parentKey,
        itemKey: itemKey,
        isRequired: isRequired,
        questionText: new Map([
            ["nl", "Geef aan hoe vervelend u uw benauwdheid/ kortademigheid vond in de afgelopen maand:"],
        ]),
        topDisplayCompoments: [{
            role: 'text',
            style: [{ key: 'className', value: 'mb-2' }],
            content: generateLocStrings(new Map([
                ["nl", "1 = helemaal niet benauwd/kortademig, 10 = heel erg benauwd/kortademig"],
            ]))
        }],
        scaleOptions: [
            {
                key: '1', content: new Map([
                    ["nl", "1"],
                ])
            }, {
                key: '2', content: new Map([
                    ["nl", "2"],
                ])
            }, {
                key: '3', content: new Map([
                    ["nl", "3"],
                ])
            }, {
                key: '4', content: new Map([
                    ["nl", "4"],
                ]),
            }, {
                key: '5', content: new Map([
                    ["nl", "5"],
                ])
            }, {
                key: '6', content: new Map([
                    ["nl", "6"],
                ])
            }, {
                key: '7', content: new Map([
                    ["nl", "7"],
                ])
            }, {
                key: '8', content: new Map([
                    ["nl", "8"],
                ])
            }, {
                key: '9', content: new Map([
                    ["nl", "9"],
                ])
            }, {
                key: '10', content: new Map([
                    ["nl", "10"],
                ])
            }
        ],
        rows: [
            {
                key: 'a', content: new Map([
                    ["nl", ""],
                ])
            },
        ]
    });
}

const Q3 = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const itemKey = keyOverride ? keyOverride : 'Q3';
    return QuestionGenerators.simpleLikertGroup({
        parentKey: parentKey,
        itemKey: itemKey,
        isRequired: isRequired,
        questionText: new Map([
            ["nl", "Geef aan hoe benauwd/ kortademig u zich voelde gedurende de meeste dagelijkse activiteiten in de afgelopen maand:"],
        ]),
        topDisplayCompoments: [{
            role: 'text',
            style: [{ key: 'className', value: 'mb-2' }],
            content: generateLocStrings(new Map([
                ["nl", "1 = helemaal niet benauwd/kortademig, 10 = heel erg benauwd/kortademig"],
            ]))
        }],
        scaleOptions: [
            {
                key: '1', content: new Map([
                    ["nl", "1"],
                ])
            }, {
                key: '2', content: new Map([
                    ["nl", "2"],
                ])
            }, {
                key: '3', content: new Map([
                    ["nl", "3"],
                ])
            }, {
                key: '4', content: new Map([
                    ["nl", "4"],
                ]),
            }, {
                key: '5', content: new Map([
                    ["nl", "5"],
                ])
            }, {
                key: '6', content: new Map([
                    ["nl", "6"],
                ])
            }, {
                key: '7', content: new Map([
                    ["nl", "7"],
                ])
            }, {
                key: '8', content: new Map([
                    ["nl", "8"],
                ])
            }, {
                key: '9', content: new Map([
                    ["nl", "9"],
                ])
            }, {
                key: '10', content: new Map([
                    ["nl", "10"],
                ])
            }
        ],
        rows: [
            {
                key: 'a', content: new Map([
                    ["nl", ""],
                ])
            },
        ]
    });
}

const Q4 = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const itemKey = keyOverride ? keyOverride : 'Q4';
    return QuestionGenerators.simpleLikertGroup({
        parentKey: parentKey,
        itemKey: itemKey,
        isRequired: isRequired,
        questionText: new Map([
            ["nl", "Emoties bij kortademigheid of benauwdheid"],
        ]),
        questionSubText: new Map([
            ["nl", "De volgende vragen hebben betrekking op emoties (gevoelens) die u kunt hebben terwijl u benauwd/kortademig bent."],
        ]),
        topDisplayCompoments: [
        {
            role: 'text',
            style: [{ key: 'variant', value: 'p' }],
            content: generateLocStrings(new Map([
                ["nl", "Vink het getal aan dat aangeeft hoe hevig die emotie is als u benauwd/kortademig bent."],
            ]))
        },
    ],
        scaleOptions: [
            {
                key: '1', content: new Map([
                    ["nl", "Niet of nauwelijks"],
                ])
            }, {
                key: '2', content: new Map([
                    ["nl", "Een beetje"],
                ])
            }, {
                key: '3', content: new Map([
                    ["nl", "Tamelijk hevig"],
                ])
            }, {
                key: '4', content: new Map([
                    ["nl", "Heel erg hevig"],
                ]),
            },
        ],
        rows: [
            {
                key: 'a', content: new Map([
                    ["nl", "Bezorgd"],
                ])
            },
            {
                key: 'b', content: new Map([
                    ["nl", "Angstig"],
                ])
            },
            {
                key: 'c', content: new Map([
                    ["nl", "Paniekerig"],
                ])
            },
            {
                key: 'd', content: new Map([
                    ["nl", "Gefrustreerd"],
                ])
            },
            {
                key: 'e', content: new Map([
                    ["nl", "Humeurig"],
                ])
            },
            {
                key: 'f', content: new Map([
                    ["nl", "Geïrriteerd"],
                ])
            },
        ]
    });
}