var result_all = {}
const dsa_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Your Daily Sleep Assessment is successfully submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "DSA1",
                    "title": "Which best describes how you are feeling?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "1",
                            "text": "1. Feeling active, vital, alert or wide awake"
                        },
                        {
                            "value": "2",
                            "text": "2. Functioning at high levels, but not fully alert"
                        },
                        {
                            "value": "3",
                            "text": "3. Awake, but relaxed; responsive but not fully alert"
                        },
                        {
                            "value": "4",
                            "text": "4. Somewhat foggy, let down"
                        },
                        {
                            "value": "5",
                            "text": "5. Foggy; losing interest in remaining awake; slowed down"
                        },
                        {
                            "value": "6",
                            "text": "6. Sleepy, woozy, fighting sleep; prefer to lie down"
                        },
                        {
                            "value": "7",
                            "text": "7. No longer fighting sleep; sleep onset soon; having dream-like thoughts"
                        }
                    ]
                }
            ]
        },
        {
            "name": "page2",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "DSA2",
                    "title": "How would you rate the quality of your sleep last night?",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "1",
                            "text": "1. Very poor - could not fall asleep or stay asleep and felt extremely unrested in the morning"
                        },
                        {
                            "value": "2",
                            "text": "2. Poor - Difficulty failing asleep, staying asleep, woke up unrefreshed"
                        },
                        {
                            "value": "3",
                            "text": "3. Fair - Fell asleep relatively quickly, a few brief awakenings, woke up feeling OK"
                        },
                        {
                            "value": "4",
                            "text": "4. Good - Fell asleep relatively quickly, no awakenings, woke up feeling OK"
                        },
                        {
                            "value": "5",
                            "text": "5. Very good - Fell asleep quickly, no awakenings, woke up rested"
                        },
                        {
                            "value": "6",
                            "text": "6. NA"
                        }
                    ]
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ],
    "completeText": "Submit"
}

const med_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Submitted! </h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "whichnight",
                    "startWithNewLine": false,
                    "title": "Regarding: ",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "last_night",
                            "text": "Last night"
                        },
                        {
                            "value": "tonight",
                            "text": "Tonight"
                        }
                    ],
                    "colCount": 2
                },
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "List  medication changes: ",
                    "hideNumber": true,
                    "isRequired": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ],
    "completeText": "Submit"
}

const general_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Submitted! </h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "whichnight",
                    "startWithNewLine": false,
                    "title": "Regarding: ",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "last_night",
                            "text": "Last night"
                        },
                        {
                            "value": "tonight",
                            "text": "Tonight"
                        }
                    ],
                    "colCount": 2
                },
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "Leave notes about your condition: ",
                    "hideNumber": true,
                    "isRequired": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ],
    "completeText": "Submit"
}

