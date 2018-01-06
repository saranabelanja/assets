$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
})

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
    $.ajax({
        type: "GET",
        url: base_url+"/api/location",
        success: function (data) {
            localStorage.setItem("locations", JSON.stringify(data));
            var location   =   "<option value='' selected disabled>Pilih Provinsi</option>";
            for (var x = 0; x < data.length; x++) {
                location += "<option value="+data[x].province_id+">"+data[x].province_name+"</option>";
            }
            $(location).appendTo("#account-province");
        }
    });
}

locations();

var locations   =   localStorage.getItem("locations");

$("#account-province").change(function(){
    $("#account-city").empty();
    var province    =   $(this).val();
    var location    =   "";
    var data        =   JSON.parse(locations);
    for (var x = 0; x < data.length; x++) {
        if(data[x].province_id==province){
            var location   =   "<option value='' selected disabled>Silahkan Pilih Kota</option>";
            for ( var y = 0; y < data[x].city.length; y++ ){
                location += "<option value="+data[x].city[y].city_id+">"+data[x].city[y].type+' '+data[x].city[y].city_name+"</option>";
            }
        }
    }
    $(location).appendTo("#account-city");
})

$("#account-city").change(function(){
    $("#account-district").empty();
    var province    =   $("#account-province").val();
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
    $(location).appendTo("#account-district");
})

$("#account-district").change(function(){
   $("#account-zip-code").empty();
    var province    =   $("#account-province").val();
    var city        =   $("#account-city").val();
    var data        =   JSON.parse(locations);
    for (var x = 0; x < data.length; x++) {
        if(data[x].province_id==province){
            for ( var y = 0; y < data[x].city.length; y++ ){
                if(data[x].city[y].city_id==city){
                    $('#account-zip-code').val(data[x].city[y].postal_code);
                }
            }
        }
    }
})

//update profile
$(document).ready(function() {
  $('.required_fn').hide();
  $('.required_phone').hide();
  $(".save_profile").click(function(){

    var fn = $('#account-fn').val();
    var id = $('#account-id').val();
    var phone = $('#account-phone').val();

    if (fn=='' || phone==''){

      if (fn==''){
        $(".required_fn").show();
      }else if (phone=='') {
        $(".required_phone").show();
      }

    }else{
      $.ajax({
        url   : base_url+'/profile/'+id,
        data  : 'name='+fn+'&phone='+phone,
        type  : 'POST',
        dataType: 'html',
        beforeSend:function() {
          $(".save_profile").attr('disabled',true);
        },
        success  : function(response){
          if (response==1) {
            $(".save_profile").attr('disabled',false);
            $('.required_fn').hide();
            $('.required_phone').hide();
            swal({title: "Sukses",text: "Alamat Berhasil di Ubah.",type: "success",timer: 3000});
            get_name();
          }else{
            $(".save_profile").attr('disabled',false);
            swal({title: "Gagal",text: "Alamat Gagal di Ubah.",type: "error",timer: 3000});
            $('.required_fn').hide();
            $('.required_phone').hide();
          }
        },
      });
    }

    $("#account-fn").keyup(function(){
      if (fn!=''){
        $(".required_fn").hide();
      }
    });

    $("#account-phone").keyup(function(){
      if (phone!=''){
        $(".required_phone").hide();
      }
    });

  });
});
// end update profile
//update password
$(document).ready(function() {
  $('.required_new').hide();
  $('.required_old').hide();
  $('.required_cnf').hide();
  $('.not_match_cnf').hide();

  $(".save_password").click(function(){

		var pnew = $('#account-password-new').val();
		var old = $('#account-password-old').val();
    var id = $('#account-id').val();
    var cnf = $('#account-password-cnf').val();

    if (pnew=='' || old=='' || cnf=='' ){

      if (pnew==''){
        $(".required_new").show();
      }else if (old=='') {
        $(".required_old").show();
      }else if(cnf==''){
        $(".required_cnf").show();
      }

    }else{
      if(pnew == cnf){
        $.ajax({
          url   : base_url+'/update-password/'+id,
          data  : 'old_password='+old+'&new_password='+pnew,
          type  : 'POST',
          dataType: 'html',
          beforeSend:function() {
            $(".save_password").attr('disabled',true);
          },
          success  : function(response){
            if (response==1) {
              $(".save_profile").attr('disabled',false);
              $('.required_new').hide();
              $('.required_old').hide();
              $('.required_cnf').hide();
              swal({title: "Sukses",text: "Password Berhasil di Ubah.",type: "success",timer: 3000});
              get_name();
            }else{
              $(".save_password").attr('disabled',false);
              swal({title: "Gagal",text: "Password Gagal di Ubah.",type: "error",timer: 3000});
              $('.required_fn').hide();
              $('.required_new').hide();
              $('.required_old').hide();
              $('.required_cnf').hide();
            }
          },
        });
      }else{
        $(".not_match_cnf").show();
      }
	  }

    $("#account-fn").keyup(function(){
      if (fn!=''){
        $(".required_fn").hide();
      }
    });

    $("#account-phone").keyup(function(){
      if (phone!=''){
        $(".required_phone").hide();
      }
    });

	});
});
// end update profile

