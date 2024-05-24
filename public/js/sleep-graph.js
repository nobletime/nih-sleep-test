'use strict';

var patientIDs = [];
var sleepData = {};
const avg = (array) => array.reduce((a, b) => a + b) / array.length;
const removeDup = (array) => [...new Set(array)];


function readFile(e) {
  if (typeof (FileReader) != "undefined") {
    let file = e.files[0];
    var path = (window.URL || window.webkitURL).createObjectURL(file);

    var regex = [/\.(xls|xlsx)$/i, /\.(csv)$/i, /\.(txt)$/i];
    if (regex[0].test(file.name.toLowerCase())) {
      readXLSFile(e);
    } else if (regex[1].test(file.name.toLowerCase())) {
      readCSVFile(file, true);
    } else if (regex[2].test(file.name.toLowerCase())) {
      uploadTemplateFile(file);
    }
  } else {
    alert("This browser does not support HTML5.");
  }
}

function readCSVFile(file, download) {
  var csvObj = [];
  // Parse local CSV file
  Papa.parse(file, {
    download: download,
    header: true,
    keepEmptyRows: false,
    skipEmptyLines: true,
    step: function (row) {
      //  push the row data into the array
      if (!Array.isArray(row.data)) {
        csvObj.push(row.data);
      }

    },
    complete: function (results) {
      preProcessingData(csvObj);
    }
  });
}

function readXLSFile(e) {
  var reader = new FileReader();
  let file = e.files[0];

  reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    workbook.SheetNames.forEach(function (sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      preProcessingData(XL_row_object);
    })
  };

  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
}

function uploadTemplateFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = e.target.result;
    let templateObj = JSON.parse(data);
    for (var key in templateObj) {
      loadTemplate(key, templateObj[key], () => { });
      $("#templateName").val(key);
      cmdPlot();
      saveTemplate(false);
    }
  };

  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsText(file);
}

function loadAxisSelection() {
  let mapToChart = [3, 1, 2, 4, 7, 5, 6, 8];
  //let axisPos = ['ULO', 'ULI', 'URI', 'URO',    'LLO', 'LLI', 'LRI', 'LRO'];

  let k = -1;
  let axisSelStr = "", axisList = "", axisMinMaxStr = "";
  for (let i of mapToChart) {
    k++;
    (i == 7) ? axisSelStr = axisSelStr + '<div class="mt-5">' : axisSelStr = axisSelStr + '<div>';

    let str =
      '<div class="mt-1"><!-- axis ' + i + ' List -->\n' +
      '<button type="button" id="btnAxis-' + i + '" class="btn-sm  btn-outline-secondary dropdown-toggle axis saveInTemplate"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> \n' +
      'Axis ' + i +
      ' </button>\n' +
      '<div class="dropdown-menu axisFont" id="axisList-' + i + '">\n';

    axisList = '';
    for (let k = 0; k < params.length; k++) {
      axisList = axisList + '<a class="dropdown-item p-0 pl-1" href="#" onclick ="selectPlotAxis(this)">' + params[k] + '</a>\n';
    }

    //  str = str+axisList + ' </div>' + axisPos[k] + '</div> \n' ;
    str = str + axisList + ' </div></div> \n';
    axisSelStr = axisSelStr + str;


    if (i == 7) axisMinMaxStr = axisMinMaxStr + '<div class="mt-5"></div>';

    axisMinMaxStr = axisMinMaxStr +
      ' <!--Min, Max-->\n ' +   // WRITE AXIS MIN AND MAX
      '<label for="axisMinTxt-' + i + '">Min  </label>\n' +
      '<input type="text" id="axisMinTxt-' + i + '" class="saveInTemplate scaleTemplate" onblur="updateScale(this)" value="">  \n' +
      ' <label for="axisMaxTxt-' + i + '">Max  </label> \n' +
      '<input type="text" id="axisMaxTxt-' + i + '" class="saveInTemplate scaleTemplate" onblur="updateScale(this)" value=""> <br/> \n ';

  }

  $("#axisDiv").html(axisSelStr);

  $("#axisMinMaxDiv").html(axisMinMaxStr);

  let i = 10;
  axisSelStr = '';

  let str =
    '<div class="mt-1"  ><!-- axis ' + i + ' List -->\n' +
    '<button type="button" id="btnAxis-' + i + '" class="btn-sm  btn-outline-secondary dropdown-toggle axis "  data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> \n' +
    'Axis ' + i +
    ' </button>\n' +
    '<div class="dropdown-menu axisFont" id="axisList-' + i + '">\n';

  axisList = '';
  for (let k = 0; k < params.length; k++) {
    axisList = axisList + '<a class="dropdown-item p-0 pl-1" href="#" onclick ="selectDashboardParam(this)">' + params[k] + '</a>\n';
  }

  //  str = str+axisList + ' </div>' + axisPos[k] + '</div> \n' ;
  str = str + axisList + ' </div> \n';
  axisSelStr = axisSelStr + str;

  $("#dashboard_param").html(axisSelStr);
  document.getElementById("btnAxis-10").innerHTML = "sAHI_4%";

}

