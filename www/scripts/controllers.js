'use strict';

angular.module('MyIonicProject.controllers', ['ui.bootstrap','base64','ngSanitize','ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal,$base64,$timeout,$http,$state,guideDetails) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope  }).then(function(modal) {
    $scope.modal = modal;
   
  });
  
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
     $scope.encoded = $base64.encode($scope.loginData.username+':'+$scope.loginData.password);
       $scope.header='Basic '+$scope.encoded;
      console.log($scope.encoded);
      var req = {
         method: "GET",
         url: "http://192.168.0.110/travel/public/guide-status",
         headers: {'Authorization': $scope.header}
            
        };
      $http(req).success(function(data, status, headers, config){
         //alert(data.message);
         console.log(data);
         data.header=$scope.header;
         guideDetails.setname(data);
         $state.go('app.guidePage');
         
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
           $scope.error = true;
      });
     // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  }
}).controller('RatingCtrl', function ($scope) {
  $scope.rate = 2;
  $scope.max = 5;
  

})
.directive('setNgAnimate', ['$animate', function ($animate) {
    return {
        link: function ($scope, $element, $attrs) {
            $scope.$watch( function() {
                return $scope.$eval($attrs.setNgAnimate, $scope);
            }, function(valnew, valold){
                console.log('Directive animation Enabled: ' + valnew);
                $animate.enabled(!!valnew, $element);
            });
        }
    };
}])
.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
})
.controller('guidePageCtrl', function($scope,guideDetails,$http) {
  $scope.guideDetails=guideDetails.getname().data;
  console.log($scope.guideDetails);
  $scope.status=$scope.guideDetails.status;
  $scope.update=function(changedStatus){
    var guideUpadeUrl="http://192.168.0.110/travel/public/guide-update-status/"+changedStatus;
    console.log(guideUpadeUrl);
    var req = {
         method: "GET",
         url: guideUpadeUrl,
         headers: {'Authorization': guideDetails.getname().header},
            
        };
      $http(req).success(function(data, status, headers, config){
         alert(data.message);
         //console.log(data);
         //guideDetails.setname(data.data);
         //$state.go('app.guidePage');
         
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
      });
 };

})
.controller('googleMap', function($scope,$stateParams,detailsData,GeoCoder) {
   //var map;
   console.log($stateParams.location);
   $scope.address=$stateParams.location;
    GeoCoder.geocode({address: $stateParams.location}).then(function(result) {
    //... do something with result
    
    $scope.lat=result[0].geometry.location.k;
    $scope.lon=result[0].geometry.location.D;
    $scope.position='['+$scope.lat+','+$scope.lon+']';
   // console.log($scope.position);
  }); 
  })
