'use strict';

var appData = {}, allPatComment = [], displayComment = [], globalPatientList = {};
var appSeriNameToObj = {
  'Medication Changes': {},
  'CPAP': {},
  'General Notes': {},
  'Dental Appliance': {},
  'Inspire Changes': {},
  'clinic': {}
};

function onboardingInfo(patId) {
  return REST_DATA.subject
}

async function plotAppData(patId, recording_time, min = null, max = null) {
  let rtData = [], appId = patId;

  let i = 0, dsa1 = [], dsa2 = [], dsa = [], commentYvalue = 5,
    papData = [], inspireData = [], generalNotesData = [], medicationData = [], dentalApplianceData = [], eventData = [],
    papObj = {}, inspireObj = {}, generalNotesObj = {}, medicationObj = {}, dentalApplianceObj = {}, eventObj = {};

  allPatComment = [];

  // GET APP DATA 
  chart.showLoading("LOADING APP DATA . . .")
  let [patAppDataArr, clinic_datapoint, clinic_data] = await getCSMA_APP(appId)

  // if (appId=="479WUG") 
  // csma_app = csma_app.concat(await getCSMA_APP("A1B2C3"))

  for (i = 0; i < patAppDataArr.length; i++) {
    if (i == patAppDataArr.length - 1) {
      console.log(i)
    }
    let parsedDate = Date.parse(patAppDataArr[i].Date)

    if (patAppDataArr[i]["General Notes"] != null) {
      let newData = generalNotesObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        generalNotesData.push([patAppDataArr[i].Plot_Date, commentYvalue]);
        generalNotesObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "G" + parsedDate,
          'text': patAppDataArr[i]["General Notes"],
          'actual_date': parsedDate,
          'type': "G",
          'plot_date': patAppDataArr[i].Plot_Date
        };  // { time : Text } 

        allPatComment.push(generalNotesObj[patAppDataArr[i].Plot_Date]);
      }

    } if (patAppDataArr[i]["Medication Changes"] != null) {
      let newData = medicationObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        medicationData.push([patAppDataArr[i].Plot_Date, commentYvalue]);

        medicationObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "M" + parsedDate,
          'text': patAppDataArr[i]["Medication Changes"],
          'actual_date': parsedDate,
          'type': "M",
          'plot_date': patAppDataArr[i].Plot_Date
        };
        allPatComment.push(medicationObj[patAppDataArr[i].Plot_Date]);
      }

    } if (patAppDataArr[i]["PAP"] != null) {
      let newData = papObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        papData.push([patAppDataArr[i].Plot_Date, commentYvalue]);
        papObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "P" + parsedDate,
          'text': patAppDataArr[i]["PAP"],
          'actual_date': parsedDate,
          'type': "P",
          'plot_date': patAppDataArr[i].Plot_Date
        };
        allPatComment.push(papObj[patAppDataArr[i].Plot_Date]);
      }


    } if (patAppDataArr[i]["Dental Appiance"] != null) {
      let newData = dentalApplianceObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        dentalApplianceData.push([patAppDataArr[i].Plot_Date, commentYvalue]);
        dentalApplianceObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "D" + parsedDate,
          'text': patAppDataArr[i]["Dental Appiance"],
          'actual_date': parsedDate,
          'type': "D",
          'plot_date': patAppDataArr[i].Plot_Date
        };
        allPatComment.push(dentalApplianceObj[patAppDataArr[i].Plot_Date]);
      }


    } if (patAppDataArr[i]["Inspire Changes"] != null) {

      let newData = inspireObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        inspireData.push([patAppDataArr[i].Plot_Date, Number(patAppDataArr[i]["Inspire Changes"])]);
        inspireObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "I" + parsedDate,
          'text': patAppDataArr[i]["Inspire Changes"],
          'actual_date': parsedDate,
          'type': "I",
          'plot_date': patAppDataArr[i].Plot_Date
        };
        allPatComment.push(inspireObj[patAppDataArr[i].Plot_Date]);
      }
    }

    if (patAppDataArr[i]["event"] != null) {

      let newData = eventObj[patAppDataArr[i].Plot_Date];
      if (!newData || (newData['actual_date'] != parsedDate)) { // if exists in the object, check actual date
        eventData.push([patAppDataArr[i].Plot_Date, commentYvalue]);
        eventObj[patAppDataArr[i].Plot_Date] = {
          'time': parsedDate,
          'key': "E" + parsedDate,
          'text': "Type : " + patAppDataArr[i]["event"].event_type + "<br/> " + patAppDataArr[i]["event"].comment,
          'actual_date': parsedDate,
          'type': "E",
          'plot_date': patAppDataArr[i].Plot_Date
        };
        allPatComment.push(eventObj[patAppDataArr[i].Plot_Date]);
      }
    }

    if (patAppDataArr[i]["Question 1 (DSA)"] != null) {
      dsa = patAppDataArr[i]["Question 1 (DSA)"].split(",");
      dsa[0] = Number(dsa[0]); dsa[1] = Number(dsa[1]); // if (i>3 && i < 7) dsa[1]=0;
      if (dsa[0] == 0) dsa[0] = null; if (dsa[1] == 0) dsa[1] = null;
      dsa1.push([patAppDataArr[i].Plot_Date, dsa[0]]);
      dsa2.push([patAppDataArr[i].Plot_Date, dsa[1]]);
    }
  }

  appSeriNameToObj = {
    'Medication Changes': medicationObj,
    'CPAP': papObj, 'General Notes': generalNotesObj,
    'Dental Appliance': dentalApplianceObj,
    "Inspire Changes": inspireObj,
    "event": eventObj,
    "clinic": {}
  };

  // GET CLINIC COMMENT

  // const clinic_datapoint = await dbFindOneAsync(REST_database, 'clinic_comment_datapoint', { 'exPatId': $('#selectedPatient').html() });
  // const clinic_data = await dbFindAsync(REST_database, 'clinic_comment', { 'exPatId': $('#selectedPatient').html() })

  if (clinic_data.length != 0) {
    clinic_data.forEach(c => {
      c.time = c.actual_date;
      allPatComment.push(c);
      appSeriNameToObj['clinic'][c.plot_date] = c;
    });
  }

  allPatComment.sort((a, b) => (a.time > b.time) ? 1 : -1);

  // PLOT NOTES
  chart.get("P").setData(papData, false, false);
  chart.get("M").setData(medicationData, false, false);
  chart.get("G").setData(generalNotesData, false, false);
  chart.get("D").setData(dentalApplianceData, false, false);
  chart.get("E").setData(eventData, false, false);

  if (clinic_datapoint.length > 0)
    chart.get("clinic").setData(clinic_datapoint[0].datapoint, false, false);

  // if (min == null && max == null) {
  //   let aMax = chart.xAxis[0].dataMax, aMin = chart.xAxis[0].dataMin;
  //   if (allPatComment.length > 0) {
  //     if (aMax == null || aMax < allPatComment[allPatComment.length - 1].plot_date) aMax = allPatComment[allPatComment.length - 1].plot_date
  //     if (aMin == null || aMin > allPatComment[0].plot_date) aMin = allPatComment[0].plot_date
  //   }
  //   chart.xAxis[0].setExtremes(aMin - 1, aMax)

  // } else {

  //   chart.xAxis[0].setExtremes(min - 1, max);
  // }


  // PLOT DSA
  chart.get("SSS").setData(dsa1, false, false);
  chart.get("SS").setData(dsa2, false, false);
  chart.hideLoading()

  // PROPORTIONAL timeline: Iterate through xAxis and add points to RT if not exist

  let middleRtData = recording_time    //patDataArray($("#selectedPatient").html(), "Recording_Time").dataArray;

  // if RT data is empty, then use all app data point as RT
  if (middleRtData.length == 0)
    middleRtData = patAppDataArr.map((e) => [e.Plot_Date, 0]);

  // RECENTLY COMMENTED OUT 
  // let firstdate = moment(new Date(chart.xAxis[0].dataMin).setHours(0, 0, 0, 0)).add(1, 'days')._d - 1;

  // if (middleRtData[0][0] > firstdate)
  //   rtData.push([firstdate, 0]);

  rtData = rtData.concat(middleRtData);
  //  chart.get("RT").setData(rtData)

  // IF INACTIVE load last active day otherwise add last night's data point
  if (rtData.length == 0) return
  if (rtData[rtData.length - 1][0] != (new Date().setHours(0, 0, 0, 0) - 1))
    rtData.push([new Date().setHours(0, 0, 0, 0) - 1, 0]);

  // if (!chart.get("RT").xData.includes(chart.xAxis[0].dataMax))
  //     rtData.push([chart.xAxis[0].dataMax, 0]);

  if (REST_DATA.selectedCsvData && REST_DATA.selectedCsvData.length != 0) {
    setRTdata(rtData)
    // addInBetweenDateTicks(setRTdata(rtData));
  }


  // ADD IN-BETWEEN DATE TICKS

  // addPatNotes(generalNotesObj, medicationObj, papObj, dentalApplianceObj, inspireObj);
  const pat = REST_DATA.subject;

  if (true || pat.inspire && pat.inspire == "on") {
    chart.yAxis[chart.get("I").index].update({
      visible: true
    }, false);

    chart.series[chart.get("I").index].update({
      visible: true
    }, false);

    // chart.get("I").setVisible(true, false);

    // stretch out the inspire level to last date of app data (if inpire data is available)
    if (inspireData.length > 0) {
      let lastAppDate = chart.xAxis[0].dataMax //patAppDataArr[patAppDataArr.length - 1].Plot_Date;
      let lastInspireDate = inspireData[inspireData.length - 1][0];

      if (lastAppDate != lastInspireDate)
        inspireData.push([lastAppDate, inspireData[inspireData.length - 1][1]]);
    }

    chart.get("I").setData(inspireData, false, false)

  } else {
    //chart.get("I").setVisible(false, false);
    chart.series[chart.get("I").index].update({
      visible: false
    }, false);

    chart.yAxis[chart.get("I").index].update({
      visible: false
    }, false)
  }

  //addPAP()
  // $("#papchart").click();
  // if (document.querySelector("#papchart").checked) 
  //   addPAP();
  // if (refresh)
 // chart.redraw()
  chart.xAxis[0].setExtremes(chart.xAxis[0].min-1, chart.xAxis[0].max)
}

