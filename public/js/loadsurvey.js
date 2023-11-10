$(() => {

    if (document.getElementById("created_date"))
        document.getElementById("created_date").value = moment(new Date()).format('YYYY-MM-DD');

    const params = new URLSearchParams(window.location.search)
    let cid = "", pid = "", cname = "";

    // if (params.has('cid') && params.has('pid')) {   
    //    // cname = document.getElementById("cname").innerHTML;
    //   //  console.log(cname);
    //     cid = params.get('cid');
    //     pid = params.get('pid');
    // } else {
    //     return 
    // }       

    Survey
        .StylesManager
        .applyTheme("defaultV2");

    let json = {};

    switch (document.querySelector(".surveyElement").id) {
        case "general":
            json = general_json
            break;
        case "isi":
            json = isi
            break;
        case "pitsburgh":
            json = pitsburgh_json
            break;
        case "general_sleep_related":
            json = general_sleep_related_json
            break;
        case "epworth":
            json = epworth
            break;
        case "event":
            json = event_json
            break;
        // case "onboarding":
        //     json = onboarding_json
        //     break;
        default:
    }

    window.survey = new Survey.Model(json);
    (new Date().getHours() < 14 || document.querySelector(".surveyElement").id == "dsa") ?
        window.survey.setValue("whichnight", "last_night") : window.survey.setValue("whichnight", "tonight")

    survey
        .onComplete
        .add(function (sender) {
            const user = JSON.parse(localStorage.getItem("rest-tracker-app-profile"));

            if (user == null) {
                if (document.getElementById("activateBtn"))
                    document.getElementById("activateBtn").click()
                return false;
            }

            let plot_date = new Date().setHours(0, 0, 0, 0) - 1;
            if (sender.data.whichnight == "tonight") {
                if (new Date().getHours() > 1) {
                    plot_date = moment(new Date()).add(1, 'days')._d.setHours(0, 0, 0, 0) - 1;
                }
            }

            const surveydata = {
                clinic_id: user.clinic_id,
                patient_app_id: user.app_id,
                date: new Date(),
                plot_date: plot_date,
                type: document.querySelector(".surveyElement").id,
                data: sender.data
            }

            //   surveydata.clinic_name = cname
            //    surveydata.date = new Date(moment(new Date()).format('MM/DD/YYYY'));

            if (surveydata.type == "pitsburgh") {
                let c2 = 0
                if (surveydata.data.c2 == 0) {
                    c2 = 0
                } else if (surveydata.data.c2 >= 1 && surveydata.data.c2 <= 2) {
                    c2 = 1
                } else if (surveydata.data.c2 >= 3 && surveydata.data.c2 <= 4) {
                    c2 = 2
                } else if (surveydata.data.c2 >= 5 && surveydata.data.c2 <= 6) {
                    c2 = 3
                }

                let c4 = 0
                if (surveydata.data.c4 >= 85) {
                    c4 = 0
                } else if (surveydata.data.c4 >= 75 && surveydata.data.c4 <= 84) {
                    c4 = 1
                } else if (surveydata.data.c4 >= 65 && surveydata.data.c4 <= 74) {
                    c4 = 2
                } else if (surveydata.data.c4 <= 64) {
                    c4 = 3
                }

                let c5 = 0
                if (surveydata.data.c5 == 0) {
                    c5 = 0
                } else if (surveydata.data.c5 >= 1 && surveydata.data.c5 <= 9) {
                    c5 = 1
                } else if (surveydata.data.c5 >= 10 && surveydata.data.c5 <= 18) {
                    c5 = 2
                } else if (surveydata.data.c5 >= 19 && surveydata.data.c5 <= 27) {
                    c5 = 3
                }

                let c7 = 0
                if (surveydata.data.c7 == 0) {
                    c7 = 0
                } else if (surveydata.data.c7 >= 1 && surveydata.data.c7 <= 2) {
                    c7 = 1
                } else if (surveydata.data.c7 >= 3 && surveydata.data.c7 <= 4) {
                    c7 = 2
                } else if (surveydata.data.c7 >= 5 && surveydata.data.c7 <= 6) {
                    c7 = 3
                }

                surveydata.data.psqi_score = surveydata.data.c1 + c2 + surveydata.data.c3 + c4 + c5 + surveydata.data.c6 + c7
            }

            fetch("/save-comment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(surveydata)
            }).then(response => response.text())
                .then(data => {
                    if (data == "saved") {
                        document.querySelector(".sd-body.sd-completedpage h3").innerHTML = document.querySelector(".sd-body.sd-completedpage h3").innerHTML + "<br/>and<br/><span style='color:green'>Your answers were saved!</span>"
                        refreshList()
                    } else {
                        document.querySelector(".sd-body.sd-completedpage h3").innerHTML = document.querySelector(".sd-body.sd-completedpage h3").innerHTML + "<br/>and<br/><span style='color:red'>But your answers were not saved due to a problem. Please contact support!</span>"
                    }
                });
        });

    //   survey.data = JSON.parse(data);
    //    survey.mode = 'display';

    $(`#${document.querySelector(".surveyElement").id}`).Survey({ model: survey });


    if (document.querySelector(".surveyElement").id == "onboarding") {
        refreshList()
    }
})

