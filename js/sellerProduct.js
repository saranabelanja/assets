//form message validation
$('.sku_required').hide();
//main image 
$("#input_image_main").change(function(){
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("input_image_main").files[0])
  oFReader.onload = function(oFREvent) {
    $("#image_main").attr({'src' : oFREvent.target.result, 'class' : 'image-preview'});
    $(".image_main_delete").show();
  };
})

// image additional image preview n delete
$("#input_additional_images1").change(function(){
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("input_additional_images1").files[0])
  oFReader.onload = function(oFREvent) {
    $("#additional_images1").attr({'src' : oFREvent.target.result, 'class' : 'image-preview'});
  };
})

$("#input_additional_images2").change(function(){
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("input_additional_images2").files[0])
  oFReader.onload = function(oFREvent) {
    $("#additional_images2").attr({'src' : oFREvent.target.result, 'class' : 'image-preview'});
  };
})

$("#input_additional_images3").change(function(){
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("input_additional_images3").files[0])
  oFReader.onload = function(oFREvent) {
    $("#additional_images3").attr({'src' : oFREvent.target.result, 'class' : 'image-preview'});
  };
})

$("#input_additional_images4").change(function(){
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("input_additional_images4").files[0])
  oFReader.onload = function(oFREvent) {
    $("#additional_images4").attr({'src' : oFREvent.target.result, 'class' : 'image-preview'});
  };
})

$(document).ready(function(){
    $('#product_sku').blur(function(){
        var url = base_url+"/seller/product/validtion/"+$(this).val();
        $.ajax({
            type : "GET",
            url  : url,
            success: function (data) {
                if(data == 'false'){
                  $(".action").attr('disabled','disabled');
                  $('.sku_required').show();
                  }else{
                  $('.action').prop("disabled", false);
                  $('.sku_required').hide();

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $(".action").attr('disabled','disabled'); 
                $('.sku_required').show();
                return false;
            }
        });
      })  
})

function addAgain(){
  console.log('again');
  $('#add_again').prop("disabled", false);
}
// $('#save-add').click(function(e){
//   e.preventDefault();
//   swal({
//         title: 'Simpan Data ?',
//         showCancelButton: true,
//         confirmButtonText: "Ya, simpan!",
//         closeOnConfirm: false
//     }, function (isConfirm) {
//       if (!isConfirm) return;
//       $.ajax({
//           type : "POST",
//           url  : base_url+"/seller/product/create",
//           data : $('#product-form').serialize(),
//           success: function () {
//               swal("Berhasil!", "produk berhasil di simpan !", "success");
//               location.reload();
//           },
//           error: function (xhr, ajaxOptions, thrownError) {
//               swal("Gagal Menyimpan!", "Coba kembali", "error");
//           }
//       });
//   });
// })