const pitsburgh_json = {
    "title": "PITTSBURGH SLEEP QUALITY INDEX",
    "logoPosition": "right",
    "completedHtml": "<h3>Your Daily Sleep Assessment is successfully submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "question1",
        "title": "During the past month, what time have you usually gone to bed at night? BED TIME",
        "isRequired": true
       },
       {
        "type": "dropdown",
        "name": "question2",
        "startWithNewLine": false,
        "title": "During the past month, how long (in minutes) has it usually taken you to fall asleep each night? NUMBER OF MINUTES",
        "choices": [
         {
          "value": "0",
          "text": "< 15 minutes"
         },
         {
          "value": "1",
          "text": "16-30 minutes"
         },
         {
          "value": "2",
          "text": "31-60 minutes"
         },
         {
          "value": "3",
          "text": "> 60 minutes"
         }
        ]
       },
       {
        "type": "text",
        "name": "question3",
        "title": "During the past month, what time have you usually gotten up in the morning? GETTING UP TIME",
        "isRequired": true
       },
       {
        "type": "dropdown",
        "name": "question6",
        "startWithNewLine": false,
        "title": "During the past month, how many hours of actual sleep did you get at night? (This may be different than the number of hours you spent in bed.) HOURS OF SLEEP PER NIGHT",
        "choices": [
         {
          "value": "0",
          "text": "> 7 hours"
         },
         {
          "value": "1",
          "text": "6 - 7 hours"
         },
         {
          "value": "2",
          "text": "5 - 6 hours"
         },
         {
          "value": "3",
          "text": "< 5 hours"
         }
        ]
       }
      ],
      "description": "INSTRUCTIONS: The following questions relate to your usual sleep habits during the past month only. Your answers should indicate the most accurate reply for the majority of days and nights in the past month. Please answer all questions."
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "matrix",
        "name": "question21",
        "title": "During the past month, how often have you had trouble sleeping because you",
        "isRequired": true,
        "columns": [
         {
          "value": "0",
          "text": "Not during the past month"
         },
         {
          "value": "1",
          "text": "Less than once a week"
         },
         {
          "value": "2",
          "text": "Once or twice a week"
         },
         {
          "value": "3",
          "text": "Three or more times a week"
         }
        ],
        "rows": [
         {
          "value": "Row 1",
          "text": "Cannot get to sleep within 30 minutes"
         },
         {
          "value": "Row 2",
          "text": "Wake up in the middle of the night or early morning"
         },
         {
          "value": "Row 3",
          "text": "Have to get up to use the bathroom"
         },
         {
          "value": "Row 4",
          "text": "Cannot breathe comfortably"
         },
         {
          "value": "Row 5",
          "text": "Cough or snore loudly"
         },
         {
          "value": "Row 6",
          "text": "Feel too cold"
         },
         {
          "value": "Row 7",
          "text": "Feel too hot"
         },
         {
          "value": "Row 8",
          "text": "Had bad dreams"
         },
         {
          "value": "Row 9",
          "text": "Have pain"
         },
         {
          "value": "Row 10",
          "text": "Other reason(s)"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question17",
        "title": "During the past month, how often have you taken medicine to help you sleep (prescribed or \"over the counter\")?",
        "isRequired": true,
        "choices": [
         {
          "value": "Item 2",
          "text": "Not during the past month"
         },
         {
          "value": "Item 3",
          "text": "Less than once a week"
         },
         {
          "value": "Item 4",
          "text": "Once or twice a week"
         },
         {
          "value": "Item 5",
          "text": "Three or more times a week"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question18",
        "startWithNewLine": false,
        "title": "During the past month, how often have you had trouble staying awake while driving, eatingmeals, or engaging in social activity?",
        "isRequired": true,
        "choices": [
         {
          "value": "Item 2",
          "text": "Not during the past month"
         },
         {
          "value": "Item 3",
          "text": "Less than once a week"
         },
         {
          "value": "Item 4",
          "text": "Once or twice a week"
         },
         {
          "value": "Item 5",
          "text": "Three or more times a week"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question16",
        "title": "During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done?",
        "isRequired": true,
        "choices": [
         {
          "value": "Item 1",
          "text": "No problem at all"
         },
         {
          "value": "Item 2",
          "text": "Only a very slight problem"
         },
         {
          "value": "Item 3",
          "text": "Somewhat of a problem"
         },
         {
          "value": "Item 4",
          "text": "A very big problem"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question5",
        "startWithNewLine": false,
        "title": "During the past month, how would you rate your sleep quality overall?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Very good"
         },
         {
          "value": "1",
          "text": "Fairly good"
         },
         {
          "value": "2",
          "text": "Fairly bad"
         },
         {
          "value": "3",
          "text": "Very bad"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question19",
        "title": "During the past month, how much of a problem has it been for you to keep up enoughenthusiasm to get things done?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No problem at all"
         },
         {
          "value": "1",
          "text": "Only a very slight problem"
         },
         {
          "value": "2",
          "text": "Somewhat of a problem"
         },
         {
          "value": "3",
          "text": "A very big problem"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "question20",
        "startWithNewLine": false,
        "title": "Do you have a bed partner or room mate?",
        "isRequired": true,
        "choices": [
         {
          "value": "Item 1",
          "text": "No bed partner or room mate"
         },
         {
          "value": "Item 2",
          "text": "Partner/room mate in other room"
         },
         {
          "value": "Item 3",
          "text": "Partner in same room, but not same bed"
         },
         {
          "value": "Item 4",
          "text": "Partner in same bed"
         }
        ]
       },
       {
        "type": "matrix",
        "name": "question22",
        "title": "If you have a room mate or bed partner, ask him/her how often in the past month you have had",
        "isRequired": true,
        "columns": [
         {
          "value": "0",
          "text": "Not during the past month"
         },
         {
          "value": "1",
          "text": "Less than once a week"
         },
         {
          "value": "2",
          "text": "Once or twice a week"
         },
         {
          "value": "3",
          "text": "Three or more times a week"
         }
        ],
        "rows": [
         {
          "value": "Row 1",
          "text": "Loud snoring"
         },
         {
          "value": "Row 2",
          "text": "Long pauses between breaths while asleep"
         },
         {
          "value": "Row 3",
          "text": "Legs twitching or jerking while you sleep"
         },
         {
          "value": "Row 4",
          "text": "Episodes of disorientation or confusion during sleep"
         },
         {
          "value": "Row 5",
          "text": "Other restlessness while you sleep"
         }
        ]
       }
      ],
      "description": "For each of the remaining questions, check the one best response. Please answer all questions. During the past month, how often have you had trouble sleeping because you ."
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

const appliance_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Submitted! </h3>",
    "pages": [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "radiogroup",
                    "name": "whichnight",
                    "startWithNewLine": false,
                    "title": "Regarding: ",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                     {
                      "value": "last_night",
                      "text": "Last night"
                     },
                     {
                      "value": "tonight",
                      "text": "Tonight"
                     }
                    ],
                    "colCount": 2
                   },
                {
                    "type": "comment",
                    "name": "comment",
                    "title": "Type in the change to your Oral Appliance Therapy: ",
                    "hideNumber": true,
                    "isRequired": true
                }
            ]
        }
    ],
    "navigateToUrlOnCondition": [
        {}
    ],
    "completeText": "Submit"
}

const general_sleep_related_json = {
    "title": "General Sleep Related Questions",
    "logoPosition": "right",
    "completedHtml": "<h3>Assessment is successfully submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already this assessment.</h3>",
    "pages": [
     {
      "name": "page2",
      "elements": [
       {
        "type": "radiogroup",
        "name": "q1",
        "title": "Have you been observed to snore?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Mild (not very disturbing to others)"
         },
         {
          "value": "2",
          "text": "Moderate (sometimes disturbing to others)"
         },
         {
          "value": "3",
          "text": "Severe (always disturbing to others)"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q2",
        "title": "Has anyone noticed that you briefly stop breathing while asleep?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q3",
        "title": "Do you awaken gasping for air?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q4",
        "title": "Have you had to raise the head of your bed?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Slightly"
         },
         {
          "value": "2",
          "text": "Moderately"
         },
         {
          "value": "3",
          "text": "Extensively (90 degrees)"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q5",
        "title": "Do you develop shortness while sleeping or trying to sleep?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q6",
        "title": "Do you awaken with heartburn / reflux feelings?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q7",
        "title": "Do you have restless sensation in your legs with an urge to move while in bed?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q8",
        "title": "Do you awaken because the baby is kicking?",
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "No"
         },
         {
          "value": "1",
          "text": "Occasionally"
         },
         {
          "value": "2",
          "text": "Often"
         },
         {
          "value": "3",
          "text": "Every night"
         }
        ]
       },
       {
        "type": "text",
        "name": "general_sleep_related_score",
        "title": "general sleep related score",
        "defaultValueExpression": "{q1}+{q2}+{q3}+{q4}+{q5}+{q6}+{q7}+{q8}"
       }
      ],
      "description": "For each of the remaining questions, check the one best response. Please answer all questions. During the past week, how often have you had trouble sleeping because you ."
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

const event_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>Submitted! </h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "radiogroup",
        "name": "event_type",
        "startWithNewLine": false,
        "title": "Type of Event:",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         "Baby kicking",
         "Breathing problems",
         "Nausea",
         "Heartburnt",
         "Headace",
         "Restless legs"
        ],
        "showOtherItem": true,
        "colCount": 2
       },
       {
        "type": "comment",
        "name": "comment",
        "title": "Leave notes about the event:",
        "hideNumber": true,
        "isRequired": true
       }
      ]
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

