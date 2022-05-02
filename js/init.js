$(document).ready(function(){
    // Load esri js api key and launch map
    let run = true;
    if (run) {
    $.ajax({
        url: 'js/apiKey.json',
        success: function(r) {
            let key = r.key;
            start_map(key);
        },
      });
    };
});