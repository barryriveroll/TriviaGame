var intervalId;

var game = {
  canClick: true,
  howToToggle: false,
  gameStart: false,
  correct: 0,
  incorrect: 0,
  maxQuestions: 0,
  questions: [
    {
      questionText:
        "Which of these is NOT a <em>Game of Thrones</em> character?",
      answers: ["Harry Potter", "Robert Baratheon", "Eddard Stark", "Jon Snow"],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/26BRzozg4TCBXv6QU/giphy.webp"
    },
    {
      questionText: "Who is the creator of <em>The Simpsons</em>?",
      answers: [
        "Matt Groening",
        "Seth McFarlane",
        "Bart Skampson",
        "Mike Judge"
      ],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/4GIcsQJorDZOU/giphy.webp"
    },
    {
      questionText: "What year did <em>Friends</em> premiere?",
      answers: ["1994", "2000", "1990", "1995"],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/xThuWp2hJABbmc20Ew/giphy.webp"
    },
    {
      questionText:
        "What sitcom follows the life of Liz Lemon, a writer for a fictional sketch-comedy <em>The Girlie Show</em>?",
      answers: [
        "30 Rock",
        "Two Broke Girls",
        "Sister-Sister",
        "Just Shoot Me!"
      ],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/vGsPkpzkQYrTy/giphy.webp"
    },
    {
      questionText:
        "What was the first animated series made for prime-time network television?",
      answers: [
        "<em>The Flintstones</em>",
        "<em>Scooby-Doo</em>",
        "<em>Felix The Cat</em>",
        "<em>The Simpsons</em>"
      ],
      values: ["0", "1", "2", "3"],
      gif: "https://i.imgur.com/NH3EL6n.gif"
    },
    {
      questionText:
        "What illicit activity did Walter White resort to in <em>Breaking Bad</em> in order to pay for his cancer treatment?",
      answers: [
        "Selling meth",
        "Bank robberies",
        "Insurance fraud",
        "Car theft"
      ],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/l0HU8V1CHKTUFtuFO/giphy.webp"
    },
    {
      questionText:
        "<em>The Office (US)</em> follows the antics of a business that sells what product?",
      answers: ["Paper", "Cars", "Insurance", "Cell phones"],
      values: ["0", "1", "2", "3"],
      gif: "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.webp"
    }
  ],
  questionsDuplicate: [],
  questionTimeMax: 30,
  questionTimeCurrent: 0,
  answerGif: "",
  divSize: 280,
  buttonResize: 88,
  answerDivs: [
    $("#answers-0"),
    $("#answers-1"),
    $("#answers-2"),
    $("#answers-3")
  ],
  correctDiv: $(""),
  // iconDivs: [$("#icon-0"), $("#icon-1"), $("#icon-2"), $("#icon-3")],

  resetDivs: function() {
    $("#timer").removeClass("alert-warning alert-danger");
    $(".answer-div")
      .removeClass("bg-secondary")
      .removeClass("answer-chosen-div")
      .removeClass("bg-success")
      .removeClass("bg-danger")
      .addClass("bg-dark");
  },

  cloneArrays: function() {
    game.questions = JSON.parse(JSON.stringify(game.questionsDuplicate));

    for (var i = 0; i < game.questions.length; i++) {
      game.questions[i] = JSON.parse(
        JSON.stringify(game.questionsDuplicate[i])
      );
    }
  },

  newQuestion: function() {
    var questionIndex = Math.floor(Math.random() * this.questions.length);
    this.resetDivs();
    $("#question").html(this.questions[questionIndex].questionText);
    for (var i = 0; i < 4; i++) {
      var answerDiv = Math.floor(
        Math.random() * this.questions[questionIndex].answers.length
      );
      this.answerDivs[i].html(this.questions[questionIndex].answers[answerDiv]);
      this.answerDivs[i].attr(
        "data-value",
        this.questions[questionIndex].values[answerDiv]
      );
      if (answerDiv === 0) {
        this.correctDiv = this.answerDivs[i];
      }
      this.questions[questionIndex].answers.splice(answerDiv, 1);
      this.questions[questionIndex].values.splice(answerDiv, 1);
    }
    this.answerGif = this.questions[questionIndex].gif;
    this.questions.splice(questionIndex, 1);
    this.beginTimer();
  },

  beginTimer: function() {
    clearInterval(intervalId);
    game.questionTimeCurrent = game.questionTimeMax;
    $("#timer-div").text(game.questionTimeCurrent);
    intervalId = setInterval(game.countDown, 1000);
  },

  countDown: function() {
    game.questionTimeCurrent--;
    $("#timer-div").text(game.questionTimeCurrent);

    if (game.questionTimeCurrent <= 0) {
      game.endQuestion(4, $(this.correctDiv));
    } else if (game.questionTimeCurrent === 15) {
      $("#timer").addClass("alert-warning");
    } else if (game.questionTimeCurrent === 5) {
      $("#timer").addClass("alert-danger");
    }
  },

  endQuestion: function(userGuess, answerDiv) {
    this.canClick = false;
    clearInterval(intervalId);
    $(".answer-icon").remove();

    answerDiv.removeClass("bg-secondary");
    if (userGuess === "0") {
      answerDiv.addClass("bg-success");
      answerDiv.append('<i class="answer-icon fas fa-check-circle"></i>');
      this.correct++;
    } else {
      answerDiv.addClass("bg-danger");
      answerDiv.append('<i class="answer-icon fas fa-times-circle"></i>');
      this.incorrect++;
    }
    var imageDiv = this.displayCorrectAnswer(userGuess);

    setTimeout(function() {
      if (game.questions.length === 0) {
        game.endGame();
      } else {
        game.newQuestion();
        game.canClick = true;
      }
      $(".progress-bar").css(
        "width",
        ((game.correct + game.incorrect) / game.maxQuestions) * 100 + "%"
      );
      imageDiv.empty().remove();
    }, 3000);
  },

  displayCorrectAnswer: function(userGuess) {
    var correctDiv = $("[data-value=0]");
    if (userGuess != 0) {
      correctDiv.removeClass("bg-dark").addClass("bg-success");
      correctDiv.append('<i class="answer-icon fas fa-check-circle"></i>');
    }
    var imageDiv = $("<div>");
    correctDiv.after(imageDiv);
    imageDiv
      .css("overflow", "hidden")
      .css("height", "0px")
      .append("<img src=" + game.answerGif + ">")
      .animate({ height: "200px" }, "fast");
    return imageDiv;
  },

  newGame: function() {
    if (this.howToToggle) {
      this.toggleHowTo();
    }
    this.cloneArrays();
    this.resetDivs();
    this.canClick = true;
    this.correct = 0;
    this.incorrect = 0;
    game.newQuestion();
    $("#trivia-div").show();
    $("#trivia-content")
      .children()
      .show();
    $("#score-div").hide();
    $("#landing-div").animate({ height: "0px" }, "fast");
    $("#trivia-div").animate({ height: "600px" }, "fast");
    $(".progress-bar").css(
      "width",
      ((this.correct + this.incorrect) / this.maxQuestions) * 100 + "%"
    );
  },

  endGame: function() {
    // $("#landing-div").animate({ height: "88px" }, "fast");
    $("#landing-div").css("height", "inherit");
    $("#trivia-div").animate({ height: "400px" }, "fast");
    $("#correct-score-div").text(this.correct);
    $("#incorrect-score-div").text(this.incorrect);
    $("#trivia-content")
      .children()
      .hide();
    $("#score-div").css("display", "block");
    $("#score-div").show();
  },

  toggleHowTo: function() {
    $("#button-bg").animate({ height: "+=" + game.buttonResize + "px" }, 100);
    setTimeout(function() {
      $("#how-to-div").animate({ height: "+=" + game.divSize + "px" }, "fast");
      game.divSize *= -1;
      game.buttonResize *= -1;
      game.howToToggle = !game.howToToggle;
    }, 0);
  }
};