function refreshList() {
    fetch('/get_nih_onboarding_list?distinct=true').then(response => response.json())
        .then(data => {
            const header = `<table id="patient_list_tbl" class="gridSelectedPatientList" style="margin:10px"> 
                <tr>
                    <th>Subject Number</th>
                    <th>Ring Serial Number</th>
                    <th>First segment subject identifier</th>
                    <th>Last segment subject identifier</th>
                    <th>Pregnancy due date</th>
                </tr>                                   
        `

            header + '</table>'

            let rows = "", included = [];
            for (const d of data) {
                if (!included.includes(d.subject_number)) {
                    included.push(d.subject_number);
                    rows = rows + `<tr id="${d.id}" onclick="toggleClass(this,'selected');"> 
                <td>${d.subject_number}  </td> <td> ${d.ring_serial_number} </td> <td>${d.firstname}  </td> <td> ${d.lastname} </td> <td> ${(d.preg_due_date) ? moment(d.preg_due_date).format("MM/DD/YYYY") : ''} </td>            
                </tr>`
                }

            }

            const tbl = header + rows + '</table>'
            document.getElementById("onboarding_list").innerHTML = tbl
        });
}


function toggleClass(el, className) {

    document.querySelectorAll("#patient_list_tbl tr").forEach(e => {
        e.className = ""
    })


    if (el.className.indexOf(className) >= 0) {
        el.className = el.className.replace(className, "");
    }
    else {
        el.className += className;
    }

    refreshViewHistory();

    document.getElementById("activateBtnVisit").disabled = false;
    document.getElementById("activateBtnViewVisits").disabled = false;
    document.getElementById("activateBtnRemove").disabled = false;
    document.getElementById("activateBtnEdit").disabled = false;

}

let selectedSubject = {}

function refreshViewHistory() {

    document.querySelectorAll("#patient_list_tbl tr").forEach(e => {
        if (e.className == "selected") {
            selectedSubject["selectedSubjectNumber"] = e.querySelector('td').innerHTML.trim();
            selectedSubject["selectedRingSerial"] = e.querySelectorAll('td')[1].innerHTML.trim();
            selectedSubject["selectedFirstname"] = e.querySelectorAll('td')[2].innerHTML.trim();
            selectedSubject["selectedLastname"] = e.querySelectorAll('td')[3].innerHTML.trim();
        }
    })

    fetch('/get_nih_onboarding_list?distinct=false&subject_number=' + selectedSubject["selectedSubjectNumber"]).then(response => response.json())
        .then(data => {

            const header = `<table id="visit_history_tbl" style="margin:10px"> 
                        <tr>
                            <th>Date</th>
                            <th>Irritation from the ring</th>
                            <th>Which finger will be used</th>
                            <th>Weight</th>
                            <th>Pulse</th>
                            <th>Blood pressure</th>
                            <th>Neck circumference</th>
                        </tr>                                   
                `

            header + '</table>'

            let rows = "";
            for (const d of data) {
                const p = JSON.parse(d.data)
                if (!p.irritation_ring) continue;
                rows = rows + `<tr onclick="toggleClass(this,'selected');"> 
                   <td>${p.created_date} </td><td>${p.irritation_ring}  </td> <td> ${p.finger_used} </td> <td> ${p.weight} </td>  <td> ${p.pulse} </td>  <td> ${p.blood_pressure} </td><td> ${p.neck_circumference} </td>
                    
                    </tr>`
            }

            const tbl = header + rows + '</table>'
            document.getElementById("visit_history_div").innerHTML = tbl
        })
}

