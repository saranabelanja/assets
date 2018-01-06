//show address
show_address_list();
function show_address_list() {
  $('#loading_address').hide();
  $.ajax({
    url   : base_url+'/address-list',
    type  : 'GET',
    dataType: 'html',
    beforeSend:function() {
      $('#loading_address').show();
    },
    success  : function(data){
      $('#loading_address').hide();
      $('#account-list-show').html(data);
    },
  });
}

function locations(){
    var province_name_update = $('#province_name_update').html();
    var province_id_update   = $('#province_id_update').html();

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
            $(location).appendTo("#account-province-update");
        }
    });
}

locations();

var locations   =   localStorage.getItem("locations");

$("#account-province-update").change(function(){
    $("#account-city-update").empty();
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
    $(location).appendTo("#account-city-update");
})

$("#account-city-update").change(function(){
    $("#account-district-update").empty();
    var province    =   $("#account-province-update").val();
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
    $(location).appendTo("#account-district-update");
})

//update address
$(document).ready(function() {

  $('.loading_province_update').hide();
  $('.loading_label_update').hide();
  $('.loading_city_update').hide();
  $('.loading_district_update').hide();
  $('.required_province_update').hide();
  $('.required_city_update').hide();
  $('.required_district_update').hide();
  $('.required_phone_update').hide();
  $('.required_name_update').hide();
  $('.required_zip_code_update').hide();
  $('.required_address_update').hide();
  $('.required_label_update').hide();

  //action update address
  $(".save_update_address").click(function(){

    var province_old    = $('#account-province-old').val();
		var province_update = $('#account-province-update').val();
    var city_update     = $('#account-city-update').val();
    var phone_update    = $('#account-phone-update').val();
		var name_update     = $('#account-name-update').val();
    var district_update = $('#account-district-update').val();
    var zip_code_update = $('#account-zip-code-update').val();
    var address_update  = $('#account-address-update').val();
    var user_address_ids= $('#account-user-address-id').val();
    var label_update    = $('#account-label-update').val();
    var status_update   = $('#account-status').val();

    if (province_update==null) {
      var prov = province_old;
    }else{
      var prov = province_update;
    }

    if (city_update=='' || district_update=='' || zip_code_update=='' || address_update=='' || label_update==''){

      if (city_update=='') {
        $(".required_city_update").show();
      }else if (district_update=='') {
        $(".required_district_update").show();
      }else if (phone_update=='') {
        $(".required_phone_update").show();
      }else if (name_update=='') {
        $(".required_name_update").show();
      }else if (zip_code_update=='') {
        $(".required_zip_code_update").show();
      }else if (address_update=='') {
        $(".required_address_update").show();
      }else if (label_update=='') {
        $(".required_label_update").show();
      }

    }else{
	    $.ajax({
	      url   : base_url+'/profile-update-address/'+user_address_ids,
	      data  : 'province='+prov+'&city='+city_update+'&name='+name_update+'&phone='+phone_update+'&district='+district_update+'&zip_code='+zip_code_update+'&address='+address_update+'&label='+label_update+'&status='+status_update,
  	    type  : 'POST',
	      dataType: 'html',
	      beforeSend:function() {
          $(".save_update_address").attr('disabled',true);
        },
	      success  : function(response){
	        if (response==1) {
            $(".save_update_address").attr('disabled',false);
            $('.required_province_update').hide();
            $('.required_city_update').hide();
            $('.required_district_update').hide();
            $('.required_phone_update').hide();
            $('.required_name_update').hide();
            $('.required_zip_code_update').hide();
            $('.required_address_update').hide();
            $('.required_label_update').hide();
            swal({title: "Sukses",text: "Alamat Berhasil di Tambah.",type: "success",timer: 3000});
            $('#update-address').modal('hide');
            $("#update-address").hide();
            $('.modal-backdrop').hide();
            $("body").removeClass("modal-open");
            show_address_list();
	        }else{
            $(".save_update_address").attr('disabled',false);
            $('.required_province_update').hide();
            $('.required_city_update').hide();
            $('.required_district_update').hide();
            $('.required_name_update').hide();
            $('.required_phone_update').hide();
            $('.required_zip_code_update').hide();
            $('.required_address_update').hide();
            $('.required_label_update').hide();
            swal({title: "Gagal",text: "Alamat Gagal di Tambah.",type: "error",timer: 3000});
            $('#update-address').modal('hide');
            $("#update-address").hide();
            $('.modal-backdrop').hide();
            $("body").removeClass("modal-open");
            show_address_list();
	        }
	      },
	    });
	  }

    $("#account-province-update").change(function(){
      if (province_update!=''){
        $(".required_province_update").hide();
      }
    });

    $("#account-city-update").change(function(){
      if (city_update!=''){
        $(".required_city_update").hide();
      }
    });

    $("#account-district-update").change(function(){
      if (district_update!=''){
        $(".required_district_update").hide();
      }
    });

    $("#account-phone-update").change(function(){
      if (phone_update!=''){
        $(".required_phone_update").hide();
      }
    });

    $("#account-name-update").change(function(){
      if (name_update!=''){
        $(".required_name_update").hide();
      }
    });

    $("#account-zip-code-update").keyup(function(){
      if (zip_code_update!=''){
        $(".required_zip_code_update").hide();
      }
    });

    $("#account-label-update").keyup(function(){
      if (label_update!=''){
        $(".required_label_update").hide();
      }
    });

    $("#account-address-update").keyup(function(){
      if (address_update!=''){
        $(".required_address_update").hide();
      }
    });

	});
});
// end update address
