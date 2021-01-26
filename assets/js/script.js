/*When search button is clicked we 
get user's input and add it to the APIs to get required COVID-19 data
*/
$("#search").on("click", function (e) {
  e.preventDefault();
  var country = $("#country-dropdown option:selected").text();

  // display COVID-19 news for a given country
  displayNewsForCountry(country);
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
    `https://covid-19-news.p.rapidapi.com/v1/covid?q=covid&lang=en&sort_by=rank&country=${countryCode}&media=True`,
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
  $("#news").css({ "background-image": `url(${imageUrl})` });
  $("#news a").attr("href", sourceLink, "_blank");
  document.querySelector("#news a").text = title;
};

// Given full country name, displays COVID-19 news for that country
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
      console.error(err);
    });
};
