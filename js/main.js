function initMap() {
    var londonish = {lat: 51.5, lng: 0.12};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: londonish
    });

    var query = "\
{\
    Venue(first:30) {\
        latitude\
        longitude\
        events(first:30,status:\"upcoming\") {\
            title\
            link\
            past\
            status\
            time\
        }\
    }\
}";
    $.post({
        "accepts": {
            json: "application/json"
        },
        "contentType": "application/json",
        "url": 'https://graphql.communitygraph.org/graphql/',
        "processData": false,
        "data": JSON.stringify({"query": query}),
        "timeout": 3000,
        "success": function(data, textStatus, jqXHR) {
            data.data.Venue.forEach(function (venue) {
                if (venue.events.length > 0 && venue.latitude && venue.longitude) {
                    var content = '';

                    venue.events.forEach(function (event) {
                        content += "<h2>" + event.title + "</h2>";
                        if (event.time) {
                            content += "<p>Event date: " + (new Date(event.time)).toUTCString();
                            // todo: a link to add the event to Google Calendar
                        }
                        if (event.link) {
                            content += "<p><a href='" + event.link + "'>Find out more...</a>";
                        }
                    });

                    var infowindow = new google.maps.InfoWindow({
                        content: content
                    });

                    var marker = new google.maps.Marker({
                        position: {lat: venue.latitude, lng: venue.longitude},
                        icon: {
                            url: 'img/GraphQL_Logo.svg',
                            scaledSize: new google.maps.Size(50, 50),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 20)
                        },
                        map: map
                    });

                    marker.addListener('click', function () {
                        infowindow.open(map, marker);
                    });
                }
            });
        },
        "error": function() {
            alert('\'scuse me, query request failed. Anyway, would you consider visiting London?');

            var marker = new google.maps.Marker({
                position: londonish,
                icon: {
                    url: 'img/GraphQL_Logo.svg',
                    size: new google.maps.Size(512,512),
                    scaledSize: new google.maps.Size(50,50),
                    anchor: new google.maps.Point(25,25)
                },
                map: map
            });
        }
    });
}
