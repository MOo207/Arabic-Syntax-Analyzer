$('#document').ready(function () {
    console.log('ready');

    // $(".dropdown-menu a").click(function(){
    //   const id = this.id;
    //   console.log(id);
    // });

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
      console.log('submitted');
    });

    function checkFile(file) {
      console.log(file);
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