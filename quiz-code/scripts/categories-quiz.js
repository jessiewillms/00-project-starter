var app = {
    content: "",
    counter: 0,
    correct_answer_counter: 0,
    countdown: "",
    seconds: "",
    seconds_cat2: "",
    score_tally: 0,
    length: "",
    result_lowest: "",
    result_medium: "",
    result_top: "",
    category: "",
    category_arry: []
};

function getJson(json) {
    app.result_lowest = json.feed.entry[2].gsx$copy.$t,
        app.result_medium = json.feed.entry[3].gsx$copy.$t,
        app.result_top = json.feed.entry[4].gsx$copy.$t;

    $('.intro h1').html(json.feed.entry[0].gsx$copy.$t),
        $('.intro h1 + p').html(intro = json.feed.entry[1].gsx$copy.$t);

    app.length = 3; //json.feed.entry.length;
    //set seconds
    app.seconds = json.feed.entry[5].gsx$copy.$t * app.length;
    app.seconds_cat2 = json.feed.entry[6].gsx$copy.$t * app.length;

    for (var i = 0; i < json.feed.entry.length; i++) {
        entry = json.feed.entry[i];
        app.counter++; // add to counter

        $('.quiz-counter ul').append('<li class="dot" data-dot_count="' + app.counter + '"></li>'); // add dots to counter

        var question = entry.gsx$question.$t,
            image = entry.gsx$image.$t,
            a = entry.gsx$a.$t,
            b = entry.gsx$b.$t,
            c = entry.gsx$c.$t,
            d = entry.gsx$d.$t,
            answer = entry.gsx$answer.$t,
            explain = entry.gsx$explain.$t,
            hint = entry.gsx$hint.$t,
            category = entry.gsx$category.$t;

            // create and populate array for categories
            app.category_arry.push(entry.gsx$category.$t);

        var question_wrap = '<section class="question-wrap"><h2 data-answer="' + answer + '"><span class="num">' + app.counter + '. </span>' + question + '</h2>' + '<div class="img-wrap"><img src="' + image + '"></div></section>',
            options_wrap = '<section class="options-wrap"><ul>' + '<li data-answer="a">' + a + '</li>' + '<li data-answer="b">' + b + '</li>' + '<li data-answer="c">' + c + '</li>' + '<li data-answer="d">' + d + '</li>' + '</ul></section>',
            hint_wrap = '<section class="hint_wrap">' + '<p>Hint</p>' + '<div class="show-hint"><p>' + hint + '</p></div></section>',
            answer_wrap = '<section class="answer-wrap"><h3><span class="num">' + answer + '. </span>' + explain + '</h3></section>';

        app.content += '<div class="quiz-wrap" data-question_number="' + app.counter + '" data-category="' + category + '">' + question_wrap + options_wrap + hint_wrap + answer_wrap + '</div>';
    }
};


app.filter_content_categories = function() {

    var sorted = app.category_arry.sort();
    quiz_category_one = sorted[0];
    quiz_category_two = sorted.pop();

    $('.quiz_by_category li:nth-child(1)').attr('data-category', quiz_category_one), $('.quiz_by_category li:nth-child(2)').attr('data-category', quiz_category_two);

    $('.quiz_by_category li:nth-child(1)').attr('data-category', quiz_category_one).click(function(){
        $(this).unbind();
        app.fixed_timer_counter(); //shows counter/timer
        window.clearInterval(app.countdown);
        app.timer();
        $('.quiz-wrap[data-category="'+quiz_category_one+'"]').hide();
        $('.quiz-wrap[data-category="'+quiz_category_two+'"]').show();
    })

    $('.quiz_by_category li:nth-child(2)').attr('data-category', quiz_category_two).click(function(){
        $(this).unbind();
        app.fixed_timer_counter(); //shows counter/timer
        window.clearInterval(app.countdown);
        app.timer_second_timer();
        $('.quiz-wrap[data-category="'+quiz_category_two+'"]').hide();
        $('.quiz-wrap[data-category="'+quiz_category_one+'"]').show();
    });
}

app.timer = function() {
    app.timer.called = true; // so it will only be called once
    console.log('aHHHHHHHH WORKKKKKKK NOW')
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

app.timer_second_timer = function() {
    app.timer_second_timer.called = true; // so it will only be called once

    $time_text = $('.quiz-timer p');

    app.countdown = window.setInterval(function() {
        $time_text.html('you have ' + app.seconds_cat2 + ' seconds left!')

        app.seconds_cat2 = app.seconds_cat2 - 1; // or seconds--;
        if (app.seconds_cat2 < 10) {
            $time_text.css('background', 'yellow');
        }
        if (app.seconds_cat2 < 5) {
            $time_text.css('background', 'orange');
        }
        if (app.seconds_cat2 < 0) {
            $time_text.css('background', 'red');
            window.clearInterval(app.countdown);
            app.unbind_everything(); // don't let users keep playing
        }
    }, 1000);

}; //ends timer

app.unbind_everything = function() {
    $('.options-wrap ul li').unbind().addClass('unbound');
    $('.hint_wrap p').unbind().addClass('unbound');
};

app.calculate_score_range = function() {

    var range = Math.round(app.correct_answer_counter / app.length * 100);

    $score = $('.quiz-score p');

    if (range <= 33) {
        $score.html("You scored " + app.score_tally + " points! " + app.result_lowest);
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
    $('header.intro h1').css('margin-top','50px');
}
app.show_hint_options = function() {
    $('.hint_wrap').show();
}
app.init = function() {
    $('.quiz-wrap').css('display','none')
    $(window).scroll(function(){
        app.fixed_timer_counter();
    });

    $('.quiz-content').append(app.content);

    app.filter_content_categories();
    // app.show_hint_options();

    // if user needs hint
    $('.hint_wrap p').click(function() {
        $(this).next().slideToggle();
    });

    // taking the quiz score_tally
    var $answer = $('.answer-wrap');
    var $quiz_question = $('.quiz-content li');

    $quiz_question.click(function() {
        /* ON CLICK -hide hint, kills click function, shows answer/explainer-------------------------------------------------*/
        $(this).parent().parent().next('.hint_wrap').hide();
        $(this).parent().children().unbind()
        $(this).parent().parent().next().next($answer).slideDown();

        /* COUNTER ----------------------------------------------------------------------------------------------------*/
        var current_question_num = $(this).parent().parent().parent().attr('data-question_number');
        $('.quiz-counter ul li:nth-child(' + current_question_num + ')').addClass('counter-completed');
        if ($('.quiz-counter ul li').hasClass == 'counter-completed') {
            $(this).next().addClass('counter-completed')
        };

        var $option_clicked = $(this).attr('data-answer'),
            $question_answer = $(this).parent().parent().prev().children('h2').attr('data-answer');

        /* CHECKS ANSWERS ------------------------------------------------------------------------------------------------------*/
        if ($option_clicked === $question_answer) { //if correct answer is chosen
            app.score_tally += 1;
            app.correct_answer_counter += 1;
            console.log(app.correct_answer_counter)

            $(this).addClass('correct').prepend('<span class="check-mark">  &#10003; </span>'), $(this).siblings().addClass('incorrect'); // shows correct answer + adds mark

        } else if ($option_clicked !== $question_answer) { //if incorrect answer is chosen
            app.score_tally -= 0.5;
            console.log(app.score_tally)
            $(this).addClass('incorrect-selected').prepend('<span class="x-mark">  &#10007; </span>'); // shows which was clicked, adds mark

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
