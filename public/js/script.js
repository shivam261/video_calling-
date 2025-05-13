// prevents the user from entering bad characters in input that could break the python code :(
$('input').on('keypress', function(e) {
  if (e.keyCode == 13) {
    return true
  };
  if (e.which < 48 && e.which != 32 ||
    (e.which > 57 && e.which < 65) ||
    (e.which > 90 && e.which < 97) ||
    e.which > 122) {
    e.preventDefault();
  }
});

// word array for playing words
var wordArray = [];

// stops a tag from redirecting
$('a').click(function(event) {
  event.preventDefault();
});

// stops submit button from submitting the form 
let form = document.getElementById('textForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();
});

// ajax request to get the response from flask in json and play the words
let sub = document.getElementById('textSubmit');
sub.addEventListener('click', () => {
  let input = document.getElementById('transcribedText').value;
  $.ajax({
    url: '/',
    type: 'POST',
    data: {
      text: input
    },
    success: function(res) {
      convert_json_to_arr(res);
      play_each_word();
      display_isl_text(res);
    },
    error: function(xhr) {
      console.log(xhr);
    }
  });
});

// displays ISL text 
function display_isl_text(words) {
  let p = document.getElementById("isl_text");
  p.textContent = "";
  Object.keys(words).forEach(function(key) {
    p.textContent += words[key] + " ";
  });
}


// displays error message if some error is there
function display_err_message() {
  console.log("ERROR:- ", "Some error occurred while playing SiGML file");
}

// converts the returned  json to array
function convert_json_to_arr(words) {
  wordArray = [];
  console.log("wordArray", words);
  Object.keys(words).forEach(function(key) {
    wordArray.push(words[key]);
  });
  console.log("wordArray", wordArray);
}


// plays each word
function play_each_word() {
  totalWords = wordArray.length;
  i = 0;
  var int = setInterval(function() {
    if (i == totalWords) {
      if (playerAvailableToPlay) {
        clearInterval(int);
        finalHint = $("#inputText").val();
        $("#textHint").html(finalHint);
        document.querySelector("#textSubmit").disabled = false;
      } else {
        display_err_message();
        document.querySelector("#textSubmit").disabled = false;
      }
    } else if (playerAvailableToPlay) {
      playerAvailableToPlay = false;
      startPlayer("SignFiles/" + wordArray[i] + ".sigml");
      console.log("CURRENTLY PLAYING", wordArray[i]);
      document.querySelector("#textSubmit").disabled = true;
      i++;
    } else {
      let errtext = $(".statusExtra").val();
      display_err_message();
      if (errtext.indexOf("invalid") != -1) {
        playerAvailableToPlay = true;
        document.querySelector("#textSubmit").disabled = false;
      }
    }
  }, 1000);
};


// sets the avatarLoaded to true 
var loadingTout = setInterval(function() {
  if (tuavatarLoaded) {
    // $("#loading").hide();
    clearInterval(loadingTout);
    console.log("Avatar loaded successfully !");
  }
}, 1500);