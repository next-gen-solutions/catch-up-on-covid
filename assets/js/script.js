/*TODO : when search button is clicked we 
get the users import and ad it to the API to get the response
for the specific place they inserted
*/

$("#search").on("click", function (e) {
  e.preventDefault();
  var myHeaders = new Headers();
  myHeaders.append("Subscription-Key", "3009d4ccc29e4808af1ccc25c69b4d5d");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  var city = $("#city").val();
  console.log(city);
  var apiUrl = "https://api.smartable.ai/coronavirus/news/US";
  console.log(apiUrl);
  // make a get request to url
  fetch(apiUrl, requestOptions)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        //call display function
        response.json().then(function (data) {
          displayRates(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {});
});
// displays covid results.
function displayRates(data) {}

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
  getNewsForCountry("USA");