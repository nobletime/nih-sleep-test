'use strict';

var singleNight = 0
let comments = {}, commentTab = false, ptime;

$(function () {
})

async function drawsingleNightCharts(mostRecentData) {
    let localtime = moment(mostRecentData.start_date).tz(mostRecentData.timezone).format();
    let parsedDate = Date.parse(localtime)
    //localtime = localtime.substring(0, localtime.lastIndexOf("-"));
    ptime = new Date(localtime).setHours(0, 0, 0, 0) - 1;

    const time = Number(localtime.substring(localtime.indexOf("T") + 1, localtime.indexOf(":")))
    if (time > 12) {
        ptime = moment(localtime).add(1, 'days')._d.setHours(0, 0, 0, 0) - 1;
    }

    const subject = JSON.parse(localStorage.getItem("rest-tracker-app-profile"));
    // const response = await fetch(`/get-restapp?id=${subject.id}`, {
    //     method: "GET",
    //     headers: { 'Content-Type': 'application/json' }
    // })
    // const restapp_data = await response.json();
    // let ahi = "sAHI_3%", sAHI_3or4 = "3%";
    // if (restapp_data[0].sAHI == "sAHI_4") {
    //     ahi = "sAHI_4%"
    //     sAHI_3or4 = "4%"
    // }

    const nightOf = moment(ptime).format("ddd, MMM Do")
    const sleepdataJson = JSON.parse(mostRecentData.sleepdata)
    let apnea_severity_3 = "Normal", apnea_severity_4 = "Normal", apnea_background = "green";
    if (sleepdataJson["sAHI_3%"] >= 5 && sleepdataJson["sAHI_3%"] < 15) {
        apnea_severity_3 = "Mild"
        apnea_background = "#FFC000"
    } else if (sleepdataJson["sAHI_3%"] >= 15 && sleepdataJson["sAHI_3%"] < 30) {
        apnea_severity_3 = "Moderate"
        apnea_background = "darkorange"
    } else if (sleepdataJson["sAHI_3%"] >= 30) {
        apnea_severity_3 = "Severe"
        apnea_background = "darkred"
    }

    if (sleepdataJson["sAHI_4%"] >= 5 && sleepdataJson["sAHI_4%"] < 15) {
        apnea_severity_4 = "Mild"
    } else if (sleepdataJson["sAHI_4%"] >= 15 && sleepdataJson["sAHI_4%"] < 30) {
        apnea_severity_4 = "Moderate"
    } else if (sleepdataJson["sAHI_4%"] >= 30) {
        apnea_severity_4 = "Severe"
    }

    // SLEEP QUALITY REPORT
    // if (sleepdataJson.SQI <=55) {
    //     document.getElementById("report_sleepquality").style.background  ="darkred"
    // } else {
    //     document.getElementById("report_sleepquality").style.background  ="green"
    // }
    // document.getElementById("report_sleepquality").innerHTML = `Sleep Quality Index : ${sleepdataJson.SQI} <br/> Expected > 55`

    if (sleepdataJson.Sleep_Efficiency <= 85) {
        document.getElementById("report_efficiency").style.background = "darkred"
    } else {
        document.getElementById("report_efficiency").style.background = "green"
    }
    document.getElementById("report_efficiency").innerHTML = `Sleep Efficiency: ${sleepdataJson.Sleep_Efficiency}% <br/> Expected > 85%`

    document.getElementById("report_apnea").style.background = apnea_background
    document.getElementById("report_apnea").innerHTML = `Apnea Hypopnea Index: ${sleepdataJson["sAHI_3%"]} <br/> ${apnea_severity_3}`

    if (sleepdataJson.Sleep_Latency_Min >= 30) {
        document.getElementById("report_latency").style.background = "darkred"
    } else {
        document.getElementById("report_latency").style.background = "green"
    }
    document.getElementById("report_latency").innerHTML = `Sleep Latency: ${Math.round(sleepdataJson.Sleep_Latency_Min)}<br/> Expected < 30 min`

    if (sleepdataJson.TST_Hour < 7) {
        document.getElementById("report_duration").style.background = "darkred"
    } else {
        document.getElementById("report_duration").style.background = "green"
    }
    document.getElementById("report_duration").innerHTML = `Sleep Time : ${decimalHoursToHHMM(sleepdataJson.TST_Hour)} <br/> Expected 7 - 8 hours`

    document.getElementById("signal_quality").innerHTML = `Signal Quality : ${sleepdataJson.Average_Signal_Quality}%`;
    document.getElementById("comment-nightof").innerHTML = document.getElementById("report-nightof").innerHTML = `<span style="font-size:21px;position:relative;top:-10px" > Night of ${nightOf} </span><br/> <span style="color:blue;font-size:18px">${sleepdataJson.Start_Time} - ${sleepdataJson.End_Time} </span>`

    Highcharts.chart('apnea-chart', {

        chart: {
            type: 'columnrange',
            inverted: true,
            height: 300
        },

        title: {
            text: `<span style="font-size:21px;position:relative;top:-10px" > Night of ${nightOf} </span><br/> <span style="color:blue;font-size:18px">${sleepdataJson.Start_Time} - ${sleepdataJson.End_Time} </span>`
        },

        credits: {
            enabled: false
        },
        subtitle: {
            text: `AHI 4%: <b>${sleepdataJson["sAHI_4%"]}</b>, count: <b> ${sleepdataJson.Apnea_Total_Count_4}</b><br/> AHI 3%: <b>${sleepdataJson["sAHI_3%"]}</b>, count: <b> ${sleepdataJson.Apnea_Total_Count_3}</b>`,
            style: {
                fontSize: '17px'
            }
        },

        xAxis: {
            categories: ["4%", "3%"]
        },

        yAxis: {
            min: 0,
            max: 40,
            title: {
                text: `<b>${apnea_severity_4}</b> Apnea based on 4% oxygen reduction <br/>(<b>${sleepdataJson["sAHI_4%"]} </b> per hour and <b> ${sleepdataJson.Apnea_Total_Count_4}</b> total events)<br/> <b>${apnea_severity_3}</b> Apnea based on 3% oxygen reduction <br/>(<b>${sleepdataJson["sAHI_3%"]}</b> per hour and <b> ${sleepdataJson.Apnea_Total_Count_3}</b> total events)`,
                style: {
                    fontSize: '15px',
                    useHTML: true
                }
            },
            plotBands: [{
                color: 'green',
                from: 0,
                to: 5
            }, {
                color: 'yellow',
                from: 5,
                to: 15
            }, {
                color: 'orange',
                from: 15,
                to: 30
            },
            {
                color: 'red',
                from: 30,
                to: 50
            }]
        },

        plotOptions: {
            columnrange: {
                pointWidth: 12,
                borderRadius: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                }
            }
        },

        exporting: {
            enabled: false
        },


        legend: {
            enabled: false
        },

        series: [{
            name: 'Apnea Hypopnea Index',
            data: [             
                [0, sleepdataJson["sAHI_4%"]],
                [0, sleepdataJson["sAHI_3%"]],
            ]
        }]
        // {
        //     name: 'Apnea Hypopnea Index',
        //     data: [
        //         [0, sleepdataJson["sAHI_3%"]],
        //     ]
        // }

    });

    Highcharts.chart('odi-chart', {

        chart: {
            type: 'columnrange',
            inverted: true,
            height: 190
        },

        title: {
            text: ``
        },

        credits: {
            enabled: false
        },
        subtitle: {
            text: `Oxygen Desaturation Index: ${sleepdataJson["ODI_4%"]}`,
            style: {
                fontSize: '18px'
            }
        },

        xAxis: {
            categories: [""]
        },

        yAxis: {
            min: 0,
            max: 50,
            title: {
                text: `Number of episodes per hour where oxygen saturation decreases at least 4% and lasts over 10 seconds during sleep`,
                style: {
                    fontSize: '14px'
                }
            },
            plotBands: [{
                color: 'green',
                from: 0,
                to: 5
            }, {
                color: 'yellow',
                from: 5,
                to: 15
            }, {
                color: 'orange',
                from: 15,
                to: 30
            },
            {
                color: 'red',
                from: 30,
                to: 50
            }]
        },

        plotOptions: {
            columnrange: {
                pointWidth: 12,
                borderRadius: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                }
            }
        },

        exporting: {
            enabled: false
        },


        legend: {
            enabled: false
        },

        series: [{
            name: 'ODI 4%',
            data: [
                [0, sleepdataJson["ODI_4%"]],                
            ]
        }]

    });

    Highcharts.chart('tst-chart', {

        chart: {
            type: 'columnrange',
            inverted: true,
            height: 130
        },

        title: {
            text: ``
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: `Total Sleep Time: <b> ${decimalHoursToHHMM(sleepdataJson.TST_Hour)}</b>`,
            style: {
                fontSize: '18px'
            }
        },

        xAxis: {
            visible: false,
            categories: ['']
        },

        yAxis: {
            min: 0,
            max: 10,
            title: {
                text: ``
            }
        },

        plotOptions: {
            columnrange: {
                borderRadius: '50%',
                dataLabels: {
                    enabled: false,
                    format: '{y}',
                }
            }
        },

        exporting: {
            enabled: false
        },


        legend: {
            enabled: false
        },

        series: [{
            name: '',
            data: [
                [0, sleepdataJson.TST_Hour],
            ]
        }]

    });

    // Highcharts.chart('spo2below90-chart', {

    //     chart: {
    //         type: 'columnrange',
    //         inverted: true,
    //         height:120
    //     },

    //     title: {
    //         text: ``
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     // subtitle: {
    //     //     text: 'Observed'
    //     // },

    //     xAxis: {
    //         categories: ['']
    //     },

    //     yAxis: {
    //         min:0,
    //         max: 50,
    //         title: {
    //             text: `% and duration in min where SpO2 dropped below 90%: <b> ${sleepdataJson.SpO2_Below90_Percent}%, ${sleepdataJson.SpO2_Below90_Duration_Min} mins</b>`
    //         }
    //     },           

    //     plotOptions: {
    //         columnrange: {
    //             borderRadius: '50%',
    //             dataLabels: {
    //                 enabled: true,
    //                 format: '{y}',                    
    //             }
    //         }
    //     },

    //     exporting: {
    //         enabled: false
    //       },


    //     legend: {
    //         enabled: false
    //     },

    //     series: [{
    //         name: 'SpO2',
    //         data: [
    //             [0, sleepdataJson.SpO2_Below90_Percent],
    //         ]
    //     }]

    // });

    Highcharts.chart('spo2-chart', {

        chart: {
            type: 'columnrange',
            inverted: true,
            height: 130
        },

        title: {
            text: ``
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: `SpO2 (avg: <b> ${sleepdataJson.Mean_SpO2} %</b>)`,
            style: {
                fontSize: '18px'
            }
        },

        xAxis: {
            visible: false,
            categories: ['']
        },

        yAxis: {
            title: {
                text: ``
            }
        },

        plotOptions: {
            columnrange: {
                borderRadius: '50%',
                dataLabels: {
                    enabled: true,
                    format: '{y}',
                    style: {
                        fontSize: '18px'
                    }
                }
            }
        },

        exporting: {
            enabled: false
        },


        legend: {
            enabled: false
        },

        series: [{
            name: 'SpO2',
            data: [
                [sleepdataJson.Min_SpO2, sleepdataJson.Max_SpO2],
            ]
        }]

    });

    Highcharts.chart('heartbeat-chart', {

        chart: {
            type: 'columnrange',
            inverted: true,
            height: 130
        },

        title: {
            text: ``
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: `Heart Beat (avg: <b> ${sleepdataJson.Mean_Heart_Rate_BPM}</b> bpm)`,
            style: {
                fontSize: '18px'
            }
        },

        xAxis: {
            visible: false,
            categories: ['']
        },

        yAxis: {
            min: 0,
            title: {
                text: ``
            }
        },

        plotOptions: {
            columnrange: {
                borderRadius: '50%',
                dataLabels: {
                    style: {
                        fontSize: '18px'
                    },
                    enabled: true,
                    format: '{y}',
                }
            }
        },

        exporting: {
            enabled: false
        },
        legend: {
            enabled: false
        },

        series: [{
            name: 'Beat per Min',
            data: [
                [sleepdataJson.Min_Heart_Rate_BPM, sleepdataJson.Max_Heart_Rate_BPM],
            ]
        }]

    });

    //const sleepstagetext = `REM: ${sleepdataJson.REM_Percent}%, ${sleepdataJson.REM_Duration_Hour} Hrs <br/> Light Sleep: ${sleepdataJson.Unstable_Percent}%, ${sleepdataJson.Unstable_Duration_Hour} Hrs <br/>  Deep Sleep: ${sleepdataJson.Stable_Percent}%, ${sleepdataJson.Stable_Duration_Hour} Hrs `

    // Highcharts.chart('sleepstages-chart', {
    //     chart: {
    //         type: 'column',
    //         inverted: true,
    //         height: 250,
    //     },
    //     title: {
    //         text: 'Sleep Stages',
    //     },
    //     subtitle: {
    //         text: sleepstagetext,
    //         style: {
    //             fontSize: '18px'
    //         }
    //     },
    //     xAxis: {
    //         visible: false,
    //         categories: ['']
    //     },
    //     yAxis: {
    //         tickPositions: [0, 20, 40, 60, 80, 100],
    //         title: {
    //             text: ''
    //         },
    //         stackLabels: {
    //             enabled: true
    //         }
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     tooltip: {
    //         headerFormat: '<b>{point.x}</b><br/>',
    //         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    //     },
    //     exporting: {
    //         enabled: false
    //     },
    //     legend: {
    //         enabled: false
    //     },
    //     plotOptions: {
    //         column: {
    //             stacking: 'normal',
    //             dataLabels: {
    //                 enabled: true
    //             }
    //         }
    //     },
    //     series: [{
    //         color: 'darkblue',
    //         name: 'Deep sleep',
    //         data: [sleepdataJson.Stable_Percent]
    //     }, {
    //         color: 'orange',
    //         name: 'Light Sleep',
    //         data: [sleepdataJson.Unstable_Percent]
    //     }, {
    //         color: 'lightgreen',
    //         name: 'REM',
    //         data: [sleepdataJson.REM_Percent]
    //     }]
    // });

    document.getElementById("mloader").style.display = "none"
    document.getElementById("tabDiv").style.display = "block"
    getComments()
}

