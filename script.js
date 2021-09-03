/* ============= Fetching Date ================ */
const curDate = document.getElementById("date");

const getCurrentDay = () =>{
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    let currentDay = new Date();
    let day = weekday[currentDay.getDay()];
    return day;
};

const getCurrentDate = () => {
    var months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = months[currentDate.getMonth()];


    let hours = currentDate.getHours();
    let mins = currentDate.getMinutes();
    let periods = "AM";

    if(hours > 11){
        periods = "PM";
        if(hours >12) hours -= 12;
    }
    if(hours==0){
        hours=12;
    }
    if(mins < 10){
        mins = "0" + mins;
    }

    return `${date} ${month} | ${hours}:${mins} ${periods}`;
};

curDate.innerHTML = getCurrentDay() + " | " + getCurrentDate();


/* ============================Fetching weather=========================== */
const wrapper = document.querySelector(".wrapper"),
      inputPart = wrapper.querySelector(".input-part"),
      infoTxt = inputPart.querySelector(".info-txt"),
      inputField = inputPart.querySelector("input"),
      locationBtn = inputPart.querySelector("button"),
      wIcon = document.querySelector(".weather-part img"),
      arrowBack = wrapper.querySelector("header i");   


inputField.addEventListener("keyup", e =>{
    // if user press enter button and input is not empy
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});
let api;
locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser doesn't support geolocation api");
    }
});
var _0x337f=["\x36\x31\x38\x64\x37\x39\x64\x33\x61\x35\x36\x31\x32\x36\x66\x62\x66\x61\x66\x36\x33\x33\x31\x39\x33\x63\x64\x66\x62\x66\x31\x36"];const apky=`${_0x337f[0]}`
function onSuccess(position){
    const {latitude, longitude} = position.coords; //getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apky}`;
    fetchData();
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apky}`;
    fetchData();
}
function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    //getting api response and returning it with parsing into js obj and in another
    //then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}
function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        // lets get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        //using custom icon according to the id which api return us
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }

        //lets pass these value to a particular html element
        wrapper.querySelector(".temp .num").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }    
}
arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});