//for show modal
$(".show-modal-add-address").click(function(){
  $('#add-address').modal('show');
  $('.modal').addClass('show');
  $('.modal-backdrop').addClass('fade in');
  $('.modal-backdrop').addClass('fade show');
});

//for show modal
function address_modal_update(id){
  var users_address_id = id;
  $.ajax({
    url : base_url+"/address-update/"+users_address_id,
    success : function(data){
      $('#modal-show-update-address').html(data);
      $('#update-address').modal('show');
      $('.modal').addClass('show');
      $('.modal-backdrop').addClass('fade in');
      $('.modal-backdrop').addClass('fade show');
    }
  })
};

//add address
$(document).ready(function() {

  $('.loading_province').hide();
  $('.loading_city').hide();
  $('.loading_district').hide();
  $('.required_province').hide();
  $('.required_phone').hide();
  $('.required_name').hide();
  $('.required_city').hide();
  $('.required_district').hide();
  $('.required_zip_code').hide();
  $('.required_address').hide();
  $('.required_label').hide();

  //action add address
  $(".save_add_address").click(function(){

    var label    = $('#account-label').val();
		var province = $('#account-province').val();
    var city     = $('#account-city').val();
    var name     = $('#account-name').val();
		var phone     = $('#account-phone').val();
    var district = $('#account-district').val();
    var zip_code = $('#account-zip-code').val();
    var address  = $('#account-address').val();
    var id       = $('#account-id').val();

    if (province=='' || city=='' || district=='' || zip_code=='' || address=='' || label=='' || phone=='' || name==''){

      if (province==''){
        $(".required_province").show();
      }else if (city=='') {
        $(".required_city").show();
      }else if (district=='') {
        $(".required_district").show();
      }else if (zip_code=='') {
        $(".required_zip_code").show();
      }else if (address=='') {
        $(".required_address").show();
      }else if (label=='') {
        $(".required_label").show();
      }else if(name==''){
        $(".required_name").show();
      }else if(phone ==''){
        $("required_phone").show()
      }

    }else{
	    $.ajax({
	      url   : base_url+'/profile-add-address/'+id,
	      data  : 'province='+province+'&city='+city+'&district='+district+'&zip_code='+zip_code+'&address='+address+'&label='+label+'&phone='+phone+'&name='+name,
  	    type  : 'POST',
	      dataType: 'html',
	      beforeSend:function() {
          $(".save_add_address").attr('disabled',true);
        },
	      success  : function(response){
	        if (response==1) {
            $(".save_add_address").attr('disabled',false);
            $('.required_province').hide();
            $('.required_city').hide();
            $('.required_name').hide();
            $('.required_phone').hide();
            $('.required_district').hide();
            $('.required_zip_code').hide();
            $('.required_address').hide();
            $('.required_label').hide();
            $('#account-city').empty();
            $('#account-district').empty();
        		$('#account-city').append('<option value="" disabled selected>Pilih Kota</option>');
            $('#account-district').append('<option value="" disabled selected>Pilih Kecamatan</option>');
            $('#account-phone').val('');
            $('#account-name').val('');
            $('#account-zip-code').val('');
            $('#account-address').val('');
            $('#account-label').val('');
            swal({title: "Sukses",text: "Alamat Berhasil di Tambah.",type: "success",timer: 3000});
            $('#add-address').modal('hide');
            $("#add-address").hide();
            $('.modal-backdrop').hide();
            $("body").removeClass("modal-open");
            show_address_list();
	        }else{
            $(".save_profile").attr('disabled',false);
    				swal({title: "Gagal",text: "Alamat Gagal di Tambah.",type: "error",timer: 3000});
            $('.required_province').hide();
            $('.required_city').hide();
            $('.required_name').hide();
            $('.required_phone').hide();
            $('.required_district').hide();
            $('.required_zip_code').hide();
            $('.required_address').hide();
            $('.required_label').hide();
            $('#account-city').empty();
            $('#account-district').empty();
        		$('#account-city').append('<option value="" disabled selected>Pilih Kota</option>');
            $('#account-district').append('<option value="" disabled selected>Pilih Kecamatan</option>');
            $('#account-zip-code').val('');
            $('#account-phone').val('');
            $('#account-name').val('');
            $('#account-address').val('');
            $('#account-label').val('');
            $('#add-address').modal('hide');
            $("#add-address").hide();
            $('.modal-backdrop').hide();
            $("body").removeClass("modal-open");
            show_address_list();
	        }
	      },
	    });
	  }

    $("#account-province").keyup(function(){
      if (province!=''){
        $(".required_province").hide();
      }
    });

    $("#account-city").keyup(function(){
      if (city!=''){
        $(".required_city").hide();
      }
    });

    $("#account-district").keyup(function(){
      if (district!=''){
        $(".required_district").hide();
      }
    });

    $("#account-zip-code").keyup(function(){
      if (zip_code!=''){
        $(".required_zip_code").hide();
      }
    });

    $("#account-phone").keyup(function(){
      if (phone!=''){
        $(".required_phone").hide();
      }
    });

    $("#account-name").keyup(function(){
      if (name!=''){
        $(".required_name").hide();
      }
    });

    $("#account-label").keyup(function(){
      if (label!=''){
        $(".required_label").hide();
      }
    });

    $("#account-address").keyup(function(){
      if (address!=''){
        $(".required_address").hide();
      }
    });

	});
});
// end add address

