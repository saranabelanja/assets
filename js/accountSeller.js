function locations(){
    var province_name_update = $('#province_name_update').val();
    var province_id_update   = $('#province_id_update').val();

    $.ajax({
        type: "GET",
        url: base_url+"/api/location",
        beforeSend:function() {
          $('.loading_province_update').show();
        },
        success: function (data) {
            localStorage.setItem("locations", JSON.stringify(data));
            var location   =   "<option value="+province_id_update+" selected disabled>"+province_name_update+"</option>";
            for (var x = 0; x < data.length; x++) {
                location += "<option value="+data[x].province_id+">"+data[x].province_name+"</option>";
            }
            $('.loading_province_update').hide();
            $(location).appendTo("#input-province");
        }
    });
}

locations();

var locations   =   localStorage.getItem("locations");

$("#input-province").change(function(){
    $("#input-city").empty();
    var province    =   $(this).val();
    var location    =   "";
    var data        =   JSON.parse(locations);
    for (var x = 0; x < data.length; x++) {
        if(data[x].province_id==province){
            var location   =   "<option value='' selected disabled>Silahkan Pilih Kota</option>";
            for ( var y = 0; y < data[x].city.length; y++ ){
                location += "<option value="+data[x].city[y].city_id+">"+data[x].city[y].city_name+"</option>";
            }
        }
    }
    $(location).appendTo("#input-city");
})

$("#input-city").change(function(){
    $("#input-district").empty();
    var province    =   $("#input-province").val();
    var city        =   $(this).val();
    var location    =   "";
    var data        =   JSON.parse(locations);
    for (var x = 0; x < data.length; x++) {
        if(data[x].province_id==province){
            for ( var y = 0; y < data[x].city.length; y++ ){
                if(data[x].city[y].city_id==city){
                    var location   =   "<option value='' selected disabled>Silahkan Pilih Kecamatan</option>";
                    for ( var z = 0; z < data[x].city[y].district.length; z++ ){
                        location += "<option value="+data[x].city[y].district[z].district_id+">"+data[x].city[y].district[z].district_name+"</option>";
                    }
                }
            }
        }
    }
    $(location).appendTo("#input-district");
})