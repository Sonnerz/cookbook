// #region AJAX send the signup data to Flask/Python

$(function () {
  $('#signupForm').submit(function (event) {
    event.preventDefault();
    $.ajax({
      url: '/signup_user',
      data: $('#signupForm').serialize(),
      type: 'POST',
      success: function (response) {
        console.log(response);
        if (response == "success") {
          var message = "Success. Log in now."
          $("#signupMessages").html(message);
          var delay = 1000;
          setTimeout(function () { window.location.href = "/"; }, delay);
        }
        else if (response == "fail") {
          var message = "Failure name take"
          $("#signupMessages").html(message);
        }
      },
      error: function (error) {
        console.log(error);
        $("#signupMessages").html(response);
      }
    });
  });
});

// #endregion

// #region AJAX send the login data to Flask/Python

$(function () {
  $('#loginForm').submit(function (event) {
    event.preventDefault();
    $.ajax({
      url: '/login_user',
      data: $('#loginForm').serialize(),
      type: 'POST',
      success: function (response) {
        console.log(response);
        $("#loginMessages").html(response.message);
        //Add username and id to localstorage        
        localStorage.setItem("username", response.username);
        localStorage.setItem("user_id", response._id);
        // Delay before redirect to read message
        var delay = 1200;
        setTimeout(function () { window.location.href = "/profile"; }, delay);
      },
      error: function (error) {
        console.log(error);
        $("#loginMessages").html(response);
      }
    });
  });
});

// #endregion

// #region AJAX send the new recipe data from form to Flask/Python

$(function () {
  $('#add_recipe_form').submit(function (event) {
    event.preventDefault();
    $.ajax({
      url: '/insert_recipe',
      data: $('#add_recipe_form').serialize(),
      type: 'POST',
      success: function (response) {
        console.log("RESPONSE FROM SERVER", response);
        $("#newRecipeMessages").html(response);
        // Delay before redirect to read message
        var delay = 1200;
        setTimeout(function () { window.location.href = "/profile"; }, delay);
      },
      error: function (error) {
        console.log(error);
        $("#newRecipeMessages").html(response);
      }
    });
  });
});

// #endregion

// #region AJAX update a recipe send data from form to server

$(function () {
  $('#update_recipe_form').submit(function (event) {
    event.preventDefault();
    var url = window.location.href;
    recipe_id = url.split("/").pop();
    $.ajax({
      url: '/update_recipe/' + recipe_id,
      data: $('#update_recipe_form').serialize(),
      type: 'POST',
      success: function (response) {
        console.log("RESPONSE FROM SERVER", response);
        $("#editRecipeMessages").html(response);
        window.location.href = "/profile";
        // Delay before redirect to read message
        // var delay = 1200;
        // setTimeout(function () { window.location.href = "/profile"; }, delay);
      },
      error: function (error) {
        console.log(error);
        $("#editRecipeMessages").html(response);
      }
    });
  });
});

// #endregion

// #region show/hide the Debug Panel
function viewPanel() {
  var panel = document.getElementById("panel-debug");
  if (panel.style.display === "none") {
    panel.style.display = "block";
  }
  else {
    panel.style.display = "none";
  }
}

// #endregion

// #region GO BACK TO PREVIOUS PAGE

function goPrev()
{
  window.history.back();
}

// #endregion


// DOCUMENT.READY START //

$(document).ready(function () {

// #region Add class to navbar link depending on the page displayed  

  var current_path = $(location).attr('pathname');
  if (current_path == "/profile") {
    $("#profile-nav-link").addClass("active-link");
  }
  else if (current_path == "/add_recipe") {
    $("#add-nav-link").addClass("active-link");
  }

// #endregion  


  //get localstorage user_id and set hidden field in add recipe form
  // var user_id = localStorage.getItem("user_id");
  // console.log(user_id);
  // document.getElementById("form_user_id").value = user_id;
  // document.getElementById("test").innerHTML = user_id;



  // #region Add extra ingredient or instruction inputs to add recipe form
  $('#add_ingredient').click(function () {
    addExtraInputs("i");
    return false; //return false;  stops page jumping back to top
  })

  $('#add_instruction').click(function () {
    addExtraInputs("m");
    return false; //return false;  stops page jumping back to top
  })

  function addExtraInputs(inputs) {
    if (inputs == "i") {
      var ingred = '<div class="added-ingred">' +
        '<input type="text" class="input form-control" placeholder="ingredient" name="ingredient">' +
        '<a href="#"><i class="fa fa-minus-circle delete" aria-hidden="true"></i></a></div>';
      $("#ingredients_input_list").append(ingred);
    }
    else {
      var method = '<div class="added-instruction">' +
        '<textarea class="input form-control" placeholder="instruction" name="instruction"></textarea>' +
        '<a href="#"><i class="fa fa-minus-circle delete" aria-hidden="true"></i></a></div>';
      $("#instruction_input_list").append(method);
    }
  }

  $(function () {
    $('#ingredients_input_list').on('click', '.delete', function () {
      var rem = $(this).closest('div.added-ingred');
      $(rem).remove();
      return false; //return false;  stops page jumping to top
    });
  });

  $(function () {
    $('#instruction_input_list').on('click', '.delete', function () {
      var rem = $(this).closest('div.added-instruction');
      $(rem).remove();
      return false; //return false;  stops page jumping to top
    });
  });

  // #endregion



  // #region CONFIRM WITH USER BEFORE DELETE A RECIPE
  $(function () {
    $('.delete_recipe').click(function (e) {
      e.preventDefault();
      // GET THE ID OF THE RECIPE APPENDED TO DELETE BUTTON ID
      var thisrecipeid = this.id;
      $("#confirm_delete").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
          "Delete all items": function () {
            $(this).dialog("close");
            var recipe_id = thisrecipeid
            $.ajax({
              url: '/delete_recipe',
              data: {"recipe_id" : recipe_id},
              type: 'POST',
              success: function (response) {
                console.log("RESPONSE FROM SERVER", response);
                $("#profileMessages").html(response);
                window.location.href = "/profile";
              },
              error: function (error) {
                console.log(error);
                $("#profileMessages").html(response);
              }
            });           
          },
          Cancel: function () {
            $(this).dialog("close");
          }
        }
      });
      return false;
    });
  });

  // #endregion



}); // DOCUMENT.READY END //