.controller('PlaylistCtrl', function($scope) {
  $scope.playlists = [
    { title: 'PLACES NEAR YOU', id: 1 },
    { title: 'POPULAR ACTIVITIES', id: 2 },
    { title: 'HOTELS NEAR YOU', id: 3 },
    { title: 'PLACES NEAR YOU', id: 4 },
    { title: 'DEALS AND DISCOUNT NEAR YOU', id: 5 },
    { title: 'RESTAURANTS NEAR YOU', id: 6}
  ];
})
.controller('CarCtrl',['$scope','$state','makeHttpRequest','CardetailsData',function($scope,$state,makeHttpRequest,CardetailsData){
    
    function getcarList(){
      makeHttpRequest.getcatList().success(function(response){
          //console.log(response);
          $scope.carDetails=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
     
    }
 getcarList();
  $scope.itemClick=function(item,$index){
           //getCarDetails(item);
           CardetailsData.setname(item);
           console.log('car booking');
           $state.go('app.bookCar');

  };
  }
])
.controller('newsCtrl',['$scope','$state','makeHttpRequest',function($scope,$state,makeHttpRequest){
  
    function getnewsList(){
      makeHttpRequest.getnewsList().success(function(response){
          //console.log(response);
          $scope.newsDetails=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });

    }
      getnewsList();
 }])
.controller('faqsCtrl',['$scope','$state','makeHttpRequest',function($scope,$state,makeHttpRequest){
  $scope.isCollapsed = true;

  /*$('.item').live('click',
                   function(){
                       var thisIs = $(this).index();
                       $('div[id^=]').eq(thisIs).toggle();
                   });*/
    function getfaqsList(){
      makeHttpRequest.getfaqsList().success(function(response){
          console.log(response);
          $scope.faqsList=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
    }
     getfaqsList();
 }])
.controller('magazineCtrl',['$scope','$state','makeHttpRequest',function($scope,$state,makeHttpRequest){
  
   getmagazineList();
    function getmagazineList(){
      makeHttpRequest.getmagazineList().success(function(response){
          //console.log(response);
          $scope.magazineDetails=response.magazine_data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
    }
    $scope.openMagazine=function(){
        var ref=window.open($scope.magazineDetails.magazine_url, '_system', 'location=yes','closebuttoncaption=back');
        ref.addEventListener("backbutton", function (e) {
          //logic here 
          e.preventDefault();
        });
    };

 }
]).filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})
.controller('festivalCtrl',['$scope','$state','makeHttpRequest','CardetailsData',function($scope,$state,makeHttpRequest,CardetailsData){
   getfestivalList();
    function getfestivalList(){
      makeHttpRequest.getallFestivalList().success(function(response){
          //console.log(response);
          $scope.festivalList=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
    }

 }
])
.controller('newsDetailsCtrl',['$scope','makeHttpRequest','$stateParams','$cordovaSocialSharing',function($scope,makeHttpRequest,$stateParams,$cordovaSocialSharing){
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com");
    }
 
    $scope.shareViaTwitter = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
        }, function(error) {
            alert("Cannot share on Twitter");
        });
    }
    function getnewsDetails(){
      makeHttpRequest.getnewsDetails($stateParams.newsID).success(function(response){
          console.log(response);
          $scope.completeNewsDetails=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
    }
getnewsDetails();
 }
])
.controller('GuideCtrl',['$scope','$state','makeHttpRequest','CardetailsData','$http',function($scope,$state,makeHttpRequest,CardetailsData,$http){
   
    function getGuideList(){
      makeHttpRequest.getGuideList().success(function(response){
         // console.log(response);
          $scope.GuideList=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
    }
 getGuideList();
  $scope.itemClick=function(item,$index){
           //getCarDetails(item);
           CardetailsData.setname(item);
             console.log('Guide booking');
           $state.go('app.bookGuide');

  };
  $scope.sendenquiry=function(resrvationDetails){
        var sendingInqueryParams={};
        sendingInqueryParams.guide_id=CardetailsData.getname().id;
        sendingInqueryParams.name=resrvationDetails.name;
        sendingInqueryParams.email=resrvationDetails.email;
        sendingInqueryParams.country=resrvationDetails.country;
        sendingInqueryParams.contact=resrvationDetails.contact;
        sendingInqueryParams.message=resrvationDetails.message;
        
        console.log(sendingInqueryParams);
        var req = {
         method: "POST",
         url: "http://192.168.0.110/travel/public/book-guide",
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         transformRequest: function(sendingInqueryParams) {
            var str = [];
            for(var p in sendingInqueryParams)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(sendingInqueryParams[p]));
            return str.join("&");
            
        },
        data: sendingInqueryParams
         
        };
      $http(req).success(function(data, status, headers, config){
         alert(data.message);
         console.log(data);
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
      });
      };
  }
])
/*.controller('GuideBookingCtrl',['$scope','$state','makeHttpRequest','$stateParams','nameInUrl','$filter','$http',function($scope,$state,makeHttpRequest,$stateParams,nameInUrl,$filter,$http){
       
   
      $scope.sendenquiry=function(selected){
        var sendingInqueryParams={};
        sendingInqueryParams.guide_id=;
        sendingInqueryParams.name=selected.name;
        sendingInqueryParams.email=selected.email;
        sendingInqueryParams.country=selected.country;
        sendingInqueryParams.contact=selected.contact;
        sendingInqueryParams.message=selected.message;
        
        console.log(sendingInqueryParams);
        var req = {
         method: "POST",
         url: "http://192.168.0.110/travel/book-guide",
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         transformRequest: function(sendingInqueryParams) {
            var str = [];
            for(var p in sendingInqueryParams)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(sendingInqueryParams[p]));
            return str.join("&");
            
        },
        data: sendingInqueryParams
         
        };
      $http(req).success(function(data, status, headers, config){
         alert(data.message);
         console.log(data);
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
      });
      };
  }
])*/
.controller('flightCtrl',['$scope','$state','makeHttpRequest','nameInUrl',function($scope,$state,makeHttpRequest,nameInUrl){
   $scope.selectedFlight='domestic';
    //console.log($scope.selectedFlight);
    getFlightList($scope.selectedFlight);
    $scope.getList=function(name){
        
       getFlightList(name);
   
    }
     function getFlightList(name){
      nameInUrl.setname(name);
      makeHttpRequest.getFlightList(name).success(function(response){
          console.log(response);
          $scope.flightLists=response.data;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
   
    }

  
  }
])
.controller('flightDetailsCtrl',['$scope','$state','makeHttpRequest','$stateParams','nameInUrl','$filter','$http',function($scope,$state,makeHttpRequest,$stateParams,nameInUrl,$filter,$http){
       $scope.selectedPlace = {};
      
       getFlightDetails(nameInUrl.getname(),$stateParams.clickedflightDetails);
      function getFlightDetails(flightType,flightId){
         makeHttpRequest.getFlightDetails(flightType,flightId).success(function(response){
         // console.log(response);
          $scope.flightDetails=response.flight_details;
          $scope.flightLocation=response.locations;
      }).error(function(error){
            $scope.status='Unable To load data:'+error.message;
      });
      }
      $scope.sendenquiry=function(selected){
        var sendingInqueryParams={};
        sendingInqueryParams.flight_id=$stateParams.clickedflightDetails;
        sendingInqueryParams.type=nameInUrl.getname();
        sendingInqueryParams.name=selected.name;
        sendingInqueryParams.email=selected.email;
        sendingInqueryParams.country=selected.country;
        sendingInqueryParams.number_people=selected.number_people;
        sendingInqueryParams.arrival_date=$filter('date')(selected.arrival_date,'dd-MMMM-yyyy');
        sendingInqueryParams.depart_date=$filter('date')(selected.depart_date,'dd-MMMM-yyyy');
        sendingInqueryParams.from=$scope.selectedPlace.from.from;
        sendingInqueryParams.to=$scope.selectedPlace.from.to;
        sendingInqueryParams.flight_class=selected.flight_class;
        sendingInqueryParams.package_id=$scope.selectedPlace.from.package_id;
        sendingInqueryParams.one_two_way=selected.type;
        sendingInqueryParams.contact=selected.contact;
        if (selected.pick_me) {
           sendingInqueryParams.pick_me='yes';
        }else{
           sendingInqueryParams.pick_me='no';
        }
        console.log(sendingInqueryParams);
        var req = {
         method: "POST",
         url: "http://192.168.0.110/travel/public/book-flight",
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         transformRequest: function(sendingInqueryParams) {
            var str = [];
            for(var p in sendingInqueryParams)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(sendingInqueryParams[p]));
            return str.join("&");
            
        },
        data: sendingInqueryParams
         
        };
      $http(req).success(function(data, status, headers, config){
         alert(data.message);
         console.log(data);
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
      });
      };
  }
])
.controller('CarReservation',['$scope','$state','makeHttpRequest','CarBookingDetailsService','$http',function($scope,$state,makeHttpRequest,CarBookingDetailsService,$http){
  
    $scope.resrvationDetails=CarBookingDetailsService.getname();
    $scope.reserveCar=function(isValid){
      if (isValid) {
      var reservingCarParams={};
      reservingCarParams.car_id=$scope.resrvationDetails.id;
      reservingCarParams.name=$scope.resrvationDetails.name;
      reservingCarParams.arrival_date=$scope.resrvationDetails.arrival_date;
      reservingCarParams.depart_date=$scope.resrvationDetails.depart_date;
      reservingCarParams.type=$scope.resrvationDetails.type;
      reservingCarParams.package_type=$scope.resrvationDetails.package_type;
       reservingCarParams.package_id=$scope.resrvationDetails.package_id;
      reservingCarParams.travel_time=$scope.resrvationDetails.travel_time;
      reservingCarParams.number_people=$scope.resrvationDetails.number_people;
      reservingCarParams.number_cars=$scope.resrvationDetails.number_car;
      reservingCarParams.email=$scope.resrvationDetails.email;
      reservingCarParams.contact=$scope.resrvationDetails.contact;
      reservingCarParams.message=$scope.resrvationDetails.message;
       reservingCarParams.to=$scope.resrvationDetails.to;
      reservingCarParams.from=$scope.resrvationDetails.from;
      //console.log(reservingCarParams);
       var req = {
         method: "POST",
         url: "http://192.168.0.110/travel/public/car-reserve",
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         transformRequest: function(reservingCarParams) {
            var str = [];
            for(var p in reservingCarParams)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(reservingCarParams[p]));
            return str.join("&");
            
        },
        data: reservingCarParams
         
        };
      $http(req).success(function(data, status, headers, config){
         alert(data.message);
         console.log(data);
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( data);
      });



      }else{
        alert('Enter all fields Correctly');
      }
      
    };
  }
])
.controller('CarCtrlName',function($scope,$state,CardetailsData,makeHttpRequest,$http,$filter,CarBookingDetailsService){
    //$scope.pageNme=;
    var item=CardetailsData.getname();
     $scope.selectedPlace = {};
    
    //console.log($scope.count);
    getCarDetails(item);
    function getCarDetails(item){
          makeHttpRequest.getCarDetails(item.id).success(function(response){
              $scope.carPageDetails=CardetailsData.getname();
              $scope.locations=response.locations;
              //console.log($scope.locations[0].from);
            }).error(function(error){
                  $scope.status='Unable To load data:'+error.message;
          });
      }
       
      $scope.calculatePrice=function(selected){
        //console.log(selected);
         // alert('in CarCtrlName');
        
        var sendingcalParams={};
        sendingcalParams.id=item.id;
        sendingcalParams.from=$scope.selectedPlace.from.from;
        sendingcalParams.to=$scope.selectedPlace.from.to;
        sendingcalParams.arrival_date=$filter('date')(selected.arrival_date,'dd-MMMM-yyyy');
        sendingcalParams.depart_date=$filter('date')(selected.depart_date,'dd-MMMM-yyyy');
        sendingcalParams.type=selected.type;
         console.log(sendingcalParams);
         var req = {
         method: "POST",
         url: "http://192.168.0.110/travel/public/car-cost-calculate",
         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
         transformRequest: function(sendingcalParams) {
            var str = [];
            for(var p in sendingcalParams)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(sendingcalParams[p]));
            return str.join("&");
            
        },
        data: sendingcalParams
         
        };
      $http(req).success(function(data, status, headers, config){
         $scope.calculatedData=data.data;
         //console.log($scope.calculatedData);
      }).error(function(data, status, headers, config){
        $scope.status='Unable To load data:'+data;
         console.log( $scope.status);
      });
        

      };
      $scope.newDestination=function(selected){
          $scope.newDestinationParams={};
          $scope.newDestinationParams.id=item.id;
          $scope.newDestinationParams.car_model=item.car_model;
          $scope.newDestinationParams.arrival_date=$filter('date')(selected.arrival_date,'dd-MMMM-yyyy');
          $scope.newDestinationParams.depart_date=$filter('date')(selected.depart_date,'dd-MMMM-yyyy');
          $scope.newDestinationParams.type=selected.type;
          $scope.newDestinationParams.package_type="other_package";
           $scope.newDestinationParams.package_id=0;
          $scope.newDestinationParams.number_people=selected.count;
          $scope.newDestinationParams.travel_time=selected.time+selected.TimeParam;
          CarBookingDetailsService.setname($scope.newDestinationParams);
          $state.go('app.reserveCar');
      };
      $scope.sendenquiry=function(selected){
          $scope.sendindenquiryParams={};
          $scope.sendindenquiryParams.id=item.id;
          $scope.sendindenquiryParams.car_model=item.car_model;
          $scope.sendindenquiryParams.from=$scope.selectedPlace.from.from;
          $scope.sendindenquiryParams.to=$scope.selectedPlace.from.to;
          $scope.sendindenquiryParams.package_id=$scope.selectedPlace.from.package_id;
          $scope.sendindenquiryParams.arrival_date=$filter('date')(selected.arrival_date,'dd-MMMM-yyyy');
          $scope.sendindenquiryParams.depart_date=$filter('date')(selected.depart_date,'dd-MMMM-yyyy');
          $scope.sendindenquiryParams.type=selected.type;
          $scope.sendindenquiryParams.package_type="our_package";
          $scope.sendindenquiryParams.number_people=selected.count;
          $scope.sendindenquiryParams.travel_time=selected.time+selected.TimeParam;
          console.log($scope.sendindenquiryParams);
          CarBookingDetailsService.setname($scope.sendindenquiryParams);
          $state.go('app.reserveCar');
      };

  }
)
.controller('ListTaskCtrl',['$scope','makeHttpRequest','nameInUrl',function($scope,makeHttpRequest,nameInUrl,$stateParams) {
    $scope.status;
    $scope.tasks;
    $scope.name=nameInUrl.getname();
   function getDiscountsList(){
        makeHttpRequest.getDiscountList().success(function(response){
            //alert(response);
              $scope.response=response;
              $scope.data=response.data;
              //console.log(response);
              $scope.banner=response.banner;
              $scope.location=response.locations;
          })
          .error(function(error){
              $scope.status='Unable To load data:'+error.message;
            });
      }
       function getListofcatagories(){
          makeHttpRequest.getListofcatagories($scope.name).success(function(response){
            //alert(response);
              $scope.response=response;
              $scope.data=response.data;
              console.log(response);
              $scope.banner=response.banner;
              $scope.location=response.locations;
          })
          .error(function(error){
              $scope.status='Unable To load data:'+error.message;
            });
      }
    if ($scope.name=='discounts') {

     getDiscountsList();
      
    }else{
       getListofcatagories();
     
    }
    
   $scope.itemClick=function(item,index){
      alert(index+" " +item.FirstName+" "+item.LastName);
  };
  
}])
.controller('SlideImage', function($scope, $stateParams, $ionicSlideBoxDelegate,makeHttpRequest) {

$scope.posi=$stateParams.playlistId;

  setTimeout(function(){
      $ionicSlideBoxDelegate.update();
  },5000);
})

.controller('PlaylistCtrl', function($scope, $stateParams,Pagename,nameInUrl,Position,detailsId,newLocation, $ionicSlideBoxDelegate) {
  
  $scope.page=Pagename.getname();
   $scope.isCollapsed = true;
   $scope.name=nameInUrl.getname();
   //console.log($scope.name);
   $scope.details=Position.getname();
   //console.log($scope.details);
   $scope.clickedItemId=detailsId.getname();
  //console.log(detailsId.getname());
 setTimeout(function(){
      $ionicSlideBoxDelegate.update();
  },5000);
})

.controller('reserveActivity', function($scope,detailsData,$state,$http,makeHttpRequest) {
  $scope.reserve_todo=function(){
   ///$scope.activity_details=Position.getname();
  // console.log(detailsData.getname());
      $state.go('app.reserve');
      
  }
   $scope.submitForm = function(isValid) {
  
            // check to make sure the form is completely valid
            if (isValid) {
                $scope.user.type = detailsData.getname().type;
            $scope.user.type_id=detailsData.getname().type_id;
           
            var jsondata=$scope.user;
            var req = {
               method: "POST",
               url: "http://192.168.0.110/travel/public/reserve",
               headers: {'Content-Type': 'application/x-www-form-urlencoded'},
               transformRequest: function(jsondata) {
                  var str = [];
                  for(var p in jsondata)
                  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(jsondata[p]));
                  return str.join("&");
              },
              data: $scope.user
               
              };
            $http(req).success(function(data, status, headers, config){
                console.log(data);
                alert(data.message);
            }).error(function(data, status, headers, config){
              $scope.status='Unable To load data:'+data;
            });
          }else{
            alert("Enter all fields Correctly");
          }

        };
  $scope.downloadFile=function(downloadUrl){
   // alert(detailsData.getname().upload_files);''
   
     document.addEventListener("deviceready", init, false);

      //The directory to store data
      var store;

    //Used for status updates
    var $status;

  //URL of our asset
  var assetURL = detailsData.getname().upload_files;

  //File name of our important data file we didn't ship with the app
  var fileName = detailsData.getname().name+'.pdf';

  function init() {
  // Override default HTML alert with native dialog
       

    $status = document.querySelector("#status");
  
    
    store = cordova.file.externalRootDirectory;
      
    //Check for the file. 
    window.resolveLocalFileSystemURL(store + fileName, appStart, downloadAsset);

}

function downloadAsset() {
    var fileTransfer = new FileTransfer();
    console.log("About to start transfer");
    fileTransfer.download(assetURL, store + fileName, 
      function(entry) {
       
        console.log("Success!");
        alert('File Downloaded');
       
      }, 
      function(err) {
        console.log("Error");
        console.dir(err);
      });
    }
function appStart() {
  
}
 }
  })
.controller('LoadPage',function($scope, $state,nameInUrl,Pagename,Position,detailsId,newLocation){
  $scope.LoadSecondPage=function(data,pagename,position){
    $scope.playlists = [
    { title: 'PLACES NEAR YOU', id: 1 },
    { title: 'POPULAR ACTIVITIES', id: 2 },
    { title: 'HOTELS NEAR YOU', id: 3 },
    { title: 'PLACES NEAR YOU', id: 4 },
    { title: 'DEALS AND DISCOUNT NEAR YOU', id: 5 },
    { title: 'RESTAURANTS NEAR YOU', id: 6}
  ];
  $scope.detailsTitle=$scope.playlists[position].title;

  Position.setname($scope.detailsTitle);
  nameInUrl.setname(data);
  Pagename.setname(pagename);
      if (data=='discounts') {
          $state.go('app.discountSecond');
      }else{
          $state.go('app.LoadPage');
      }
 
  }
  $scope.LoadThirdPage=function(item){
    //console.log(item);
    detailsId.setname(item);
    if (nameInUrl.getname()=='to_do') {
      $state.go('app.toDo');
    }else if(nameInUrl.getname()=='to_see'){
      $state.go('app.toSee');
    }else if(nameInUrl.getname()=='discounts')
    {
      //console.log('discount third page loading');
      $state.go('app.discounts');
    }else if(nameInUrl.getname()=='restaurants'||nameInUrl.getname()=='shoppings'||nameInUrl.getname()=='to_stay')
    {
        $state.go('app.common');
    }
  }
  $scope.reloadPageWithLocation=function(){
   
      //console.log(nameInUrl.getname());
    
    $state.go('app.showLocationList');
  }
  $scope.Booking=function(name){
        //console.log('book a car clicked');
       if (name=='car') {
         $state.go('app.openCarBooking');
       }else if (name=='flight') {
         $state.go('app.openFlightBooking');
       }else if (name=='guide') {
          $state.go('app.openGuideBooking');
       }
       
  };
 
  $scope.reloadSecondpage=function(location){
    
     //console.log(detailsId.getname());
    newLocation.setname(location);
    $scope.locationTitle=newLocation.getname().location;
    $scope.details=Position.getname();
    //console.log(Position.getname());
     $state.go('app.reloadSecondPage');
  }
})
.controller('getReloadedCatagoryList',['$scope','makeHttpRequest','detailsId','newLocation',function($scope,makeHttpRequest,detailsId,newLocation,$stateParams) {
   $scope.status;
   reloadCatagoriesList();
   $scope.locationTitle=newLocation.getname().location;
    function reloadCatagoriesList(){
      makeHttpRequest.reloadCatagoriesList().success(function(response){
        //alert(response);
          $scope.response=response;
          $scope.detailsData=response.data;
          $scope.banner=response.banner;
         //console.log(response.data);
      })
      .error(function(error){
          $scope.status='Unable To load data:'+error.message;
      });
    }
}])

.controller('getCatagoryDetails',['$scope','makeHttpRequest','pageTitle','nameInUrl','detailsData','starCurrentRating',function($scope,makeHttpRequest,pageTitle,nameInUrl,detailsData,starCurrentRating,$stateParams) {
   $scope.status;
 function getDiscountDetails(){
                makeHttpRequest.getDiscountDetails().success(function(response){
                  //alert(response);
                    $scope.response=response;
                    $scope.detailsData=response.data;
                    detailsData.setname(response.data);
                    pageTitle.setname(response.data);
                   console.log(response.data);
                })
                .error(function(error){
                    $scope.status='Unable To load data:'+error.message;
                });
              }
     function getCategoryDetails(){
          makeHttpRequest.getCategoryDetails().success(function(response){
            //alert(response);
              $scope.response=response;
              $scope.detailsData=response.data;
               console.log(response.data);
              //converting string into html text
              var $log = $( "#log" ),
                str = response.data.details,
                html = $.parseHTML( str ),
                nodeNames = [];       
                     
                console.log(html);
               $(".item_details").html(html);
               var $log = $( "#log" ),
                str = response.data.info,
                html = $.parseHTML( str ),
                nodeNames = [];       
                     
                console.log(html);
               $(".item_info_details").html(html);
              detailsData.setname(response.data);
              starCurrentRating.setname(response.rating);
             if (response.rating==0) {
                starCurrentRating.setname(1);
             }
              $scope.rating = 0;
              $scope.ratings = [{
                current: starCurrentRating.getname(),
                max: 5
              }];

           $scope.getSelectedRating = function (rating) {
              console.log(rating);
            }
             console.log(starCurrentRating.getname());
          })
          .error(function(error){
              $scope.status='Unable To load data:'+error.message;
          });
        }
   if (nameInUrl.getname()=='discounts') {
          getDiscountDetails();
             
   }else{
         getCategoryDetails();
        
   }

  
}]).controller('StarCtrl', ['$scope','starCurrentRating',function($scope,starCurrentRating) {
    console.log(starCurrentRating.getname());
    $scope.rating = 0;
    $scope.ratings = [{
        current: 2,
        max: 5
    }];

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }
}])
.factory('makeHttpRequest',['$http','detailsId','newLocation','nameInUrl',function($http,detailsId,newLocation,nameInUrl){
  var baseUrlSecondPage='http://192.168.0.110/travel/public/get-category-list/';
  var baseUrlThirdPage='http://192.168.0.110/travel/public/get-category-detail/';
  var baseUrlDiscountPage='http://192.168.0.110/travel/public/get-discount-lists';
  var baseUrlReloadPage='http://192.168.0.110/travel/public/get-category-list-location/';
  var baseUrlReloadDiscountPage='http://192.168.0.110/travel/public/get-discount-lists-locations/';
  var reserveURL='http://192.168.0.110/travel/public/reserve';
  var baseUrlGetAllCars='http://192.168.0.110/travel/public/get-all-cars';
  var getCarDetailsURL='http://192.168.0.110/travel/public/get-car-details/';
  var getFlightListURL='http://192.168.0.110/travel/public/get-all-flights/';
  var getFlightDetailsURL='http://192.168.0.110/travel/public/get-flight-detail/';
  var getGuideListURL='http://192.168.0.110/travel/public/all-guides';
  var baseUrlGetAllNews='http://192.168.0.110/travel/public/get-travel-news';
  var vaseUrlgetnewsDetails='http://192.168.0.110/travel/public/get-news-deatils/';
  var getallFestivalList='http://192.168.0.110/travel/public/get-festivals';
  var getMagazineListURL='http://192.168.0.110/travel/public/magazine';
  var getfaqsListURL='http://192.168.0.110/travel/public/get-faqs';
      var makeHttpRequest={};
      makeHttpRequest.getallFestivalList=function(){
        return $http.get(getallFestivalList);
      };
      makeHttpRequest.getListofcatagories=function(data){
        return $http.get(baseUrlSecondPage+data);
      };
      makeHttpRequest.getCategoryDetails=function(){
      
        return $http.get(baseUrlThirdPage+detailsId.getname().type+'/'+detailsId.getname().id);
      };

      makeHttpRequest.getDiscountList=function(){
      
        return $http.get(baseUrlDiscountPage);
      };
       makeHttpRequest.getDiscountDetails=function(){
        //console.log(baseUrlDiscountPage+'/'+detailsId.getname().type+'/'+detailsId.getname().id);
        return $http.get(baseUrlDiscountPage+'/'+detailsId.getname().type+'/'+detailsId.getname().id);
      };
      makeHttpRequest.getcatList=function(){
        return $http.get(baseUrlGetAllCars);
      };
       makeHttpRequest.getnewsList=function(){
        return $http.get(baseUrlGetAllNews);
      };
       makeHttpRequest.getmagazineList=function(){
        return $http.get(getMagazineListURL);
      };
      makeHttpRequest.getfaqsList=function(){
        return $http.get(getfaqsListURL);
      };
      makeHttpRequest.getnewsDetails=function(newsID){
        console.log(vaseUrlgetnewsDetails+newsID);
        return $http.get(vaseUrlgetnewsDetails+newsID);
      };
      makeHttpRequest.getCarDetails=function(id){
        //console.log(getCarDetailsURL+id);
        return $http.get(getCarDetailsURL+id);
      };
      makeHttpRequest.getFlightList=function(data){
        //console.log(getFlightListURL+data);
        return $http.get(getFlightListURL+data);
      };
      makeHttpRequest.getFlightDetails=function(flightType,flightId){
        //console.log(getFlightDetailsURL+flightType+"/"+flightId);
        return $http.get(getFlightDetailsURL+flightType+"/"+flightId);
      };
      makeHttpRequest.getGuideList=function(){
          return $http.get(getGuideListURL);
      };

      makeHttpRequest.reserveEntry=function(){
        return $http.post(reserveURL,user);
      };
      makeHttpRequest.reloadCatagoriesList=function(){
          if (nameInUrl.getname()=='discounts') {
              return $http.get(baseUrlReloadDiscountPage+newLocation.getname().location);
          }else{
             return $http.get(baseUrlReloadPage+nameInUrl.getname()+'/'+newLocation.getname().location);
          }
      };
  return makeHttpRequest;
}])
.controller('DatepickerDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
   // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.closed = true;
  };
  $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy','shortDate'];
  $scope.format = $scope.formats[0];
})
.controller('TimepickerDemoCtrl', function ($scope) {
  $scope.selectedTime={};
  $scope.selectedTimeParam={};
  $scope.time=["1","2","3","4","5","6","7","8","9","10","11","12"];
  $scope.timeParam=["AM","PM"];
})
.service('Pagename',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
};
  })
.service('Position',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('guideDetails',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('detailsId',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('newLocation',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('pageTitle',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('detailsData',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('CardetailsData',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('CarBookingDetailsService',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  }).service('starCurrentRating',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  })
.service('nameInUrl',function() {
    var _xxx ;
   return {
    getname: function () {
        return _xxx;
    },
    setname: function (value) {
        _xxx = value;
    }
          };
  });
/*angular.module('MyIonicProject.controllers').run(function($FB){
  $FB.init('1577894775761134');
});*/