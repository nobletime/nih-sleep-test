window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {

    navigator.serviceWorker
      .register('/public/sw.js').then(registeration => {
        // const params = new URLSearchParams(window.location.search)
        // if (params.has('app_id')) {
        //   const SHARED_DATA_ENDPOINT = '/app_id';
        //   fetch(SHARED_DATA_ENDPOINT, { method: "POST", body: JSON.stringify({ app_id: params.get('app_id') }) }).then(() => {
        //     console.log('saved to cache')
        //   })
        // }
      })

    // const params = new URLSearchParams(window.location.search)
    // if (params.has('app_id')){     

  }

  navigator.serviceWorker.addEventListener("controllerchange", (evt) => {
    console.log("controller changed");
    this.controller = navigator.serviceWorker.controller;
  });

  navigator.serviceWorker.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    console.log(data.app_data);
  });

  // navigator.serviceWorker.controller.postMessage(JSON.stringify({app_id: "app_id"}));


  if ((window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://')) {

    fetch("/getversion")
      .then(res => res.json())
      .then(data => {
        const oldV = document.getElementById("app-version").value
        const newV = data[0].version
        if ((oldV != newV)) {
          const message = `Your version of app is old ${oldV}, please install the new version of the app (verson ${newV})`
          document.getElementById("appversion-message").innerHTML = message
          document.getElementById("appUpdateBtn").click()
          //   $("#appVersionModal").show();
        }
      })

  } else {

    // alert(`you are running ${getMobile()}`)
  //   <video controls="controls" width="800" height="600" name="Video Name">
  //   <source src="/public/images/video.mov">
  // </video>
    // if (getMobile() == "ios") {
    //   document.getElementById("main-content").innerHTML = `
    //   <div style="padding:10px;border:2px red solid; margin:10px; color:black;font-size:20px;">
    //      <h3 style="text-align:center">To Install the APP on iOS:  </h3>
    //      <div style=" margin-bottom:20px">
    //     <strong>Step 1:</strong> Tap the icon <img src="/public/images/ios_install_button.jpg"   style="width:15%"  > or <img src="/public/images/ios_install_button_white.jpg"   style="width:17%"  > at the bottom of the screen.
    //      <br/> <br/>
    //      <strong>Step 2:</strong> Scroll down and tap <img src="/public/images/add_home_screen.jpg"   style="width:100%"  >  <br/> <br/>
       
    //      <strong>Step 3:</strong> Tap "Add". <br/>
    //     <img src="/public/images/add.jpg"   style="width:100%"  >
    //     </div>

    //     <span>Now the CSMA app should be added to your home screen.  </span> <br/><br/>
        
    //     For a video instruction click <a href="/public/images/video.mov" target="_blank" rel="noopener noreferrer">here </a>


    //   </div> 
    //  `

    // } else {

    // }

  }

}