async function getComments() {
    if (commentTab) showComments();
    comments.general = [];
    comments.pap = [];
    comments.appliance = [];
    comments.inspire = [];
    comments.medication = [];
    comments.event = []
    comments.clinic = []
    comments.dsa1 = []
    comments.dsa2 = []

    commentTab = true;
    let comment, ptime, parsedDate;
    const mostRecentData = REST_DATA.selectedCsvData[singleNight]
    let [foundNih, patAppDataArr, clinic_datapoint, clinic_data] = await getCSMA_APP(mostRecentData.ring_id)

    while (patAppDataArr.length > 0) {
        comment = patAppDataArr.shift()
        let jsondata = JSON.parse(comment.data);
        if (!jsondata.length) jsondata = [jsondata]

        if (comment.type == "general" || (comment.type == "all_comments" && jsondata[0].general)) {
            for (let c of jsondata) {
                if (c.general) {
                    c = c.general
                }
                [ptime, parsedDate] = getPlotTime(c)
                // generalNotesData.push([ptime, commentYvalue]);          

                comments.general.push({
                    'time': parsedDate,
                    'key': "G" + parsedDate,
                    'text': c.data.comment,
                    'actual_date': parsedDate,
                    'type': "G",
                    'plot_date': ptime
                });
                // allPatComment.push(generalNotesObj[ptime]);
            }
        }

        if (comment.type == "med" || (comment.type == "all_comments" && jsondata[0].med)) {
            for (let c of jsondata) {
                if (c.med) {
                    c = c.med
                }
                [ptime, parsedDate] = getPlotTime(c)
                //  medicationData.push([ptime, commentYvalue]);
                comments.medication.push({
                    'time': parsedDate,
                    'key': "M" + parsedDate,
                    'text': c.data.comment,
                    'actual_date': parsedDate,
                    'type': "M",
                    'plot_date': ptime
                });
                //  allPatComment.push(medicationObj[ptime]);
            }
        }

        if (comment.type == "pap" || (comment.type == "all_comments" && jsondata[0].pap)) {
            for (let c of jsondata) {
                if (c.pap) {
                    c = c.pap
                }
                [ptime, parsedDate] = getPlotTime(c)
                //    papData.push([ptime, commentYvalue]);
                comments.pap.push({
                    'time': parsedDate,
                    'key': "P" + parsedDate,
                    'text': c.data.comment,
                    'actual_date': parsedDate,
                    'type': "P",
                    'plot_date': ptime
                });
                //  allPatComment.push(papObj[ptime]);
            }
        }

        if (comment.type == "appliance" || (comment.type == "all_comments" && jsondata[0].appliance)) {
            for (let c of jsondata) {
                if (c.appliance) {
                    c = c.appliance
                }
                [ptime, parsedDate] = getPlotTime(c)
                //  dentalApplianceData.push([ptime, commentYvalue]);
                comments.appliance.push({
                    'time': parsedDate,
                    'key': "D" + parsedDate,
                    'text': c.data.comment,
                    'actual_date': parsedDate,
                    'type': "D",
                    'plot_date': ptime
                });
                //  allPatComment.push(dentalApplianceObj[ptime]);

            }
        }

        if (comment.type == "inspire" || (comment.type == "all_comments" && jsondata[0].inspire)) {
            for (let c of jsondata) {
                if (c.inspire) {
                    c = c.inspire
                }
                [ptime, parsedDate] = getPlotTime(c)
               // let newData = inspireObj[ptime];
               // if (isNull(newData) || (newData['actual_date'] != parsedDate)) {
                    //   inspireData.push([ptime, Number(c.data.inspire_level)]);
                    comments.inspire.push({
                        'time': parsedDate,
                        'key': "I" + parsedDate,
                        'text': 'level: <b>' + c.data.inspire_level + "</b>, " + c.data.comment,
                        'actual_date': parsedDate,
                        'type': "I",
                        'plot_date': ptime
                    });
                    //    allPatComment.push(inspireObj[ptime]);
               // }
            }
        }

        if (comment.type == "event" || (comment.type == "all_comments" && jsondata[0].event)) {
            for (let c of jsondata) {
                if (c.event) {
                    c = c.event
                }
                [ptime, parsedDate] = getPlotTime(c)
                //   eventData.push([ptime, commentYvalue]);
                comments.event.push({
                    'time': parsedDate,
                    'key': "E" + parsedDate,
                    'text': "Type : " + c.data.event_type + "<br/> " + c.data.comment,
                    'actual_date': parsedDate,
                    'type': "E",
                    'plot_date': ptime
                });
                //    allPatComment.push(eventObj[ptime]);
            }
        }

        if (comment.type == "dsa1") {
            for (let c of jsondata) {
                if (!c.data) {
                    if (c["DSA1"]) {
                      c = c["DSA1"]
                    }    
                  } 
                [ptime, parsedDate] = getPlotTime(c)
                comments.dsa1.push([ptime, Number(c.data["DSA1"])]);
            }
        } else if (comment.type == "dsa2") {

            for (let c of jsondata) {
                if (!c.data) {
                    if (c["DSA2"]) {
                      c = c["DSA2"]
                    }    
                  } 
                [ptime, parsedDate] = getPlotTime(c)
                comments.dsa2.push([ptime, Number(c.data["DSA2"])]);
            }
        }
    }


    if (clinic_data.length != 0) {
        clinic_data.forEach(c => {
            c.time = c.actual_date;
            //   allPatComment.push(c);
            comments.clinic.push(c);
        });
    }

    showComments();

}

