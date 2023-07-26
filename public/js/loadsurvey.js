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
        case "onboarding":
            json = onboarding_json
            break;
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
                    } else {
                        document.querySelector(".sd-body.sd-completedpage h3").innerHTML = document.querySelector(".sd-body.sd-completedpage h3").innerHTML + "<br/>and<br/><span style='color:red'>But your answers were not saved due to a problem. Please contact support!</span>"
                    }
                });
        });

    //   survey.data = JSON.parse(data);
    //    survey.mode = 'display';

    $(`#${document.querySelector(".surveyElement").id}`).Survey({ model: survey });
})