function goBack() {
  if (chart && chart.xAxis[0] && chart.xAxis[0].min) {
    let from = Date.parse(moment(chart.xAxis[0].min).add(-7, "days")._d)-1
    if (from < chart.xAxis[0].dataMin) {
      from = chart.xAxis[0].dataMin;
    }

    chart.xAxis[0].setExtremes(from, chart.xAxis[0].min-1)
  }
}

function goForward() {
  if (chart && chart.xAxis[0] && chart.xAxis[0].max) {

    let to = Date.parse(moment(chart.xAxis[0].max).add(7, "days")._d)-1
    if (to > chart.xAxis[0].dataMax) {
      to = chart.xAxis[0].dataMax;
    }

    chart.xAxis[0].setExtremes(chart.xAxis[0].max-1, to)
  }
}

function setRTdata(rtData) {
  let rtDataAll = [rtData[0]], i = 0, k = rtData[0][0];
  let zones = [], tmp = 0;

  for (i = 1; i < rtData.length; i++) {
    k = moment(k).add(1, 'days')._d - 1 + 1; // VERY SENSITIVE
    // console.log(new Date(k))
    if (rtData[i][0] == k) {
      rtDataAll.push(rtData[i]);
      if (rtDataAll[rtDataAll.length - 1][1] > 12) {
        tmp = rtDataAll[rtDataAll.length - 1][0] - 43200000
        zones.push({ value: tmp })
        tmp = rtDataAll[rtDataAll.length - 1][0] + 43200000
        zones.push({ color: 'red', value: tmp })
        // zones.push({color: 'red', value: rtDataAll[rtDataAll.length-1][0]})
      } else {

        //   zones.push({value: rtData[i][0]})
      }

    } else if (rtData[i][0] > k) {
      rtDataAll.push([k, 0]);
      i--;
      tmp = rtDataAll[rtDataAll.length - 1][0] - 43200000
      zones.push({ value: tmp })
      tmp = rtDataAll[rtDataAll.length - 1][0] + 43200000
      zones.push({ color: 'red', value: tmp })
    } else if (rtData[i][0] < k) {
      // rtDataAll[rtDataAll.length-1][0] = rtDataAll[rtDataAll.length-1][0] - 1;
      rtDataAll.push(rtData[i]);
      k = moment(k).subtract(1, 'days')._d - 1 + 1;
    }
  }

  if (rtDataAll[rtDataAll.length - 1][1] == 0) {
    tmp = rtDataAll[rtDataAll.length - 1][0] - 43200000;
    zones.push({ value: tmp })
    tmp = rtDataAll[rtDataAll.length - 1][0] + 1;
    zones.push({ color: 'red', value: tmp })
  }

  chart.get("RT").setData(rtDataAll, false, false);

  chart.get("RT").update({
    zones: zones
  }, false)

  // chart.navigator.update({
  //   series: {
  //     data: rtDataAll
  //   }
  // })

  return rtDataAll;
}

