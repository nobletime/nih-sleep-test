'use strict';
let trendchart_stages, trendchart_tst, trendchart_spo2, trendchart_heartrate, trendchart_ahi, trendchart_spo2_below90;
var REST_DATA = {};
// chart.exportChart({
//     type: 'application/pdf',
//     filename: 'my-pdf'
// });

Highcharts.SVGRenderer.prototype.symbols.plus = function (x, y, w, h) {
    return ['M', x, y + h / 2, 'L', x + w, y + h / 2, 'M', x + w / 2, y, 'L', x + w / 2, y + h, 'z'];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.plus = Highcharts.SVGRenderer.prototype.symbols.plus;
}

Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
    return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
}

$(async function () {
    const profileString = localStorage.getItem("rest-tracker-app-profile")    
    if (profileString == null) {
        alert("Error: You are not onboarded. Please contact support!")
    } else {
        REST_DATA.subject = JSON.parse(profileString)

        if (REST_DATA.subject.ringorpap == "pap") {
            
        }
        if (REST_DATA.subject.ring_id && REST_DATA.subject.ring_id.length > 0) {
            REST_DATA.selectedPatId = REST_DATA.subject.ring_id
            plotChart()
        } else {
            alert(`Error : Tell support that your ring id is ${REST_DATA.subject.ring_id}`)
        }
    }

    document.getElementById("datestart").value = moment(new Date()).subtract(1, "month").format("YYYY-MM-DD")
    document.getElementById("datefinish").value = moment(new Date()).format("YYYY-MM-DD")
});