const isi = {
    "title": "ISI, Insomnia Severity Index",
    "logoPosition": "right",
    "completedHtml": "<h3>Your ISI submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed ISI.</h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "radiogroup",
        "name": "q1",
        "title": "1. Difficulties falling asleep",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "no problem"
         },
         {
          "value": "1",
          "text": "mild"
         },
         {
          "value": "2",
          "text": "moderate"
         },
         {
          "value": "3",
          "text": "severe"
         },
         {
          "value": "4",
          "text": "very severe"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q2",
        "title": "2. Difficulties staying asleep",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "no problem"
         },
         {
          "value": "1",
          "text": "mild"
         },
         {
          "value": "2",
          "text": "moderate"
         },
         {
          "value": "3",
          "text": "severe"
         },
         {
          "value": "4",
          "text": "very severe"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q3",
        "title": "3. Early morning awakenings",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "no problem"
         },
         {
          "value": "1",
          "text": "mild"
         },
         {
          "value": "2",
          "text": "moderate"
         },
         {
          "value": "3",
          "text": "severe"
         },
         {
          "value": "4",
          "text": "very severe"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q4",
        "title": "4. Sleep dissatisfaction",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "very satisfied"
         },
         {
          "value": "1",
          "text": "satisfied"
         },
         {
          "value": "2",
          "text": "neutral"
         },
         {
          "value": "3",
          "text": "dissatisfied"
         },
         {
          "value": "4",
          "text": "very dissatisfied"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q5",
        "title": "5. Interference of sleep problems with daytime functioning",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "not at all"
         },
         {
          "value": "1",
          "text": "a little"
         },
         {
          "value": "2",
          "text": "somewhat"
         },
         {
          "value": "3",
          "text": "much"
         },
         {
          "value": "4",
          "text": "very much"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q6",
        "title": "6. Noticeability of sleep difficulties by others",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "not at all"
         },
         {
          "value": "1",
          "text": "a little"
         },
         {
          "value": "2",
          "text": "somewhat"
         },
         {
          "value": "3",
          "text": "much"
         },
         {
          "value": "4",
          "text": "very much"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q7",
        "title": "7. Preoccupation and distress caused by sleep difficulties",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "not at all"
         },
         {
          "value": "1",
          "text": "a little"
         },
         {
          "value": "2",
          "text": "somewhat"
         },
         {
          "value": "3",
          "text": "much"
         },
         {
          "value": "4",
          "text": "very much"
         }
        ]
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "total_isi",
        "title": "Total is the ISI, Insomnia Severity Index",
        "defaultValueExpression": "{q1}+{q2}+{q3}+{q4}+{q5}+{q6}+{q7}"
       }
      ]
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

