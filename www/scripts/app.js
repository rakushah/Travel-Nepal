'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('MyIonicProject', ['ionic', 'config', 'MyIonicProject.controllers','ionicLazyLoad'])

.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }
 
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
.state('app.homePage', {
      url: '/homePage',
      views: {
        'menuContent' :{
          templateUrl: 'templates/homePage.html',
          controller: 'PlaylistCtrl'
        }
      }
    })
    
    .state('app.travelNews', {
      url: '/travelNews',
      views: {
        'menuContent' :{
          templateUrl: 'menu_elements/travelNews.html',
          controller: 'newsCtrl'
        }
      }
    })
    .state('app.magazine', {
      url: '/magazine',
      views: {
        'menuContent' :{
          templateUrl: 'menu_elements/magazine.html',
          controller: 'magazineCtrl'
        }
      }
    })
    .state('app.faqs', {
      url: '/faqs',
      views: {
        'menuContent' :{
          templateUrl: 'menu_elements/faqs.html',
          controller: 'faqsCtrl'
        }
      }
    })
    .state('app.upcommingFestivals', {
      url: '/upcommingFestivals',
      views: {
        'menuContent' :{
          templateUrl: 'menu_elements/upcommingFestivals.html',
          controller: 'festivalCtrl'
        }
      }
    })
    .state('app.travelNewsDetails', {
      url: '/newsDetails/:newsID',
      views: {
        'menuContent' :{
          templateUrl: 'menu_elements/newsDetails.html',
          controller: 'newsDetailsCtrl'
        }
      }
    })
 

   .state('app.bookCar', {
      url: '/bookCar',
      views: {
        'menuContent' :{
          templateUrl: 'templates/carBooking.html',
            controller:'CarCtrlName'
        }
      }

    })
  
  
    .state('app.bookGuide', {
      url: '/homepage',
      views: {
        'menuContent' :{
          templateUrl: 'templates/guideBooking.html',
            controller:'GuideCtrl'
        }
      }

    })
   
    .state('app.reserveCar', {
      url: '/bookCar',
      views: {
        'menuContent' :{
          templateUrl: 'templates/reserveCar.html',
            controller:'CarReservation'
        }
      }
    })
    

  .state('app.single', {
      url: '/homePage/:clickedflightDetails',
      views: {
        'menuContent' :{
          templateUrl: 'templates/flightBookingDetails.html',
          controller: 'flightDetailsCtrl'
        }
      }
    })
  .state('app.openFlightBooking', {
      url: 'homepage_flight',
      views: {
        'menuContent' :{
          templateUrl: 'templates/flightBooking.html',
            controller:'flightCtrl'
        }
      }

    })
   
.state('app.login',{
      url: '/guidelogin',
      views: {
        'menuContent' :{
          templateUrl: 'templates/login.html',
            controller:'AppCtrl'
        }
      }

    })
.state('app.guidePage',{
      url: '/guidelogin',
      views: {
        'menuContent' :{
          templateUrl: 'templates/guideProfile.html',
            controller:'guidePageCtrl'
        }
      }

    })
.state('app.googleMap', {
      url: '/googleMap/:location',
      views: {
        'menuContent' :{
          templateUrl: 'templates/google_map_view.html',
          controller: ''
        }
      }
    })
  
  
    /*.state('app.single', {
      url: '/homePage/:clickedItemId',
      views: {
        'menuContent' :{
          templateUrl: 'ThirdPage/to_do_details.html',
          controller: 'PlaylistCtrl'
        }
      }
    })*/
.state('app.openCarBooking', {
      url: '/homePage_car',
      views: {
        'menuContent' :{
          templateUrl: 'templates/local_transport.html',
            controller:'CarCtrl'
        }
      }

    })
.state('app.openGuideBooking', {
      url: '/homePage_guide',
      views: {
        'menuContent' :{
          templateUrl: 'templates/guideList.html',
            controller:'GuideCtrl'
        }
      }

    })
    .state('app.toDo',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/to_do_details.html',
         controller: 'PlaylistCtrl'
        }
    }
    })
    .state('app.toSee',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/to_see_details123.html',
         controller: 'PlaylistCtrl'
        }
    }
    })
    .state('app.discounts',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/discounts_details.html',
         controller: 'PlaylistCtrl'
        }
    }
    })
    .state('app.common',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/common_detail_page.html',
         controller: 'getCatagoryDetails'
        }
    }
    })
    .state('app.showLocationList',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/locationList.html',
         controller: 'ListTaskCtrl'
        }
    }
    })
    .state('app.reserve',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/reservation_page.html',
         controller: 'reserveActivity'
        }
    }
    })
    .state('app.reloadSecondPage',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/reloaded_secondPage.html',
         controller: 'PlaylistCtrl'
        }
    }
    })

    .state('app.discountSecond',{
      url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/discountSecondpage.html',
         controller: 'PlaylistCtrl'
        }
    }
    })
    .state('app.LoadPage', {
    url: '/homePage',
    views:{
      'menuContent' :{
          templateUrl: 'templates/secondPage.html',
          controller: 'PlaylistCtrl'
        }
    }
    
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/homePage');
});

