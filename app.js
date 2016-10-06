(function() {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "//davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowItDown = this;
  narrowItDown.searchTerm = "";
  narrowItDown.search = function(searchTerm) {
    var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);
    promise.then(function(response) {
    narrowItDown.found = response;
    });
  };

  narrowItDown.removeItem = function(index) {
  	narrowItDown.found.splice(index, 1);
  };

  narrowItDown.isEmpty = function() {
    if (narrowItDown.found) {
    return (narrowItDown.found.length == 0);
    } else return false;
  };
}

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    restrict: "E",
    scope: {
      list: "<",
      onRemove: "&"
    },
  };
  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
  	console.log("getMatchedMenuItems called");
    return $http({
  	  method: "GET",
  	  url: (ApiBasePath + "/menu_items.json")

  	}).then(
  	  function (response) {
  	  	var foundItems = response.data.menu_items;
  	  	for(var i = 0; i < foundItems.length; i++) {
  	  	  if (foundItems[i].description.indexOf(searchTerm) === -1) {
  	  		  foundItems.splice(i, 1);
  	  		 i--;
  	  	  }
  	    }
  	    return foundItems;
  	  });
  };
}

})();