const epworth = {
    "title": "Epworth Sleepiness Scale",
    "logoPosition": "right",
    "completedHtml": "<h3>Your Epworth Sleepiness Scale is submitted</h3>",
    "completedBeforeHtml": "<h3>Our records show that you have already completed DSA.</h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "radiogroup",
        "name": "q1",
        "title": "Sitting and reading",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q2",
        "title": "Watching TV",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q3",
        "title": "Sitting, inactive, in a public place(e.g., in a meeting, theater, or dinner event)",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q4",
        "title": "As a passenger in a car for an hour or more without stopping for a break",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q5",
        "title": "Lying down to rest when circumstances permit",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q6",
        "title": "Sitting and talking to someone",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q7",
        "title": "Sitting quietly after a meal without alcohol",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       },
       {
        "type": "radiogroup",
        "name": "q8",
        "title": "In a car, while stopped for a few minutes in traffic or at a light",
        "hideNumber": true,
        "isRequired": true,
        "choices": [
         {
          "value": "0",
          "text": "Would never nod off"
         },
         {
          "value": "1",
          "text": "Slight chance of nodding off"
         },
         {
          "value": "2",
          "text": "Moderate chance of nodding off"
         },
         {
          "value": "3",
          "text": "High chance of nodding off"
         }
        ]
       }
      ],
      "description": "How likely are you to nod off or fall asleep in the following situations, in contrast to feeling just tired? This refers to your usual way of life in recent times. Even if you haven’t done some of these things recently, try to work out how they would have affected you. It is important that you answer each question as best you can. Use the following scale to choose the most appropriate number for each situation."
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "total_score",
        "title": "A score of 10 or greater raises concern: you may need to get more sleep, improve your sleep practices, or seek medical attention to determine why you are sleepy.",
        "defaultValueExpression": "{q1}+{q2}+{q3}+{q4}+{q5}+{q6}+{q7}+{q8}"
       }
      ]
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