async function plotChart() {
    REST_DATA.selectedCsvData = await getCsvData(REST_DATA.selectedPatId)
    singleNight = REST_DATA.selectedCsvData.length - 1;
    const mostRecentData = REST_DATA.selectedCsvData[singleNight];
    drawsingleNightCharts(mostRecentData);
    let sleepData = {};

    sleepData.tst = []; sleepData.recording_time = [];
    sleepData.sAHI_3 = []; sleepData.sAHI_4 = []
    sleepData.Min_SpO2 = []; sleepData.Max_SpO2 = []; sleepData.Mean_SpO2 = [];
    sleepData.Mean_Heart_Rate_BPM = []; sleepData.Min_Heart_Rate_BPM = []; sleepData.Max_Heart_Rate_BPM = [];
    sleepData.Sleep_Efficiency = [];
    sleepData.SpO2_Below90_Duration_Sec = [];
    sleepData.REM_Duration_Hour = []; sleepData.Unstable_Duration_Hour = []; sleepData.Stable_Duration_Hour = [];

    for (const d of REST_DATA.selectedCsvData) {
        const sleepdataJson = JSON.parse(d.sleepdata)

        d.plot_date = (sleepdataJson.Start_Time.indexOf("PM") > -1) ?
            moment(sleepdataJson.Start_Date).add(1, 'days') - 1 : new Date(sleepdataJson.Start_Date).setHours(0, 0, 0, 0) - 1

        if (sleepData.recording_time.length > 0) {
            for (let i = sleepData.recording_time[sleepData.recording_time.length - 1][0]; i < (d.plot_date - 86400000); i = i + 86400000) {
                sleepData.recording_time.push(
                    {
                        x: i + 86400000,
                        y: 0,
                        color: "red",
                        //    marker:{
                        //      radius: 3
                        //    }
                    })
                // recording_time.push([i+ 86400000, 0]);    
            }

            for (let i = sleepData.tst[sleepData.tst.length - 1][0]; i < (d.plot_date - 86400000); i = i + 86400000) {
                sleepData.tst.push(
                    {
                        x: i + 86400000,
                        y: 0,
                        color: "red",
                        //    marker:{
                        //      radius: 3
                        //    }
                    })
                // recording_time.push([i+ 86400000, 0]);    
            }
        }

        sleepData.tst.push([d.plot_date, sleepdataJson.TST_Hour]);
        sleepData.recording_time.push([d.plot_date, sleepdataJson["Recording_Time"]]);

        sleepData.SpO2_Below90_Duration_Sec.push([d.plot_date, sleepdataJson.SpO2_Below90_Duration_Sec]);

        sleepData.sAHI_3.push([d.plot_date, sleepdataJson["sAHI_3%"]]);
        sleepData.sAHI_4.push([d.plot_date, sleepdataJson["sAHI_4%"]]);

        sleepData.Min_SpO2.push([d.plot_date, sleepdataJson["Min_SpO2"]]);
        sleepData.Max_SpO2.push([d.plot_date, sleepdataJson["Max_SpO2"]]);
        sleepData.Mean_SpO2.push([d.plot_date, sleepdataJson["Mean_SpO2"]]);

        sleepData.Mean_Heart_Rate_BPM.push([d.plot_date, sleepdataJson["Mean_Heart_Rate_BPM"]]);
        sleepData.Min_Heart_Rate_BPM.push([d.plot_date, sleepdataJson["Min_Heart_Rate_BPM"]]);
        sleepData.Max_Heart_Rate_BPM.push([d.plot_date, sleepdataJson["Max_Heart_Rate_BPM"]]);
        sleepData.Sleep_Efficiency.push([d.plot_date, sleepdataJson["Sleep_Efficiency"]]);

        sleepData.REM_Duration_Hour.push([d.plot_date, sleepdataJson["REM_Duration_Hour"]]);
        sleepData.Unstable_Duration_Hour.push([d.plot_date, sleepdataJson["Unstable_Duration_Hour"]]);
        sleepData.Stable_Duration_Hour.push([d.plot_date, sleepdataJson["Stable_Duration_Hour"]]);
    }

    let cpap = [], min_pressure = [], max_pressure = [];

    REST_DATA.papData = {};
    REST_DATA.papData['pAHI'] = [];
    REST_DATA.papData['pUsage'] = [];
    REST_DATA.papData['pLeak'] = [];
    REST_DATA.papData['pLeak_95th'] = [];
    REST_DATA.papData['pLeak_max'] = [];

    const sqlPapresponse = await fetch(`/getpapdata?tracker_id=${REST_DATA.selectedPatId}`)
    const sqlPapdata = await sqlPapresponse.json()

    for (let p of sqlPapdata) {
        let d = Date.parse(moment(p.date).add(1, "days")) - 1;

        const r = JSON.parse(p.report)

        if (p.report_type == "cpap") {
            if (p.erp_level == 0) p.erp_level = 0.3;
            r.setpressure = Number(r.setpressure);

            cpap.push({
                x: d, low: r.setpressure - r.erp_level, high: r.setpressure, report_type: p.report_type,
                erp_level: r.erp_level, machine: p.machine, mode: p.mode, serial: p.serial_number, ahi: p.ahi, usage: p.pap_usage
            });

        } else if (p.report_type == "bilevel") {
            if (r.epap == r.ipap) r.epap = r.epap - 0.3;
            cpap.push({
                x: d, low: r.epap, high: r.ipap, report_type: p.report_type,
                machine: p.machine, mode: p.mode, serial: p.serial_number, ahi: p.ahi, usage: p.pap_usage
            });

        } else if (p.report_type == "apap") {
            if (r.erp_level == 0) r.erp_level = 0.3;
            cpap.push({
                x: d, low: r.ninetyfive - r.erp_level, high: r.ninetyfive, report_type: p.report_type,
                erp_level: r.erp_level, machine: p.machine, mode: p.mode, serial: p.serial_number, ahi: p.ahi, usage: p.pap_usage,
                min_pressure: r.min_pressure, max_pressure: r.max_pressure
            });

            min_pressure.push([d, r.min_pressure])
            max_pressure.push([d, r.max_pressure]);
        }

        if (REST_DATA.papData['pUsage'].length > 0) {
            for (let i = REST_DATA.papData['pUsage'][REST_DATA.papData['pUsage'].length - 1][0]; i < (d - 86400000); i = i + 86400000) {
                REST_DATA.papData['pUsage'].push(
                    {
                        x: i + 86400000,
                        y: 0,
                        color: "red",
                        // marker:{
                        //   radius: 3
                        // }
                    })
            }
        }
        REST_DATA.papData['pAHI'].push([d, p.ahi]);
        REST_DATA.papData['pUsage'].push([d, p.pap_usage]);
        REST_DATA.papData['pLeak'].push([d, p.leaks || 0]);
        REST_DATA.papData['pLeak_95th'].push([d, p.leaks_95th || 0]);
        REST_DATA.papData['pLeak_max'].push([d, p.leaks_max || 0]);
    }

    let tstPapData = []
    if (REST_DATA.papData['pUsage'].length > 0) {
        tstPapData = [{
            color: 'black',
            name: 'Ring Usage',
            data: sleepData.recording_time
        }, {
            name: 'PAP Usage',
            color: 'red',
            data: REST_DATA.papData['pUsage']
        }]
    } else {
        tstPapData = [{
            color: 'darkblue',
            name: 'Recording time',
            data: sleepData.recording_time
        }, {
            color: 'green',
            name: 'Total sleep time',
            data: sleepData.tst
        }]
    }

    trendchart_tst = Highcharts.chart('trend-chart-tst', {
        chart: {
            type: 'spline',
        },
        legend: {
            itemStyle: {
                fontSize: '15px',
            }
        },
        title: {
            text: '',
            align: 'left'
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            type: "datetime",
            events: {
                afterSetExtremes: function (e) {
                    const rc = e.target.series[0].data.filter(d => d.x >= e.min && d.x <= e.max && d.y != 0).map(d => d.y)
                    const tst = e.target.series[1].data.filter(d => d.x >= e.min && d.x <= e.max && d.y != 0).map(d => d.y)

                    // if (e.target.series[2]) {
                    //     papusage= e.target.series[2].data.filter(d => d.x >= e.min && d.x <= e.max && d.y != 0).map(d => d.y)
                    // }                    

                    // const papusage_average = Math.round(papusage.reduce(function (sum, value) {
                    //     return sum + value;
                    // }, 0) / rc.length);

                    const rc_average = Math.round(rc.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / rc.length);

                    const tst_average = Math.round(tst.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / tst.length);

                    if (REST_DATA.papData['pUsage'].length > 0) {
                        trendchart_tst.legend.allItems[0].name = `Ring Usage (Avg: ${rc_average})`
                        trendchart_tst.legend.allItems[1].name = `Pap Usage (Avg: ${tst_average})`
                    } else {
                        trendchart_tst.legend.allItems[0].name = `Recording Time (Avg: ${rc_average})`
                        trendchart_tst.legend.allItems[1].name = `Total sleep time (Avg: ${tst_average})`
                    }

                    // trendchart_tst.legend.allItems[2].name = `Total sleep time (Avg: ${tst_average})`
                    trendchart_tst.legend.update();
                }
            }
        },
        yAxis: {
            tickPositions: [0, 2, 4, 6, 8, 10],
            showFirstLabel: false,
            title: {
                useHTML: true,
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
            //  pointFormat: '<span style="font-size:16px"> <b>{point.y} ({point.percentage:.1f}%)</b></span>'            
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                }
            }
        },
        series: tstPapData
    });

    let ahiPapData = []
    if (REST_DATA.papData['pAHI'].length > 0) {
        ahiPapData = [{
            color: 'blue',
            name: 'AHI 3%',
            data: sleepData.sAHI_3
        }, {
            color: 'black',
            name: 'AHI 4%',
            data: sleepData.sAHI_4
        }, {
            color: 'red',
            name: 'PAP AHI',
            data: REST_DATA.papData['pAHI']
        }]
    } else {
        ahiPapData = [{
            color: 'blue',
            name: 'AHI 3%',
            data: sleepData.sAHI_3
        }, {
            color: 'black',
            name: 'AHI 4%',
            data: sleepData.sAHI_4
        }]
    }


    trendchart_ahi = Highcharts.chart('trend-chart-ahi', {
        chart: {
            type: 'spline',
        },
        title: {
            text: '',
            align: 'left'
        }, legend: {
            itemStyle: {
                fontSize: '15px',
            }
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            type: "datetime",
            events: {
                afterSetExtremes: function (e) {
                    const ahi_3 = e.target.series[0].data.filter(d => d.x >= e.min && d.x <= e.max).map(d => d.y)
                    const ahi_4 = e.target.series[1].data.filter(d => d.x >= e.min && d.x <= e.max).map(d => d.y)
                    const ahi_3_average = Math.round(ahi_3.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / ahi_3.length);

                    const ahi_4_average = Math.round(ahi_4.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / ahi_4.length);

                    trendchart_ahi.legend.allItems[0].name = `AHI 3% (Avg: ${ahi_3_average})`
                    trendchart_ahi.legend.allItems[1].name = `AHI 4% (Avg: ${ahi_4_average})`
                    trendchart_ahi.legend.update();
                }
            }
        },
        yAxis: {
            tickPositions: [0, 5, 15, 30, 45],
            showFirstLabel: false,
            plotBands: [{
                color: 'lightgreen',
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
            }, {
                color: '#FF474D',
                from: 30,
                to: 45
            }],
            title: {
                useHTML: true,
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                }
            }
        },
        series: ahiPapData
    });

    // {
    //     type: 'pie',
    //     name: 'Total',
    //     data: [{
    //         name: '2020',
    //         y: 619,
    //         color: Highcharts.getOptions().colors[0], // 2020 color
    //         dataLabels: {
    //             enabled: true,
    //             distance: -50,
    //             format: '{point.total} M',
    //             style: {
    //                 fontSize: '15px'
    //             }
    //         }
    //     }, {
    //         name: '2021',
    //         y: 386,
    //         color: Highcharts.getOptions().colors[1] // 2021 color
    //     }],
    //     center: [110, 28],
    //     size: 100,
    //     innerSize: '70%',
    //     showInLegend: false,
    //     dataLabels: {
    //         enabled: false
    //     }
    // },

    trendchart_spo2 = Highcharts.chart('trend-chart-spo2', {
        chart: {
            type: 'spline',
        },
        legend: {
            itemStyle: {
                fontSize: '15px',
            }
        },
        title: {
            text: '',
            align: 'left'
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            type: "datetime",
        },
        yAxis: {
            min: 70, max: 100,
            showFirstLabel: false,
            title: {
                useHTML: true,
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'Max Spo2',
            data: sleepData.Max_SpO2
        }, {
            name: 'Mean Spo2',
            data: sleepData.Mean_SpO2
        }, {
            name: 'Min Spo2',
            data: sleepData.Min_SpO2
        }]
    });

    trendchart_spo2_below90 = Highcharts.chart('trend-chart-SpO2_Below90_Duration_Sec', {
        chart: {
            type: 'spline',
            height: 300
        },
        legend: {
            itemStyle: {
                fontSize: '15px',
            }
        },
        title: {
            text: '',
            align: 'left'
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            type: "datetime",
        },
        yAxis: {

            showFirstLabel: false,
            title: {
                useHTML: true,
                text: ''
            },
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'SpO2_Below90_Duration',
            data: sleepData.SpO2_Below90_Duration_Sec,
            tooltip: {
                pointFormatter: function () {
                    const m = Math.floor(this.y / 60);
                    const s = this.y - m * 60;
                    return `${m}:${s} (mins:sec)`
                }
            }
        }]
    });

    trendchart_heartrate = Highcharts.chart('trend-chart-heartrate', {
        chart: {
            type: 'spline',
        },
        legend: {
            itemStyle: {
                fontSize: '15px',
            }
        },
        title: {
            text: '',
            align: 'left'
        },
        subtitle: {
            text: '',
            align: 'left'
        },
        xAxis: {
            type: "datetime",
            events: {
                afterSetExtremes: function (e) {
                    const mean_heartrate = e.target.series[1].data.filter(d => d.x >= e.min && d.x <= e.max).map(d => d.y)
                    const mean_heartrate_average = Math.round(mean_heartrate.reduce(function (sum, value) {
                        return sum + value;
                    }, 0) / mean_heartrate.length);

                    trendchart_heartrate.legend.allItems[1].name = `Mean Heartrate (Avg: ${mean_heartrate_average})`
                    trendchart_heartrate.legend.update();
                }
            }
        },
        yAxis: {
            showFirstLabel: false,
            title: {
                useHTML: true,
                text: ''
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                }
            }
        },
        series: [{
            name: 'Max Heartrate',
            data: sleepData.Max_Heart_Rate_BPM
        }, {
            name: 'Mean Heartrate',
            data: sleepData.Mean_Heart_Rate_BPM
        }, {
            name: 'Min Heartrate',
            data: sleepData.Min_Heart_Rate_BPM
        }]
    });

    // trendchart_stages = Highcharts.chart('trend-chart-stages', {
    //     chart: {
    //         type: 'area',
    //     },
    //     legend: {
    //         itemStyle: {
    //             fontSize: '15px',
    //         }
    //     },
    //     title: {
    //         text: '',
    //         align: 'left'
    //     },
    //     subtitle: {
    //         text: '',
    //         align: 'left'
    //     },
    //     xAxis: {
    //         type: "datetime",
    //     },
    //     yAxis: {
    //         tickPositions: [0, 2, 4, 6, 8],
    //         showFirstLabel: false,
    //         title: {
    //             useHTML: true,
    //             text: ''
    //         }
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     tooltip: {
    //         shared: true,
    //         headerFormat: `<b>{point.x:%A, %b %e %Y}</b><br/>`,
    //     },
    //     plotOptions: {
    //         area: {
    //             stacking: 'normal',
    //             lineColor: '#666666',
    //             lineWidth: 1,
    //             marker: {
    //                 enabled: false,
    //                 lineWidth: 1,
    //                 lineColor: '#666666'
    //             }
    //         }
    //     },
    //     series: [{
    //         type: 'area',
    //         color: 'darkblue',
    //         name: 'Deep sleep',
    //         data: sleepData.Stable_Duration_Hour
    //     }, {
    //         type: "area",
    //         color: 'orange',
    //         name: 'Light Sleep',
    //         data: sleepData.Unstable_Duration_Hour

    //     }, {
    //         type: "areaspline",
    //         color: 'lightgreen',
    //         name: 'REM',
    //         data: sleepData.REM_Duration_Hour
    //     }]
    // });


    setExteremes()

}

