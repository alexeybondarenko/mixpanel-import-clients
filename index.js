var fs = require('fs');
var mixpanel = require('mixpanel');

// Mixpanel INIT
var mixpanel = Mixpanel.init('6fd9434dba686db2d1ab66b4462a3a67');

function readLines(input, func) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            func(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

var input = fs.createReadStream('numbers.txt');
readLines(input, function (phones) {
    phones.map( function (phone) {

        // mixpanel add event for user
        mixpanel.track("Client Imported");
        // mixpanel user creation
        mixpanel.people.set({
            distinct_id: phone,
            sender_phone: phone
        });
    })
});

// var phone = '+380666666666';
// mixpanel_importer.import("Client Imported", new Date(), {
//     distinct_id: phone,
//     sender_phone: phone
// });