const onboarding_json = {
    "logoPosition": "right",
    "completedHtml": "<h3>successfully submitted</h3>",
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "subject_number",
        "title": "Subject number:",
        "description": "(same as ring number)",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "ring_serial_number",
        "startWithNewLine": false,
        "title": "Ring serial number",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "firstname",
        "title": "Firstname",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "lastname",
        "startWithNewLine": false,
        "title": "Lastname",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "irritation_ring",
        "title": "Irritation from the ring?",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "finger_used",
        "startWithNewLine": false,
        "title": "Which finger will be used?",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "weight",
        "title": "Weight:",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "pulse",
        "startWithNewLine": false,
        "title": "Pulse:",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "blood_pressure",
        "title": "Blood pressure:",
        "isRequired": true
       },
       {
        "type": "text",
        "name": "neck_circumference",
        "startWithNewLine": false,
        "title": "Neck circumference?",
        "isRequired": true
       }
      ]
     }
    ],
    "navigateToUrlOnCondition": [
     {}
    ],
    "completeText": "Submit"
   }

function getResultLink() {
    //document.getElementById("result_link").href=`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`; 

    $.get(`/results?cid=${document.getElementById("cid").value}`, function (data) {
        Survey
            .StylesManager
            .applyTheme("defaultV2");

        json['clientId'] = `${document.getElementById("cid").value}`

        window.survey = new Survey.Model(json);
        result_all = data;
        convertJsontoHtmlTable(data)

        //   survey.data = JSON.parse(data);
        //    survey.mode = 'display';

        // $("#surveyElement").Survey({ model: survey });
    });

    // fetch(`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`)
    //     .then(response => console.log(response.json()))
    //     .then(data => console.log(data));

    // await fetch(`/result?cid=${document.getElementById("cid").value}&pid=${document.getElementById("pid").value}`, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //         'Content-Type': 'application/json'
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: JSON.stringify(data) 
    // });
};

function callExport() {
    exportAllToCSV(result_all, document.getElementById("cid").value)
}