function addVisit() {
    const visitData = {
        created_date: document.getElementById("created_date").value,
        subject_number: selectedSubject["selectedSubjectNumber"],
        ring_serial_number: selectedSubject["selectedRingSerial"],
        firstname: selectedSubject["selectedFirstname"],
        lastname: selectedSubject["selectedLastname"],
        irritation_ring: document.getElementById("irritation_ring").value,
        finger_used: document.getElementById("which_finger").value,
        weight: document.getElementById("weight").value,
        pulse: document.getElementById("pulse").value,
        blood_pressure: document.getElementById("blood_pressure").value,
        neck_circumference: document.getElementById("neck_circumference").value
    }


    fetch("/add-visit", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData)
    }).then(response => response.text())
        .then(data => {
            refreshViewHistory();
            document.getElementById("closeAddVisit").click();
        });
}

function addPatient() {
    const data = {
        subject_number: document.getElementById("subject_number").value,
        ring_serial_number: document.getElementById("ring_serial_number").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        preg_due_date: document.getElementById("preg_due_date").value,
        db_id: document.getElementById("db_id").value
    }

    if (document.getElementById("activateModalLabel").innerHTML == "Add Patient") {
        fetch("/addpatient", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.text())
            .then(data => {
                refreshList();
                document.getElementById("closeAppAddPatient").click();
            });
    } else {
        fetch("/editpatient", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.text())
            .then(data => {
                refreshList();
                document.getElementById("closeAppAddPatient").click();
            });
    }



}

function addPatientBtn() {
    document.getElementById("activateModalLabel").innerHTML = "Add Patient";
}

function editPatient() {
    document.getElementById("activateModalLabel").innerHTML = "Edit Patient";

    document.querySelectorAll("#patient_list_tbl tr").forEach(e => {
        if (e.className == "selected") {
            selectedSubject["id"] = e.id;
            selectedSubject["selectedSubjectNumber"] = e.querySelector('td').innerHTML.trim();
            selectedSubject["selectedRingSerial"] = e.querySelectorAll('td')[1].innerHTML.trim();
            selectedSubject["selectedFirstname"] = e.querySelectorAll('td')[2].innerHTML.trim();
            selectedSubject["selectedLastname"] = e.querySelectorAll('td')[3].innerHTML.trim();
            selectedSubject["selectedPregDueDate"] = e.querySelectorAll('td')[4].innerHTML.trim();
        }
    })

    document.getElementById("db_id").value = selectedSubject["id"]
    document.getElementById("subject_number").value = selectedSubject["selectedSubjectNumber"]
    document.getElementById("ring_serial_number").value = selectedSubject["selectedRingSerial"]
    document.getElementById("firstname").value = selectedSubject["selectedFirstname"]
    document.getElementById("lastname").value = selectedSubject["selectedLastname"]
    document.getElementById("preg_due_date").value = moment(selectedSubject["selectedPregDueDate"]).format('YYYY-MM-DD');

}

function removePatient() {
    fetch(`/removepatient?subject_number=${selectedSubject["selectedSubjectNumber"]}`).then(response => response.text())
        .then(data => {
            refreshList()
            refreshViewHistory()
        })
}