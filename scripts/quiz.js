var app = {
    content: "",
    counter: 0,
    correct_answer_counter: 0,
    countdown: "",
    seconds: "",
    score_tally: 0,
    length: "",
    result_lowest: "",
    result_medium: "",
    result_top: "",
    current_question_num: ""
};

function getJson(json) {
    var hint_wrap = "";
    app.result_lowest = json.feed.entry[2].gsx$copy.$t,
        app.result_medium = json.feed.entry[3].gsx$copy.$t,
        app.result_top = json.feed.entry[4].gsx$copy.$t;

    $('.intro h1').html(json.feed.entry[0].gsx$copy.$t),
        $('.intro h1 + p').html(intro = json.feed.entry[1].gsx$copy.$t);

    var get_seconds = json.feed.entry[5].gsx$copy.$t;

    app.length = json.feed.entry.length; //3; 
    if (get_seconds != "" || get_seconds != null) {
        app.seconds = get_seconds * app.length; //set seconds
    };
    // console.log(app.seconds)

    for (var i = 0; i < app.length; i++) {
        entry = json.feed.entry[i];
        app.counter++; // add to counter

        $('.quiz-counter ul').append('<li class="dot" data-dot_count="' + app.counter + '"></li>'); // add dots to counter

        var question = entry.gsx$question.$t,
            image = entry.gsx$image.$t,
            hint = entry.gsx$hint.$t,
            a = entry.gsx$a.$t.toString(),
            b = entry.gsx$b.$t.toString(),
            c = entry.gsx$c.$t.toString(),
            d = entry.gsx$d.$t.toString(),
            answer = entry.gsx$answer.$t,
            explain = entry.gsx$explain.$t;

        // FOR IMAGE AS ANSWER
        if (a.indexOf("http://misc.thestar.com.s3.amazonaws.com") >= 0) {
            console.log('there is an image here');
            a = '<div class="img-as-answer-wrap"><img src="' + a + '" class=image-as-answer-wrap></div>';
            console.log(a);
        }

        if (b.indexOf("http://misc.thestar.com.s3.amazonaws.com") >= 0) {
            b = '<div class="img-as-answer-wrap"><img src="' + b + '" class=image-as-answer-wrap></div>';
        }

        if (c.indexOf("http://misc.thestar.com.s3.amazonaws.com") >= 0) {
            c = '<div class="img-as-answer-wrap"><img src="' + c + '" class=image-as-answer-wrap></div>';
        }

        if (d.indexOf("http://misc.thestar.com.s3.amazonaws.com") >= 0) {
            d = '<div class="img-as-answer-wrap"><img src="' + d + '" class=image-as-answer-wrap></div>';
        }





        var question_wrap = '<section class="question-wrap"><h2 data-answer="' + answer + '"><span class="num">' + app.counter + '. </span>' + question + '</h2>' + '<div class="img-wrap"><img src="' + image + '"></div></section>',
            hint_wrap = '<section class="hint_wrap cf hide-contents">' + '<button>Hint &#187;</button>' + '<p class="show-hint hide-contents hint-text"><span class="num">Hint: </span>' + entry.gsx$hint.$t + ' <span class="num close">Got it.</span></p></section>',
            options_wrap = '<section class="options-wrap"><ul class="cf">' + '<li data-answer="a"><span class="num">A. </span>' + a + '</li>' + '<li data-answer="b"><span class="num">B. </span>' + b + '</li>' + '<li data-answer="c"><span class="num">C. </span>' + c + '</li>' + '<li data-answer="d"><span class="num">D. </span>' + d + '</li>' + '</ul></section>',
            answer_wrap = '<section class="answer-wrap"><h3><span class="num">' + answer + '. </span>' + explain + '</h3></section>';

        // if hint has content, add it to the app.content var DUH!
        if (hint.length !== 0) {
            app.content += '<div class="quiz-wrap" data-question_number="' + app.counter + '">' + question_wrap + options_wrap + hint_wrap + answer_wrap + '</div>';
        } else {
            app.content += '<div class="quiz-wrap" data-question_number="' + app.counter + '">' + question_wrap + options_wrap + answer_wrap + '</div>';
        };
    }
};

app.set_height_options = function() {
    var $options = $('.options-wrap ul li');
    var height = 0;
    $options.each(function() {
        if ($(this).height() > height) {
            height = $(this).height();
        }
    });
    $options.height(height);
}

