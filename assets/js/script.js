/*TODO : when search button is clicked we 
get the users import and ad it to the API to get the response
for the specific place they inserted
*/


$("#search").on("click",function(e) {
    e.preventDefault()
    var myHeaders = new Headers();
myHeaders.append("Subscription-Key", "3009d4ccc29e4808af1ccc25c69b4d5d");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
    var city = $("#city").val();
    console.log(city)
    var apiUrl ="https://api.smartable.ai/coronavirus/news/US";
    console.log(apiUrl);
      // make a get request to url
      fetch(apiUrl, requestOptions)
      .then(function(response) {
          // request was successful
          if (response.ok) {
              //call display function
            response.json().then(function(data) {

              displayRates(data);
            });
          } else {
            alert("Error: " + response.statusText);
          }
        })
        .catch(function(error) {
        });
});
// displays covid results.
function displayRates(data){

}