function setExteremes() {
    trendchart_tst.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
  //  trendchart_stages.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
    trendchart_spo2.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
    trendchart_spo2_below90.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
    trendchart_heartrate.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
    trendchart_ahi.xAxis[0].setExtremes(moment(document.getElementById("datestart").value, "YYYY-MM-DD").add(1, 'days') - 1, moment(document.getElementById("datefinish").value, "YYYY-MM-DD").add(1, 'days') - 1)
}


function createChart() {
    let i = 0, k = 0, yAxisColors = ['#000000', '#0000ff', '#009933', Highcharts.getOptions().colors[5], '#000000', '#0000ff', '#009933', Highcharts.getOptions().colors[5]];

    let oExportMenu = Highcharts.getOptions().exporting.buttons.contextButton.menuItems, exportMenu = []

    exportMenu.push(
        {
            "text": '<span style="color:blue">Parameter Definition</span>', onclick: function () { document.getElementById("infoBtn").click() }
        },
        {
            "text": '<span style="color:blue">Help</span>',
            onclick: function () { document.getElementById("helpBtn").click() }
        })

    exportMenu = exportMenu.concat(oExportMenu.slice(7, 10));


    //  exportMenu.push({ text: "VIEW INFO", onclick: downloadFullReportOriginal });
    //  exportMenu.push({ text: "CONTACT SUPPORT", onclick: downloadFullReportOriginal });
    //exportMenu.push({ text: "Download Report (PDF)", onclick: downloadFullReportOriginal });

    var initChart = {
        chart: {
            height: chartHeight,
            type: 'spline',
            inverted: false,
            animation: false,
            ignoreHiddenSeries: false,
            panning: false,
            //  zoomType: 'x',
            // marginTop: 40,
        },
        plotOptions: {
            columnrange: {
                dataLabels: {
                    enabled: false,
                    format: '{y}°C'
                },
                grouping: false
            },
            column: {
                pointWidth: 7,
                grouping: false
            },
            series: {
                lineWidth: 1,
                showCheckbox: false,
                stickyTracking: true,
                //  pointWidth: 15,
                animation: {
                    duration: 0
                },
                marker: {
                    enabled: true
                },
                dataGrouping: {
                    enabled: false
                },
                states: {
                    inactive: {
                        opacity: 1
                    }
                },
                events: {
                    contextmenu: function (e) {
                        return false;
                    },
                    checkboxClick: function (event) {
                        this.options.enableMouseTracking = !this.options.enableMouseTracking;
                        return (this.options.enableMouseTracking) ? true : false;
                    },
                    show: toggleAxisExtremes,
                    hide: toggleAxisExtremes,
                }
            }
        },
        legend: {
            symbolHeight: 10,
            itemMarginTop: 2,
            itemStyle: {
                fontWeight: 'bold',
                fontSize: '13px'
            },
            //     y: topLegend,
            // top:600,
            enabled: false
        },
        subtitle: {
            text: 'test'
        },
        credits: {
            enabled: false
        },
        scrollbar: {
            liveRedraw: false
        },
        tooltip: {
            enabled: true,
            split: true,
            shared: false,
            headerFormat: "{point.x:%A, %b %e %Y}", // "{point.key:%b'%d}",            
            useHTML: true,
            brderWidth: 0,
            style: {
                whiteSpace: 'normal',
                fontSize: '15px'
            },
        },
        series: [],
        xAxis: {
            // top: topxAxis,
            type: 'datetime',
            minorTicks: true,
            minorTickInterval: 4 * 3600 * 1000,
            endOnTick: true,
            // tickInterval:3600 * 1000,
            events: {

                afterSetExtremes: (e) => {

                    document.querySelectorAll(".xmin").forEach(e => {
                        e.innerHTML = moment(chart.xAxis[0].min).format("MMM DD");
                        e.style.left = `${chart.xAxis[0].toPixels(chart.xAxis[0].min)}px`
                    })

                    document.querySelectorAll(".xmax").forEach(e => {
                        e.innerHTML = moment(chart.xAxis[0].max).format("MMM DD");
                        e.style.left = `${chart.xAxis[0].toPixels(chart.xAxis[0].max)}px`
                    })

                    // RUN ONLY IF APPDATA IS LOADED         
                    displayComment = allPatComment.filter(x => (x.plot_date >= e.target.min && x.plot_date <= e.target.max));
                    for (i = 0; i < displayComment.length; i++) {
                        displayComment[i]['index'] = i + 1;
                    }

                    addPatCommentDiv(displayComment);

                    if (e.max - e.min <= 2682000000) { // one month or less add comment numbers

                        addCommentNumbers();

                    } else {
                        clearCommentNumbers()
                    }
                }
            },

            labels: {
                enabled: false,
                // format: "{value:point.x:%e %b %H:%M}", // "{value:%b'%d}",
                formatter: function () {
                    return Highcharts.dateFormat("%b'%d", this.value - 2);
                },
                //  rotation: 90,
                x: 0,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold'
                }
            },
        },
        yAxis: []

        , rangeSelector: {
            selected: 0,
            //  x: 30,
            //  y:-10,
            inputStyle: {
                float: "right",
                fontSize: "17px",
                color: "#000"
            },
            buttons: [{
                type: 'week',
                count: 1,
                text: '1w'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            },
            {
                type: 'year',
                count: 1,
                text: '1y'
            }, {
                type: 'all',
                text: 'All'
            }]
        },

        navigator: {
            top: topNav,
            enabled: true,
            height: 25,
            xAxis: {
                // tickPositioner:  function() {
                //     return calculateYpositions(minMaxSingle["min"], minMaxSingle["max"]);
                // },
                labels: {
                    enabled: false,
                    format: "{value:%b'%d}",
                    style: {
                        fontSize: '14px',
                        color: "#000000"
                    }
                }

                // tickWidth: 1,
                // lineWidth: 1,
                // gridLineWidth: 1,
                // tickPixelInterval: 10,
                // labels: {
                //        align: 'left',
                //     style: {
                //         color: '#888'
                //     },
                //     x: 3,
                //     y: -4
                // }
            },
            series: {
                visible: false,
                data: []
            }
        },
        exporting: {
            title: {
                text: "exporting"
            },
            buttons: {

                contextButton: {
                    menuItems: exportMenu
                }

                //  contextButton: 
                //  {
                //     menuItems: [
                //         {
                //             "text": '<span style="color:blue">Parameter Definition</span>', onclick:function() {document.getElementById("infoBtn").click()}
                //         },
                //         {
                //             "text": '<span style="color:blue">Help</span>',
                //             onclick:function() {document.getElementById("helpBtn").click()}
                //         }
                //     ]
                // }
            },
            //  width: 500,
            filename: chartTitle,
            chartOptions: {
                chart: {
                    //  top: 100,
                    //  height: 2000,
                    marginLeft: 0,
                    marginRight: 0,
                    events: {
                        load: function () {
                            //  prepareChartforDownloadPDF(this);
                            //  downloadFullReportPDF(this);
                        },
                    }
                },
                legend: {
                    enabled: false
                    //   y: -220
                },
                rangeSelector: {
                    // enabled:false
                },
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                }
            }
        }
    }

    let x = -1, orderLst = [3, 1, 2, 4, 5, 7, 6, 8];//, legendOrder = [0,1,4,5,2,3,6,7];
    for (i = 0; i < axisDataChart.length; i++) {
        if (axisDataChart[i].length > 0) {
            k = i + 1, x++;
            //let axisName =  $("#btnAxis-" + k).html();
            // let axisName = $("#btnAxis-" + k).val();
            let axisName = REST_DATA.axis[i].name;

            // enforce min max if entered
            // if ($("#axisMinTxt-" + k).val().length != 0) minMaxSingle["min"] = Number($("#axisMinTxt-" + k).val());
            // if ($("#axisMaxTxt-" + k).val().length != 0) minMaxSingle["max"] = Number($("#axisMaxTxt-" + k).val());

            let yAxis = { // yAxis [i]
                top: (i == 0) ? 320 : i * 230 + 320,
                offset: (i < 6) ? 0 : 60,
                //   min: yScale[axisName].min,
                //   max: yScale[axisName].max,
                //   tickPositioner: function () {
                //       return calculateYpositions(yScale[axisName].min, yScale[axisName].max);
                //   },             
                className: "axis-index-" + i,
                labels: {
                    // x: window.innerWidth *0.8,
                    // y: 0,   
                    format: '{value}',
                    style: {
                        color: yAxisColors[x],
                        fontSize: '15px'
                    },
                    events: {
                        click: function () {
                            this.axis.update({
                                reversed: !this.axis.reversed
                            })
                        }
                    }
                },
                // title: {
                //     text: axisName,
                //     //   x: -1* window.innerWidth *0.8,
                //     //   y: 0,   
                //     style: {
                //         color: yAxisColors[x],
                //         fontSize: '13px'//,
                //         // fontWeight: 'bold'
                //     },
                //     events: {
                //         click: function (e) {
                //             const sleepParams = Object.keys(yScale).sort();
                //             let select = ""
                //             for (const v of sleepParams) {
                //                 if (v == e.currentTarget.innerHTML) {
                //                     select = select + `<option selected value="${v}">${v}</option>`;
                //                 } else {
                //                     select = select + `<option value="${v}">${v}</option>`;
                //                 }
                //             }

                //             const elem = document.getElementById("axislist");
                //             elem.style.display = "block"
                //             elem.innerHTML = select;
                //             elem.style.top = `${e.pageY}px`;
                //             elem.style.left = `${e.pageX}px`;

                //             // which index is clicked
                //             const axisElem = this.element.parentGroup.element.getAttribute("class")
                //             const axisIndex = Number(axisElem.substring(axisElem.indexOf("axis-index") + 11));

                //             elem.setAttribute("selectedAxisIndex", axisIndex)
                //         }
                //     }
                // },
                height: sleepDataAxisHeight,
                visible: true,
                reversed: (REST_DATA.axis[i].reversed) ? REST_DATA.axis[i].reversed : false,
                showLastLabel: true,
                'allowDecimals': true,
                opposite: (REST_DATA.axis[i].opposite) ? REST_DATA.axis[i].opposite : false
            }

            if (axisName == "SpO2_Below90_Percent") {
                const minMaxSingle = findMindMax2D(axisDataChart[i], axisName);
                yAxis["min"] = minMaxSingle.min;
                yAxis["max"] = minMaxSingle.max;
            }

            var ySerie = {
                name: axisName,
                data: axisDataChart[i],
                yAxis: x,
                color: yAxisColors[x],
                visible: true,
                enableMouseTracking: true,  //,                 legendIndex: legendOrder[x]
                tooltip: {
                    pointFormatter: function () {
                        console.log(`${this.series.index} ${this.series.name} `)
                        return this.y
                    },
                    positioner: function (width, height, point) {
                        return {
                            x: point.plotX,
                            y: point.plotY
                        }
                    }
                }
            }

            initChart.yAxis.push(yAxis);
            initChart.series.push(ySerie);
        }
    }

    // add four axis for Patient Comments

    for (let i = 0; i < 7; i++) {
        initChart.yAxis.push({
            //  id: commentSeriesShortName[i],
            min: 5,
            max: 5,
            title: {
                text: commentSeriesShortName[i]
            },
            top: topComment + 50 * i,
            height: 30,
            opposite: false,
            offset: -10,
            gridLineColor: 'transparent',
            //    tickPositions: (i==4)? [0,1,2,3,4,5,6,7,8,9,10,11] : [-5,5],
            //  lineColor: 'transparent',
            labels: {
                enabled: false
            },
            plotBands: (i < 5) ? [{
                color: '#F0F0F0',
                from: 0,
                to: 11
            }] : [{
                color: '#ffffcc',
                from: 0,
                to: 11
            }]
        });

        initChart.series.push({
            id: commentSeriesShortName[i],
            name: commentSeriesName[i],
            data: [],
            step: 'left',
            type: (i == 4) ? 'area' : 'line',
            //   grouping: (i == 4) ? false : true,
            lineWidth: (i == 4) ? 1 : 0,
            yAxis: initChart.yAxis.length - 1,
            enableMouseTracking: true,
            showInLegend: false,
            opacity: 0.5,
            marker: {
                enabled: true,
                radius: (i == 4) ? 2 : 8,
                symbol: (i == 5) ? 'url(public/imgage/event_symbol.jpg)' : commentSeriesShape[i],
                lineColor: null,
                lineWidth: (i < 5) ? 1 : 4
            },
            //  selected: true,
            color: (i == 4) ? '#000000' : yAxisColors[i],
            fillColor: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgba(0,0,0,0.3)'],
                    [1, '#F0F0F0']
                ]
            },
            point: {
                events: {
                    mouseOver: function (e) {
                        var sObj = appSeriNameToObj[this.series.name][this.x];
                        if (isNull(sObj)) return;
                        let todayComment = allPatComment.filter(x => (x.plot_date == this.x));
                        var relatedComment = todayComment.filter(x => (x['key'].substring(0, 1) == sObj.key.substring(0, 1)));
                        makeTextHighlight(relatedComment);
                    }
                }
            },
            tooltip: {
                pointFormatter: function () {
                    //  console.log(this.series.name + " " + moment().tz(Highcharts.getOptions().time.timezone).format());
                    let sObj = appSeriNameToObj[this.series.name][this.x], d = "", tooltip = '', i = 0, _user = "";

                    if (isNull(sObj)) return tooltip;
                    let commentKey = sObj.key.substring(0, 1);

                    let relatedComment = displayComment.filter(x => (x.plot_date == this.x) &&
                        (x['key'].substring(0, 1) == commentKey));

                    for (let item of relatedComment) {
                        i++;
                        d = new Date(item.time).toString();
                        if (item.user) _user = `<span style="font-size:12px !important">--- ${item.user} </span><br/>`
                        tooltip = tooltip + '<b>' + item.index + ". " + this.series.name + '</b><br/> (' + d.substring(0, d.indexOf("GMT") - 1) + ")<br/>" +
                            '<span style="font-size:15px">' + item.text + '</span><br/>' + _user;
                    }
                    return tooltip
                }
            }
        });
    }

    // add two DSA Axis
    initChart.yAxis.push({
        title: {
            text: 'Stanford Sleepiness Scale'
        },
        top: topDSAaxis,
        height: DSAHeight,
        opposite: false,
        offset: 0,
        // labels:{
        //     style:{
        //         color:'black'
        //     }
        // },

        lineWidth: 3,
        gridLineColor: 'transparent',
        // reversed: false,
        lineColor: '#000',
        showLastLabel: true,
        tickPositions: [1, 2, 3, 4, 5, 6, 7],
        reversed: true
    });

    initChart.yAxis.push({
        title: {
            text: 'Sleep Quality Scale'
        },
        // left: 170,
        top: topDSAaxis,
        height: DSAHeight,
        opposite: true,
        offset: 0,
        color: 'blue',
        lineWidth: 3,
        // lineColor: 'transparent',
        lineColor: '#0000FF',
        gridLineColor: 'transparent',
        // reversed: false,
        showLastLabel: true,
        tickPositions: [1, 2, 3, 4, 5]
    });

    initChart.series.push({
        //  type: 'column',
        id: "SSS",
        name: "SSS",
        data: [],
        yAxis: initChart.yAxis.length - 2,
        enableMouseTracking: false,
        lineWidth: 1,
        connectNulls: true,
        // selected: true,
        marker: {
            enabled: true,
            radius: 2
        },
        color: 'black',
        //dashStyle: 'shortdot',
        showInLegend: false
    });

    initChart.series.push({
        // type: 'column',
        id: "SS",
        name: "SS",
        data: [],
        enableMouseTracking: false,
        yAxis: initChart.yAxis.length - 1,
        lineWidth: 1,
        connectNulls: true,
        //  selected: true,
        marker: {
            enabled: true,
            radius: 2
        },
        color: 'blue',
        //dashStyle: 'shortdot',
        showInLegend: false
    });


    // RECORDING TIME
    // let minMaxSingle = findMindMax2D(axisDataChart[i], "Recording_Time");
    initChart.yAxis.push({
        id: 'yRT',
        // title: {
        //     text: 'Recording Time (hours)',
        // },
        // labels:{
        //     align: "high",
        //     textAlign: "left",
        //     rotation: 0,
        //     offset: 0,
        //     margin: 0,             
        //      x: -70
        //  },
        // left: 170,
        className: "axis-index-rt",
        top: topRecoringTime,
        height: 140,
        opposite: false,
        offset: 10,
        lineWidth: 3,
        // gridLineColor: 'transparent',
        tickPositions: [0, 4, 8, 12],
        gridLineColor: '#000000',
        gridLineWidth: 0,
        plotLines: [{
            color: '#008000',
            width: 0.6,
            value: 2,
            zIndex: 5,
            dashStyle: "Dash"
        }, {
            color: '#008000',
            width: 0.6,
            value: 4,
            zIndex: 5,
            dashStyle: "Dash"
        }, {
            color: '#008000',
            width: 0.6,
            value: 6,
            zIndex: 5,
            dashStyle: "Dash"
        }, {
            color: '#008000',
            width: 0.6,
            value: 8,
            zIndex: 5,
            dashStyle: "Dash"
        }],
        showLastLabel: true,
        showFirstLabel: true,
    });

    initChart.series.push({
        // type: 'column',
        yAxis: initChart.yAxis.findIndex(e => e.id == "yRT"),
        id: "RT",
        //  name: "RT",
        type: "area",
        enableMouseTracking: true,
        data: [],
        showInLegend: true,
        //  selected: true,
        zoneAxis: 'x',
        zones: [],
        marker: {
            enabled: true,
            radius: 5
        },
        color: Highcharts.getOptions().colors[0],
        fillColor: {
            linearGradient: {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1
            },
            stops: [
                [0, '#ffffff'],
                [1, 'rgba(102,133,194,0.3)']
            ]
        }, point: {
            events: {
                click: function (e) {
                    (this.x % 1000 == 999) ? onPointClick(this.x)
                        : onPointClick(this.x - 1)
                }
            }
        },
        tooltip: {
            style: {
                zIndex: 9999
            },
            pointFormatter: function () {
                // JSON.parse(REST_DATA.selectedCsvData[0].sleepdata).Start_Date
                // let rtTooltip = "";  headerFormat: "{point.x:%A, %b %e %Y}"
                const recordedNight = REST_DATA.selectedCsvData.find(e => e.plot_date == this.x)
                const ptime = moment(this.x).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(1, "days") - 1;
                if (!recordedNight) {
                    document.getElementById("displayInfo").style.display = "none";
                    return `<span style="color:red;text-decoration:underline">Night of ${moment(this.x).format("ddd, MMM D YYYY")} <br/>No data </span>`
                } else {
                    const csvData = JSON.parse(recordedNight.sleepdata)
                    const start_time = moment(csvData.Sleep_Onset_SI.split(" ")[1], "hh:mm").format("HH:mm"); //moment(csvData.Sleep_Onset_SI.split(" ")[1], "hh:mm").format("hh:mm A")
                    const end_time = moment(csvData.Sleep_Conclusion.split(" ")[1], "hh:mm").format("HH:mm"); // moment(csvData.Sleep_Conclusion.split(" ")[1], "hh:mm").format("hh:mm A")    

                    const total_start_time = moment(csvData.Report_Start_Date.split(" ")[1], "hh:mm").format("HH:mm"); // csvData.Report_Start_Date.split(" ")[1].split(":")
                    const total_end_time = moment(csvData.Report_End_Date.split(" ")[1], "hh:mm").format("HH:mm"); // csvData.Report_End_Date.split(" ")[1].split(":")

                    const htmlDiv = `<span style="color:black;text-decoration:underline;font-weight:bold">Night of ${moment(this.x).format("ddd, MMM D")}</span><br/> 
                    <span style="color:blue;">  ${total_start_time} - ${total_end_time} = ${decimalHoursToHHMM(this.y)} (recorded) </span><br/>
                            <span style="color:red">  ${start_time} - ${end_time} = ${decimalHoursToHHMM(csvData.TST_Hour)} (sleep) </span>
                    <br/> 
                     <span style="color:green; font-weight:bold;font-style: italic; "> ${csvData.Mean_SpO2}, ${csvData.Min_SpO2} - ${csvData.Max_SpO2} (SpO2 μ, min-max) </span>
                    `
                    document.getElementById("displayInfoText").innerHTML = htmlDiv;
                    document.getElementById("displayInfo").style.display = "block";
                    return false;
                }
            }
        }
        // , showInLegend:true
    });


    chart = new Highcharts.stockChart('chart', initChart, function (chart) {

        const totalBackBtn = document.querySelectorAll(".backward-forward.back-chart")
        const totalForwardBtn = document.querySelectorAll(".backward-forward.forward-chart")
        const axisSeperator = document.querySelectorAll(".axis-seperator")
        const totalmin = document.querySelectorAll(".xmin")
        const totalmax = document.querySelectorAll(".xmax")

        const sleepParams = Object.keys(yScale).sort();
        let i = -1;

        for (const c of REST_DATA.axis) {
            let select = ""
            for (const v of sleepParams) {
                if (v == c.name) {
                    select = select + `<option selected value="${v}">${v}</option>`;
                } else {
                    select = select + `<option value="${v}">${v}</option>`;
                }
            }

            i++;
            const elem = document.getElementById("axislist" + i);
            elem.style.display = "block"
            elem.innerHTML = select;
            elem.style.textAlign = `center`;

            const top = (chart.yAxis[i].reversed) ? chart.yAxis[i].toPixels(chart.yAxis[i].max) : chart.yAxis[i].toPixels(chart.yAxis[i].min);
            const inc = (document.getElementById("mydatadiv").style.display == "none") ? 295 : 248;

            elem.style.top = `${top + inc}px`;
            elem.style.border = `1px ${yAxisColors[i]} solid`

            totalBackBtn[i].style.top = elem.style.top;
            totalForwardBtn[i].style.top = elem.style.top;
            axisSeperator[i].style.top = `${top + inc - 8}px`;
            totalmin[i].style.top = `${top + inc - 18}px`;
            totalmax[i].style.top = `${top + inc - 18}px`;
            //elem.style.zIndex = 9999
        }

        const rtAxis = chart.get("RT").yAxis;
        const tmpTop = rtAxis.toPixels(rtAxis.min)
        const inc = (document.getElementById("mydatadiv").style.display == "none") ? 240 : 240;

        totalBackBtn[4].style.top = `${tmpTop + inc}px`;
        totalForwardBtn[4].style.top = `${tmpTop + inc}px`;
        axisSeperator[4].style.top = `${tmpTop + inc - 8}px`;
        document.getElementById("recording_time_text").style.top = `${tmpTop + inc}px`;
        document.getElementById("recording_time_text").style.display = "block";

        document.querySelectorAll(".backward-forward").forEach(e => e.style.display = "block")

        // document.querySelectorAll(".xmin").forEach(e=> {
        //     e.innerHTML = moment(chart.xAxis[0].min).format("MMM DD");
        //     e.style.left = `${chart.xAxis[0].toPixels(chart.xAxis[0].min)}px` 
        // })

        // document.querySelectorAll(".xmax").forEach(e=> {
        //     e.innerHTML = moment(chart.xAxis[0].max).format("MMM DD");
        //     e.style.left = `${chart.xAxis[0].toPixels(chart.xAxis[0].max)}px`
        // })


        if (chart.options.chart.forExport) {
            prepareChartforDownloadPDF(chart);
        } else {

        }
    });

    mouseTracking = false;
    checkLegendFomMouseTracking();
    drawTresholdPlotlines();
    cloneToolTip = null, cloneToolTip2 = null;

    chart.update({
        exporting: {
            filename: chart.subtitle.textStr + "_from_" + (new Date(chart.xAxis[0].dataMin).toLocaleDateString())
        }
    })


}