function addInBetweenDateTicks(rtData) {
  let ren = chart.renderer;

  if (rtData.length < 5) return;
  let colors = Highcharts.getOptions().colors, i = rtData.length - 1,
    inc = parseInt(rtData.length / 4);

  let globalDate = Highcharts.dateFormat("%b %e %Y", rtData[i][0]);
  let offsettop = 60;
  ren.label(globalDate, chart.xAxis[0].toPixels(rtData[i][0]) - 42,
    chart.yAxis[chart.yAxis.length - 2].toPixels(0) + offsettop)
    .css({
      color: '#000000',
      fontSize: '15px',
      //  fontWeight: 'bold'
    }).add();


  for (i = 0; i < rtData.length - inc; i = i + inc) {
    if (i > (rtData.length - 1)) return;

    globalDate = Highcharts.dateFormat("%b %e %Y", rtData[i][0]);
    ren.label(globalDate, chart.xAxis[0].toPixels(rtData[i][0]) - 42,
      chart.yAxis[chart.yAxis.length - 2].toPixels(0) + offsettop)
      // .attr({
      //     rotation: 270
      // })
      .css({
        color: '#000000',
        fontSize: '15px',
        //fontWeight: 'bold'
      }).add();
  }
}

function clearNoteDiv() {
  $("#generalNotesDiv").html(""); $("#medDiv").html(""); $("#dentalsDiv").html(""); // Resetting content
}


