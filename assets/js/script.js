//always expect 1 country (recently searched), as we don't need to keep track of all the countries for this app.
var countries = JSON.parse(localStorage.getItem("countries")) || [];

var currentCountry;

//creating elements outside so it clears.
var errorMessage = document.createElement("h2");
var countryName = document.createElement("h1");
var lastChecked = document.createElement("h1");
var currentCases = document.createElement("h1");
var currentDeaths = document.createElement("h1");
var currentRecoveries = document.createElement("h1");

/*When search button is clicked we 
get user's input and add it to the APIs to get required COVID-19 data
*/
$("#search").on("click", function (e) {
  e.preventDefault();
  currentCountry = $("#country-dropdown option:selected").text();
  displayStatsForGivenCountry(currentCountry);
  displayNewsForCountry(currentCountry);
  displayChart(currentCountry).then(() => {
    addCountryToLocalStorage(currentCountry);
  });
});

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

// Given country code, retrieve trending COVID-19 news for that country
var getNewsForCountry = async (countryCode) => {
  const response = await fetch(
    `https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&sort_by=relevancy&country=${countryCode}&media=True`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "79e20cee69mshcae50ad470f1abep1cc951jsn09748cf70909",
        "x-rapidapi-host": "covid-19-news.p.rapidapi.com",
      },
    }
  );
  const responseJSON = await response.json();
  return responseJSON;
};

var populateNewsContent = (responseJSON) => {
  var imageUrl = responseJSON.articles[0].media;
  var sourceLink = responseJSON.articles[0].link;
  var title = responseJSON.articles[0].title;

  if (!imageUrl) {
    imageUrl = "assets/default.jpg";
  }
  $("#news").css({
    "background-image": `  linear-gradient( rgba(255,0,0,0), rgba(255,0,0,.5)), url(${imageUrl})`,
  });
  $("#news a").attr("href", sourceLink, "_blank");
  document.querySelector("#news a").text = title;
};

// Given full country name, displays COVID-19 news for that country
var myCountry;
var defaulImgUrl = "assets/default.jpg";
$("#news").css({ "background-image": `url(${defaulImgUrl})` });

var displayNewsForCountry = (fullCountryName) => {
  convertCountryToISO(fullCountryName)
    .then((countryCode) => {
      getNewsForCountry(countryCode).then((responseJSON) => {
        if (responseJSON.status == "No matches for your search.") {
          getNewsForCountry("US").then((defaultResponseJSON) => {
            populateNewsContent(defaultResponseJSON);
          });
        } else {
          populateNewsContent(responseJSON);
        }
      });
    })
    .catch((err) => {
      var newsHeaderEl = document.querySelector("#news a");
      newsHeaderEl.text = "Your advertisement could go here"; //TODO: @yulduz: fix it
      newsHeaderEl.setAttribute("style", "font-size: 20px", "color: yellow");
      console.error(err);
    });
};

//NOT COMPATIBLE W/ GITHUB PAGES' DUE TO SERVING CONTENT OVER HTTP
var getUsersLocation = async () => {
  const response = await fetch(
    "http://api.ipstack.com/check?access_key=caf6117ea48e02e280cf1198ad4c4e12"
  );
  const responseJSON = await response.json();
  var countryBasedOnLocation = responseJSON.country_code;
  return countryBasedOnLocation;
};

var displayChart = async (searchedCountry) => {
  var iframeEl = $("#chart iframe");
  var predefinedCountry = "US";
  var previoslySearchedCountry = countries[0];
  var twoMonthsAgo = moment().subtract(2, "months").format("M/DD/YY");
  iframeEl[0].attributes.src.nodeValue = `https://covid19chart.org/#/?bare=1&include=${predefinedCountry};${previoslySearchedCountry};${searchedCountry}&scale=linear&start=${twoMonthsAgo}&top=0&domain=&theme=paper&advanced=1`;
};

var displayStatsForGivenCountry = (country) => {
  // make a get request to url
  var api =
    "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=" +
    country;
  fetch(api, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "5320d39b26msh9d1c12db50862d2p1c0e8ajsn0cf78c7c1705",
      "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
    },
  })
    .then(function (response) {
      // request was successful
      if (response.ok) {
        //call display function
        response.json().then(function (data) {
          //displays results
          populateCovidStatsContent(data);
        });
      } else {
      }
    })
    .catch(function (error) {});
};

var populateCovidStatsContent = (data) => {
  $("#info").attr("class", "cardStyle");

  if (data.data.location === "Global") {
    if (!countries.length == 0) {
      errorMessage.innerHTML =
        "This country is not yet supported by our program, please have a look at the global stats!";
      errorMessage.setAttribute("class", "error");
    }
    countryName.innerHTML = data.data.location;
    lastChecked.innerHTML = "updated on " + moment().format("LLL");
    currentDeaths.innerHTML = " Current Deaths: " + data.data.deaths;
    currentCases.innerHTML = "Current Cases: " + data.data.confirmed;
    currentRecoveries.innerHTML = "Recovered Cases: " + data.data.recovered;
  } else {
    errorMessage.innerHTML = "";
    countryName.innerHTML = data.data.location;
    lastChecked.innerHTML = "updated on " + moment().format("LLL");
    currentDeaths.innerHTML = " Current Deaths: " + data.data.deaths;
    currentCases.innerHTML = "Current Cases: " + data.data.confirmed;
    currentRecoveries.innerHTML = "Recovered Cases: " + data.data.recovered;
  }
  //append information

  info.appendChild(errorMessage);
  info.appendChild(countryName);
  info.appendChild(lastChecked);
  info.appendChild(currentCases);
  info.appendChild(currentDeaths);
  info.appendChild(currentRecoveries);
};

// Adds recently searched country to local storage by overwriting it's current contents
// We only need to keep track of 1 recently searched country,
// which is why we are not tracking the entire search history.
var addCountryToLocalStorage = (country) => {
  //update array
  countries.splice(0, 1, country);

  //push to localstorage
  localStorage.setItem("countries", JSON.stringify(countries));
};

displayChart();
displayNewsForCountry("United States of America");
if (countries.length == 0) {
  displayStatsForGivenCountry("global");
} else {
  displayStatsForGivenCountry(countries[0]);
}
