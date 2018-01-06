$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
})

function getCartTable(){
  $.ajax({
      type: "GET",
      url: base_url+"/cart/cartTable",
      success: function (data) {
         $('#cartTable').html(data);
      }
  });
}

function remove_item_cart(rowid){
  $.ajax({
      type: "GET",
      url: base_url+"/cart/remove/"+rowid,
      success: function (data) {
          etCartTable();
          swal({title: "Sukses",text: "Data Berhasil di hapus",type: "success",timer: 3000});
      }
  });
}

function destroy_cart(rowid){
  $.ajax({
      type: "GET",
      url: base_url+"/cart/destroy/",
      success: function (data) {
          etCartTable();
          swal({title: "Sukses",text: "Data Berhasil di hapus",type: "success",timer: 3000});
      }
  });
}

getCartTable();