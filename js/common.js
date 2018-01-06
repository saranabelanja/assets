$("#form-address").hide();
$("#hide-back").hide();
$("#add-address").click(function(){
  $("#hide-front").fadeOut();
  $("#hide-back").fadeIn();
  $("#form-address").fadeIn();
  $("#hide-address-list").fadeOut();
  $('.ekspedisi-dis').prop('disabled', true);
  $('.paket-dis').prop('disabled', true);
  $('.asuransi-dis').prop('disabled', true);
});

$("#back-address").click(function(){
  $("#hide-front").fadeIn();
  $("#hide-back").fadeOut();
  $("#form-address").fadeOut();
  $("#hide-address-list").fadeIn();
  $('.ekspedisi-dis').prop('disabled', false);
  $('.paket-dis').prop('disabled', false);
  $('.asuransi-dis').prop('disabled', false);
});

get_name();
function get_name() {
    $.ajax({
        type: "GET",
        url: base_url+"/get-name",
        success: function (data) {
            $(".get-name").html(data);
        }
    });
}

function remove_item_cart(rowid){
  $.ajax({
      type: "GET",
      url: base_url+"/cart/remove/"+rowid,
      success: function (data) {
          updateCart();
          swal({title: "Sukses",text: "Data Berhasil di hapus",type: "success",timer: 3000});
      }
  });
}

$(function() {
    //lazy loading;
    var instance;
       
    var instance = $('img').lazy({chainable: false});
    instance.addItems('img');
    instance.update(true);
    var instance = $('.lazy').lazy({
    chainable: false,
    placeholder: "http://res.cloudinary.com/dd5jfnv3x/image/upload/v1515059196/loading_qej9h7.gif",
    afterLoad: function(element) {
            element.removeClass("lazy");
        }
    });

    function registerLazy() {
        if( instance )
            instance.destroy();

        instance = $('img').lazy({
            chainable: false,
            afterLoad: function(element) {
                element.removeClass('lazy');
            }
        });
    }

    $(".numberonly").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $('body').on('click', '.pagination a', function(e) {
        e.preventDefault();
        var url = $(this).attr('href'); 
        getProduct(url);
        window.history.pushState("", "", url);
    });

    $(document).on('click',".overlay", function(e) {       
      $('.overlay').fadeOut();                
    });

    $('body').on('click', '#filter-price', function(e) {
        e.preventDefault();
        if ('URLSearchParams' in window) {
            var url = base_url+window.location.pathname+'?';
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("min", $('#min').val());
            searchParams.set("max", $('#max').val());

            url = url+searchParams.toString();
        }
        getProduct(url);
        window.history.pushState("", "", url);
    });

    $('body').on('keyup', '#form-search', function() {
      if($('#form-search').val() == ''){
        $('.rollover').css({
                      'display': 'none',
              });
        $('.overlay').css({
                      'display': 'none',
              });
      }else{
        $('.rollover').css({
                      'display': 'block',
              });
        $('.overlay').css({
                      'display': 'block',
              });
      }
      $.ajax({
          url : base_url+'/autocomplete?query='+$('#form-search').val(),
      }).done(function (data) {
          $('.data-produk').empty();
            $('.data-toko').empty();
          $.each(data.category, function(index,category){
            $('.data-produk').append('<li><a href="/'+category.slug+'?query='+data.term+'" title="Sepatu"><b><b><b>'+data.term+'</b></b></b> dalam <b>'+category.name+'</b></a></li>');
            return index<4;
          })
          $.each(data.seller, function(index,toko){
            $('.data-toko').append('<li><a href="/'+toko.slug+'" title="Brembrem.com" class="list-img"><div class="img"><img src="'+toko.avatar+'" alt="Saranabelanja.com"></div><span class="gettext">'+toko.name+'</span></a></li>');
            return index<4;
          })
      }).fail(function () {
          alert('Product could not be loaded.');
      });
    });

    $('body').on('click', '.condition-filter', function(e) {
        if ('URLSearchParams' in window) {
            var condition = [];
            $(".condition-filter:checked").each(function(){
                condition.push($(this).val());
            });
            var url = base_url+window.location.pathname+'?';
            var searchParams = new URLSearchParams(window.location.search);
            if(condition.length > 1){
              searchParams.set("condition", 'all');
            }else if(condition.length < 1){
              searchParams.delete('condition');
            }else{
              searchParams.set("condition", condition);
            }
            url = url+searchParams.toString();
        }
        getProduct(url);
        window.history.pushState("", "", url);
    });

    $('body').on('click', '.city-filter', function(e) {
        if ('URLSearchParams' in window) {
            var condition = [];
            $(".city-filter:checked").each(function(){
                condition.push($(this).val());
            });
            var url = base_url+window.location.pathname+'?';
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("city", condition);
            url = url+searchParams.toString().replace(/%2C/g,",");
        }
        getProduct(url);
        window.history.pushState("", "", url);
    });

    $('body').on('change', '#filer-sort', function(e) {
        e.preventDefault();
        if ('URLSearchParams' in window) {
            var url = window.location.href +'?';
            var value = $('#filer-sort').val().split('|');
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("orderBy", value[0]);
            searchParams.set("type", value[1]);

            url = url+searchParams.toString();
        }
        getProduct(url);
        window.history.pushState("", "", url);
    });

    function getProduct(url) {
        $.ajax({
            url : url,
            beforeSend : function(){
                $('.pagination').hide();
                $('.isotope-grid').css({
                      'position': '', 
                      'height': '',
              });
            }
        }).done(function (data) {
            $('#product-data').html(data);
            $('.isotope-grid').css({
                'position': 'relative'
            });
            $('html, body').animate({ scrollTop: 0 }, 'slow')
            registerLazy();
        }).fail(function () {
            alert('Product could not be loaded.');
        });
    }

    function removeURLParameter(url, parameter) {
      //prefer to use l.search if you have a location/link object
      var urlparts= url.split('?');   
      if (urlparts.length>=2) {

          var prefix= encodeURIComponent(parameter)+'=';
          var pars= urlparts[1].split(/[&;]/g);

          //reverse iteration as may be destructive
          for (var i= pars.length; i-- > 0;) {    
              //idiom for string.startsWith
              if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                  pars.splice(i, 1);
              }
          }

          url= urlparts[0]+'?'+pars.join('&');
          return url;
      } else {
          return url;
      }
  }

  
});