function getCsvData(patient_id) { // may need to add clinic_id 
    return new Promise((resolve, reject) => {
        fetch(`/getCsvData?ring_id=${patient_id}`).then(response => response.json())
            .then(data => resolve(data));
    })
}

Highcharts.setOptions({
    time: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
});

function findMindMax2D(arr2D, axisName) {
    if (axisName.length == 0) return [];
    var yValues = arr2D.map(function (e) { return e[1] });
    let minMaxSingle = { "min": Math.min.apply(null, yValues), "max": Math.max.apply(null, yValues) };
    minMaxSingle.min = (yScale[axisName].min > minMaxSingle.min) ? minMaxSingle.min : yScale[axisName].min;
    minMaxSingle.max = (yScale[axisName].max < minMaxSingle.max) ? minMaxSingle.max : yScale[axisName].max;
    if (minMaxSingle.min < 0) minMaxSingle.min = 0;
    return minMaxSingle;
}

function prepareChartforDownloadPDF(chart) {

    chart.rangeSelector.update({
        enabled: false
    });

    chart.yAxis[chart.get('SS').index].update({
        top: '70%'
    });
    chart.yAxis[chart.get('SSS').index].update({
        top: '70%'
    });
    chart.xAxis[0].update({
        visible: false,
        top: '-33%',
        labels: {
            enabled: false,
            format: '{value:%m-%d-%y}',
            rotation: 90, x: -20,
            style: {
                fontSize: '10px'//,
            }
        }
    });
}