function init() {
  game.maxQuestions = game.questions.length;
  $("#trivia-div").hide();
  // game.questionsDuplicate = $.extend(true, [], game.questions);
  // game.questionsDuplicate = game.questions.slice();
  game.questionsDuplicate = JSON.parse(JSON.stringify(game.questions));

  for (var i = 0; i < game.questions.length; i++) {
    game.questionsDuplicate[i] = JSON.parse(JSON.stringify(game.questions[i]));
    //   game.questionsDuplicate[i].answers = $.extend(
    //     true,
    //     [],
    //     game.questions[i].answers
    //   );
    //   game.questionsDuplicate[i].values = $.extend(
    //     true,
    //     [],
    //     game.questions[i].values
    //   );
  }
}

$(document).ready(function() {
  init();

  $("#start-button").on("click", function() {
    game.newGame();
  });

  $(".answer-div").on("click", function() {
    if (game.canClick) {
      if ($(this).hasClass("answer-chosen-div")) {
        game.endQuestion($(this).attr("data-value"), $(this));
      } else {
        //   game.iconDivs[$(this).index()].addClass("fa-question-circle");
        console.log($(this).index());
        $(".answer-div")
          .removeClass("bg-secondary")
          .removeClass("answer-chosen-div")
          .addClass("bg-dark");
        $(".answer-icon").remove();
        $(this)
          .removeClass("bg-dark")
          .addClass("bg-secondary")
          .addClass("answer-chosen-div")
          .append(
            '<i id="icon-1" class="answer-icon fas fa-question-circle"></i>'
          );
      }
    }
  });

  $(".buttons").on("click", "#button-bg, #how-to-button", game.toggleHowTo);
});
