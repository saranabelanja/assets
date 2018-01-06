$('#shipping_type_loading').hide();
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
})

//CART
function count_cart() {
    $.ajax({
        type: "GET",
        url: base_url+"/cart-count",
        success: function (count) {
            $(".count-cart").html(count);
        }
    });
}

count_cart();

function cart(slug){
  $.ajax({
        type: "GET",
        url: base_url+"/cart-modal",
        data: "slug="+slug,
        success: function (data) {
            $("#modal").html(data);
            $('#myModal').modal('show');
        }
    });
}

function ekspedisi(){
  var pathArray = window.location.pathname.split( '/' );
  $.ajax({
      type: "GET",
      url: base_url+"/api/user-ekspedisi/"+pathArray[1],
      success: function (data) {
          console.log(data);
          var ekspedisi   =   "";
          $.each(data.ekspedisi, function( index, data ) {
              ekspedisi += "<option value="+data.code+">"+data.code.toUpperCase()+"</option>";
          });
          $(ekspedisi).appendTo(".ekspedisi-dis");
      }
  });
}

ekspedisi();

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

show_address_list();
function show_address_list() {
  $('#loading_address').hide();
  $.ajax({
    url   : base_url+'/address-list-primary',
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

show_address_select();
function show_address_select() {
  $('#loading_address').hide();
  $('#primary-address-select').empty();
  $.ajax({
    url   : base_url+'/address-list-select',
    type  : 'GET',
    dataType: 'html',
    beforeSend:function() {
      $('#loading_address').show();
    },
    success  : function(data){
      $.each(JSON.parse(data), function (idx, val) {
            $('#primary-address-select').append($('<option/>', { 
                value: val.user_address_id,
                text : val.label 
            }));
        }); 
    },
  });
}

//Raja Ongkir
$('#shipping_name').change(function(){
  var city_seller = $('#seller_address').val();
  var district = $('#user_district').val();
  var courier = $('#shipping_name').val();
  var weight = $('#product-weight').val();
  if(weight < 5000){
   $.ajax({
      type: "POST",
      url: base_url+"/ongkir/cost",
      data: "&origin="+city_seller+"&district="+district+"&weight="+weight+"&courier="+courier,
      beforeSend: function(){
        $('#shipping_type').hide();
        $('#shipping_type_loading').show();
      },
      success: function (data) {
        $("#shipping_type").empty();
        var data      = JSON.parse(data);
        var count     = data.rajaongkir.results.length;
        var service   = "<option value=''>Paket Pengiriman</option>";
        for(var i =0;i<count;i++){
          if(data.rajaongkir.results[i].code==$('#shipping_name').val()){
            var count_courier   = data.rajaongkir.results[i].costs.length;
            for(var x=0;x<count_courier;x++){
              service += "<option value="+data.rajaongkir.results[i].costs[x].service+"|"+data.rajaongkir.results[i].costs[x].cost[0].value+"|"+data.rajaongkir.results[i].costs[x].cost[0].etd+">"+data.rajaongkir.results[i].costs[x].service+"</option>";  
            }
          }
        }
        $('#shipping_type').show();
        $('#shipping_type_loading').hide();
        $(service).appendTo("#shipping_type");
      }
  }); 
 }else{
  swal({title: "Gagal",text: "Berat benda melebihi kapasitas",type: "warning",timer: 3000});
 }
  
});

$("#shipping_type").change(function(){
  var data  = $("#shipping_type").val().split("|");
  var ongkir= data[1];
  var etd   = data[2];
  var total = parseInt(ongkir) + parseInt($('#product-price').val());

  $("#shipping-cost").val(ongkir);
  $("#shipping_cost_result").html('Rp.' + Intl.NumberFormat().format(ongkir));
  $("#total_cost_result").html('Rp.' + Intl.NumberFormat().format(total));

})

$('#primary-address-select').change(function(){
    $.ajax({
        url : base_url+"/address-primary/"+$(this).val(),
        type: 'GET',
        success : function(response){
          if(response=='1'){
            show_address_list();
          }else {
            alert('gagal')
          }
        }
    })
})

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

$("#add-to-cart").click(function(){
  var name            = $('#product-name').val();
  var sku             = $('#product-sku').val();
  var product_id      = $('#product-id').val();
  var qty             = $('#product-qyt').val();
  var price           = $('#product-price').val();
  var image           = $('#product-image').val();
  var slug            = $('#product-slug').val();
  var weight          = parseInt($('#product-weight').val());
  var width           = parseInt($('#product-width').val());
  var height          = parseInt($('#product-height').val());
  var address         = $('#address').html();
  var address_label   = $('#address-label').html();
  var address_name    = $('#address-name').html();
  var address_phone   = $('#address-phone').html();
  var address_province= $('#address-province').html();
  var address_city    = $('#address-city').html();
  var address_district= $('#address-district').html();
  var address_zip_code= $('#address-zip-code').html();
  var notes           = $('#notes').val();
  var shipping_name   = $('.ekspedisi-dis').val();
  var shipping_type   = $('.paket-dis').val().split("|")[0];
  var shipping_cost   = $('.paket-dis').val().split("|")[1];
  var shipping_etd    = $('.paket-dis').val().split("|")[2];
  var seller_name     = $('#seller-name').val();
  var seller_id     = $('#seller-id').val();
     
  $.ajax({
      type: "POST",
      url: base_url+"/cart/add",
      data: "sku="+sku+
            "&name="+name+
            "&product_id="+product_id+
            "&qty="+qty+
            "&price="+price+
            "&image="+image+
            "&slug="+slug+
            "&weight="+weight+
            "&height="+height+
            "&width="+width+
            "&address="+address+
            "&label="+address_label+
            "&receiver="+address_name+
            "&phone="+address_phone+
            "&province="+address_province+
            "&city="+address_city+
            "&district="+address_district+
            "&zip_code="+address_zip_code+
            "&shipping_name="+shipping_name+
            "&shipping_cost="+shipping_cost+
            "&shipping_type="+shipping_type+
            "&shipping_etd="+shipping_etd+
            '&seller_name='+seller_name+
            '&seller_id='+seller_id+
            "&notes="+notes,
      success: function (data) {
          $('#myModal').modal('hide');
          $("#myModal").hide();
          $('.modal-backdrop').hide();
          $("body").removeClass("modal-open");
          updateCart();
          swal({title: "Sukses",text: "Data Berhasil ke keranjang",type: "success",timer: 3000});
      }
  });
});


function updateCart(){
    $.ajax({
            url : base_url+'/cart/load',
        }).done(function (data) {
            $('#header-cart').html(data);
        }).fail(function () {
            console.log('load cart faild')
        });
  }


//WISHLIST
function wishlist_add(slug){
    $.ajax({
        type: "GET",
        url: base_url+"/wishlist-add",
        data: "slug="+slug,
        success: function (data) {
            console.log(data);
        }
    });
}


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
    var phone    = $('#account-phone').val();
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
            $('#add-address').modal('hide');
            $("#add-address").hide();
            show_address_list();
            show_address_select();
            }else{
            $(".save_profile").attr('disabled',false);
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
            show_address_list();
            show_address_select();
            }
            $("#hide-front").fadeIn();
              $("#hide-back").fadeOut();
              $("#form-address").fadeOut();
              $("#hide-address-list").fadeIn();
              $('.ekspedisi-dis').prop('disabled', false);
              $('.paket-dis').prop('disabled', false);
              $('.asuransi-dis').prop('disabled', false);
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