function downloadPDF(svg, outFileName, chartTitle, size, reportEvent, cb) {
    //userPassword :"hello"
    chart.setTitle(null, { text: '' });
    var cloneSvg = svg.cloneNode(true);
    var doc = new PDFDocument({ compress: false, size: size });

    let fromTxt = $(".highcharts-label.highcharts-range-input")[0].getElementsByTagName('text')[0].innerHTML,
        toTxt = $(".highcharts-label.highcharts-range-input")[1].getElementsByTagName('text')[0].innerHTML;


    doc.text(chartTitle, 10, 20, {
        align: 'center'
    });
    doc.moveDown(0.5);
    doc.text("(" + fromTxt + ' - ' + toTxt + ")", {
        align: 'center'
    });
    SVGtoPDF(doc, cloneSvg, 0, 50);

    doc.moveDown(3);
    let x = screen.width * 0.17578125, y = screen.height * 1 / screen.height * 780;
    if (size == "A4")
        x = 50, y = 600

    doc.moveTo(x, y)
        .lineTo(x, y + 100)
        .lineWidth(1)
        .moveTo(x + 40, y + 20)
        .lineTo(x + 40, y + 100)
        .fillColor('black')
        .fontSize(16)
        .text("Upper graph", x - 150, y)
        .fontSize(14)
        .text("AVG   SD    ", x - 35, y + 10, {
            underline: true
        });

    let legends = [2, 0, 1, 3], legendElem, i = 0, k = -1;

    for (i of legends) {
        legendElem = document.querySelector(`svg > g.highcharts-legend .highcharts-legend-item.highcharts-series-${i} `)
        if (!legendElem.classList.contains("highcharts-legend-item-hidden")) {
            doc.fontSize(12)
                .fillColor('black')
                .text(document.getElementById(`avgSerie${i}`).innerHTML, x - 30, y + 30 + ++k * 16)
                .text(document.getElementById(`sdSerie${i}`).innerHTML, x + 8, y + 30 + k * 16)
                .fillColor(legendElem.firstElementChild.getAttribute("stroke"))
                .text(legendElem.lastElementChild.innerHTML, x + 50, y + 30 + k * 16)
        }
    }

    legends = [6, 4, 5, 7]
    k = -1, x = x * 2;

    doc.moveTo(x, y)
        .lineTo(x, y + 100)
        .lineWidth(1)
        .moveTo(x + 40, y + 20)
        .lineTo(x + 40, y + 100)
        .fillColor('black')
        .fontSize(16)
        .text("Lower graph", x - 150, y)
        .fontSize(14)
        .text("AVG   SD    ", x - 35, y + 10, {
            underline: true
        });


    for (i of legends) {
        legendElem = document.querySelector(`svg > g.highcharts-legend .highcharts-legend-item.highcharts-series-${i} `)
        if (!legendElem.classList.contains("highcharts-legend-item-hidden")) {
            doc.fontSize(12)
                .fillColor('black')
                .text(document.getElementById(`avgSerie${i}`).innerHTML, x - 30, y + 30 + ++k * 16)
                .text(document.getElementById(`sdSerie${i}`).innerHTML, x + 8, y + 30 + k * 16)
                .fillColor(legendElem.firstElementChild.getAttribute("stroke"))
                .text(legendElem.lastElementChild.innerHTML, x + 50, y + 30 + k * 16)
        }
    }

    //c.text(legendElem.innerHTML, 5,5, {})
    //  doc.image(img.replace('data:image/png;base64,',''), 0, 15);
    // let x = parseInt(document.getElementById("first-table").style.left) - 75;
    // let y = parseInt(document.getElementById("first-table").style.top) - 218;
    // if (x && y) doc.image(img[0], x, y, { scale: 0.72 });

    // x = parseInt(document.getElementById("second-table").style.left) - 445;
    // y = parseInt(document.getElementById("second-table").style.top) - 215;
    // if (x && y) doc.image(img[1], x, y, { scale: 0.72 });

    // SVGtoPDF(doc, cloneSvg, x, y, options);
    doc.addPage({ size: size });
    doc.fontSize(15).fillColor('black');
    doc.text('Comments', 25, 25, {
        align: 'center'
    });
    doc.fontSize(10);
    let patComment = document.getElementById("txtComment").value;
    doc.text(patComment, 25, 45, {
        width: (size == 'A4') ? 540 : size[0] - 100,
        align: 'left'
    });

    let stream = doc.pipe(blobStream());

    stream.on('finish', () => {
        let blobData = stream.toBlob('application/pdf');
        if (reportEvent) return cb({ 'blobData': blobData, 'fileName': outFileName });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blobData);
        link.download = outFileName + ".pdf";
        link.click();
        chart.update({
            tooltip: {
                enabled: true
            }
        });
    });

    doc.end();
    chart.setTitle(null, { text: chartTitle });
}
function downloadFullReportPrint() {
    downloadFullReportPDF('A4');
}
function downloadFullReportOriginal() {

    downloadFullReportPDF('full')
}

