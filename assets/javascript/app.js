var intervalId;

var game = {
  canClick: true,
  correct: 0,
  incorrect: 0,
  questions: [
    {
      questionText: "Which of these is NOT a Game of Thrones character?",
      answers: ["Harry Potter", "Robert Baratheon", "Eddard Stark", "Jon Snow"],
      values: ["0", "1", "2", "3"]
    },
    {
      questionText: "Who is the creator of The Simpsons?",
      answers: [
        "Matt Groening",
        "Seth McFarlane",
        "Bart Skampson",
        "Mike Judge"
      ],
      values: ["0", "1", "2", "3"]
    },
    {
      questionText: "What year did Friends premiere?",
      answers: ["1994", "2000", "1990", "1995"],
      values: ["0", "1", "2", "3"]
    }
  ],
  dataValues: [0, 1, 2, 3],
  questionTimeMax: 30,
  questionTimeCurrent: 0,
  answerDivs: [
    $("#answers-0"),
    $("#answers-1"),
    $("#answers-2"),
    $("#answers-3")
  ],
  iconDivs: [$("#icon-0"), $("#icon-1"), $("#icon-2"), $("#icon-3")],

  newQuestion: function() {
    var questionIndex = Math.floor(Math.random() * this.questions.length);
    $(".answer-div")
      .removeClass("bg-secondary")
      .removeClass("answer-chosen-div")
      .removeClass("bg-success")
      .removeClass("bg-danger")
      .addClass("bg-dark");
    $("#question").text(this.questions[questionIndex].questionText);
    for (var i = 0; i < 4; i++) {
      var answerDiv = Math.floor(
        Math.random() * this.questions[questionIndex].answers.length
      );
      this.answerDivs[i].text(this.questions[questionIndex].answers[answerDiv]);
      this.answerDivs[i].attr(
        "data-value",
        this.questions[questionIndex].values[answerDiv]
      );
      this.questions[questionIndex].answers.splice(answerDiv, 1);
      this.questions[questionIndex].values.splice(answerDiv, 1);
    }

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
      clearInterval(intervalId);
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

    setTimeout(function() {
      if (game.questions.length === 0) {
        game.endGame();
      } else {
        game.newQuestion();
        game.canClick = true;
      }
    }, 1000);
  },

  endGame: function() {
    $("#correct-score-div").text(this.correct);
    $("#incorrect-score-div").text(this.incorrect);
    $("#score-div").css("display", "block");
  }
};

$(document).ready(function() {
  game.newQuestion();
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
});