function prepareDivInsertComment() {
  clearNoteDiv();
  $("#txtComment").html("");
}

function addPatCommentDiv(notes) {
  prepareDivInsertComment();

  let i = 0, k = 0, txtNote = "", noteType = "";
  for (k = 0; k < notes.length; k++) {
    noteType = notes[k].key.substring(0, 1).toUpperCase();

    let spanElem = document.createElement('span');
    let brElem = document.createElement('br');
    spanElem.id = notes[k].key;
    spanElem.innerHTML = '<strong>' + noteType + ". " + (k + 1) + ". </strong><span>" + notes[k].text + '</span>';
    //spanElem.contentEditable = "true";
    spanElem.setAttribute('orgText', spanElem.innerHTML);

    // var notesStr ='<span contenteditable="true" onchange="alert(4)" id="'+ notes[k].key  +'"><strong>' +  noteType  + ". " + (k+1) + ". </strong>" + notes[k].text + "</span><br/>";
    // $("#generalNotesDiv").html($("#generalNotesDiv").html() +  notesStr);

    document.getElementById('generalNotesDiv').appendChild(spanElem);
    document.getElementById('generalNotesDiv').appendChild(brElem);

    let aDate = new Date(notes[k].time);
    aDate = aDate.toDateString() + " " + aDate.toLocaleTimeString();
    txtNote = txtNote + '\n' + noteType + "-" + (k + 1) + " (" + aDate + ") : " + notes[k].text;

    spanElem.addEventListener("mouseover", function (e) {
      let spanTag = e.currentTarget;
      var elem = $("#allPatNotesDiv span");

      for (var i = 0; i < elem.length; i++)
        elem[i].classList.remove("highlightText");

      spanTag.classList.add("highlightText");


    }, false);


    //  spanElem.addEventListener("input", function(e) {
    //    let spanTag = e.currentTarget;
    //    let inputTags = spanTag.getElementsByTagName('input');
    //    if (inputTags.length == 0) {
    //       spanTag.innerHTML = spanTag.innerHTML + ' <input type="button" value="save" onclick="appendSpanTag(this)">' +
    //                       '<input type="button" value="cancel" onclick="resetSpanTag(this)">';
    //    } 

    //   }, false);
  }

  $("#txtComment").html($("#txtComment").html() + txtNote);


  // let replaceComments = loadLocalStorage('replaceSpan');;
  // if (replaceComments != null && replaceComments != '') {
  //   document.getElementById(replaceComments.spanId).innerHTML = replaceComments.html;

  // }

}

function appendSpanTag(e) {
  var id = e.parentElement.id;
  let inputTags = e.parentElement.getElementsByTagName('input');
  e.parentElement.innerHTML = '<span style=" text-decoration: line-through;">' + e.parentElement.getAttribute("orgText") + '</span><br />' + e.parentElement.innerHTML;


  do inputTags[0].remove();
  while (inputTags.length > 0)

  var content = document.getElementById(id);

  saveLocalStorage('replaceSpan', { 'spanId': id, 'html': content.innerHTML });
}