function downloadFullReportPDF(size, reportEvent = false) {
    if (chart == null) return;
    chart.update({
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true
                },
            }
        }
    });

    let chartTitle = chart.subtitle.textStr;
    const subject = onboardingInfo(REST_DATA.selectedPatId)
    const fname = (subject) ?
        subject.lastname + "," + subject.firstname + "_" + REST_DATA.selectedPatId +
        "_" + moment(chart.xAxis[0].min).format("MM-DD-YYYY") +
        "_" + moment(chart.xAxis[0].max).format("MM-DD-YYYY")
        : "Unboarded_" + REST_DATA.selectedPatId +
        "_" + moment(chart.xAxis[0].min).format("MM-DD-YYYY") +
        "_" + moment(chart.xAxis[0].max).format("MM-DD-YYYY");


    let svg = $("#chart svg")[0];
    let chartWidth = chart.chartWidth;
    size = (size == 'A4') ? size
        : [Number(svg.getAttribute("width") - 300), Number(svg.getAttribute("height"))];
    if (size == 'A4') {
        chart.setSize(chartWidth / (1.6 * 1 / window.devicePixelRatio), chart.chartHeight);
    }

    return new Promise((resolve, reject) => {
        downloadPDF($("#chart svg")[0], fname, chartTitle, size, reportEvent, fileMeta => {
            resolve(fileMeta)

            // MAY NEED TO UPDATE CHART BACK WITH DATAGROUPING: FALSE AFTER PRINT
        });
    })

    //arrangeLegends();
}

