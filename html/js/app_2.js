angular
    .module('apiApp', [])
    .controller('apiAppCtrl', controladorPrincipal);

function controladorPrincipal($scope, $http){
    var vm = this;
    vm.buscaCiudad = function(e){
      var num_string = vm.nombre.length;
      //console.log(num_string);
      if(vm.nombre && num_string > 2){
        var url = 'http://api.wunderground.com/api/9d60410990f6709c/conditions/q/';
        url +=  vm.nombre+'.json';
      }
      $http.get(url).success(function(respuesta){
        //console.log("res:", respuesta.response.results[0]);
        var data = respuesta.response.results;
        vm.ciudades = data;
      });
    }

    vm.valor_ciudad = function(item){
      var valor = '';
      vm.nombre = item.name+' '+item.country_name;
    }

    vm.buscaTiempo = function(item){
       var valor = '';
       var tmp = item.split(' ');
       var country = tmp[1];
       var name = tmp[0];
       //vm.valor = item.name+' '+item.country_name;

       var url = 'http://api.wunderground.com/api/9d60410990f6709c/forecast/lang:SP/q/';
       var url2 = 'http://api.wunderground.com/api/9d60410990f6709c/conditions/lang:SP/q/';
       if(item){
         url +=  country+'/'+name+'.json';
         url2 +=  country+'/'+name+'.json';
       }

       $http.get(url).success(function(respuesta){
         var data2 = respuesta.forecast.simpleforecast.forecastday;
         vm.tiempos_2 = data2[0];
       });
       $http.get(url2).success(function(respuesta){
         var data1 = respuesta.current_observation;
         vm.tiempos_1 = data1;
         vm.location = data1.display_location;
       });
    }

}
