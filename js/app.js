(function() {
  "use strict";

  angular
    .module("searchList", [])
    .controller("searchInput", searchInput)
    .service("Items", Items)
    .directive("foundItems", foundItems);
  function foundItems() {
    var ddo = {
      templateUrl: "found-list.html",
      restrict: "E",
      scope: {
        foundItems: "=",
        onRemove: "&"
      },
      controller: foundItemsController,
      controllerAs: "ctrl",
      bindToController: true
    };
    return ddo;
  }
  function foundItemsController() {
    var ctrl = this;
    // element.scope = element.myProp;
  }
  Items.$injector = ["$http"];
  searchInput.$injector = ["Items", "$filter"];
  function Items($http) {
    var service = this;
    let items;
    $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    })
      .then(res => (items = res.data.menu_items))
      .catch(err => err);
    service.getItems = function() {
      return items;
    };
  }
  function searchInput(Items, $filter) {
    var vm = this;
    vm.hello = "Hello world";

    vm.consoleData = function() {
      if (!vm.search) return (vm.inputempty = true);
      else if (vm.search !== "") {
        const ret = Items.getItems();
        vm.found = $filter("filter")(ret, vm.search);
        vm.inputempty = false;
        vm.error = false;
        vm.error2 = false;
        if (vm.found.length === 0) {
          vm.error = true;
          vm.inputempty = false;
        }
      }
    };
    vm.remove = function(index) {
      vm.found.splice(index, 1);
      if (vm.found.length === 0) {
        vm.error2 = true;
      }
    };
  }
})();
