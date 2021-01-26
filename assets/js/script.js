
/*TODO : when search button is clicked we 
get the users import and ad it to the API to get the response
for the specific place they inserted
*/
//date for the api it only takes format YYYY/MM/DD

var date = moment(). format("YYYY-MM-DD");
console.log(date)
 // location for information 
 var info = document.querySelector("#info");
 //place

//start of samuels portion
$("#search").on("click",function(e) {
   e.preventDefault()
   displayResults();
});
//function that displays  logic
function displayResults(){
    var place = $("#city").val();

    // make a get request to url
    var api = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=" + place;
    console.log(api)
    fetch(api, {
      "method": "GET",
      "headers": {
          "x-rapidapi-key": "5320d39b26msh9d1c12db50862d2p1c0e8ajsn0cf78c7c1705",
          "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com"
      }
  })
    .then(function(response) {
      // request was successful
      if (response.ok) {
          //call display function
        response.json().then(function(data) {
           //displays results
           if (data.data.location === "Global"){
               errorMessage.innerHTML = "This country is not yet supported by our program, please have a look at the global stats!";
               errorMessage.setAttribute("class", "error")
             countryName.innerHTML = data.data.location;
             lastChecked.innerHTML ="updated on " + moment().format('LLL');
             currentDeaths.innerHTML = " Current Deaths: " + data.data.deaths;
             currentCases.innerHTML = "Current Cases: " + data.data.confirmed
             currentRecoveries.innerHTML = "Recovered Cases: " + data.data.recovered;
           }
           else{
               errorMessage.innerHTML = "";
         countryName.innerHTML = data.data.location;
         lastChecked.innerHTML ="updated on " + moment().format('LLL');
         currentDeaths.innerHTML = " Current Deaths: " + data.data.deaths;
         currentCases.innerHTML = "Current Cases: " + data.data.confirmed
         currentRecoveries.innerHTML = "Recovered Cases: " + data.data.recovered;
           }          
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
    });
  //append information
  
  info.appendChild(errorMessage);
  info.appendChild(countryName);
  info.appendChild(lastChecked);
  info.appendChild(currentCases);
  info.appendChild(currentDeaths);
  info.appendChild(currentRecoveries);
}
//creating elements 
var errorMessage = document.createElement("h2");
var countryName = document.createElement("h1");
var lastChecked = document.createElement("h1");
var currentCases = document.createElement("h1");
var currentDeaths = document.createElement("h1");
var currentRecoveries = document.createElement("h1");
//end of samuels Portion

// Given full country name, converts it to ISO 3166-1 alpha-2 code.
var convertCountryToISO = async function (fullCountryName) {
 const response = await fetch(
   `https://restcountries.eu/rest/v2/name/${fullCountryName
     .toLowerCase()
     .trim()}?fullText=true`
 );
 const responseJSON = await response.json();
 return responseJSON[0].alpha2Code;
};

// Given full country name, displays COVID-19 news for that country
var getNewsForCountry = (fullCountryName) => {
 convertCountryToISO(fullCountryName).then((countryCode) => {
   fetch(
     `https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&sort_by=rank&country=${countryCode}&media=True`,
     {
       method: "GET",
       headers: {
         "x-rapidapi-key":
           "79e20cee69mshcae50ad470f1abep1cc951jsn09748cf70909",
         "x-rapidapi-host": "covid-19-news.p.rapidapi.com",
       },
     }
   )
     .then((response) => {
       response.json().then((responseJSON)=>{
         var imageUrl = responseJSON.articles[0].media;
         var sourceLink = responseJSON.articles[0].link;
         var summary = responseJSON.articles[0].title;
         $("#news").css("background-image", `url(${imageUrl})`);
         $('#news a').attr('href', sourceLink, '_blank').css('color','white')
         document.querySelector('#news a').text = summary;
       })
     })
     .catch((err) => {
       console.error(err);
     });
 });
};

 // TODO: make dynamic once all pieces are ready
 getNewsForCountry("US");