function showComments() {
    document.getElementById("commentDiv").innerHTML = "";
    let nocomment = true;

    if (comments.general.length > 0) {       
        const g = comments.general.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">General Notes</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    } 

    if (comments.pap.length > 0) {
        const g = comments.pap.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">CPAP/APAP/BiLevel</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (comments.medication.length > 0) {
        const g = comments.medication.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">Medications</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (comments.inspire.length > 0) {
        const g = comments.inspire.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">Inspire</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (comments.appliance.length > 0) {
        const g = comments.appliance.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">Dental Appliances</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (comments.event.length > 0) {
        const g = comments.event.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">Events</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (comments.clinic.length > 0) {
        const g = comments.clinic.filter(e => e.plot_date == ptime)
        if (g.length > 0) {
            nocomment = false;
            const commentStr =
                `<div style="font-weight:bold;color:black;font-size:18px">Clinical Notes</div>
        <div style="text-align:left" class="commentbox">
        ${g.map(e => e.text).join("<br/>")}
        </div>
        <hr />`
            document.getElementById("commentDiv").innerHTML = document.getElementById("commentDiv").innerHTML + commentStr
        }
    }

    if (nocomment) {
        document.getElementById("commentDiv").innerHTML  = '<h3>No comments found. </h3>'
    }
}

function getPlotTime(c) {
    let timezone = "America/Chicago";
    if (REST_DATA.selectedCsvData[0]) {
        timezone = (c.timezone) ? c.timezone : REST_DATA.selectedCsvData[0].timezone;
    }
    let localtime = moment(c.zdate).tz(timezone).format();
    let parsedDate = Date.parse(localtime)
    //localtime = localtime.substring(0, localtime.lastIndexOf("-"));

    let ptime = new Date(localtime).setHours(0, 0, 0, 0) - 1;

    if (!c.data) {
        console.log(c)
    }

    if (c.data.whichnight == "tonight") {
        ptime = moment(localtime).add(1, 'days')._d.setHours(0, 0, 0, 0) - 1;
    }
    return [ptime, parsedDate]
}

function goBackSingleNight() {
    if (singleNight == 0) return;
    singleNight--;
    const mostRecentData = REST_DATA.selectedCsvData[singleNight];
    drawsingleNightCharts(mostRecentData);
}

function goForwardSingleNight() {
    if (singleNight == REST_DATA.selectedCsvData.length - 1)  {
        ptime = moment(ptime).add(2, 'days')._d.setHours(0, 0, 0, 0) - 1;               
        document.getElementById("comment-nightof").innerHTML = `<span style="font-size:21px;position:relative;top:-10px" > Night of ${moment(ptime).format("ddd MMM, Do")}</span>`
        getComments()
        return;
    }
    singleNight++;
    const mostRecentData = REST_DATA.selectedCsvData[singleNight];
    drawsingleNightCharts(mostRecentData);
}
