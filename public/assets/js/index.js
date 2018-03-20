(function () {


    let api = "";
    let searchTerm = "";
    let queryURL = "";

    $(".button-collapse").sideNav();

    // queryURL = "" + api + "" + searchTerm

    // $.get(queryURL).then(function(response) {
    //     console.log(response)
    // });


    $(".submit").on("click", function(){
  console.log("i work");
})

function makeChoices(){

  $(".choice").on('click',function(){
    console.log(this.value);
  });


}


makeChoices();

})
