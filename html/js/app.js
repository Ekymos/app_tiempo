jQuery(document).ready(function(){
   
   $('#ciudad').keyup(function(){
      $('#lista_resultados').fadeIn();
      if($(this).val().length>2){
         var buscar_ciudad = $('#ciudad').val();
         var flickerAPI = 'http://api.wunderground.com/api/9d60410990f6709c/conditions/q/'+buscar_ciudad+'.json';
         $.getJSON( flickerAPI, {
            format: "json"
         }) .done(function( data ) {
            var listado = '';
            var resultados = data.response.results;
            var listado = '';
            if(resultados!= undefined){
               resultados.sort(SortByName);
               for(i=0; i < resultados.length; i++){
                  //console.log(resultados[i].city+', '+resultados[i].country_name);
                  var cadena = resultados[i].city+', '+resultados[i].state+' '+resultados[i].country_name;
                  listado = listado+'<p class="listados" data-country="'+resultados[i].country_name+'" data-name="'+resultados[i].name +'">'+cadena+'</p>';
               }
               $('#lista_resultados').html(listado);
            }else{
               listado = '<h5>No se han encontrado resultados</h5>';
               $('#lista_resultados').html(listado);
            }
         });
      }
   });

   $('#lista_resultados').on("click",".listados",function(){
      
      $('#lista_resultados').fadeOut(900);

      var pais = $(this).data('country');
      var ciudad = $(this).data('name');
      var url_forecast = 'http://api.wunderground.com/api/9d60410990f6709c/forecast/lang:SP/q/'+pais+'/'+ciudad+'.json';
      var url_conditions = 'http://api.wunderground.com/api/9d60410990f6709c/conditions/lang:SP/q/'+pais+'/'+ciudad+'.json';
      
      $.getJSON(url_forecast,{
         format:'json'
      }).done(function(data1){
         //console.log(data1);
         
         $.getJSON(url_conditions,{
            format:'json'
         }).done(function(data2){
            console.log(data1);
            var path_1 = data1.forecast.simpleforecast;
            var path_1_1 = data1.forecast.txt_forecast;
            var path_2 = data2.current_observation;
               
            var temp_actual = path_2.temp_c;
            var temp_max = path_1.forecastday[0].high.celsius;
            var temp_min = path_1.forecastday[0].low.celsius;
            var ciudad_tit = path_2.display_location.full;
            var id_cielo = path_1.forecastday[0].conditions;
            var humedad = path_1.forecastday[0].avehumidity; 
            var descripcion = path_1_1.forecastday[0].fcttext_metric;

            
            $('.cuerpo').css('background-image',fondos(id_cielo,temp_actual));
            $('#ciudad-tit').html(ciudad_tit);
            $('#temp-actual').html(temp_actual+' &deg;');
            $('#temp-max').html(temp_max+' &deg;');
            $('#temp-min').html(temp_min+' &deg;');
            $('#humedad').html(humedad+'%');
            $('#descripcion').html(descripcion);
            $('.informacion').fadeIn(1000,function(){
               $('#ciudad').val('');
            }); 
         });
      });
   });
   
   /*$('#ir').click(function(){
      var valor_buscador = $('#ciudad').val();
      if(valor_buscador!=''){
         $.get('http://api.openweathermap.org/data/2.5/weather?q='+valor_buscador+'&lang=es',function(data){
            
            var id_cielo = data.weather[0].id;   
            var temp_actual = convert_KtoC(data.main.temp);
            var ciudad_tit = data.name;
            var humedad = data.main.humidity;
            var descripcion = data.weather[0].description;
            
            //console.log(data.name);
            
            $('.cuerpo').css('background-image',fondos(id_cielo,temp_actual));
            $('#ciudad-tit').html(ciudad_tit);
            $('#temp-actual').html(temp_actual+' C&deg;');
            $('#humedad').html(humedad+'%');
            $('#descripcion').html(descripcion);
            $('.informacion').fadeIn(1000,function(){
               $('#ciudad').val('');
            });
         });
      }   
   });
   */
   function fondos(valor,temp){
      var fondo ='';
      if(valor=='800' && temp<1){
         fondo='url(img/invierno-despejado.jpg)';
      }
      if(valor=='800' && temp<=15 && temp>=5){
         fondo='url(img/invierno-despejado-2.jpg)';
      }
      if(valor=='800' && temp>15){
         fondo='url(img/verano-despejado.jpg)';
      }
      if(valor=='500' && temp>0){
         fondo='url(img/lluvia-ligera.jpg)';
      }
      if(valor=='802' && temp<0){
         fondo='url(img/invierno-nubesDispersas.jpg)';
      }
      return fondo;
   }
   function convert_KtoC(valor){
      var centigrados = valor-273;
      centigrados = Math.round(centigrados);
      return centigrados;
   }
   function SortByName(x,y) {
      return ((x.country_name == y.country_name) ? 0 : ((x.country_name > y.country_name) ? 1 : -1 ));
    }
   
});