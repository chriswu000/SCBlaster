
function strip_spacing(str) {
  //trim out any strange new lines
  str = str.replace("\r","\n");
  var arr = str.split("\n");

  //remove any blank array values
  var i;
  for (i=0; i < arr.length; i++) {
    if (!arr[i].match(/\S/g)) {
      arr.splice(i,1);
      i--;
    }
  }
  return arr;
}

// Strip any identifying lettering.  Does not need to be correct lettering
function strip_lettering(arr) {
  var i;
  for (i=1; i<6; i++) {
    arr[i] = arr[i].replace(/^[(<)]*[abcdeABCDE][.)>]\s*/,"");
  }
  return arr;
}

function format_question(question) {
  var arr = strip_spacing(question);

  // Check number of lines
  if (arr.length != 6) {
    throw "Incorrect number of lines in this question.  Expecting 6, got " + arr.length.toString();
  }

  // strip A-E of preceding lettering 
  return strip_lettering(arr);
}

function set_error(err) {
  $(document).ready(function() {
    $("#error".html(err));
  });
}

$(document).ready(function() {
  $("#question_submit").click(function() {
    try {
      var arr = format_question($("#question_input").val());
      $("#prompt").html(arr[0]);
      $("#a").html(arr[1]);
      $("#b").html(arr[2]);
      $("#c").html(arr[3]);
      $("#d").html(arr[4]);
      $("#e").html(arr[5]);

      // hide the question div, show the "new question button"
      $("#input").slideUp(500, function() {
        $("#output").slideDown(500);
      });
    }
    catch(err) {
      alert(err);
    }
  });
});