function updateScale(elem) {
  if ((elem.value.trim()).length == 0) return;
  let axisTxt = elem.id.split("-");
  let k = Number(axisTxt[1]) - 1;
  let min = chart.yAxis[k].min;
  let max = chart.yAxis[k].max;
  (axisTxt[0] == "axisMinTxt") ?
    min = Number(elem.value) :
    max = Number(elem.value)

  chart.yAxis[k].update({
    tickPositioner: function () {
      return calculateYpositions(min, max);
    }
  })
}

function preProcessingData(csvObj) {
  let i = 0;
  sleepData = {};

  // header name for patient id in csv object array 
  let pIdKey = Object.keys(csvObj[0])[0];

  for (i = csvObj.length - 1; i > -1; i--) {
    //  csvObj[i]["Recording_Duration"] = substractTwoTimes(csvObj[i].Start_Time, csvObj[i].End_Time);

    // ADD undefined arousal
    csvObj[i]["und_arousal_3%"] = Number((csvObj[i]["sRDI_3%"]) - Number(csvObj[i]["sAHI_3%"]));
    csvObj[i]["und_arousal_4%"] = Number((csvObj[i]["sRDI_4%"]) - Number(csvObj[i]["sAHI_4%"]));


    if (csvObj[i].hasOwnProperty(" TST_Sec")) {
      csvObj[i]["TST_Sec"] = csvObj[i][" TST_Sec"];
      delete csvObj[i][" TST_Sec"];
    }

    if (csvObj[i].hasOwnProperty(" WASO_Sec")) {
      csvObj[i]["WASO_Sec"] = csvObj[i][" WASO_Sec"];;
      delete csvObj[i][" WASO_Sec"];
    }

    if (csvObj[i].hasOwnProperty("Sleep_Onset")) {
      var sleepOnset = new Date(csvObj[i]["Sleep_Onset"]);
      let sleepHours = (sleepOnset.getHours() + sleepOnset.getMinutes() / 60);
      if (sleepHours < 24 && sleepHours > 12)
        sleepHours = sleepHours - 24;
      csvObj[i]["Sleep_Onset"] = sleepHours;
    }


    for (var key in csvObj[i]) {
      let value = csvObj[i][key];


      if (value.length === 0) {
        // empty string here
      }

      if (key.toLowerCase() == "sleep_duration_sec" || key.toLowerCase() == "stable_duration_sec" || key.toLowerCase() == "rem_duration_sec" ||
        key.toLowerCase() == "unstable_duration_sec" || key.toLowerCase() == "tst_sec") {
        (key == "Sleep_Duration_Sec") ? csvObj[i]["Recording_Time"] = secToHours(value) : csvObj[i][key.replace("_Sec", "_Hour")] = secToHours(value);
        csvObj[i][key] = Number(value);
      } else if (key.toLowerCase() == "spo2_below80_duration_sec" || key.toLowerCase() == "spo2_below88_duration_sec"
        || key.toLowerCase() == "spo2_below90_duration_sec" || key.toLowerCase() == "waso_sec" || key.toLowerCase() == "sleep_latency_sec") {
        csvObj[i][key.replace("_Sec", "_Min")] = secToMins(value);
        csvObj[i][key] = Number(value);
      } else if (key.toLowerCase() == "sleep_conclusion") {
        let timeCon = csvObj[i][key].split(" ")[1]
        //if (timeCon == null) console.log(`Bad data for ${csvObj[i].Last_Name} ${csvObj[i].First_Name} (${csvObj[i].Patient_Id}) on ${csvObj[i].Start_Date} ${csvObj[i].Start_Time} - ${csvObj[i].End_Time}`)
        //   if (timeCon == null) console.log(csvObj[i])
        csvObj[i]["Sleep_Termination"] = hhmmssToHours(timeCon)
      } else if (key.toLowerCase() == "start_date") {
        // d.toLocaleDateString()    

        if (csvObj[i].Start_Time.includes("AM")) { // if pass midnight
          csvObj[i]["Plot_Date"] = get1159pmAfterMidnight(Date.parse(value));

        } else {
          csvObj[i]["Plot_Date"] = get1159pmBeforeMidnight(Date.parse(value));
        }
      } else if (!isNaN(value)) {
        csvObj[i][key] = Number(value);
      }
    }

    let patId = csvObj[i][pIdKey].toUpperCase();
    if (!sleepData.hasOwnProperty(patId))
      sleepData[patId] = [];

    sleepData[patId].push(csvObj[i]);
  }

}