//delete address
function address_delete(id){
  var users_address_id = id;
  swal({
    title: "Apa Anda yakin akan menghapus alamat ini?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya',
    cancelButtonText: "Tidak",
    closeOnConfirm: false,
    closeOnCancel: false
 },
 function(isConfirm){

   if (isConfirm){

      $.ajax({
        url : base_url+"/address-delete/"+id,
        type: 'GET',
        success : function(response){
          if(response=='1'){
            swal({title: "Sukses",text: "Alamat berhasil di hapus.",type: "success",timer: 3000});
            show_address_list();
          }else {
            swal({title: "Batal",text: "Hapus alamat dibatalkan.",type: "error",timer: 3000});
            show_address_list();
          }
        }
     });

    }else{
      swal({title: "Batal",text: "Hapus alamat dibatalkan.",type: "error",timer: 3000});
    }
});

}

function address_primary(id){
  $.ajax({
    url : base_url+"/address-primary/"+id,
    type: 'GET',
    success : function(response){
      if(response=='1'){
        swal({title: "Sukses",text: "Berhasil dijadikan alamat utama.",type: "success",timer: 3000});
        show_address_list();
      }else {
        swal({title: "Batal",text: "Gagal dijadikan alamat utama.",type: "error",timer: 3000});
        show_address_list();
      }
    }
 });

}
