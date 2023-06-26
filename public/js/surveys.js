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

const inspire_json = {
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
                    "type": "dropdown",
                    "name": "inspire_level",
                    "title": "Select inspire changes:",
                    "hideNumber": true,
                    "isRequired": true,
                    "choices": [
                        {
                            "value": "0",
                            "text": "0 / off / stopped"
                        },
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11"
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

const pap_json = {
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
                    "title": "Type in the change to your PAP treatmen: ",
                    "hideNumber": true,
                    "isRequired": true
                }
            ]
        }
    ],
 //   "navigateToUrl": "/",
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
         {
          "value": "seizure",
          "text": "Seizure"
         },
         {
          "value": "headache",
          "text": "Headache"
         },
         {
          "value": "spell",
          "text": "Spell"
         }
        ],
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
          "text": "very satisfied"
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
        "name": "q6",
        "title": "6. Interference of sleep problems with daytime functioning",
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
        "name": "q7",
        "title": "7. Preoccupation and distress caused by sleep difficulties",
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
        "name": "question6",
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
        "name": "q7",
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