function addPAP() {
    let query = { trackerid: document.getElementById("selectedPatient").innerHTML.trim() },
        cpap = [], pressure = [];

    dbFind("rest", "pap", query, list => {
        if (list.length > 0) {
            if (list[0].report_type == "cpap") {

                for (let p of list) {
                    let d = Date.parse(moment(p.date).add(1, "days")) - 1;
                    p.setpressure = Number(p.setpressure);
                    if (p.erp_level == 0) p.erp_level = 0.3;
                    cpap.push({
                        x: d, low: p.setpressure - p.erp_level, high: p.setpressure, report_type: p.report_type,
                        erp_level: p.erp_level, machine: p.machine, mode: p.mode, serial: p.serialnum, ahi: p.ahi, usage: p.usage
                    });
                }
                chart.get('pap').setData(cpap);

            } else if (list[0].report_type == "bilevel") {
                for (let p of list) {
                    let d = Date.parse(moment(p.date).add(1, "days")) - 1;
                    // cpap.push([d, p.epap, p.ipap]);
                    cpap.push({
                        x: d, low: p.epap, high: p.ipap, report_type: p.report_type,
                        machine: p.machine, mode: p.mode, serial: p.serialnum, ahi: p.ahi, usage: p.usage
                    });
                }
            } else if (list[0].report_type == "apap") {
                for (let p of list) {
                    let d = Date.parse(moment(p.date).add(1, "days")) - 1;
                    if (p.erp_level == 0) p.erp_level = 0.3;
                    cpap.push({
                        x: d, low: p.ninetyfive - p.erp_level, high: p.ninetyfive, report_type: p.report_type,
                        erp_level: p.erp_level, machine: p.machine, mode: p.mode, serial: p.serialnum, ahi: p.ahi, usage: p.usage,
                        min_pressure: p.min_pressure, max_pressure: p.max_pressure
                    });

                    pressure.push([d, p.min_pressure, p.max_pressure])
                }
            }

            chart.get('pap').setData(cpap);
            if (list[0].report_type == "apap") chart.get("errorbar").setData(pressure);
        }


        chart.redraw(true);
    })

}

