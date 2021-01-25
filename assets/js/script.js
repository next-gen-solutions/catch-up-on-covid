
/*TODO : when search button is clicked we 
get the users import and ad it to the API to get the response
for the specific place they inserted
*/
//date for the api it only takes format YYYY/MM/DD

 var date = moment(). format("YYYY-MM-DD");
 console.log(date)

 

// $("#search").on("click",function(e) {
//     e.preventDefault()
//     var place = $("#city").val();
//     console.log(place)
//       // make a get request to url
//       fetch("https://covid-19-data.p.rapidapi.com/report/country/name?date=" + date + "&name=" + place+"&date-format=YYYY-MM-DD&format=json", {
//         "method": "GET",
//         "headers": {
//             "x-rapidapi-key": "5320d39b26msh9d1c12db50862d2p1c0e8ajsn0cf78c7c1705",
//             "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
//         }
//     })
//       .then(function(response) {
//         // request was successful
//         if (response.ok) {
//             //call display function
//           response.json().then(function(data) {
//             // displayRates(data);
//             console.log(data[0].provinces[0].province)

//           });
//         } else {
//           alert("Error: " + response.statusText);
//         }
//       })
//       .catch(function(error) {
//         alert("Unable to connect to GitHub");
//       });
// });

$("#search").on("click",function(e) {
    e.preventDefault()
    var place = $("#city").val();
    console.log(place)
      // make a get request to url
      fetch("https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country="+place, {
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
            // displayRates(data);
            console.log(data.data.recovered)

          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to connect to GitHub");
      });
});

//  function displayRates(data){
//    console.log(data.confirmed)
//  }