function resetSpanTag(e) {
  e.parentElement.innerHTML = e.parentElement.getAttribute("orgText");
}

function makeTextHighlight(objArray) {
  // if (document.getElementById("disableHighlighCheckbox").checked) return;
  var elem = $("#allPatNotesDiv span"); // first remove classname highlightText from all notes
  for (var i = 0; i < elem.length; i++)
    elem[i].classList.remove("highlightText");

  for (let item in objArray) {
    if (document.getElementById(objArray[item].key))
      document.getElementById(objArray[item].key).classList.add("highlightText");
  }
  //document.getElementById(spanId).scrollIntoView();
}

function copyCommentsToClipboard() {
  $("#txtComment").show();
  var copyText = document.getElementById("txtComment");

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  $("#txtComment").hide();

}

function showTextArea(currentX) {
  onPointClickCancel();
  currentX = Number(currentX);
  let txtarea = document.querySelector('#textareaDiv');
  document.querySelectorAll('#textareaDiv > textarea')[0].id = currentX;
  document.getElementById('xdatetime').value = moment(currentX).format('YYYY-MM-DD');
  txtarea.style.display = 'block';
  let top = chart.get('RT').yAxis.toPixels(0) - 80;
  let left = chart.xAxis[0].toPixels(currentX);
  // txtarea.id = currentX;
  txtarea.style.top = top + 'px';
  txtarea.style.left = left + 'px';
  // console.log(new Date(currentX));
}

function onPointClick(currentX) {
  return;
  let txtarea = document.querySelector('#onPointClick');
  document.querySelector('#onPointClick > div').value = currentX;
  txtarea.style.display = 'block';
  let top = chart.get('RT').yAxis.toPixels(0) - 80;
  let left = chart.xAxis[0].toPixels(currentX);
  // txtarea.id = currentX;
  txtarea.style.top = top + 'px';
  txtarea.style.left = left + 'px';
  // console.log(new Date(currentX));
}