app.timer = function() {
    $time_text = $('.quiz-timer p');

    app.countdown = window.setInterval(function() {
        $time_text.html('you have ' + app.seconds + ' seconds left!')

        app.seconds = app.seconds - 1; // or seconds--;
        if (app.seconds < 10) {
            $time_text.css('background', 'yellow');
        }
        if (app.seconds < 5) {
            $time_text.css('background', 'orange');
        }
        if (app.seconds < 0) {
            $time_text.css('background', 'red');
            window.clearInterval(app.countdown);
            app.unbind_everything(); // don't let users keep playing
        }
    }, 1000);
}; //ends timer

app.unbind_everything = function() {
    $('.options-wrap ul li').unbind().addClass('unbound');
    $('.hint_wrap button').unbind().addClass('unbound');
};

app.calculate_score_range = function() {

    var range = Math.round(app.correct_answer_counter / app.length * 100);

    $score = $('.quiz-score h2');

    if (range <= 33) {
        $score.html("<strong>You scored " + app.score_tally + " points!</strong> " + app.result_lowest);
    } else if (range <= 66) {
        $score.html("You scored " + app.score_tally + " points! " + app.result_medium);
    } else if (range >= 66) {
        $score.html("You scored " + app.score_tally + " points! " + app.result_top);
    };
};

app.show_quiz_score = function() {
    app.calculate_score_range();

    $('.quiz-score').slideDown();

    // this is not working
    $('.facebook').attr('href', 'https://www.facebook.com/torontostar/?fref=ts');
    $('.twitter').attr('href', 'http://twitter.com/share?url=http://on.thestar.com/quizzes;hashtags=;text=I scored ' + app.score_tally + ' . Can you beat my score? →');
}

app.fixed_timer_counter = function() {
    app.fixed_timer_counter.called = true
    $('.quiz-fixed').show();
    // $('.quiz-counter').show();
    // $('.quiz-timer').show();
    $('header.intro h1').css('margin-top', '50px');
}

app.show_hint_options = function() {
    $('.hint_wrap').show();
}

app.negative_score = function() {
    app.score_tally -= 0.5;
    console.log(app.score_tally)
}

/* COUNTER ----------------------------------------------------------------------------------------------------*/
app.show_counter = function() {
    $('.quiz-counter ul li:nth-of-type(' + app.current_question_num + ')').addClass('counter-completed');
}

var $quiz_box = $('.quiz-content');
app.init = function() {
    $quiz_box.append(app.content);

    // app.set_height_options();

    $(window).scroll(function() {
        app.fixed_timer_counter();
    });

    app.show_hint_options();
    app.timer();

    // if user needs hint
    var $hint_bttn = $('.hint_wrap button');
    $hint_bttn.click(function() {
        console.log('$hint_bttn clicked')
        $(this).fadeOut();
        $(this).next().slideDown();
    });
    $('.close').click(function(){
        $(this).parent().slideUp();
    });


    // taking the quiz score_tally
    var $answer = $('.answer-wrap');
    var $quiz_question = $('.quiz-content li');

    $quiz_question.click(function() {
        /* ON CLICK ----------------*/
        /*        $(this).parent().parent().next().hide(); //hide hint
        $(this).parent().children().unbind(); // kills click function
        $(this).parents().children($answer).slideDown();*/

        $(this).parent().parent().next('.hint_wrap').hide(); //hide hint
        $(this).parent().children().unbind(); // kills click function
        $(this).parents().children('.answer-wrap').slideDown(); // shows answer

        app.current_question_num = $(this).parent().parent().parent().attr('data-question_number');
        app.show_counter();

        var $option_clicked = $(this).attr('data-answer'),
            $question_answer = $(this).parent().parent().prev().children('h2').attr('data-answer');

        /* CHECKS ANSWERS ------------------------------------------------------------------------------------------------------*/
        if ($option_clicked === $question_answer) { //if correct answer is chosen
            app.score_tally += 1;
            app.correct_answer_counter += 1;
            $(this).addClass('correct').prepend('<span class="check-mark"> &#10003; </span>'), $(this).siblings().addClass('incorrect'); // shows correct answer + adds mark

        } else if ($option_clicked !== $question_answer) { //if incorrect answer is chosen
            app.negative_score();

            // console.log(app.score_tally)
            $(this).addClass('incorrect-selected').prepend('<span class="x-mark"> &#10007; </span>'); // shows which was clicked, adds mark

            $(this).parent().children().each(function() {
                if ($(this).attr('data-answer') == $question_answer) {
                    $(this).addClass('correct'), $(this).siblings().addClass('incorrect')
                }
            });
        };
        // var quizNum = ;

        if ($(this).parent().parent().parent().attr('data-question_number') == app.length) {
            app.show_quiz_score();
            window.clearInterval(app.countdown);
        };
    }); // ends click function on quiz-content li
};

$(function() {
    app.init();
});
