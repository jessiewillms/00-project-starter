var app = {};

app.init = function() {

	function getJsonFromGoogle(json) {

	    var content = "";
	    var currentdate;

	    h1 = json.feed.entry[0].gsx$h1.$t;

	    for (var i = 0; i < json.feed.entry.length; i++) {
	        entry = json.feed.entry[i];

	        var copy = entry.gsx$copy.$t;

	        content += '<div class="wrap">' +  + '</div>';
	    }
	    $('.wrapper').append(content);
	};
};

$(function() {
    app.init();
});
