import { Survey, SurveyGroupItem, SurveyItem } from "survey-engine/lib/data_types";
import { ItemEditor } from "../../editor-engine/survey-editor/item-editor";
import { SurveyEditor } from "../../editor-engine/survey-editor/survey-editor";
import { initDropdownGroup, initLikertScaleItem, initMultipleChoiceGroup, initSingleChoiceGroup } from "../../editor-engine/utils/question-type-generator";
import { expWithArgs, generateHelpGroupComponent, generateLocStrings, generateTitleComponent } from "../../editor-engine/utils/simple-generators";
import { WeeklyQuestions as CommonPoolWeekly } from "../common_question_pool/influenzanet-weekly";
import { likertScaleKey, multipleChoiceKey, responseGroupKey, singleChoiceKey } from "../common_question_pool/key-definitions";

const weekly = (): Survey | undefined => {
    const surveyKey = 'weekly';

    const survey = new SurveyEditor();
    survey.changeItemKey('survey', surveyKey);

    // *******************************
    // Survey card
    // *******************************
    survey.setSurveyName(generateLocStrings(
        new Map([
            ["en", "Weekly questionnaire"],
            ["it", "Weekly questionnaire"],
        ])
    ));
    survey.setSurveyDescription(generateLocStrings(
        new Map([
            ["en", "Click here for your questionnaire about your complaints in the past week. Please also report if you had no complaints."],
            ["it", "Click here for your questionnaire about your complaints in the past week. Please also report if you had no complaints."],
        ])
    ));

    survey.setSurveyDuration(generateLocStrings(
        new Map([
            ["en", "Filling in takes 15 seconds to 5 minutes, depending on your complaints."],
            ["it", "Filling in takes 15 seconds to 5 minutes, depending on your complaints."],
        ])
    ));

    // *******************************
    // Some rules if necessary
    // *******************************
    // max item per page
    // set prefill rules
    // set context rules

    // *******************************
    // Questions
    // *******************************
    const rootItemEditor = new ItemEditor(survey.findSurveyItem(surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    survey.updateSurveyItem(rootItemEditor.getItem());
    const rootKey = rootItemEditor.getItem().key;

    // Symptoms Q1
    const Q_symptoms = CommonPoolWeekly.symptomps(rootKey, true);
    survey.addExistingSurveyItem(Q_symptoms, rootKey);

    // Q1a consent to further symptom questions
    const Q_consentSymptomQuestion = CommonPoolWeekly.consentForSymptoms(rootKey, Q_symptoms.key, true)
    survey.addExistingSurveyItem(Q_consentSymptomQuestion, rootKey);

    // // -------> HAS SYMPTOMS GROUP
    const userConsentedSymptomsGroup = CommonPoolWeekly.userConsentedSymptomsGroup(rootKey, Q_consentSymptomQuestion.key);
    survey.addExistingSurveyItem(userConsentedSymptomsGroup, rootKey);
    const hasSymptomGroupKey = userConsentedSymptomsGroup.key;

    // // Q2 same illnes --------------------------------------
    const Q_same_illnes = CommonPoolWeekly.sameIllnes(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_same_illnes, hasSymptomGroupKey);

    // // Qcov3 pcr tested contact COVID-19--------------------------------------
    const Q_covidPCRTestedContact = CommonPoolWeekly.pcrTestedContact(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_covidPCRTestedContact, hasSymptomGroupKey);

    // // Qcov3b household pcr contacts COVID-19--------------------------
    const Q_pcrHouseholdContact = CommonPoolWeekly.pcrHouseholdContact(hasSymptomGroupKey, Q_covidPCRTestedContact.key, true);
    survey.addExistingSurveyItem(Q_pcrHouseholdContact, hasSymptomGroupKey);

    // // Qcov8 contact with people showing symptoms -------------------------------------
    const Q_covidContact = CommonPoolWeekly.covidSymptomsContact(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_covidContact, hasSymptomGroupKey);

    // // Qcov8b contact with people showing symtoms in your household ---------------------------
    const Q_covidHouseholdContact = CommonPoolWeekly.covidHouseholdContact(hasSymptomGroupKey, Q_covidContact.key, true);
    survey.addExistingSurveyItem(Q_covidHouseholdContact, hasSymptomGroupKey);

    // // Q3 when first symptoms --------------------------------------
    const Q_symptomStart = CommonPoolWeekly.symptomsStart(hasSymptomGroupKey, Q_same_illnes.key, true);
    survey.addExistingSurveyItem(Q_symptomStart, hasSymptomGroupKey);

    // // Q4 when symptoms end --------------------------------------
    const Q_symptomsEnd = CommonPoolWeekly.symptomsEnd(hasSymptomGroupKey, Q_symptomStart.key, true);
    survey.addExistingSurveyItem(Q_symptomsEnd, hasSymptomGroupKey);

    // // Q5 symptoms developed suddenly --------------------------------------
    const Q_symptomsSuddenlyDeveloped = CommonPoolWeekly.symptomsSuddenlyDeveloped(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_symptomsSuddenlyDeveloped, hasSymptomGroupKey);

    // Q6 fever start questions
    // Separated into individual questions and Key code overriden to prevent Q6.a and keep Q6
    const Q_feverStart = CommonPoolWeekly.feverGroup.feverStart(hasSymptomGroupKey, Q_symptomStart.key, true, "Q6");
    survey.addExistingSurveyItem(Q_feverStart, hasSymptomGroupKey);

    // Q6b fever developed suddenly
    const Q_feverDevelopedSuddenly = CommonPoolWeekly.feverGroup.feverDevelopedSuddenly(hasSymptomGroupKey, true, "Q6b");
    survey.addExistingSurveyItem(Q_feverDevelopedSuddenly, hasSymptomGroupKey);

    // Q6c temperature taken
    const Q_didUMeasureTemp = CommonPoolWeekly.feverGroup.didUMeasureTemperature(hasSymptomGroupKey, true, "Q6c");
    survey.addExistingSurveyItem(Q_didUMeasureTemp, hasSymptomGroupKey);

    // Q6c temperature taken
    const Q_highestTempMeasured = CommonPoolWeekly.feverGroup.highestTemprerature(hasSymptomGroupKey, Q_didUMeasureTemp.key, true, "Q6d");
    survey.addExistingSurveyItem(Q_highestTempMeasured, hasSymptomGroupKey);

    // // Q7 visited medical service --------------------------------------
    const Q_visitedMedicalService = CommonPoolWeekly.visitedMedicalService(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_visitedMedicalService, hasSymptomGroupKey);

    // // Q7b how soon visited medical service --------------------------------------
    const Q_visitedMedicalServiceWhen = CommonPoolWeekly.visitedMedicalServiceWhen(hasSymptomGroupKey, Q_visitedMedicalService.key, true);
    survey.addExistingSurveyItem(Q_visitedMedicalServiceWhen, hasSymptomGroupKey);

    // // Q8 contacted medical service --------------------------------------
    const Q_contactedMedicalService = CommonPoolWeekly.contactedMedicalService(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_contactedMedicalService, hasSymptomGroupKey);

    // // Q8b how soon contacted medical service --------------------------------------
    const Q_contactedMedicalServiceWhen = CommonPoolWeekly.contactedMedicalServiceWhen(hasSymptomGroupKey, Q_contactedMedicalService.key, true);
    survey.addExistingSurveyItem(Q_contactedMedicalServiceWhen, hasSymptomGroupKey);

    // // Qcov18 reasons no medical services-----------------------------------------
    const Q_visitedNoMedicalService = CommonPoolWeekly.visitedNoMedicalService(hasSymptomGroupKey, Q_visitedMedicalService.key, Q_contactedMedicalService.key, true);
    survey.addExistingSurveyItem(Q_visitedNoMedicalService, hasSymptomGroupKey);

    // // Qcov18b consequences fear-------------------------------------------------
    const Q_consFear = CommonPoolWeekly.consFear(hasSymptomGroupKey, Q_visitedMedicalService.key, Q_contactedMedicalService.key, Q_visitedNoMedicalService.key, true);
    survey.addExistingSurveyItem(Q_consFear, hasSymptomGroupKey);

    // // Qcov16 test -----------------------------------------------------
    const Q_SymptomImpliedCovidTest = CommonPoolWeekly.symptomImpliedCovidTest(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_SymptomImpliedCovidTest, hasSymptomGroupKey);

    //Qcov16b PCR test result
    const Q_resultPCRTest = CommonPoolWeekly.resultPCRTest(hasSymptomGroupKey, Q_SymptomImpliedCovidTest.key, true)
    survey.addExistingSurveyItem(Q_resultPCRTest, hasSymptomGroupKey);

    //Qcov16c Serological test result
    const Q_resultSeroTest = CommonPoolWeekly.resultSerologicalTest(hasSymptomGroupKey, Q_SymptomImpliedCovidTest.key, true)
    survey.addExistingSurveyItem(Q_resultSeroTest, hasSymptomGroupKey);

    //Qcov16d duration between symptoms and lab search for testing
    const Q_durationTestResult = CommonPoolWeekly.durationLabSearch(hasSymptomGroupKey, Q_SymptomImpliedCovidTest.key, true)
    survey.addExistingSurveyItem(Q_durationTestResult, hasSymptomGroupKey);

    //Qcov16e duration between symptoms and test sampling
    const Q_durationLabSampling = CommonPoolWeekly.durationLabSampling(hasSymptomGroupKey, Q_SymptomImpliedCovidTest.key, true)
    survey.addExistingSurveyItem(Q_durationLabSampling, hasSymptomGroupKey);

    //Qcov16f rapid test result
    const Q_resultRapidTest = CommonPoolWeekly.resultRapidTest(hasSymptomGroupKey, Q_SymptomImpliedCovidTest.key, true)
    survey.addExistingSurveyItem(Q_resultRapidTest, hasSymptomGroupKey);

    // // Qcov19 test -----------------------------------------------------
    const q_fluTest = CommonPoolWeekly.fluTest(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(q_fluTest, hasSymptomGroupKey);

    // // Q9 took medication --------------------------------------
    const Q_tookMedication = CommonPoolWeekly.tookMedication(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_tookMedication, hasSymptomGroupKey);

    // // Q9b how soon after symptoms taking antivirals --------------------------------------
    const Q_whenAntivirals = CommonPoolWeekly.whenAntivirals(hasSymptomGroupKey, Q_tookMedication.key, true);
    survey.addExistingSurveyItem(Q_whenAntivirals, hasSymptomGroupKey);

    // // Q10 daily routine------------------------------------------------
    const Q_dailyRoutine = CommonPoolWeekly.dailyRoutine(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_dailyRoutine, hasSymptomGroupKey);

    // // Q10b today-------------------------------------------------------
    const Q_dailyRoutineToday = CommonPoolWeekly.dailyRoutineToday(hasSymptomGroupKey, Q_dailyRoutine.key, true);
    survey.addExistingSurveyItem(Q_dailyRoutineToday, hasSymptomGroupKey);

    // // Q10c daily routine days-----------------------------------------
    const Q_dailyRoutineDaysMissed = CommonPoolWeekly.dailyRoutineDaysMissed(hasSymptomGroupKey, Q_dailyRoutine.key, true);
    survey.addExistingSurveyItem(Q_dailyRoutineDaysMissed, hasSymptomGroupKey);


    // Q_BE_1_3 COVID-19 test
    const Q_covidTest = covidTest(rootKey, true, "Q_BE_1_3");
    survey.addExistingSurveyItem(Q_covidTest, rootKey);

    // Q_BE_1_4 reason test
    const Q_reasonTest = reasonTest(rootKey, Q_covidTest.key, true, "Q_BE_1_4");
    survey.addExistingSurveyItem(Q_reasonTest, rootKey);

    // Q_BE_1_5 date test
    const Q_dateTest = dateTest(rootKey, Q_covidTest.key, true, "Q_BE_1_5");
    survey.addExistingSurveyItem(Q_dateTest, rootKey);

    /* //Q_BE_cov16z duration untill test result
    const Q_durationTestResult = durationTestResult(rootKey, Q_covidTest.key, Q_resultTest.key, true, "Qcov_BE_16z")
    survey.addExistingSurveyItem(Q_durationTestResult, rootKey); */

    // // Q_BE_7x duration hospitalisation----------------------------------------------
    const Q_durHosp = durHosp(hasSymptomGroupKey, Q_visitedMedicalService.key, true, "Q_BE_7x");
    survey.addExistingSurveyItem(Q_durHosp, hasSymptomGroupKey);

    // // Q_BE_7y ICU ------------------------------------------------------------------
    const Q_addICU = addICU(hasSymptomGroupKey, Q_visitedMedicalService.key, true, "Q_BE_7y");
    survey.addExistingSurveyItem(Q_addICU, hasSymptomGroupKey);

    // // Q_BE_7z Coma -----------------------------------------------------------------
    const Q_inComa = inComa(hasSymptomGroupKey, Q_visitedMedicalService.key, true, "Q_BE_7z");
    survey.addExistingSurveyItem(Q_inComa, hasSymptomGroupKey);
    // // Q11 think cause of symptoms --------------------------------------
    const Q_causeOfSymptoms = CommonPoolWeekly.causeOfSymptoms(hasSymptomGroupKey, true);
    survey.addExistingSurveyItem(Q_causeOfSymptoms, hasSymptomGroupKey);

    // // Qcov_BE_7 Covid 19 habits change question ------------------------------------------------------
    const Q_covidHabits = covidHabitsChange(hasSymptomGroupKey, false, "Qcov_BE_7");
    survey.addExistingSurveyItem(Q_covidHabits, hasSymptomGroupKey);

    const surveyEndText = surveyEnd(rootKey);
    survey.addExistingSurveyItem(surveyEndText, rootKey);

    return survey.getSurvey();
}

export default weekly;

/**
 * TEST COVID-19: single choice question about COVID-19  test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const covidTest = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_1_3'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Heeft u sinds de vorige vragenlijst een COVID-19 test laten uitvoeren (of in de afgelopen 7 dagen indien dit uw eerste bezoek is)?"],
            ["fr-be", "Avez-vous passé un test de dépistage du coronavirus depuis le dernier questionnaire (ou au cours des 7 derniers jours s'il s'agit de votre première visite) ?"],
            ["de-be", "Haben Sie seit der letzten Fragen einen COVID-19-Test durchführen lassen (oder in den vergangenen 7 Tagen, wenn dieser Ihr erster Besuch ist)?"],
            ["en", "Have you been tested for coronavirus since the last questionnaire (or within the past 7 days if this is your first visit)?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new Map([
                    ["nl-be", "Waarom vragen we dit?"],
                    ["fr-be", "Pourquoi posons-nous cette question ?"],
                    ["de-be", "Warum fragen wir das?"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new Map([
                    ["nl-be", "We willen weten hoe COVID-19 zich verspreidt in de bevolking."],
                    ["fr-be", "Nous voulons savoir comment le coronavirus se propage au sein de la population."],
                    ["de-be", "Wir möchten wissen, wie Covid-19 sich in der Bevölkerung verbreitet."],
                    ["en", "We want to understand how the coronavirus is spreading within the population."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option', content: new Map([
                ["nl-be", "Ja"],
                ["fr-be", "Oui"],
                ["de-be", "Ja"],
                ["en", "Yes"],

            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["nl-be", "Nee"],
                ["fr-be", "Non"],
                ["de-be", "Nein"],
                ["en", "No"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new Map([
                ["nl-be", "Nee, ik weet het niet (meer)"],
                ["fr-be", "Je ne sais pas (plus)"],
                ["de-be", "Ich weiß es nicht (mehr)"],
                ["en", "I don’t know/can’t remember"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * REASON COVID-19 test: single choice question about COVID-19  test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const reasonTest = (parentKey: string, keycovidTest?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_1_4'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Wat was de reden dat u een COVID-19 test liet uitvoeren?"],
            ["fr-be", "Pour quelle raison avez-vous effectué un test de dépistage du coronavirus ?"],
            ["de-be", "Was war der Grund dafür, dass Sie einen COVID-19-Test durchführen ließen?"],
            ["en", "Why are you being tested for coronavirus?"],
        ]))
    );

    // CONDITION
    if (keycovidTest) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keycovidTest, [responseGroupKey, singleChoiceKey].join('.'), '0')
        );
    }

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new Map([
                    ["nl-be", "Hoe moet ik deze vraag beantwoorden?"],
                    ["fr-be", "Comment dois-je répondre à cette question ?"],
                    ["de-be", "Wie soll ich diese Frage beantworten?"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new Map([
                    ["nl-be", "Antwoord zo precies mogelijk."],
                    ["fr-be", "Répondez de la manière la plus précise possible."],
                    ["de-be", "Bitte antworten Sie so genau wie möglich."],
                    ["en", "Answer as precisely as possible."],
                ]),
                //style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new Map([
                ['nl-be', 'Meerdere antwoorden mogelijk'],
                ["fr-be", "Plusieurs réponses sont possibles"],
                ["de-be", "Mehrere Antworten möglich"],
                ["en", "Multiple answers possible"],
            ])),
    }, rg?.key);
    const rg_inner = initMultipleChoiceGroup(multipleChoiceKey, [
        {
            key: '0', role: 'option', content: new Map([
                ["nl-be", "Vanwege mijn symptomen"],
                ["fr-be", "En raison de mes symptômes"],
                ["de-be", "Aufgrund meiner Symptome"],
                ["en", "Because of my symptoms"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["nl-be", "Vanwege symptomen of een positieve test bij één van mijn huisgenoten"],
                ["fr-be", "En raison de symptômes ou d'un test positif auprès de l'une des personnes vivant avec moi"],
                ["de-be", "Aufgrund von Symptomen oder einem positiven Test bei einem meiner Mitbewohner (Hausgenossen)"],
                ["en", "Because a person who lives with me experienced symptoms or had a positive coronavirus test"],
            ])
        },
        {
            key: '2', role: 'option',
            content: new Map([
                ["nl-be", "Vanwege symptomen of een positieve test bij één van mijn contacten buitenshuis"],
                ["fr-be", "En raison de symptômes ou d'un test positif auprès de l'un de mes contacts extérieurs"],
                ["de-be", "Aufgrund von Symptomen oder einem positiven Test bei einem meiner Kontakte außerhalb des Hauses"],
                ["en", "Because one of my external contacts experienced symptoms or had a positive coronavirus test"],
            ])
        },
        {
            key: '3', role: 'option',
            content: new Map([
                ["nl-be", "Vanwege mijn terugkeer uit een risicogebied"],
                ["fr-be", "En raison de mon retour d'une zone à risque"],
                ["de-be", "Aufgrund meiner Rückkehr aus einem Risikogebiet"],
                ["en", "Because I returned from a risk area"],
            ])
        },
        {
            key: '4', role: 'option',
            content: new Map([
                ["nl-be", "Vanwege mijn deelname aan een risico-activiteit (vliegreis, evenement, ...)"],
                ["fr-be", "En raison de ma participation à une activité à risque (un voyage en avion, un événement, etc.)"],
                ["de-be", "Aufgrund meiner Teilnahme an einer Risiko-Aktivität (Flugreise, Veranstaltung, Event usw.)"],
                ["en", "Because I took part in a high-risk activity (a plane trip, an event, etc.)"],
            ])
        },
        {
            key: '5', role: 'option',
            content: new Map([
                ["nl-be", "Vanwege mijn beroep"],
                ["fr-be", "En raison de ma profession"],
                ["de-be", "Aufgrund meines Berufs"],
                ["en", "Because of my profession"],
            ])
        },
        {
            key: '6', role: 'input',
            style: [{ key: 'className', value: 'w-100' }],
            content: new Map([
                ["nl-be", "Andere"],
                ["fr-be", "Autre"],
                ["de-be", "Andere"],
                ["en", "Other"],
            ]),
            description: new Map([
                ["nl-be", "Beschrijf hier (optioneel in te vullen)"],
                ["fr-be", "Veuillez fournir une description ici (facultatif)"],
                ["de-be", "Beschreiben Sie es hier (optional einzutragen)"],
                ["en", "Describe here (optional)"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DATE COVID-19 test: date COVID-19 test
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const dateTest = (parentKey: string, keycovidTest?: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_1_5'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Wanneer heeft u een test laten uitvoeren voor COVID-19? Als u de datum niet meer precies weet, mag u deze schatten."],
            ["fr-be", "Quand avez-vous fait réaliser un test de dépistage du coronavirus ? Si vous ne vous souvenez pas (plus) de la date exacte, vous pouvez l'estimer."],
            ["de-be", "Wann haben Sie einen Test auf COVID-19 durchführen lassen? Wenn Sie das Datum nicht mehr genau wissen, dürfen Sie es schätzen."],
            ["en", "When did you get tested for the coronavirus? If you don't remember the exact date, please give an estimate."],
        ]))
    );

    // CONDITION
    if (keycovidTest) {
        editor.setCondition(
            expWithArgs('responseHasKeysAny', keycovidTest, [responseGroupKey, singleChoiceKey].join('.'), '0')
        );
    }

    // INFO POPUP
    //

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'dateInput',
            optionProps: {
                min: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', -5184000) },
                max: { dtype: 'exp', exp: expWithArgs('timestampWithOffset', 0) }
            },
            description: new Map([
                ["nl-be", "Kies een datum"],
                ["fr-be", "Choisissez la date"],
                ["de-be", "Datum auswählen"],
                ["en", "Choose date"],
            ]),
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["nl-be", "Ik weet het niet (meer)"],
                ["fr-be", "Je ne sais pas (plus)"],
                ["de-be", "Ich weiß es nicht (mehr)"],
                ["en", "I don’t know/can’t remember"],

            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * DURATION HOSPITAL
 * TO D0: Fix drop down
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ: reference to quesiton if visited any medical service
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const durHosp = (parentKey: string, keyVisitedMedicalServ: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_7x';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Hoe lang ben je gehospitaliseerd geweest?"],
            ["fr-be", "Combien de temps avez-vous été hospitalisé(e) ?"],
            ["de-be", "Wie lange waren Sie im Krankenhaus?"],
            ["en", "For how long were you hospitalised?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '2')
    );

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new Map([
                    ["nl-be", "Hoe moet ik deze vraag beantwoorden?"],
                    ["fr-be", "Comment dois-je répondre à cette question ?"],
                    ["de-be", "Wie soll ich diese Frage beantworten?"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new Map([
                    ["nl-be", "Wees alstublieft zo nauwkeurig mogelijk."],
                    ["fr-be", "Veuillez fournir la réponse la plus précise possible."],
                    ["de-be", "Bitte so genau wie möglich."],
                    ["en", "Answer as precisely as possible."],
                ]),
            },
        ])
    );

    // RESPONSE PART
    const ddOptions = initDropdownGroup('ddg', [
        {
            key: '0', role: 'option', content: new Map([
                ["nl-be", "1 dag"],
                ["fr-be", "1 jour"],
                ["de-be", "1 Tage"],
                ["en", "1 day"],
            ]),
        },
        {
            key: '1', role: 'option', content: new Map([
                ["nl-be", "2 dagen"],
                ["fr-be", "2 jours"],
                ["de-be", "2 Tagen"],
                ["en", "2 days"],
            ]),
        },
        {
            key: '2', role: 'option', content: new Map([
                ["nl-be", "3 dagen"],
                ["fr-be", "3 jours"],
                ["de-be", "3 Tagen"],
                ["en", "3 days"],
            ]),
        },
        {
            key: '3', role: 'option', content: new Map([
                ["nl-be", "4 dagen"],
                ["fr-be", "4 jours"],
                ["de-be", "4 Tagen"],
                ["en", "4 days"],
            ]),
        },
        {
            key: '4', role: 'option', content: new Map([
                ["nl-be", "5 dagen"],
                ["fr-be", "5 jours"],
                ["de-be", "5 Tagen"],
                ["en", "5 days"],
            ]),
        },
        {
            key: '5', role: 'option', content: new Map([
                ["nl-be", "6 dagen"],
                ["fr-be", "6 jours"],
                ["de-be", "6 Tagen"],
                ["en", "6 days"],
            ]),
        },
        {
            key: '6', role: 'option', content: new Map([
                ["nl-be", "7 dagen"],
                ["fr-be", "7 jours"],
                ["de-be", "7 Tagen"],
                ["en", "7 days"],
            ]),
        },
        {
            key: '7', role: 'option', content: new Map([
                ["nl-be", "8 dagen"],
                ["fr-be", "8 jours"],
                ["de-be", "8 Tagen"],
                ["en", "8 days"],
            ]),
        },
        {
            key: '8', role: 'option', content: new Map([
                ["nl-be", "9 dagen"],
                ["fr-be", "9 jours"],
                ["de-be", "9 Tagen"],
                ["en", "9 days"],
            ]),
        },
        {
            key: '9', role: 'option', content: new Map([
                ["nl-be", "10 dagen"],
                ["fr-be", "10 jours"],
                ["de-be", "10 Tagen"],
                ["en", "10 days"],
            ]),
        },
        {
            key: '10', role: 'option', content: new Map([
                ["nl-be", "11 dagen"],
                ["fr-be", "11 jours"],
                ["de-be", "11 Tagen"],
                ["en", "11 days"],
            ]),
        },
        {
            key: '11', role: 'option', content: new Map([
                ["nl-be", "12 dagen"],
                ["fr-be", "12 jours"],
                ["de-be", "12 Tagen"],
                ["en", "12 days"],
            ]),
        },
        {
            key: '12', role: 'option', content: new Map([
                ["nl-be", "13 dagen"],
                ["fr-be", "13 jours"],
                ["de-be", "13 Tagen"],
                ["en", "13 days"],
            ]),
        },
        {
            key: '13', role: 'option', content: new Map([
                ["nl-be", "14 dagen"],
                ["fr-be", "14 jours"],
                ["de-be", "14 Tagen"],
                ["en", "14 days"],
            ]),
        },
        {
            key: '14', role: 'option', content: new Map([
                ["nl-be", "15 dagen"],
                ["fr-be", "15 jours"],
                ["de-be", "15 Tagen"],
                ["en", "15 days"],
            ]),
        },
        {
            key: '15', role: 'option', content: new Map([
                ["nl-be", "16 dagen"],
                ["fr-be", "16 jours"],
                ["de-be", "16 Tagen"],
                ["en", "16 days"],
            ]),
        },
        {
            key: '16', role: 'option', content: new Map([
                ["nl-be", "17 dagen"],
                ["fr-be", "17 jours"],
                ["de-be", "17 Tagen"],
                ["en", "17 days"],
            ]),
        },
        {
            key: '17', role: 'option', content: new Map([
                ["nl-be", "18 dagen"],
                ["fr-be", "18 jours"],
                ["de-be", "18 Tagen"],
                ["en", "18 days"],
            ]),
        },
        {
            key: '18', role: 'option', content: new Map([
                ["nl-be", "19 dagen"],
                ["fr-be", "19 jours"],
                ["de-be", "19 Tagen"],
                ["en", "19 days"],
            ]),
        },
        {
            key: '19', role: 'option', content: new Map([
                ["nl-be", "20 dagen"],
                ["fr-be", "20 jours"],
                ["de-be", "20 Tagen"],
                ["en", "20 days"],
            ]),
        },
        {
            key: '20', role: 'option', content: new Map([
                ["nl-be", "21 dagen"],
                ["fr-be", "21 jours"],
                ["de-be", "21 Tagen"],
                ["en", "21 days"],
            ]),
        },
        {
            key: '21', role: 'option', content: new Map([
                ["nl-be", "22 dagen"],
                ["fr-be", "22 jours"],
                ["de-be", "22 Tagen"],
                ["en", "22 days"],
            ]),
        },
        {
            key: '22', role: 'option', content: new Map([
                ["nl-be", "23 dagen"],
                ["fr-be", "23 jours"],
                ["de-be", "23 Tagen"],
                ["en", "23 days"],
            ]),
        },
        {
            key: '23', role: 'option', content: new Map([
                ["nl-be", "24 dagen"],
                ["fr-be", "24 jours"],
                ["de-be", "24 Tagen"],
                ["en", "24 days"],
            ]),
        },
        {
            key: '24', role: 'option', content: new Map([
                ["nl-be", "25 dagen"],
                ["fr-be", "25 jours"],
                ["de-be", "25 Tagen"],
                ["en", "25 days"],
            ]),
        },
        {
            key: '25', role: 'option', content: new Map([
                ["nl-be", "26 dagen"],
                ["fr-be", "26 jours"],
                ["de-be", "26 Tagen"],
                ["en", "26 days"],
            ]),
        },
        {
            key: '26', role: 'option', content: new Map([
                ["nl-be", "27 dagen"],
                ["fr-be", "27 jours"],
                ["de-be", "27 Tagen"],
                ["en", "27 days"],
            ]),
        },
        {
            key: '27', role: 'option', content: new Map([
                ["nl-be", "28 dagen"],
                ["fr-be", "28 jours"],
                ["de-be", "28 Tagen"],
                ["en", "28 days"],
            ]),
        },
        {
            key: '28', role: 'option', content: new Map([
                ["nl-be", "29 dagen"],
                ["fr-be", "29 jours"],
                ["de-be", "29 Tagen"],
                ["en", "29 days"],
            ]),
        },
        {
            key: '29', role: 'option', content: new Map([
                ["nl-be", "30 dagen"],
                ["fr-be", "30 jours"],
                ["de-be", "30 Tagen"],
                ["en", "30 days"],
            ]),
        },
        {
            key: '30', role: 'option', content: new Map([
                ["nl-be", "31-40 dagen"],
                ["fr-be", "31-40 jours"],
                ["de-be", "31-40 Tagen"],
                ["en", "31-40 days"],
            ]),
        },
        {
            key: '31', role: 'option', content: new Map([
                ["nl-be", "41-50 dagen"],
                ["fr-be", "41-50 jours"],
                ["de-be", "41-50 Tagen"],
                ["en", "41-50 days"],
            ]),
        },
        {
            key: '32', role: 'option', content: new Map([
                ["nl-be", "51-60 dagen"],
                ["fr-be", "51-60 jours"],
                ["de-be", "51-60 Tagen"],
                ["en", "51-60 days"],
            ]),
        },
        {
            key: '33', role: 'option', content: new Map([
                ["nl-be", "meer dan 60 dagen"],
                ["fr-be", "plus de 60 jours"],
                ["de-be", "mehr als 60 Tage"],
                ["en", "more than 60 days"],
            ]),
        },
    ]);

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        content: generateLocStrings(
            new Map([
                ['nl-be', "Selecteer het juiste aantal dagen"],
                ["fr-be", "Sélectionnez le nombre de jours"],
                ["de-be", "Wählen Sie die Anzahl der Tage"],
                ["en", "Select the number of days"],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(ddOptions, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * ICU addmission
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ: reference to quesiton if visited any medical service
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const addICU = (parentKey: string, keyVisitedMedicalServ: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_7y';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Ben je in ICU (afdeling intensieve zorgen) opgenomen?"],
            ["fr-be", "Avez-vous été admis(e) aux soins intensifs (ICU) ?"],
            ["de-be", "Waren Sie auf einer Intensivstation (ICU)?"],
            ["en", "Were you admitted to the intensive care unit (ICU)?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '2')
    );

    // INFO POPUP
    //none

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '01', role: 'option',
            content: new Map([
                ["nl-be", "Ja, 1 keer"],
                ["fr-be", "Oui, une fois"],
                ["de-be", "Ja, ein Mal"],
                ["en", "Yes, one time"],
            ])
        },
        {
            key: '02', role: 'option',
            content: new Map([
                ["nl-be", "Ja, meerdere keren"],
                ["fr-be", "Oui, plusieurs fois"],
                ["de-be", "Ja, mehrere Male"],
                ["en", "Yes, several times"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["nl-be", "Nee"],
                ["fr-be", "Non"],
                ["de-be", "Nein"],
                ["en", "No"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);
    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}

/**
 * Coma
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keyVisitedMedicalServ: reference to quesiton if visited any medical service
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const inComa = (parentKey: string, keyVisitedMedicalServ: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Q_BE_7z';
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Ben je in coma geweest?"],
            ["fr-be", "Avez-vous été dans le coma ?"],
            ["de-be", "Waren Sie im Koma?"],
            ["en", "Were you in a coma?"],
        ]))
    );

    // CONDITION
    editor.setCondition(
        expWithArgs('responseHasKeysAny', keyVisitedMedicalServ, [responseGroupKey, multipleChoiceKey].join('.'), '2')
    );

    // INFO POPUP
    //none

    // RESPONSE PART
    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    const rg_inner = initSingleChoiceGroup(singleChoiceKey, [
        {
            key: '0', role: 'option',
            content: new Map([
                ["nl-be", "Ja"],
                ["fr-be", "Oui"],
                ["de-be", "Ja"],
                ["en", "Yes"],
            ])
        },
        {
            key: '1', role: 'option',
            content: new Map([
                ["nl-be", "Nee"],
                ["fr-be", "Non"],
                ["de-be", "Nein"],
                ["en", "No"],
            ])
        },
    ]);
    editor.addExistingResponseComponent(rg_inner, rg?.key);

    // VALIDATIONs
    if (isRequired) {
        editor.addValidation({
            key: 'r1',
            type: 'hard',
            rule: expWithArgs('hasResponse', itemKey, responseGroupKey)
        });
    }

    return editor.getItem();
}


/**
 * COVID 19 Personal Habits Changes: likert scale question about changes in personal habits after experiencing covid symptoms
 *
 * @param parentKey full key path of the parent item, required to genrate this item's unique key (e.g. `<surveyKey>.<groupKey>`).
 * @param keySymptomsQuestion reference to the symptom survey
 * @param isRequired if true adds a default "hard" validation to the question to check if it has a response.
 * @param keyOverride use this to override the default key for this item (only last part of the key, parent's key is not influenced).
 */
const covidHabitsChange = (parentKey: string, isRequired?: boolean, keyOverride?: string): SurveyItem => {
    const defaultKey = 'Qcov_BE_7'
    const itemKey = [parentKey, keyOverride ? keyOverride : defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    editor.setVersion(1);

    // QUESTION TEXT
    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["nl-be", "Heeft u vanwege uw symtomen deze maatregelen genomen of verstrengd (in vergelijking met de periode voor uw symptomen)?"],
            ["fr-be", "En raison de vos symptômes, avez-vous pris ou intensifié les mesures reprises ci-dessous (par rapport à la période précédant vos symptômes) ?"],
            ["de-be", "Haben Sie aufgrund Ihrer Symtome diese Maßnahmen ergriffen oder verstärkt (im Vergleich mit dem Zeitraum vor Ihren Symptomen)?"],
            ["en", "Did you begin to follow or increase any of the measures below, due to your symptoms (compared to the period before your symptoms began)?"],
        ]))
    );

    // CONDITION
    // none

    // INFO POPUP
    editor.setHelpGroupComponent(
        generateHelpGroupComponent([
            {
                content: new Map([
                    ["nl-be", "Waarom vragen we dit?"],
                    ["fr-be", "Pourquoi posons-nous cette question ?"],
                    ["de-be", "Warum fragen wir das?"],
                    ["en", "Why are we asking this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new Map([
                    ["nl-be", "Om te onderzoeken hoe verschillende maatregelen worden opgevolgd."],
                    ["fr-be", "Afin d'examiner la manière dont les différentes mesures sont suivies."],
                    ["de-be", "Um zu untersuchen, wie verschiedene Maßnahmen befolgt werden."],
                    ["en", "To examine how different measures are being followed."],
                ]),
                style: [{ key: 'variant', value: 'p' }],
            },
            {
                content: new Map([
                    ["nl-be", "Hoe moet ik deze vraag beantwoorden?"],
                    ["fr-be", "Comment dois-je répondre à cette question ?"],
                    ["de-be", "Wie soll ich diese Frage beantworten?"],
                    ["en", "How should I answer this question?"],
                ]),
                style: [{ key: 'variant', value: 'h5' }],
            },
            {
                content: new Map([
                    ["nl-be", "Bijvoorbeeld 'Handen schudden vermijden': Kies 'Ja', omwille van mijn symptomen heb ik geen of nog minder handen geschud; Kies 'Nee, ik pas deze maatregel niet toe', ik geef nog steeds mensen de hand ook al heb ik symptomen; Kies 'Nee, ik hield me al aan deze maatregel', want ook voor mijn symptomen gaf ik geen handen en heb dit niet aangepast."],
                    ["fr-be", "Par exemple, « Évitez de serrer les mains » : Choisissez « Oui » si vous avez serré moins de mains ou si vous n'avez plus serré de mains en raison de vos symptômes ; Choisissez « Non, je n'applique pas cette mesure », si vous continuez à serrer la main des gens malgré vos symptômes ; Choisissez « Non, J'appliquais déjà cette mesure » si vous ne serriez déjà plus la main des gens avant l'apparition de vos symptômes, et que vous n'avez pas modifié ce comportement."],
                    ["de-be", "Zum Beispiel so, 'Hände schütteln vermeiden': Wählen Sie 'Ja', aufgrund meiner Symptome habe ich keine oder noch weniger Hände geschüttelt; Wählen Sie 'Nein, ich wende diese Maßnahme nicht an', ich gebe noch immer Menschen die Hand, obwohl ich schon Symptome habe; Wählen Sie 'Nein, ich hielt mich schon an diese Maßnahme', denn auch aufgrund meiner Symptome gab ich niemandem die Hand und habe das nicht gemacht."],
                    ["en", "For example, 'Avoid shaking hands': Answer 'yes' if you shake hands less or not at all due to your symptoms; Answer 'No, I am not following this measure' if you continue to shake hands despite your symptoms; Answer 'No, I was already following this measure' if you had already stopped shaking hands before the onset of your symptoms and you did not change this behaviour."],
                ]),
                // style: [{ key: 'variant', value: 'p' }],
            },
        ])
    );


    // RESPONSE PART
    const likertOptions = [
        {
            key: "1", content: new Map([
                ["nl-be", "Ja, ik pas deze maatregel nu (voor het eerst) of meer (verstrengd) toe"],
                ["fr-be", "Oui, j'applique cette mesure maintenant (pour la première fois) ou de manière plus stricte"],
                ["de-be", "Ja, ich wende diese Maßnahme nun (zum ersten Mal) oder mehr (verstärkt) an"],
                ["en", " Yes, I am following this measure now for the first time, or in a stricter way"],
            ])
        },
        {
            key: "3", content: new Map([
                ["nl-be", "Nee, ik hield me al aan deze maatregel"],
                ["fr-be", "Non, j'appliquais déjà cette mesure"],
                ["de-be", "Nein, ich hielt mich schon an diese Maßnahme"],
                ["en", "I was already following this measure"],
            ])
        },
        {
            key: "2", content: new Map([
                ["nl-be", "Nee, ik pas deze maatregel niet toe"],
                ["fr-be", "Non, je n'applique pas cette mesure"],
                ["de-be", "Nein, ich wende diese Maßnahme nicht an"],
                ["en", "No, I am not following this measure"],
            ])
        }
    ];

    const rg = editor.addNewResponseComponent({ role: 'responseGroup' });
    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-2' }],
        content: generateLocStrings(
            new Map([
                ['nl-be', 'Optioneel in te vullen'],
                ["fr-be", "Question facultative"],
                ["de-be", "Optional einzutragen"],
                ["en", "To be completed optionally"],
            ])),
    }, rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Regelmatig handen wassen/desinfecteren"],
                ["fr-be", "Se laver/se désinfecter régulièrement les mains"],
                ["de-be", "Regelmäßig die Hände waschen/desinfiziren"],
                ['en', 'Regularly wash or disinfect hands'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_1', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Niezen en hoesten in uw elleboog"],
                ["fr-be", "Éternuer et tousser dans votre coude"],
                ["de-be", "In Ihren Ellenbogen niesen und husten"],
                ['en', 'Cough or sneeze into your elbow'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_2', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Wegwerptissues gebruiken"],
                ["fr-be", "Utiliser des mouchoirs jetables"],
                ["de-be", "Einwegtaschentücher verwenden"],
                ['en', 'Use a disposable tissue'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_3', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Een mondmasker dragen buitenshuis"],
                ["fr-be", "Porter un masque buccal à l'extérieur"],
                ["de-be", "Außerhalb des Hauses einen Mund-Nasen-Schutz tragen"],
                ['en', 'Wear a face mask outdoors'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_4', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Een mondmasker dragen binnenshuis"],
                ["fr-be", "Porter un masque buccal à l'intérieur"],
                ["de-be", "Im Hause einen Mund-Nasen-Schutz tragen"],
                ['en', 'Wear a face mask indoors'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_5', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Handen schudden vermijden"],
                ["fr-be", "Éviter de serrer les mains"],
                ["de-be", "Hände schütteln vermeiden"],
                ['en', 'Avoid shaking hands'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_6', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Niet meer knuffelen of kus op de wang geven"],
                ["fr-be", "Éviter les embrassades ou les bisous sur la joue"],
                ["de-be", "Nicht mehr knutschen oder einen Kuss auf die Wange geben"],
                ['en', 'Stop greeting by hugging and/or kissing on both cheeks'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_7', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Gebruik van openbaar vervoer beperken"],
                ["fr-be", "Limiter l'utilisation des transports en commun"],
                ["de-be", "Die Nutzung des ÖPNV begrenzen"],
                ['en', 'Limit your use of public transport'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_8', likertOptions), rg?.key);


    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Drukke plaatsen mijden (supermarkt, cinema, stadium,...)"],
                ["fr-be", "Éviter les lieux bondés (un supermarché, un cinéma, un stade, etc.)"],
                ["de-be", "Belebte Plätze meiden (Supermarkt, Kino, Stadion, usw.)"],
                ['en', 'Avoid busy places (supermarket, cinema, stadium)'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_9', likertOptions), rg?.key);


    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Thuis blijven"],
                ["fr-be", "Rester à la maison"],
                ["de-be", "Zu Hause bleiben"],
                ['en', 'Stay at home'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_10', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Telewerken"],
                ["fr-be", "Effectuer du télétravail"],
                ["de-be", "Telearbeit oder erhöhen Sie die Anzahl der Telearbeitstage"],
                ['en', 'Telework or increase your number of telework days'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_11', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Niet meer naar het buitenland reizen"],
                ["fr-be", "Ne plus voyager à l'étranger"],
                ["de-be", "Nicht mehr ins Ausland reisen!"],
                ['en', 'Avoid travel outside your own country or region'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_12', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Boodschappen aan huis laten leveren (door winkel/familie/vriend)"],
                ["fr-be", "Se faire livrer ses achats à domicile (par un magasin/un membre de la famille/un ami)"],
                ["de-be", "Aufträge nach Hause liefern lassen (durch das Geschäft/die Familie/Freunde)"],
                ['en', 'Have your food/shopping delivered by a store or a friend/family member'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_13', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Ontmoetingen met familie en vrienden beperken"],
                ["fr-be", "Limiter les rencontres avec la famille et les amis"],
                ["de-be", "Treffen mit Familie und Freunden einschränken und begrenzen"],
                ['en', 'Avoid seeing friends and family'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_14', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Ontmoetingen met mensen 65+ jaar of met chronische aandoeningen beperken"],
                ["fr-be", "Limiter les rencontres avec les personnes âgées de plus de 65 ans ou souffrant de maladies chroniques"],
                ["de-be", "Treffen mit Menschen im Alter von 65+ Jahren oder mit chronischen Erkrankungen begrenzen"],
                ['en', 'Avoid being in contact with people over 65 years old or with a chronic disease'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_15', likertOptions), rg?.key);

    editor.addExistingResponseComponent({
        role: 'text',
        style: [{ key: 'className', value: 'mb-1 border-top border-1 border-grey-7 pt-1 mt-2 fw-bold' }, { key: 'variant', value: 'h5' }],
        content: generateLocStrings(
            new Map([
                ["nl-be", "Contact met kinderen beperken"],
                ["fr-be", "Limiter les contacts avec les enfants"],
                ["de-be", "Kontakt mit Kindern begrenzen"],
                ['en', 'Avoid being in contact with children'],
            ])),
    }, rg?.key);
    editor.addExistingResponseComponent(initLikertScaleItem(likertScaleKey + '_16', likertOptions), rg?.key);

    // VALIDATIONs
    // None

    return editor.getItem();
}

/**
 * SURVEY END TEXT
*/
const surveyEnd = (parentKey: string): SurveyItem => {
    const defaultKey = 'surveyEnd'
    const itemKey = [parentKey, defaultKey].join('.');
    const editor = new ItemEditor(undefined, { itemKey: itemKey, type: 'surveyEnd', isGroup: false });

    editor.setTitleComponent(
        generateTitleComponent(new Map([
            ["en", "Thank you! This was all for now, please submit (push « send ») your responses. We will ask you again next week."],
            ["nl-be", "Dank je wel! Dit was de laatste vraag. Druk « verzenden » om je antwoorden op te slaan. Volgende week vragen we je weer om een nieuwe vragenlijst in te vullen."],
            ["fr-be", "Merci ! C'était la dernière question.  Cliquez sur « envoyer » pour sauvegardé vos réponses. Nous vous contacterons à nouveau la semaine prochaine afin de compléter un nouveau questionnaire."],
            ["de-be", "Vielen Dank! Das war die letzte Frage. Drücken Sie auf « versenden », um Ihre Antworten zu speichern. In der folgenden Woche fragen wir wieder."],
        ]))
    );

    // CONDITION
    // None

    return editor.getItem();
}