function launchSpectrogram(x) {
  x = Number(x)
  onPointClickCancel();
  let local = 'http://localhost:3031'
  let lt = 'http://73.76.62.225:3031'
  let record = REST_DATA.selectedCsvData.find(e => e.plot_date == x)
  if (record == null) return showModal("No Data point for selected date time");
  window.open(`${lt}/spectrogram?id=${REST_DATA.selectedPatId}&date=${JSON.parse(record.sleepdata).Start_Date}&starttime=${JSON.parse(record.sleepdata).Start_Time}&user=${REST_DATA.restTrackerLoginUser}`,
    'spec' + (new Date().getTime()),
    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=950,height=1000');
  moment(x).format('ll')
}

function textAreaSave() { // textArea.id is this.x value
  let txtarea = document.querySelectorAll('#textareaDiv > textarea')[0];
  document.getElementById('xdatetime').valueAsNumber
  //let plot_x = Number(txtarea.id);
  let plot_x = moment(document.getElementById('xdatetime').value).add(1, 'days') - 1;
  // console.log(new Date(plot_x));

  chart.get("clinic").addPoint([plot_x, 5]);
  let cData = chart.get("clinic").data.map(e => [e.x, e.y]);
  let exPatId = $('#selectedPatient').html().toUpperCase();

  dbFindOne(REST_database, 'clinic_comment_datapoint', { 'exPatId': exPatId }, data => {
    (data == null) ?
      dbInsert(REST_database, 'clinic_comment_datapoint', { 'exPatId': exPatId, 'datapoint': cData }, e => {
        if (chart.rangeSelector.selected == null) chart.xAxis[0].setExtremes(chart.xAxis[0].dataMin, chart.xAxis[0].dataMax)
      })
      :
      dbUpdateOne(REST_database, 'clinic_comment_datapoint', { 'exPatId': exPatId }, { 'datapoint': cData }, e => {
        if (chart.rangeSelector.selected == null) chart.xAxis[0].setExtremes(chart.xAxis[0].dataMin, chart.xAxis[0].dataMax)
      });
  });

  // saveLocalStorage("clinicPointData" + $('#selectedPatient').html(), cData);

  // let  allClinicComment =  loadLocalStorage($('#selectedPatient').html());
  // if (allClinicComment == null || allClinicComment == '' ){
  //   allClinicComment = [];
  // }

  txtarea.value = txtarea.value;
  let clinicComment = {
    'time': plot_x,
    'key': "clinic" + plot_x,
    'text': txtarea.value,
    'actual_date': Date.parse(new Date()),
    'type': "clinic",
    'plot_date': plot_x,
    'exPatId': exPatId,
    'user': REST_DATA.restTrackerLoginUser
  };

  dbInsert(REST_database, 'clinic_comment', clinicComment, e => { });

  // allClinicComment.push(clinicComment);

  //saveLocalStorage("clinicComments" + $('#selectedPatient').html(), allClinicComment);

  appSeriNameToObj['clinic'][plot_x] = clinicComment;

  allPatComment.push(clinicComment);
  allPatComment.sort((a, b) => (a.time > b.time) ? 1 : -1);
  chart.xAxis[0].setExtremes(chart.xAxis[0].min, chart.xAxis[0].max);

  textAreaCancel();
}

function textAreaCancel() {
  document.querySelector('#textareaDiv').style.display = 'none';
  document.querySelectorAll('#textareaDiv > textarea')[0].value = "";
}

function textAreaMonitoringSave() {
  const patId = REST_DATA.selectedPatId
  const subject = onboardingInfo(patId)
  if (subject == null
    || subject.emr_id == ""
    || subject.emr_id == null) return showModal(`Patient with Tracker Id ${patId} isn't onboarded or has no EMR ID assigned to compeletd this request`)

  // const routine_extended = (document.getElementById("routine_monitoring").style.display == 'none')? 'extended' : 'routine';

  let monitoringEvent = {
    "trackerId": patId,
    "clinic_id": subject.clinic_id.toString(),
    "appId": subject.app_id,
    "patientName": `${subject.firstname} ${subject.lastname}`,
    "patientEMRID": subject.emr_id,
    "createdby": document.querySelector(`#monitoring_username`).value,
    "createdDate": moment(document.querySelector(`#monitoring_datetime`).value).format('MM/DD/YYYY'),
    "comment": document.querySelector(`#monitoring_textarea`).value,
    "routine_extended": document.getElementById("routine_extended").value
  }

  dbInsert(REST_database, 'monitoring_event', monitoringEvent, e => {
    setTimeout(() => {
      $("#monitoring_history_table").DataTable().ajax.reload()
    }, 850)

    //     dbUpdateOne(REST_database, "billing", { '_id': e._id }, dashSetting, e => {
    //       showModal(`${e.modifiedCount} record was updated!`)
    //  })


  })

  // dbFind(REST_database, 'monitoring_event', { 'trackerId': document.getElementById("selectedPatient").innerHTML.trim() }, data => {
  // })

}

function monitoringSendAMD() {

}



function onPointClickCancel() {
  document.querySelector('#onPointClick').style.display = 'none';
}

function getCSMA_APP(patId) {
  return new Promise((resolve, reject) => {

    fetch("/getCsmaApp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patId: patId })
    })
      .then(response => response.json())
      .then(csma_app => resolve(csma_app))
  })
}


function readXLSAppFile(e) {
  var reader = new FileReader();
  let file = e.files[0];

  reader.onload = function (e) {
    var data = e.target.result;
    readXLSappData(data);
  };

  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
}

function readXLSappData(data) {
  appData = {};
  let key, i, patId;

  var workbook = XLSX.read(data, {
    type: 'binary'
  });

  workbook.SheetNames.forEach(async (sheetName) => {
    if (sheetName.trim() == "Summary") {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

      for (i = 0; i < XL_row_object.length; i++) {
        patId = XL_row_object[i]["Patient ID"];

        if (patId == null) continue;
        patId = patId.toUpperCase();

        for (key in XL_row_object[i]) {
          if (key.hasSpace()) {
            XL_row_object[i][key.trim()] = XL_row_object[i][key];
            delete XL_row_object[i][key];
          }
        }

        var d = new Date(XL_row_object[i].Date);
        if (d.getHours() < 14) {
          XL_row_object[i]["Plot_Date"] = d.setHours(0, 0, 0, 0) - 1;
        } else {
          d.setDate(d.getDate() + 1);
          XL_row_object[i]["Plot_Date"] = d.setHours(0, 0, 0, 0) - 1;
        }

        if (!appData.hasOwnProperty(patId))
          appData[patId] = [];
        appData[patId].push(XL_row_object[i]);
      }

      // for (const key in appData) {
      //   await dbInsertAsync("rest", "patient_comment_archive", {appId: key, comments: JSON.stringify(appData[key])}) 
      // }
      console.log(appData)
    }
  })
};
