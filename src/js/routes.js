import Framework7 from "framework7";
import $$ from 'dom7';
import HomePage from '../pages/home.f7.html';
import Weather from '../pages/weather.f7.html';
import Currency from '../pages/currency.f7.html';

var routes = [
  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // We got user data from request
      var user = {
        "coord": {
          "lon": 0,
          "lat": 0
        },
        "sys": {
          "country": '',
          "sunrise": 0,
          "sunset": 0
        },
        "weather": [
          {
            "id": 0,
            "main": '',
            "description": '',
            "icon": ''
          }
        ],
        "main": {
          "temp": 0,
          "humidity": 0,
          "pressure": 0,
          "temp_min": 0.0,
          "temp_max": 0.0
        },
        "wind": {
          "speed": 0.0,
          "deg": 0.0
        },
        "rain": {
          "3h": 0
        },
        "clouds": {
          "all": 0
        },
        "dt": 0,
        "id": 0,
        "name": '',
        "cod": 0
      };
      console.log('Fetching location...');

      navigator.geolocation.getCurrentPosition
        (function (position) {
          var OpenWeatherAppKey = "fe95e4c3ec705baa8cbbb6863995d0e3";
          var queryString =
            'https://api.openweathermap.org/data/2.5/weather?lat='
            + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=' + OpenWeatherAppKey + '&units=metric';

          Framework7.request.promise.get(queryString)
            .then(function (data) {
              // Parsing JSON string.
              data = JSON.parse(data);
              // Date time.
              var dt = new Date(0);
              dt.setUTCSeconds(data.dt);
              data.dt = dt.toLocaleString();
              // Sunrise time.
              var dtSunrise = new Date(0);
              dtSunrise.setUTCSeconds(data.sys.sunrise);
              data.sys.sunrise = dtSunrise.toLocaleTimeString();
              // Sunset time.
              var dtSunset = new Date(0);
              dtSunset.setUTCSeconds(data.sys.sunset);
              data.sys.sunset = dtSunset.toLocaleTimeString();

              var db = window.sqlitePlugin.openDatabase({ name: "travelpal.db", location: 'default' });

              var city = data.name;
              var country = data.sys.country;
              db.transaction(function (transaction) {
                
                var selectQuery = 'SELECT 1 FROM Weather WHERE city = ? AND country = ?';

                transaction.executeSql(selectQuery, [city, country],
                  function(tx, results) {
                    if(results.rows.length === 0) {

                      var executeQuery = "INSERT INTO Weather (city, country) VALUES (?,?)";
                      transaction.executeSql(executeQuery, [city, country]
                        , function (tx, result) {
                          transaction.executeSql('SELECT * FROM Weather', [], function (tx, results) {
                            var len = results.rows.length, i;
      
                            for (i = 0; i < len; i++) {
                              $$("#TableData").append("<tr><td class='label-cell'> "+results.rows.item(i).id+". </td><td class='label-cell'> "+results.rows.item(i).city+", </td><td class='numeric-cell'> "+results.rows.item(i).country+" </td></tr><br>");
                            }
                            
                          }, null);
                        });
                    } else {
                      transaction.executeSql('SELECT * FROM Weather', [], function (tx, results) {
                        var len = results.rows.length, i;
  
                        for (i = 0; i < len; i++) {
                          $$("#TableData").append("<tr><td class='label-cell'> "+results.rows.item(i).id+". </td><td class='label-cell'> "+results.rows.item(i).city+", </td><td class='numeric-cell'> "+results.rows.item(i).country+" </td></tr><br>");
                        }
                        
                      }, null);
                    }
                  });
              },
                function (error) {
                  alert('Error occurred');
                });


              // Hide Preloader
              app.preloader.hide();

              // Resolve route to load page
              resolve(
                {
                  component: HomePage,
                },
                {
                  context: {
                    user: data,
                  }
                }
              );
            });
        }, function (positionError) {
          console.log(positionError);
          // Hide Preloader
          app.preloader.hide();
          router.navigate('/');
        }, { timeout: 1000, maximumAge: 3000, enableHighAccuracy: true });
    },
  },
  {
    path: '/currency/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // We got user data from request
      var data = {
        "ip": '',
        "city": '',
        "region": '',
        "region_code": '',
        "country": '',
        "country_name": '',
        "continent_code": '',
        "in_eu": false,
        "postal": '',
        "latitude": 0.0,
        "longitude": 0.0,
        "timezone": '',
        "utc_offset": '',
        "country_calling_code": '',
        "currency": '',
        "languages": '',
        "asn": '',
        "org": ''
      };

      app.request({
        url: 'https://jsonip.com/',
        async: false,
        statusCode: {
          200: function (result) {
            var response = JSON.parse(result.response);
            getIpInfo(response.ip);
          }
        }
      })

      function getIpInfo(ipAddress) {
        app.request({
          url: 'https://ipapi.co/' + ipAddress + '/json',
          async: false,
          statusCode: {
            200: function (result) {
              var response = JSON.parse(result.response);
              console.log(response);
              // Hide Preloader
              app.preloader.hide();
              // Resolve route to load page
              resolve(
                {
                  component: Currency,
                },
                {
                  context: {
                    data: response,
                  }
                }
              );
            }
          }
        })
      }
    }
  },
  {
    path: '/weather/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // We got user data from request
      var user = {
        "coord": {
          "lon": 0,
          "lat": 0
        },
        "sys": {
          "country": '',
          "sunrise": 0,
          "sunset": 0
        },
        "weather": [
          {
            "id": 0,
            "main": '',
            "description": '',
            "icon": ''
          }
        ],
        "main": {
          "temp": 0,
          "humidity": 0,
          "pressure": 0,
          "temp_min": 0.0,
          "temp_max": 0.0
        },
        "wind": {
          "speed": 0.0,
          "deg": 0.0
        },
        "rain": {
          "3h": 0
        },
        "clouds": {
          "all": 0
        },
        "dt": 0,
        "id": 0,
        "name": '',
        "cod": 0
      };
      console.log('Fetching location...');
      GetLocation();

      function GetLocation() {
        navigator.geolocation.getCurrentPosition
          (function (position) {
            var OpenWeatherAppKey = "fe95e4c3ec705baa8cbbb6863995d0e3";
            var queryString =
              'https://api.openweathermap.org/data/2.5/weather?lat='
              + position.coords.latitude + '&lon=' + position.coords.longitude + '&appid=' + OpenWeatherAppKey + '&units=metric';

            Framework7.request.promise.get(queryString)
              .then(function (data) {
                // Parsing JSON string.
                data = JSON.parse(data);
                // Date time.
                var dt = new Date(0);
                dt.setUTCSeconds(data.dt);
                data.dt = dt.toLocaleString();
                // Sunrise time.
                var dtSunrise = new Date(0);
                dtSunrise.setUTCSeconds(data.sys.sunrise);
                data.sys.sunrise = dtSunrise.toLocaleTimeString();
                // Sunset time.
                var dtSunset = new Date(0);
                dtSunset.setUTCSeconds(data.sys.sunset);
                data.sys.sunset = dtSunset.toLocaleTimeString();

                // Hide Preloader
                app.preloader.hide();

                // Resolve route to load page
                resolve(
                  {
                    component: Weather,
                  },
                  {
                    context: {
                      user: data,
                    }
                  }
                );
              });
          }, function (positionError) {
            console.log(positionError);
            app.preloader.hide();
            GetLocation();
          }, { timeout: 1000, maximumAge: 3000, enableHighAccuracy: true });
      }
    }
  }
];

export default routes;