function convertJsontoHtmlTable(employess) {

    //Getting value for table header
    // {'EmployeeID', 'EmployeeName', 'Address' , 'City','Country'}
    var tablecolumns = [];
    //  tablecolumns.push('clinic_id')
    tablecolumns.push('patient_id')
    tablecolumns.push('dob')
    tablecolumns.push('gender')
    tablecolumns.push('relationship_child')
    tablecolumns.push("Q 1")
    tablecolumns.push("Q 2")
    tablecolumns.push("Q 3")
    tablecolumns.push("Q 4")
    tablecolumns.push("Q 5")
    tablecolumns.push("rating")
    tablecolumns.push('<button type="button" onclick="callExport()" class="btn btn-primary">Export All to XLS</button>')
    // tablecolumns.push("  ")

    //Creating html table and adding class to it
    var tableemployee = document.createElement("table");
    tableemployee.classList.add("table");
    tableemployee.classList.add("table-striped");
    tableemployee.classList.add("table-bordered");
    tableemployee.classList.add("table-hover")

    //Creating header of the HTML table using
    //tr
    var tr = tableemployee.insertRow(-1);

    for (var i = 0; i < tablecolumns.length; i++) {
        //header
        var th = document.createElement("th");
        th.innerHTML = tablecolumns[i];
        tr.appendChild(th);
    }

    // Add employee JSON data in table as tr or rows
    for (var i = 0; i < employess.length; i++) {
        tr = tableemployee.insertRow(-1);
        for (var j = 0; j < tablecolumns.length; j++) {
            var tabCell = tr.insertCell(-1);
            if (tablecolumns[j] == "Q 1") {
                tabCell.innerHTML = employess[i].main_questions['1'];
            } else
                if (tablecolumns[j] == "Q 2") {
                    tabCell.innerHTML = employess[i].main_questions['2'];
                } else
                    if (tablecolumns[j] == "Q 3") {
                        tabCell.innerHTML = employess[i].main_questions['3'];
                    } else if (tablecolumns[j] == "Q 4") {
                        tabCell.innerHTML = employess[i].main_questions['4'];
                    } else if (tablecolumns[j] == "Q 5") {
                        tabCell.innerHTML = employess[i].main_questions['5'];
                    } else if (tablecolumns[j].indexOf("button") > -1) {
                        tabCell.innerHTML = `<button type="button" onclick="downloadResult('${employess[i].clinic_id}', '${employess[i].patient_id}', 'download')" class="btn btn-primary">Download</button>`
                    } else {
                        tabCell.innerHTML = employess[i][tablecolumns[j]];
                    }
        }
    }

    //Final step , append html table to the container div
    var employeedivcontainer = document.getElementById("employeedivcontainer");
    employeedivcontainer.innerHTML = ""; // '<div style="text-align:right; margin-bottom:10px;"><button type="button" onclick="exportToCSV()" class="btn btn-primary">Export All to XLS</button></div>';
    employeedivcontainer.appendChild(tableemployee);
}


function downloadResult(cid, pid, openOrDownload) {
    var options = {
        fontSize: 14,
        margins: {
            left: 10,
            right: 10,
            top: 18,
            bot: 10
        }
    };


    const response = fetch(`/download-results?cid=${cid}&pid=${pid}`)
        .then(response => response.json())
        .then(data => {
            data = data[0]

            if (openOrDownload == 'open') {
                //     Survey
                //     .StylesManager
                //     .applyTheme("defaultV2");

                // window.survey = new Survey.Model(json);

                // survey
                //     .onComplete
                //     .add(function (sender) {


                //     });

                // //   survey.data = JSON.parse(data);
                // //    survey.mode = 'display';

                // $("#surveyElement").Survey({ model: survey });



                // delete data.clinic_id;
                // delete data.patient_id;
                // delete data._id;
                ///   survey.data = data;
                //   survey.mode = 'display';

            } else {

                //json is same as for SurveyJS Library
                var surveyPDF = new SurveyPDF.SurveyPDF(json, options);
                surveyPDF.data = data;
                surveyPDF.haveCommercialLicense = true;
                //uncomment next code to add html and markdown text support
                /*var converter = new showdown.Converter();
                surveyPDF.onTextMarkdown.add(function(survey, options) {
                    var str = converter.makeHtml(options.text);
                    str = str.substring(3);
                    str = str.substring(0, str.length - 4);
                    options.html = str;
                });*/

                surveyPDF.onRenderHeader.add(function (_, canvas) {
                    canvas.drawText({
                        text: `Clinic = ${document.getElementById("clinic_name").value}, Patient Id=${pid}                                airwayassessment.azurewebsites.net`,
                        fontSize: 10
                    });
                });
                surveyPDF.save(`${cid}_${pid}.pdf`);
            }
        });


}