function rePlotSmooth() {
  chart.update({ chart: { type: document.getElementById("chSmoth").checked ? 'spline' : 'line' } });
  chart.redraw();
  arrangeLegends();
}

function showAxis() {
  if (document.getElementById("chAxisOn").checked) {
    for (let i = 0; i < 8; i++)
      chart.yAxis[i].update({
        visible: true
      })
  }
}


function showModal(message) {
  document.querySelector("#noDataModal .modal-title").innerHTML = message
  $("#noDataModal").modal('show');
}

function patDataArray(whichPat, whichAxis) {
  let i = 0, excluded = 0, dataArr = [];
  let patRecordArray = sleepData[whichPat];
  if (patRecordArray == null)
    return { "dataArray": [], "excluded": excluded };

  if (whichAxis == 'pAHI' || whichAxis == 'pUsage') {
    //  const papData = chart.series[chart.series.findIndex(e=> e.name=='PAP')].data;
    //  const param = (whichAxis == 'pAHI') ? 'ahi' : 'usage';

    //  for (let p of papData){
    //   dataArr.push([ p.options.x, p.options[param]])

    //  }
  } else {

    for (i = 0; i < patRecordArray.length; i++) {
      if (patRecordArray[i].Recording_Time < Number($("#recTime").val())) {
        excluded++;
        if (whichAxis == "Recording_Time") dataArr.push([patRecordArray[i].Plot_Date, patRecordArray[i]["Recording_Time"]]);
      } else {
        dataArr.push([patRecordArray[i].Plot_Date, patRecordArray[i][whichAxis]]);
      }
    }
  }
  return { "dataArray": dataArr, "excluded": excluded };
}


function selectPatient(selectedPat) {
  Array.from(selectedPat.parentNode.children).forEach(e => { e.classList.remove("selected-patient") });
  selectedPat.classList.add("selected-patient");
  REST_DATA.selectedPatId = selectedPat.getAttribute("value")
  document.getElementById("selectedPatient").innerHTML = REST_DATA.selectedPatId
  //  $("#selectedPatient").html(selectedPat.getAttribute("value"));
  reloadBillingEventTables();
  cmdPlot();
  document.getElementById("routine_extended").value ="routine";
}

