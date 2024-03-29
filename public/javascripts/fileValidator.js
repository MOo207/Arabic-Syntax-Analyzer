$('#document').ready(function () {

  $('select').on('invalid', function () {
    if(this.value == null){
    this.setCustomValidity('إختر من القائمة ');
    }
  });

  $('input[type=file]').on('invalid', function () {
    var file = this.files[0];
     
    if (checkFile(file) == 'emptyError')
      this.setCustomValidity('إختر ملفا لرفعه');
  });

  $('input[type=file]').on('change', function () {
    var file = this.files[0];
     
    if (checkFile(file) == 'extError')
      this.setCustomValidity('صيغة الملف ليست مدعومة بعد');
  });

  $('input[type=file]').on('input', function () {
    this.setCustomValidity('');
  });

  $('#form').on('submit', function () {
    // console.log('submitted');
  });

  function checkFile(file) {
     
    if (!file) {
      return 'emptyError';
    }
    var ext = file.name.match(/\.(.+)$/)[1];
    if (ext != 'txt') {
      return 'extError';
    }

    return 'success';
  }
});