function togglePapChart() {
    if (!document.querySelector("#papchart").checked) {

        chart.get("pap").hide()
        chart.get("errorbar").hide()

        chart.yAxis[chart.yAxis.findIndex(e => e.options.id == "yRT")].update(
            {
                top: topPAP,
            })

        chart.setSize(null, chartHeight)
        chart.update({
            navigator: {
                top: topNav,
            }
        });

    } else {
        addPAP();
        chart.get("pap").show()
        chart.get("errorbar").show()
        chart.yAxis[chart.yAxis.findIndex(e => e.options.id == "yRT")].update(
            {
                top: topRecoringTime,
            })
        chart.setSize(null, 1027)
        chart.update({
            navigator: {
                top: topNav + 100,
            }
        });
    }


}

function getTransformSVG(element) {
    return element.getAttribute("transform").substring(10).split(",").map(e => parseFloat(e))
}

function setTransformSVG(element, x, y) {
    let translate = "translate(" + x + ", " + y + ")";
    return element.setAttribute("transform", translate);
}

function arrangeXLabel() {
    let timeTooltip = $(".highcharts-label.highcharts-tooltip-header.highcharts-tooltip-box");
    let timeBox = getTransformSVG(timeTooltip[0]);
    let timeText = timeTooltip[1];

    setTransformSVG(timeTooltip[0], timeBox[0], timeBox[1] - 300);
    timeText.style.top = (timeBox[1] - 300) + "px";
}

function addCommentNumbers() {
    clearCommentNumbers();
    let i = 0;
    for (i = 0; i < displayComment.length; i++) {
        if (displayComment[i].type != "I") {

            var svgE = document.querySelector(".highcharts-root .highcharts-series-group");
            let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');

            newElement.setAttribute('x', chart.xAxis[0].toPixels(displayComment[i].plot_date));
            // chart.get(displayComment[i].type).yAxis.dataMin = 5
            newElement.setAttribute('y', chart.get(displayComment[i].type).yAxis.toPixels(5));
            newElement.setAttribute('class', 'number-comment');
            newElement.innerHTML = i + 1;

            svgE.appendChild(newElement);
        }
    }

}

function clearCommentNumbers() {
    var svg = document.querySelector(".highcharts-root .highcharts-series-group");
    svg.querySelectorAll(".number-comment").forEach(x => x.remove());
}

function updateYpositions(minMaxSingle, axisName, axisIndex) {
    chart.yAxis[axisIndex].update({
        title: {
            text: axisName
        },
        tickPositioner: function () {
            return calculateYpositions(minMaxSingle["min"], minMaxSingle["max"]);
        }
    }, true);
}


function calculateYpositions(yMin, yMax) {
    if (yMin == 0 && yMax == 0) {
        return [0, 1]
    }
    yMax = Math.ceil(yMax);
    if (yMax % 4 > 0)
        yMax = (yMax + 4 - (yMax % 4));
    var positions = [],
        tick = Math.floor(yMin),
        increment = Math.ceil((yMax - yMin) / 4)
    for (tick; tick <= yMax; tick += increment) {
        positions.push(tick);
    }
    return positions;
}

var toggleAxisExtremes = function (event) {
    if (event.target.userOptions.name.indexOf("Navigator") > -1) return;
    if (event.type === "show") {
        chart.yAxis[event.target.index].update({
            visible: true
        });

        // console.log(event.target.name + " " + event.target.index);
        // if (!nonSleepAxisName.includes(event.target.name)) {
        //     let legendLine = $(".highcharts-legend-item .highcharts-graph");
        //     legendLine[event.target.index].setAttribute("stroke-width", 6);
        // }

    } else if (event.type === "hide") {
        console.log("hide")
        if (!document.getElementById("chAxisOn").checked) {
            chart.yAxis[event.target.index].update({
                visible: false
            });
        }

    }
}

function setAvgSd() {
    if (REST_DATA.selectedCsvData.length == 0) return
    let xData = [], i = 0;
    let yDataFiltered = [];

    for (i = 0; i < 8; i++) {
        yDataFiltered[i] = [];
        xData = chart.series[i].xData;
        for (let k = 0; k < xData.length; k++) {
            if (chart.xAxis[0].min <= xData[k] && xData[k] <= chart.xAxis[0].max) {
                yDataFiltered[i].push(chart.series[i].yData[k]);
            }
        }
    }

    for (i = 0; i < 8; i++) {
        if (yDataFiltered[i].length == 0) continue;
        $("#avgSerie" + i).html(round(avg(yDataFiltered[i]), 1));
        $("#sdSerie" + i).html(round(std(yDataFiltered[i]), 1));
    }
}

function isNull(el) {
    return (el == null) || (el == 'undefined');
}

function codeEntered() {
    fetch(`/checkcode?code=${document.getElementById("code").value.toUpperCase()}`).then(response => response.json())
        .then(data => {
            if (data) {
                document.querySelector("#mydatadiv").style.display = "block";
                if (chart) chart.destroy()
                // yScale = yScaleCode;
            }
        })
}

function chooseAxis(e) {
    const axisName = e.value
    const axisIndex = parseInt(e.id.substring(8, 9))
    REST_DATA.axis[axisIndex].name = axisName;
    localStorage.setItem(`axis${axisIndex}`, axisName)
    //  chart.yAxis[axisIndex].setTitle({ text: axisName }, false);

    const serie = REST_DATA.selectedCsvData.map(c => [c.plot_date, JSON.parse(c.sleepdata)[axisName]]);
    const minMaxSingle = findMindMax2D(serie, axisName);
    chart.series[axisIndex].setData(serie)

    // chart.yAxis[axisIndex].update({
    //     min: minMaxSingle.min,
    //     max: minMaxSingle.max,
    // })    
}

function decimalHoursToHHMM(decimalHours) {
    const n = new Date(0, 0);
    n.setMinutes(+Math.round(decimalHours * 60));
    const days = (n.getDate() - 1)
    const hh = n.getHours()
    let mm = n.getMinutes().toString();
    if (mm.length < 2) mm = `0${n.getMinutes()}`;
    return (`${hh}:${mm}`)
}

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}