function selectPlotAxis(e) {
  let elemId = e.parentElement.id.split("-")[1];
  let axisName = e.innerHTML;
  //$("#btnAxis-" + elemId).html(axisName);
  $("#btnAxis-" + elemId).val(axisName);

  elemId = Number(elemId);
  if (chart) {
    if (chart.series[elemId - 1]) {
      const selectedAxis = REST_DATA.selectedCsvData.map(e => [e.plot_date, JSON.parse(e.sleepdata)[axisName]])
      chart.series[elemId - 1].setData(selectedAxis, false);
      let minMaxSingle = findMindMax2D(selectedAxis, axisName);
      updateYpositions(minMaxSingle, axisName, elemId - 1);
      //  chart.series[elemId-1].name = axisName;
      //  chart.isDirtyLegend = true;

      chart.series[elemId - 1].update({
        name: axisName
      })

      chart.redraw();
      drawTresholdPlotlines();
      setAvgSd()

      // $("#information").html("<b>Excluded records :</b> " + patDataObj.excluded + " records have recording times < " + $("#recTime").val());
      arrangeLegends();
    }

  }
  document.getElementById("templateName").style.backgroundColor = "#ffccff";
}

function loadFilePath() {
  var path = window.localStorage.getItem('sleepFilePath');
  var gAppFilePath = new URL(`file:///${path}`).href;
}

function csvJSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",").map(item => {
    return item.trim()
  });
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    if (lines[i].length === 0) continue; // line is empty string
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return result; //JSON
}

function get1159pmAfterMidnight(currentDate) {
  return (currentDate - 1);
}

function get1159pmBeforeMidnight(currentDate) {
  var d = new Date(currentDate);
  d.setDate(d.getDate() + 1); // add a day then reduce a mili-second before midnight
  return (d - 1);
}

function secToHours(sec) {
  return Number((Number(sec) / 3600).toFixed(2));
}

function secToMins(min) {
  return Number((Number(min) / 60).toFixed(2));
}

function hhmmssToHours(time) {
  if (time == null) return 0;
  let secTime = time.split(':').reduce((acc, time) => (60 * acc) + +time);
  return secToHours(secTime)
}

function substractTwoTimes(hms1, hms2) {
  var time1 = hms1.split(" ");
  var time2 = hms2.split(" ");

  var t1 = time1[0].split(':'), t2 = time2[0].split(':');

  var min1 = ((time1[1] == "AM") ? +t1[0] : (+t1[0] - 12)) * 60 + (+t1[1]);
  var min2 = (+t2[0]) * 60 + (+t2[1]);

  return (min2 - min1) / 60;
}


var patList = [];

function patListf() {
  let obj = {};
  patList = [];
  for (var key in sleepData) {

    obj = {
      'Patient_Id': sleepData[key][0].Patient_Id,
      'Last_Name': sleepData[key][0].Last_Name,
      'First_Name': sleepData[key][0].First_Name,
      'DOB': sleepData[key][0].DOB
    }
    patList.push(obj);
  }

  for (var key in appData) {
    obj = {
      'Patient_Id': appData[key][0]['Patient ID']
    }
    if (sleepData[key] == null)
      patList.push(obj);
  }
}

function std(arr) {
  // Creating the mean with Array.reduce
  let mean = arr.reduce((acc, curr) => {
    return acc + curr
  }, 0) / arr.length;

  // Assigning (value - mean) ^ 2 to every array item
  arr = arr.map((k) => {
    return (k - mean) ** 2
  })

  // Calculating the sum of updated array
  let sum = arr.reduce((acc, curr) => acc + curr, 0);

  // Calculating the variance
  let variance = sum / arr.length

  // Returning the Standered deviation
  return Math.sqrt(sum / arr.length);
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}



function cmdResetColor() {
  let axisColor = ['#000000', '#0000ff', '#009933', '#f15c80'];

  for (let i = 1; i < 9; i++) {
    document.getElementById('axisColor-' + i).value = axisColor[(i % 4) - 1];

  }

  cmdPlot();

}