$(() => {

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
        case "isi":
            json = isi
            break;
        case "general":
            json = general_json
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

            if (user == null ) {
                if (document.getElementById("activateBtn"))
                    document.getElementById("activateBtn").click()
                return false;
            }

            let plot_date = new Date().setHours(0, 0, 0, 0) - 1;
            if (sender.data.whichnight == "tonight") {
                if (new Date().getHours() > 1) {
                    plot_date = moment(new Date()).add( 1, 'days')._d.setHours(0, 0, 0, 0) -1;
                }
            }
   
            const surveydata = {
                clinic_id:  user.clinic_id,
                patient_app_id: user.app_id,
                date: new Date(),
                plot_date: plot_date,
                type: document.querySelector(".surveyElement").id,
                data: sender.data
            }        

            //   surveydata.clinic_name = cname
            //    surveydata.date = new Date(moment(new Date()).format('MM/DD/YYYY'));

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

function refreshList(){
    fetch('/get_nih_onboarding_list?distinct=true').then(response => response.json())
.then(data => {
    const header = `<table id="patient_list_tbl" class="gridSelectedPatientList" style="margin:10px"> 
                <tr>
                    <th>Subject Number</th>
                    <th>Ring Serial Number</th>
                    <th>First segment subject identifier</th>
                    <th>Last segment subject identifier</th>
                </tr>                                   
        `

        header +  '</table>'
    
    let rows = "";
    for (const d of data) {
        rows = rows + `<tr onclick="toggleClass(this,'selected');"> 
            <td>${d.subject_number}  </td> <td> ${d.ring_serial_number} </td> <td>${d.firstname}  </td> <td> ${d.lastname} </td>
            
            </tr>`
    }

    const tbl = header +  rows +  '</table>'
    document.getElementById("onboarding_list").innerHTML = tbl
});
}


function toggleClass(el, className) {

    document.querySelectorAll("#patient_list_tbl tr").forEach(e=>{
        e.className = ""
    })

    
if (el.className.indexOf(className) >= 0) {
    el.className = el.className.replace(className,"");
}
else {
    el.className  += className;
}

refreshViewHistory();

document.getElementById("activateBtnVisit").disabled=false;
document.getElementById("activateBtnViewVisits").disabled=false;
document.getElementById("activateBtnRemove").disabled=false;

}

let selectedSubject = {} 

function refreshViewHistory(){
 
    document.querySelectorAll("#patient_list_tbl tr").forEach(e=>{
               if (e.className == "selected") {
                selectedSubject["selectedSubjectNumber"] = e.querySelector('td').innerHTML.trim();
                selectedSubject["selectedRingSerial"] = e.querySelectorAll('td')[1].innerHTML.trim();
                selectedSubject["selectedFirstname"] = e.querySelectorAll('td')[2].innerHTML.trim();
                selectedSubject["selectedLastname"] = e.querySelectorAll('td')[3].innerHTML.trim();
               }
            })    
       
    fetch('/get_nih_onboarding_list?distinct=false&subject_number=' + selectedSubject["selectedSubjectNumber"] ).then(response => response.json())
        .then(data => {                   
            
            const header = `<table id="visit_history_tbl" style="margin:10px"> 
                        <tr>
                            <th>Irritation from the ring</th>
                            <th>Which finger will be used</th>
                            <th>Weight</th>
                            <th>Pulse</th>
                            <th>Blood pressure</th>
                            <th>Neck circumference</th>
                        </tr>                                   
                `
    
                header +  '</table>'
            
            let rows = "";
            for (const d of data) {
                const p = JSON.parse(d.data)
                if (!p.irritation_ring) continue;
                rows = rows + `<tr onclick="toggleClass(this,'selected');"> 
                    <td>${p.irritation_ring}  </td> <td> ${p.finger_used} </td> <td> ${p.weight} </td>  <td> ${p.pulse} </td>  <td> ${p.blood_pressure} </td><td> ${p.neck_circumference} </td>
                    
                    </tr>`
            }
    
            const tbl = header +  rows +  '</table>'
            document.getElementById("visit_history_div").innerHTML = tbl    
       })    
    }

    function addVisit(){
        const visitData = {            
             subject_number : selectedSubject["selectedSubjectNumber"],
             ring_serial_number : selectedSubject["selectedRingSerial"],
             firstname : selectedSubject["selectedFirstname"],
             lastname : selectedSubject["selectedLastname"],
             irritation_ring : document.getElementById("irritation_ring").value,
             finger_used : document.getElementById("which_finger").value,
             weight : document.getElementById("weight").value,
             pulse : document.getElementById("pulse").value,
             blood_pressure : document.getElementById("blood_pressure").value,
             neck_circumference : document.getElementById("neck_circumference").value
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

    function addPatient(){
        const data = {            
             subject_number : document.getElementById("subject_number").value ,
             ring_serial_number : document.getElementById("ring_serial_number").value,
             firstname : document.getElementById("firstname").value,
             lastname : document.getElementById("lastname").value
        }

        fetch("/addpatient", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.text())
            .then(data => {
                refreshList();
                document.getElementById("closeAppAddPatient").click();
            });
    }

    function removePatient(){
        fetch(`/removepatient?subject_number=${selectedSubject["selectedSubjectNumber"]}`).then(response => response.text())
        .then(data => {
            refreshList()
            refreshViewHistory()
        })    
    }