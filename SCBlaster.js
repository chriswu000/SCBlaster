function display_error(err) {
  $("#error").fadeOut(250,function() {
    $("#error").html("ERROR: " + err);
    $("#error").fadeIn(250);
  });
}

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
    arr[i] = arr[i].replace(/^\s*[(<\s]*[abcdeABCDE]\s*[.)>]+\s*/,"");
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
  arr = strip_lettering(arr);

  // check that choice A is found within the prompt
  if (!arr[0].match(arr[1])) {
    throw "Answer choice A could not be found within the prompt";
  }

  return arr;
}

function initialize_prompt(strPrompt, strA) {
  // split the prompt into 3 sections
  var index = strPrompt.indexOf(strA);
  // throw an exception if the substring matches twice!
  if (strPrompt.indexOf(strA,index+1) != -1) {
    index = strPrompt.indexOf("--");
    if (index != -1) {
      strPrompt = strPrompt.replace("--","");
    } else {
      throw "Choice A was found twice in the prompt.  Please mark the beginning of the correct location in the prompt with 2 dashes -- ";
    }
  }
  var strPrompt_1 = strPrompt.substring(0,index);
  var strPrompt_2 = strPrompt.substring(index,index + strA.length);
  var strPrompt_3 = strPrompt.substring(index + strA.length);

  // surround each piece with <span> and appendTo prompt
  $('<span>').append(strPrompt_1).appendTo($("#prompt"));
  $('<span>').attr("id","prompt_underline").addClass('underline').append(strPrompt_2).appendTo($("#prompt"));
  $('<span>').append(strPrompt_3).appendTo($("#prompt"));
  
}

function clear_output() {
  $(".answer").html("");
  $("#prompt").html("");
}

$(document).ready(function() {
  $("#question_submit").click(function() {
    try {
      var arr = format_question($("#question_input").val());
      initialize_prompt(arr[0],arr[1]);
      $("#a").html(arr[1]);
      $(".selected_answer").removeClass("selected_answer");
      $("#a").addClass('selected_answer');
      $("#b").html(arr[2]);
      $("#c").html(arr[3]);
      $("#d").html(arr[4]);
      $("#e").html(arr[5]);

      $("#error").html("");
      // hide the question div, show the "new question button"
      $("#input").slideUp(200, function() {
        $("#output").slideDown(200);
    });

    }
    catch(err) {
      display_error(err);
    }
   
  });
});

$(document).ready(function() {
  $("#question_clear").click(function() {
    $("#question_input").val("");
  });
});

$(document).ready(function() {
  $(".answer").hover(function() {
    $(this).addClass("hover_selected");
  }, function() {
    $(this).removeClass("hover_selected");
  });
});

$(document).ready(function() {
  $(".answer").click(function() {
    $(".selected_answer").removeClass("selected_answer");
    $(this).addClass("selected_answer");
    $("#prompt_underline").html($(this).text());
  });
});

$(document).ready(function() {
  $("#new_question").click(function() {
    $("#question_input").val("");
    $("#output").slideUp(200, function() {
      clear_output();
      $("#input").slideDown(200);
    });
  });
});

$(document).ready(function() {
  $("#edit_question").click(function() {
    $("#output").slideUp(200, function() {
      clear_output();
      $("#input").slideDown(200);
    });
  });
});
