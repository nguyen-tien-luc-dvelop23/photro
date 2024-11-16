var front_app = front_app || {};
front_app = {
	body: $(document.body),
    Window: $(window),
    is_requesting: false,
    content_changed:false,
    validatePhone: function(phone){
        var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return phoneRe.test(phone);
    },
    user:{
        userLogin: function () {
            $('.js-login-form').on('submit', function (e) {
                e.preventDefault();
                var _self = $(this);
                var btn_submit = _self.find('button[type="submit"]');
                var btn_submit_text = btn_submit.html();
                btn_submit.html('Đang xử lý...');

                $.ajax({
                    url: base_url + '/user/login',
                    data: $('.js-login-form').serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success:function(){
                        btn_submit.html(btn_submit_text);
                    }
                });
            });

            $('.js-login-form-popup').on('submit', function (e) {
                e.preventDefault();
                var _self = $(this);
                var btn_submit = _self.find('button[type="submit"]');
                var btn_submit_text = btn_submit.html();
                btn_submit.html('Đang xử lý...');

                $.ajax({
                    url: base_url + '/user/login',
                    data: $('.js-login-form-popup').serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success:function(){
                        btn_submit.html(btn_submit_text);
                    }
                });
            });
        },
        userRegister: function () {
            $('.js-register-form').on('submit', function (e) {
                e.preventDefault();
                var _self = $(this);
                var btn_submit = _self.find('button[type="submit"]');
                var btn_submit_text = btn_submit.html();
                btn_submit.html('Đang xử lý...');
                $.ajax({
                    url: base_url + '/user/register',
                    data: $('.js-register-form').serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success:function(){
                        btn_submit.html(btn_submit_text);
                    }
                });
            });

            $('.js-register-form-popup').on('submit', function (e) {
                e.preventDefault();
                var _self = $(this);
                var btn_submit = _self.find('button[type="submit"]');
                var btn_submit_text = btn_submit.html();
                btn_submit.html('Đang xử lý...');

                $.ajax({
                    url: base_url + '/user/register',
                    data: $('.js-register-form-popup').serialize(),
                    type: 'POST',
                    dataType: 'json',
                    success:function(){
                    	btn_submit.html(btn_submit_text);
                    }
                });
            });
        },
        forgotPassword: function () {
            var action_url, phone;

            // send email/sdt để lấy mã xác nhận
            $('.js-forget-password-first-step').on('submit', function (e) {
                e.preventDefault();

                var _self = $(this);
                action_url = _self.attr('data-action');
                phone = _self.find('.js-input-phone-or-email').val();
                _self.find('.js-forgot-password-next-step').html('Đang xử lý...');
                var data_next_step = _self.find('.js-forgot-password-next-step').attr('data-next-step');

                $.ajax({
                    url: base_api_url+ '/user/send-token',
                    data: {
                        phone: phone,
                        action:'forget_password'
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.data_code == 200) {
                            $('.js-forgot-password-step.active').addClass('deactive');
                            $('.js-forgot-password-step.step_' + data_next_step).find('.js-alert-message').html(data.message);
                            setTimeout(function () {
                                $('.js-forgot-password-step').removeClass('active');
                                $('.js-forgot-password-step.step_' + data_next_step).addClass(
                                    'active'
                                );
                            }, 100);
                        }
                    },
                    error: function(res){
                        $('.js-forgot-password-step.active').addClass('deactive');
                        $('.js-forgot-password-step.step_' + data_next_step).find('.js-alert-message').html('');
                        setTimeout(function () {
                            $('.js-forgot-password-step').removeClass('active');
                            $('.js-forgot-password-step.step_' + data_next_step).addClass(
                                'active'
                            );
                        }, 100);
                        
                        Swal.fire({
                            title: 'Lỗi',
                            html: 'Bạn gặp khó khăn trong việc nhận mã xác nhận. Bạn vui lòng liên hệ SĐT/Zalo: 0909 316 890 để chúng tôi giúp bạn.',
                            type: 'error',
                            timer: 0,
                            showConfirmButton: true
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    }
                });
            });

            // verify mã xác nhận đúng hay không
            $('.js-forget-password-second-step').on('submit', function (e) {
                e.preventDefault();

                var _self = $(this);
                var verify_code = _self.find('.js-input-verify-code').val();
                var data_next_step = _self
                    .find('.js-forgot-password-next-step')
                    .attr('data-next-step');
                $.ajax({
                    url: base_api_url+ '/user/verify-token',
                    data: {
                        verify_code: verify_code,
                        phone_or_email: phone,
                        action:'forget_password'
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.data_code == 200) {
                            $('.js-forgot-password-step.active').addClass('deactive');
                            setTimeout(function () {
                                $('.js-forgot-password-step').removeClass('active');
                                $('.js-forgot-password-step.step_' + data_next_step).addClass('active');
                            }, 100);
                        }
                    }
                });
            });

            $('.js-forget-password-third-step').on('submit', function (e) {
                e.preventDefault();

                var _self = $(this);
                var password = _self.find('.js-newpassword').val();
                var cf_password = _self.find('.js-confirm-newpassword').val();
                var verify_code = $('.js-input-verify-code').val();
                if (password != cf_password) {
                    // alert('Mật khẩu xác nhận không đúng');
                    Swal.fire(
                        'Thông báo!',
                        'Mật khẩu xác nhận không đúng',
                        'error'
                    );
                    return;
                }
                var data_next_step = _self.find('.js-forgot-password-next-step').attr('data-next-step');
                $.ajax({
                    url: base_api_url+'/user/update/password',
                    data: {
                        verify_code: verify_code,
                        password: password,
                        cf_password: cf_password,
                        phone_or_email: phone
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.data_code == 200) {
                            $('.js-forgot-password-step.active').addClass('deactive');
                            setTimeout(function () {
                                $('.js-forgot-password-step').removeClass('active');
                                $('.js-forgot-password-step.step_' + data_next_step).addClass('active');
                            }, 100);
                        }
                    }
                });
            });

            // gửi lại mã xác nhận trường hợp không nhận được, hay lỡ xóa hay sao đó
            $('.js-btn-resend-token').on('click', function (e) {
                e.preventDefault();

                var $btn = $(this).button('loading');
                // business logic...
                $.ajax({
                    url: action_url,
                    data: {
                        phone_or_email: phone_or_email,
                        resend: 1
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.code == 200) {
                            $btn.button('reset');
                        }
                    }
                });
            });
        },
        verifyAccount: function () {
            var phone_number;

            $('.js-btn-get-verify-code').on('click', function (e) {
                e.preventDefault();

                if(front_app.is_requesting) return;
                front_app.is_requesting = true;
                var _self = $(this);
                phone_number = $('.js-input-phone').val();
                var data_action_url = _self.attr('data-action-url');

                if (!phone_number || !front_app.validatePhone(phone_number)) {
                    // toastr.error('Vui lòng nhập đúng Format số điện thoại: Vd 0981234567 hoặc 012341234567', 'Lỗi');
                    Swal.fire(
                        'Lỗi!',
                        'Vui lòng nhập đúng Format số điện thoại: Vd 0981234567 hoặc 012341234567',
                        'error'
                    );
                    return;
                }

                $.ajax({
                    url: data_action_url,
                    data: {
                        phone: phone_number,
                        action: 'verify'
                    },
                    type: 'POST',
                    dataType: 'json',
                    success:function(res){
                        front_app.is_requesting = false;
                    },
                    error:function(res){
                        front_app.is_requesting = false;
                    }
                });
            });

            $('.js-btn-verify').on('click', function (e) {
                e.preventDefault();

                var _self = $(this);
                var data_action_url = _self.attr('data-action-url');
                var verify_code = $('.js-input-verify-code').val();
                var redirect_to = $('#redirect_to').val();
                phone_number = $('.js-input-phone').val();

                if (!verify_code) {
                    toastr.error('Bạn hãy nhập mã xác nhận để tiếp tục.', 'Lỗi');
                    return;
                }

                $.ajax({
                    url: data_action_url,
                    data: {
                        verify_code: verify_code,
                        phone_or_email: phone_number,
                        action: 'verify',
                        redirect_to: redirect_to
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        if (data.data_code == 200) {
                            
                        }
                    }
                });
            });

            var from = $('.js-verify-input-phone').attr('data-from-page');
            if(from == 'r' && phone_number != ''){
                $('.js-btn-get-verify-code').trigger('click');
            }
        },
        logout:function(){
            $('.js-header-control-user-login').on('click', '.js-user-logout', function(event){
                event.preventDefault();
                var _self = $(this);
                var logout_url = _self.attr('href');
                localStorage.removeItem('authenticated');
                localStorage.removeItem('verified');
                localStorage.removeItem('access_token');
                localStorage.removeItem('bds123.user_data');
                window.location.href = logout_url;
            });
        },
        reloadHtmlHeader: function () {
            
            if($('.js-reload-html-header').length == 0) return;
            var action_url = base_url + '/api/refresh/header';
    
            $.ajax({
                url: action_url,
                type: 'POST',
                dataType: 'json'
            });
        },
        init:function(){
            this.reloadHtmlHeader();
            this.userLogin();
            this.userRegister();
            this.forgotPassword();
            this.verifyAccount();
            this.logout();
        },
    },
    post:{
        findPackageById: function(package_id){
            for(var i = 0; i<window.packages.length; i++){
                if(packages[i].id == package_id){
                    return packages[i];
                }
            }
            return false;
        },
        renderGrandTotalHtml: function(options){
            var self = this;
            var package_id = options.package_id;
            var package_time = options.package_time;
            var package_total = options.package_total;
            var package_total_day = package_total;
            var current_grand_total = 0;
            var current_deadline_time = '';
            var package_price_text = '';
            var package_total_text = package_total_day + ' ngày';
            
            var package = self.findPackageById(package_id);
            current_grand_total = package.price * package_total;
            package_price_text = numberWithCommas(package.price)+' đ/ngày';
    
            if(package_time == 'week'){
                package_total_day = package_total*7;
                current_grand_total = package.price_week * package_total;
                package_price_text = numberWithCommas(package.price_week)+' đ/tuần';
                package_total_text = package_total + ' tuần ('+package_total_day+' ngày)';
            }
    
            if(package_time == 'month'){
                package_total_day = package_total*30;
                current_grand_total = package.price_month * package_total;
                package_price_text = numberWithCommas(package.price_month)+' đ/tháng';
                package_total_text = package_total + ' tháng ('+package_total_day+' ngày)';
            }
    
            package_total_day = parseInt(package_total_day);
            
            var deadline_date = new Date();
            current_deadline_time = deadline_date.addDays(package_total_day);
            var day = current_deadline_time.getDate();
            var month = current_deadline_time.getMonth()+1;
            var year = current_deadline_time.getFullYear();
            
            $('.js-wrapper-dang-tin .js-package-price').html(package_price_text);
            $('.js-wrapper-dang-tin .js-package-days').html(package_total_text);
            $('.js-wrapper-dang-tin .js-package-deadline').html(day+'/'+month+'/'+year);
            $('.js-wrapper-dang-tin .js-package-grand-total').html(numberWithCommas(current_grand_total) + 'đ');
        },
        submitFrontPost: function(){
            var self = this;

            $('.js-form-post-vip-submit').on('submit', function(e){
                e.preventDefault();
    
                if(self.is_requesting) return;
    
                var fd = new FormData();
                var other_data = $(this).serializeArray();
                $.each(other_data,function(key,input){
                    fd.append(input.name,input.value);
                });
    
                $.ajax({
                    url: get_district_ajax.ajaxurl,
                    data: fd,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    beforeSend: function(){
                        self.is_requesting = true;
                    },
                    success: function(data){
                        self.is_requesting = false;
                    },
                    error: function(){
                        self.is_requesting = false;
                    }
                });
            });
            
            $('#frm-dangtin').on('submit', function(e){
    
                e.preventDefault();
                var _self = $(this);
                var btn_submit = $(this).find('.js-btn-submit');
                var btn_submit_text = btn_submit.html();
    
                if(self.is_requesting) return;

                $.ajax({
                    url: base_api_url+'/create/post',
                    data: _self.serialize(),
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function(){
                        self.is_requesting = true;
                        btn_submit.html('Đang xử lý...');
                    },
                    success: function(data){
                        self.is_requesting = false;
                        btn_submit.html(btn_submit_text);
                    },
                    error: function(){
                        self.is_requesting = false;
                        btn_submit.html(btn_submit_text);
                    }
                });
    
            });
    
            $('#thoa_thuan').click(function(){
                if($(this).is(':checked')){
                    $('.js-gia-cho-thue').attr('readonly', true);
                    $('.js-gia-cho-thue').removeAttr('required');
                }else{
                    $('.js-gia-cho-thue').attr('required', true);
                    $('.js-gia-cho-thue').removeAttr('readonly');
                }
            });
        },
        uploadVersion3: function(){
        
            if ($('.js-upload-list-wrapper').length > 0) {
                $('.js-upload-list-wrapper').sortable();
            }
    
            function add_file(id, file){
                /* preparing image for preview */
                if (typeof FileReader !== 'undefined') {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var image_preview = e.target.result;
                        image_preview = e.target.result;
                        var template = '' +
                        '<div id="media_item_'+id+'" class="media_item js-media-item" data-id="" data-url="" data-file-name="'+file.name+'">' +
                            '<div class="media_item_preview">' +
                                '<div class="media_item_thumbail" style="background: url('+image_preview+') center no-repeat; background-size: cover;">' +                              
                                    '<img src="'+image_preview+'">' +
                                    '<input class="images_linked_id" type="hidden" value="" name="images_linked_ids[]"/>' + 
                                    '<input class="images_linked_path" type="hidden" value="" name="images_linked_paths[]"/>' + 
                                '</div><div class="media_item_action">'+
                                    /*'<label><input class="image_thumbnail" type="radio" value="" name="image_thumbnail"/> Hình đại diện</label>' + */
                                    '<a class="remove-selected" href="#delete" rel="'+file.name+'"><i class="fa fa-trash-o" aria-hidden="true"></i> Xóa hình này</a>'+
                                '</div>' +
                            '</div>' +
                            '<div class="progress">' +
                                '<div class="progress-bar progress-bar-success js-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 5%">'+
                                    '<span>5%</span>'+
                                '</div>'+
                            '</div>' +
                        '</div>';
    
                        $('.js-upload-list-wrapper').append(template);
                    };
    
                    reader.readAsDataURL(file);
                }
            }
            
            function update_file_status(id, status, message){
                $('#media_item_' + id).addClass(status);
            }
            
            function update_file_progress(id, percent){
                $('#media_item_' + id).find('.js-progress-bar').width(percent);
                $('#media_item_' + id).find('.js-progress-bar span').html(percent);
            }
    
            var _current_url = window.location.href;
            if($('.js-drag-and-drop-zone').length){
                $('.js-drag-and-drop-zone').dmUploader({
                    url: 'https://static123.com/api/upload',//get_district_ajax.ajaxurl,
                    dataType: 'json',
                    allowedTypes: 'image\/*',
                    extFilter: 'jpg;png;gif;jpeg;JPG;JPEG;PNG',
                    maxFileSize: 5000000,
                    extraData: {
                        'action':'preupload_file_v3',
                        'source':'phongtro123',
                        'source_url':_current_url
                    },
                    onInit: function(){
                        //console.log('initialized :)');
                    },
                    onBeforeUpload: function(id){
                        //console.log('Starting the upload of #' + id);
                        update_file_status(id, 'uploading', 'Uploading...');
        
                        $('.btn-update-tin').addClass('disabled');
                        $('.btn-dangtin-ngay').addClass('disabled');
                    },
                    onNewFile: function(id, file){
                        //console.log('New file added to queue #' + id);
                        add_file(id, file);
                        $('.js-nav-tabs a[href="#library_media"]').tab('show');
                    },
                    onComplete: function(){
                        //console.log('All pending tranfers finished');
                    },
                    onUploadProgress: function(id, percent){
                        var percentStr = percent + '%';
                        update_file_progress(id, percentStr);
                    },
                    onUploadSuccess: function(id, data){
                        
                        if(typeof data.image_id != 'undefined'){
                            $('#media_item_' + id).addClass('upload_done');
                            update_file_status(id, 'selected', 'Upload Complete');
                            update_file_progress(id, '100%');
        
                            // set lại value mới sau khi upload hình thành công
                            $('#media_item_'+id).find('img').attr('src', data.image_full_url);
                            $('#media_item_'+id).find('.images_linked_path').val(data.image_path);
                            $('#media_item_'+id).find('.images_linked_id').val(data.image_id);
                            $('#media_item_'+id).find('.image_thumbnail').val(data.image_id);
                        }else{
                            $('#media_item_' + id).remove();
                        }
                        
                        $('.btn-update-tin').removeClass('disabled');
                        $('.btn-dangtin-ngay').removeClass('disabled');
                    },
                    onUploadError: function(id, message){
                        //console.log('Failed to Upload file #' + id + ': ' + message);
                        update_file_status(id, 'error', message);
                        
                        $('.btn-update-tin').removeClass('disabled');
                        $('.btn-dangtin-ngay').removeClass('disabled');
        
                        $('#media_item_' + id).remove();
                    },
                    onFileSizeError: function(file){
                        alert('Lỗi, Không thể upload file \'' + file.name + '\' này, chỉ được phép upload file dưới 5mb. Cảm ơn.');
                    },
                    onFallbackMode: function(message){
                        alert('Browser not supported(do something else here!): ' + message);
                    }
                });
            }
        },
        dangTin2018: function(){
            var self = this;
            if(!window.packages || window.packages.length == 0) return;
            var current_package_vip_id = window.packages[0].id;
            var current_package_time = 'day';
            var current_package_total = 3;
    
            $('.js-choose-package-vip').on('change', function(){
                current_package_vip_id = $(this).val();
                if(current_package_vip_id == ''){
                    toastr.error('Bạn chưa chọn gói tin đăng', 'Thông báo');
                    return;
                }
                self.renderGrandTotalHtml({'package_id': current_package_vip_id, 'package_time': current_package_time, 'package_total': current_package_total});
            });
    
            $('.js-goi-thoi-gian').on('change', function(event){
                current_package_time = $(this).val();
                current_package_total = $('.js-wrap-dang-theo[data-by="'+current_package_time+'"] select').val();
    
                $('.js-wrap-dang-theo').addClass('hidden');
                $('.js-wrap-dang-theo[data-by="'+current_package_time+'"]').removeClass('hidden');
    
                self.renderGrandTotalHtml({'package_id': current_package_vip_id, 'package_time': current_package_time, 'package_total': current_package_total});
    
                $('.js-wrap-dang-theo[data-by="'+current_package_time+'"] select').on('change', function(){
                    current_package_total = $(this).val();
                    self.renderGrandTotalHtml({'package_id': current_package_vip_id, 'package_time': current_package_time, 'package_total': current_package_total});
                });
            });
            
            $('.js-wrap-dang-theo[data-by="'+current_package_time+'"] select').on('change', function(){
                current_package_total = $(this).val();
                self.renderGrandTotalHtml({'package_id': current_package_vip_id, 'package_time': current_package_time, 'package_total': current_package_total});
            });
    
        },
        postLikable: function () {
            $('.js-btn-save').on('click', function (e) {
                e.preventDefault();
    
                var _self = $(this);
                var post_id = $(this).attr('data-post-id');
                var status = 'saved';
                if (_self.hasClass('saved')) {
                    status = 'unsaved';
                }
    
                // không show loading
                window.show_loading = false;
    
                $.ajax({
                    url: base_url + '/api/post/save',
                    data: {
                        post_id: post_id,
                        action: status,
                        referer_url:window.location.href
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        $('.js-btn-save').each(function (index, el) {
                            if ($(el).attr('data-post-id') == post_id) {
                                $(el).find('span').html(data.button_text);
                                $(el).attr('data-original-title', data.button_text);
    
                                // add class save
                                if (status == 'saved') {
                                    $(el).addClass('saved');
                                } else {
                                    $(el).removeClass('saved');
                                    if(front_app.body.hasClass('page-post-saved') && $(el).closest('article').length){
                                        $(el).closest('article')
                                            .fadeOut(1000, function () {
                                                $(this).remove();
                                            });
                                    }
                                }
                            }
                        });
                    }
                });
            });
        },
        contentChange:function(){
            var self = this;
            //
            $('.js-frm-manage-post .js-title').donetyping(function(event){
                if($(this).val() == '') {
                    front_app.content_changed = false;
                    return;
                }
                front_app.content_changed = true;
            }, 250);

            $('.js-frm-manage-post .js-content').donetyping(function(event){
                if($(this).val() == '') {
                    front_app.content_changed = false;
                    return;
                }
                front_app.content_changed = true;
            }, 250);

        },
        preventBrowserClose: function(){
            window.onbeforeunload = function(event) {
                console.log(front_app.content_changed);
                if(front_app.content_changed){
                    event.preventDefault();
                    event.returnValue = 'Bạn có chắc muốn rời khỏi trang này?';
                    return 'Bạn có chắc muốn rời khỏi trang này?';
                }
                
            }
        },
        init: function(){
            this.submitFrontPost();
            this.uploadVersion3();
            this.dangTin2018();
            this.postLikable();
            this.contentChange();
            this.preventBrowserClose();
        }
    },
    payment:{
        order_id:0,
        method:'store',
        is_success:false,
        payoo: function(){
            var self = this;

            $('.js-btn-cancel-qrcode').on('click', function(event){
                event.preventDefault();

                var _self = $(this);
                var _button_text = _self.html();
                _self.html('Đang xử lí');

                $.ajax({
                    url: base_api_url+'/payoo/cancel/qrcode',
                    data: {order_id: self.order_id, status:'cancel'},
                    method: 'post',
                    type: 'json',
                    success: function(){
                        _self.html(_button_text);
                    }
                });
            });
            
        },
        momo: function(){
            var self = this;
        },
        checkPayooQRCode: function(){
            var self = this;

            if(self.order_id == 0) return;
            if(self.is_success) return;

            $.ajax({
                url: base_api_url+'/payoo/check/qrcode',
                data: {order_id: self.order_id},
                method: 'post',
                type: 'json',
                success:function(res){
                    if(res.success){
                        self.is_success = true;
                        return;
                    }
                    self.is_success = false;
                }
            });

            setTimeout(function(){
                self.checkPayooQRCode();
            }, 3000);
        },
        init:function(){
            this.payoo();
            this.momo();
        }
    },
    notification:{
		readNotification: function (){
			var self = this;
			$('.js-notification-item').on('click', '.js-read-notification', function(e){
				e.preventDefault();
                var _self = $(this);
				// nếu đọc rồi thì thôi ko mark gì nữa
				if(_self.hasClass('read')) return;

				var nof_id = _self.closest('.js-notification-item').attr('data-id');
				var action_url = '/api/notification/read';

				if(backend_app.is_requesting) return;
				backend_app.is_requesting = true;

				$.ajax({
					url: action_url,
					data: {'nof_id': nof_id},
					type: 'POST',
					dataType: 'json',
					success: function (response) {
						backend_app.is_requesting = false;
                        _self.remove();
                        _self.closest('.js-notification-item').addClass('read');
					},
					error: function (response) {
						backend_app.is_requesting = false;
					}
				});
			});
		},
        deleteNotification: function (){
			var self = this;
			$('.js-notification-item').on('click', '.js-delete-notification', function(e){
				e.preventDefault();
                var _self = $(this);
                Swal.fire({
                    title: 'Thông báo!',
                    text: 'Bạn chắc chắn muốn xóa thông báo này?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Vâng, Xóa nó!',
                    cancelButtonText: 'Không'
                }).then((result) => {
                    if (result.value) {
                        // nếu đọc rồi thì thôi ko mark gì nữa
                        var nof_id = _self.closest('.js-notification-item').attr('data-id');
                        var action_url = '/api/notification/delete';

                        if(backend_app.is_requesting) return;
                        backend_app.is_requesting = true;

                        $.ajax({
                            url: action_url,
                            data: {'nof_id': nof_id},
                            type: 'POST',
                            dataType: 'json',
                            success: function (response) {
                                backend_app.is_requesting = false;
                                _self.closest('.js-notification-item').remove();
                            },
                            error: function (response) {
                                backend_app.is_requesting = false;
                            }
                        });
                    }
                });

			});
		},
		notifications: function(action){
			action = action || 'add';
			var notificationsWrapper   = $('.js-notifications');
			var notificationsCount     = parseInt(notificationsWrapper.find('.js-number').text());

			if(action == 'add'){
				notificationsCount += 1;
			}
			if(action == 'read'){
				notificationsCount -= 1;
			}
			notificationsWrapper.find('.js-number').text(notificationsCount);


		},
		init:function(){
			this.notifications();
			this.readNotification();
			this.deleteNotification();
		}
	},
    calculatorDiscount: function(amount){
		var percent = 0;
        if($('.js-promotion-payment-daily').length){
			if(amount >= 100000 && amount < 1000000){
				percent = 0.1;
			}
			if(amount >= 1000000 && amount<2000000){
				percent = 0.2;
			}
			if(amount>=2000000){
				percent = 0.25;
			}
		}
		if($('.js-promotion-payment').length){
			if(amount >= 100000 && amount < 500000){
				percent = 0.15;
			}
			if(amount >= 500000 && amount<1000000){
				percent = 0.2;
			}
			if(amount>=1000000){
				percent = 0.3;
			}
		}
		if($('.js-promotion-payment-new-user').length){
			if(amount>=100000){
				percent = 0.5;
			}
		}

		return {'amount':  parseFloat(amount) + parseFloat(amount * percent), 'percent': percent};
	},
    layoutFront: function () {
        var self = this;

        // $('.js-btn-group-price input[type="radio"]').change(function(){
        //     var number = $(this).val();
        //     var current_price = number.replace(/,/g,'');

        //     var number_text = docso(current_price) + ' đồng';

		// 	$(this).closest('.js-form-submit-data').find('.js-price').val(parseFloat(number).formatDot());
		// 	$(this).closest('.js-form-submit-data').find('.js-price-text').html(number_text);
        // });
        
        $('.js-price').donetyping(function(){

            var current_price = $(this).val().replace(/\,/g,'');
            current_price = current_price.replace(/\./g,'');

            if(!current_price || current_price == '') {
                $(this).closest('.js-price-wrapper').find('.js-price-text').addClass('hidden');
                $(this).closest('.js-form-submit-data').find('.js-btn-group-price input[type="radio"]:first').prop('checked', false);
                return;
            }

            var number_text = docso(current_price) + ' đồng';
            $(this).val(parseFloat(current_price).formatDot());

            $(this).closest('.js-price-wrapper').find('.js-price-text').removeClass('hidden');
            $(this).closest('.js-price-wrapper').find('.js-price-text').html(number_text);
            $(this).closest('.js-form-submit-data').find('.js-btn-group-price input[type="radio"]').prop('checked', false);

			$('.js-btn-group-price .js-btn-price').removeClass('active');

			var cal_discount = self.calculatorDiscount(current_price);
			var discount = parseFloat(cal_discount.amount) - parseFloat(current_price);
			var account_blance_total = parseFloat(window.account_balance_number) + parseFloat(cal_discount.amount);
			// $('.js-payment-discount').html((cal_discount.percent*100)+'% ('+parseFloat(discount).formatDot()+'₫)');
			$('.js-payment-discount').html('+'+parseFloat(discount).formatDot()+'₫');
			$('.js-payment-total').html(parseFloat(cal_discount.amount).formatDot()+'₫');
			$('.js-account-balance').html(parseFloat(account_blance_total).formatDot()+'₫');
            $('.js-price-add').html(parseFloat(current_price).formatDot()+'₫');
        }, 50);

        if (typeof ClipboardJS !== 'undefined') {
			if($('.js-btn-copy').length){
				var copylink_clipboard = new ClipboardJS('.js-btn-copy');
				copylink_clipboard.on('success', function (e) {
					$(e.trigger).addClass('active btn-primary').removeClass('btn-secondary');
					setTimeout(function () {
						$(e.trigger).removeClass('active btn-primary').addClass('btn-secondary');
					}, 1000);

				});
			}
        }
        
        $('.js_btn_menu:not(.open)').on('click', function () {
            $(this).toggleClass('open');
            front_app.body.toggleClass('menu_mobile_opening');
            $('#webpage').addClass('mm-slideout');
            setTimeout(function () {
                front_app.body.toggleClass('menu_mobile_open_done');
            }, 300);
        });
        
        $('.panel-backdrop').on('click', function () {
            front_app.body.removeClass('menu_mobile_opening');
            front_app.body.removeClass('menu_mobile_open_done');
            $('#mn_icon').removeClass('open');
        });

        $('.js-btn-menu').on('click', function(event){
            front_app.body.toggleClass('active-menu-mobile');
            event.stopPropagation();
        })
        $('.js-panel-backdrop').on('click', function() {
            front_app.body.removeClass('active-menu-mobile');
        });
    
        $('.js-scroll-top').on('click', function (e) {
            $('html,body').animate({ scrollTop: 0 }, 'fast');
        });

        $('.number, .js-number').donetyping(function(){

            $('.js-btn-group-price').find('label').removeClass('active');
            $('.js-btn-group-price').find('input[type="radio"]').prop('checked');
                
            var current_price = $(this).val().replace(/,/g,'');
            var number_text = docso(current_price) + ' đồng';
            
            var donvi = $('.js-unit').val();
                
            var current_price = $(this).val().replace(/,/g,'');
            var number_text = docso(current_price) + ' đồng/tháng';
            if(donvi == 1){
                number_text = docso(current_price) + ' đồng/m2/tháng';
            }
            
            $('.js-number-text').html(number_text);

        });

        $('.js-btn-group-price .js-btn-price').on('click', function(e){
            var number = $(this).find('input').val();
            var current_price = number.replace(/\,/g,'');
            current_price = current_price.replace(/\./g,'');
            var number_text = docso(current_price) + ' đồng';

			$(this).closest('.js-form-submit-data').find('.js-price').val(parseFloat(number).formatDot());
			$(this).closest('.js-form-submit-data').find('.js-price-text').removeClass('hidden');
			$(this).closest('.js-form-submit-data').find('.js-price-text').html(number_text);
            $(this).find('input[type="radio"]').prop('checked', true);
            
			$('.js-btn-group-price .js-btn-price').removeClass('active');
			$(this).closest('.js-btn-price').addClass('active');

			var cal_discount = self.calculatorDiscount(current_price);
			var discount = parseFloat(cal_discount.amount) - parseFloat(current_price);
			var account_blance_total = parseFloat(window.account_balance_number) + parseFloat(cal_discount.amount);
			// $('.js-payment-discount').html((cal_discount.percent*100)+'% ('+parseFloat(discount).formatDot()+'₫)');
			$('.js-payment-discount').html('+'+parseFloat(discount).formatDot()+'₫');
			$('.js-payment-total').html(parseFloat(cal_discount.amount).formatDot()+'₫');
			$('.js-account-balance').html(parseFloat(account_blance_total).formatDot()+'₫');
            $('.js-price-add').html(parseFloat(current_price).formatDot()+'₫');
		});
        
        if ($.fn.select2) {
            $('.js_select2_room_type').select2({
                minimumResultsForSearch: Infinity
            });

            $('.js_select2_price').select2({
                minimumResultsForSearch: Infinity
            });
            
            $('.js_select2_acreage').select2({
                minimumResultsForSearch: Infinity
            });
            
            $('.js_select2_duongpho').select2();
        }

        $('.js-gia-cho-thue').keypress(function(event) {
            if(event.which == 45 || event.which == 189){
                event.preventDefault();
            }
        });

        $('#dientich').keypress(function(event) {
            if (event.which == 45 || event.which == 189){
                event.preventDefault();
            }
        });

        $(window).scroll(function(){
            if ($(this).scrollTop() > 400) {
                $('.scrollToTop').fadeIn();
            } else {
                $('.scrollToTop').fadeOut();
            }
        });
    
        if(typeof tinymce !== 'undefined'){
            tinymce.init({
                selector: 'textarea.editor',
                height: 300,
                theme: 'modern',
                entity_encoding: 'raw',
                plugins: [
                    'image imagetools',
                  //'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                  //'searchreplace wordcount visualblocks visualchars code fullscreen',
                  //'insertdatetime media nonbreaking save table contextmenu directionality',
                  //'emoticons template paste textcolor colorpicker textpattern imagetools'
                  'autolink link paste',
                  'code'
                ],
                toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink image',
                toolbar2: 'print preview media | forecolor backcolor emoticons',
                image_advtab: true,
                paste_auto_cleanup_on_paste : true,
                paste_remove_spans: true,
                paste_remove_styles: true,
                paste_strip_class_attributes: true,
                paste_remove_styles_if_webkit: true,
                paste_retain_style_properties : '',
                paste_preprocess: function(plugin, args) {
                    var re = /<a\s.*?href=["']([^"']*?[^"']*?)[^>]*>(.*?)<\/a>/g;
                    var subst = '$2';
                    args.content = args.content.replace(re, subst);
    
                    var whitelist = 'p,span,b,strong,i,em,h3,h4,h5,h6,ul,li,ol,img,div';
                    var stripped = $('<div>' + args.content + '</div>');
    
                    var els = stripped.find('*').not(whitelist);
                    for (var i = els.length - 1; i >= 0; i--) {
                        var e = els[i];
                        $(e).replaceWith(e.innerHTML);
                    }
                    // Strip all class and id attributes
                    stripped.find('*').removeAttr('id').removeAttr('class');
                    stripped.children('div').each(function(e, el) {
                        $(el).replaceWith( $('<p />', {html: $(this).html()}) );
                    });
                    // Return the clean HTML
                    args.content = stripped.html();
                },
                templates: [
                  { title: 'Test template 1', content: 'Test 1' },
                  { title: 'Test template 2', content: 'Test 2' }
                ],
                setup: function (editor) {
                    editor.on('change', function () {
                        editor.save();
                    });
                },
                content_css:base_url+'/css/custom.mce.css',
                image_caption: true,
                convert_urls:true,
                relative_urls:false,
                remove_script_host:false,
            });
        }

        if(typeof Swiper !== 'undefined'){
            
            new Swiper('.js-post-media-swiper', {
                // Optional parameters
                loop: true,
              
                // If we need pagination
                pagination: {
                  el: '.swiper-pagination',
                },
              
                // Navigation arrows
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
              
            });
            
            new Swiper('.images-swiper-container', {
            
                loop: true,
              
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
        
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
              
            });

        }
    },
    processSubmitFormFront: function () {
        var self = this;

        $('.js-form-submit-data').each(function(index, el){
            $(el).validate({
                submitHandler: function(form, event) {
                    event.preventDefault();
    
                    front_app.content_changed = false;
                    if (self.is_requesting) return;
                    self.is_requesting = true;
    
                    var _self = $(form);
                    var action_url = _self.attr('data-action-url');
                    if (!action_url) return;
    
                    var html_button = _self.find('.js-btn-hoan-tat').html();
                    var formData = new FormData(form);
    
                    $.ajax({
                        url: action_url,
                        data: formData,
                        processData: false,
                        contentType: false, 
                        type: 'POST',
                        dataType: 'json',
                        beforeSend: function () {
                            _self.find('.js-btn-hoan-tat').text('Đang xử lí...');
                        },
                        success: function (data) {
                            _self.find('.js-btn-hoan-tat').html(html_button);
                            self.is_requesting = false;
                        },
                        error: function (data) {
                            _self.find('.js-btn-hoan-tat').html(html_button);
                            self.is_requesting = false;
                        }
                    });
                    //form.submit();
                },
                errorPlacement: function($error, $element) {
                    var input_group = $element.closest('.input-group');
                    var el_parent = input_group.length > 0 ? input_group.parent() : $element.parent();
                    $error.appendTo(el_parent);
                }
            });
        });

	},
    displayPriceText: function(){
		$('.js-gia-cho-thue').donetyping(function(){
            
            var current_price = $(this).val().replace(/,/g,'');
            current_price = current_price.replace(/\./g,'');
            current_price = current_price.replace(/[^\d]/,'');

            if(current_price && current_price.length > 0 && !isNaN(current_price)){
                $(this).val(parseFloat(current_price).formatDot());
            }else{
                $(this).val('');
            }

            var donvi = $('.js-unit').val();                
            var number_text = docso(current_price) + ' đồng/tháng';
            if(donvi == 1){
                number_text = docso(current_price) + ' đồng/m2/tháng';
            }
            $('.js-number-text').html(number_text);
        }, 50);
        
        var current_price = $('.js-gia-cho-thue').val();
        if(current_price && current_price.length > 0 && !isNaN(current_price)){
            current_price = current_price.replace(/,/g,'');
            current_price = current_price.replace(/\./g,'');
            current_price = current_price.replace(/[^\d]/,'');

            $('.js-gia-cho-thue').val(parseFloat(current_price).formatDot());

            var donvi = $('.js-unit').val();                
            var number_text = docso(current_price) + ' đồng/tháng';
            if(donvi == 1){
                number_text = docso(current_price) + ' đồng/m2/tháng';
            }
            $('.js-number-text').html(number_text);
        }

	},
    fixFacebookLogin: function () {
		if (!window.location.hash || window.location.hash !== '#_=_')
			return;
		if (window.history && window.history.replaceState)
			return window.history.replaceState('', document.title, window.location.pathname + window.location.search);
		// Prevent scrolling by storing the page's current scroll offset
		var scroll = {
			top: document.body.scrollTop,
			left: document.body.scrollLeft
		};
		window.location.hash = "";
		// Restore the scroll offset, should be flicker free
		document.body.scrollTop = scroll.top;
		document.body.scrollLeft = scroll.left;
    },
    reloadPostSaved: function () {
        if($('.js-btn-save').length == 0) return;

		var data_post_ids = [];
		$('.js-btn-save').each(function (index, el) {
			var post_id = $(el).attr("data-post-id");
			if (data_post_ids.indexOf(post_id) < 0) {
				data_post_ids.push(post_id);
			}
		});

		$.ajax({
			url: base_url + '/api/post/check/save',
			data: {
				data_post_ids: data_post_ids
			},
			type: 'POST',
			dataType: 'json'
		});
	},
    lazyLoadImage: function () {
		if (typeof lozad === 'function') {
			this.observer = lozad('.lazy', {
				rootMargin: '10px 0px', // syntax similar to that of CSS Margin
				threshold: 0.1,
				loaded: function (element) {
					element.classList.add('lazy_done');
					element.classList.remove('lazy');
				}
			});
			this.observer.observe();
		}
    },
    removeChooseImage: function () {
        $('.js-remove-one-image').on('click', function (event) {
            event.preventDefault();
            var _self = $(this);
            Swal.fire({
                title: 'Bạn chắc chứ?',
                text: "Bạn chắc muốn xóa hình này chứ",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK, Xóa nó!',
                cancelButtonText: 'Đóng'
            }).then(function () {
                _self.closest('.js-one-image-wrapper').removeClass('upload_done');
                _self.closest('.js-one-image-wrapper').find('.js-one-image-preview').css({'background-image':'url(/images/default-user.png)'});
                _self.closest('.js-one-image-wrapper').find('.js-input-value').val('');
                
                Swal.fire(
                    'Deleted!',
                    'Hình đã xóa thành công.',
                    'success'
                );
            });

        });
    },
    oneMediaUpload: function(){
        if (!$.fn.dmUploader) return;

        $('.js-one-image-wrapper').dmUploader({
            //url: base_url + '/image/uploadimage',
            url: "https://static123.com/api/upload",
            dataType: 'json',
            // allowedTypes: allowed_types,
            extFilter: ['jpg','png','jpeg','JPG','JPEG','PNG'],
            maxFileSize: 150000000,
            extraData: {
                'source':'phongtro123',
                'source_url':window.location.href,
                'user_id': typeof current_user_id !== 'undefined' ? current_user_id : 1,
                'from': ''
            },
            onInit: function () {

            },
            onBeforeUpload: function (id) {
            },
            onNewFile:function(id, file){
                if (typeof FileReader !== "undefined") {

                    var reader = new FileReader();
                    reader.onload = function (e) {

                        var image_preview = e.target.result;
                        var thumbnail_class = 'image';

                        image_preview = e.target.result;

                        $('.js-one-image-wrapper').find('.js-one-image-preview').css({'background-image':'url('+image_preview+')'});
                    };

                    reader.readAsDataURL(file);
                }
            },
            onUploadProgress: function (id, percent) {
                var percentStr = percent + '%';
            },
            onUploadSuccess: function (id, data) {
                $('.js-one-image-wrapper').find('.js-one-image-preview').css({'background-image':'url('+data.full_image_900_url+')'});
                $('.js-one-image-wrapper').find('.js-input-value').val(data.image_path);
                $('.js-one-image-wrapper').addClass('upload_done');
            },
            onFileTypeError: function (file) {
                console.log('File \'' + file.name + '\' cannot be added: must be an image');
            },
            onFileSizeError: function (file) {
                alert('File \'' + file.name + '\' không thể upload: tối đa 50mb/file');
            },
            onFileExtError: function (file) {
                alert('File \'' + file.name + '\' không đúng định dạng file');
            },
            onFallbackMode: function (message) {
                alert('Browser not supported(do something else here!): ' + message);
            }
        });
    },
    initWithWindow: function () {
		this.lazyLoadImage();
	},
    init: function () {
		this.layoutFront();
		this.fixFacebookLogin();
        this.displayPriceText();
        this.processSubmitFormFront();
        this.reloadPostSaved();
        this.oneMediaUpload();
        this.removeChooseImage();
        this.user.init();
        this.post.init();
        /* init payment */
        this.payment.init();
        this.notification.init();
	}
};

$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $('meta[name="_token"]').attr("content")
    }
});

$(document).ajaxComplete(function(event, xhr, settings){
    // reinit facebook 
    if(!xhr.responseText) return;
    var response = $.parseJSON(xhr.responseText);
    if(!response) return;
    
    if(response.code != 200){
        if(response.code == 500){
            var jsonData = response;
            for(var obj in jsonData){
                toastr.options.closeButton = true;    
                toastr.error(jsonData[obj][0], "Lỗi");    
            }

            return;
        }
    }
    if(typeof response.action == 'undefined' || response.action == '')return;

    $.each(response.action.trim().split(' '), function(index, action){
        var timeout = response.delay || response.action.trim().split(' ').length > 2 ? 3000 : 2000;
        if(action == 'toastr'){
            toastr.options = {
                "closeButton": true,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "6000"
            };

            if(response.command == 'success'){
                toastr.success(response.message, response.title);        
            }else if(response.command == 'info'){
                toastr.info(response.message, response.title);        
            }else if(response.command == 'waring'){
                toastr.warning(response.message, response.title);        
            }else if(response.command == 'error'){
                toastr.options.closeButton = true;    
                toastr.error(response.message, response.title);        
            }else{
                toastr.info(response.message, response.title);        
            }           
        }

        if(action == 'sweetalert'){
            Swal.fire({
                title: response.title,
                html: response.message,
                type: response.command,
                timer: 0,
                showConfirmButton: response.command == 'error' ? true : false
            });
        }

        if(action == 'redirect'){
            setTimeout(function () {
                window.location.href = response.link;
            }, timeout);
        }

        if (action == 'redirect_auth' || action == 'redirect_suddenly') {
            window.location.href = response.link;
        }
        
        if(action == 'redirect_delay'){
            setTimeout(function () {
                window.location.href = response.link;
            }, timeout);
        }

        if(action == 'reload'){    
            setTimeout(function () {
                window.location.reload();
            }, timeout);
        }

        if(action == 'khong_du_tien'){
            $('.js_thong_bao').addClass('hide');
            $('.js_loi_khong_du_tien').removeClass('hide');
            $('html, body').animate({scrollTop : 0}, 500);
        }
        
        if(action == 'dang_lai_thanh_cong'){
            $('.js_step_chon_loai_tin_dang').addClass('hide');
            $('.js_thong_bao').addClass('hide');
            $('.js_thanh_cong').removeClass('hide');
            $('html, body').animate({scrollTop : 0}, 500);
        }
        
        if(action == 'loi_ket_noi_server'){
            $('.js_thong_bao').addClass('hide');
            $('.js_bao_loi').removeClass('hide');
            if(response.message){
                $('.js_bao_loi').find('.js-message').html(response.message);
            }
            $('html, body').animate({scrollTop : 0}, 500);
        }

        if (action == 'replace_html') {
            $(response.js_class).html(response.html);
        }

        if (action == 'replace_array_html') {
            $.each(response.responses, function (key, html) {
                $(key).html(html);
            });
        }
        
        if(action == 'offline_store'){
            $('.js-payment-number').html(response.billingCode);
            $('.js-payment-at-store').find('.js-payment-step').addClass('hidden');
            $('.js-payment-step.step-2').removeClass('hidden');

            $('.js-date-expired').html(response.validate_time);
        }
        
        if(action == 'qrcode'){
            toastr.remove();
            if(!response.QRCodeLink){
                toastr.info('Thông báo', 'Có lỗi xảy ra. Vui lòng thử lại!'); 
                return;
            }
            $('.js-qr-code').find('img').attr('src', response.QRCodeLink);
            $('.js-payment-at-store').find('.js-payment-step').addClass('hidden');
            $('.js-payment-step.step-2').removeClass('hidden');

            front_app.payment.order_id = response.order_no;
            $('.js-time-expired').attr('data-time', response.validate_time)
            .countdown(response.validate_time)
            .on("update.countdown", function(event) {
                var format = "%H:%M:%S";
                $(this).html(event.strftime(format));
                if(event.offset.totalSeconds % 5 == 0){
                    front_app.payment.checkPayooQRCode();
                }
            })
            .on('finish.countdown', function(event){
                /* #TODO timeout*/
                $.ajax({
                    url: base_api_url+'/payoo/cancel/qrcode',
                    data: {order_id: response.order_no, status:'timeout'},
                    method: 'post',
                    type: 'json'
                });
            });
            
            /* #TODO timer check qrcode*/
            front_app.payment.checkPayooQRCode();
        }

        if(action == 'get_verify_code'){
            if($('.js-input-verify-wrap').length){
                $('.js-verify-step').addClass('hidden');
                $('.js-input-verify-wrap').removeClass('hidden');
                $('.js-input-verify-wrap').find('.js-alert-message').html(response.message);
            }
            $('.js-input-phone').attr('readonly', 'readonly').addClass('disabled');
            $('.js-btn-cap-nhat').removeAttr('disabled').removeClass('disabled');

            $('.js-resend .js-btn-get-verify-code').addClass('disabled').prop('disabled', true);
            var _time = new Date();
            var _second = 120;
            _time.setSeconds(_time.getSeconds() + _second);

            $('.js-btn-get-verify-code .js-time-expired').countdown(_time)
            .on('update.countdown', function(event) {
                _second--;
                $(this).html('('+_second+'s)');
            })
            .on('finish.countdown', function(event){
                // DONE
                $(this).html('');
                $('.js-resend .js-btn-get-verify-code').removeClass('disabled').removeAttr('disabled');
            });
        }

        if(action == 'insert_ads'){ 
            if(front_app.body.hasClass('page_tim_kiem')) return;
            if(front_app.body.hasClass('login')) return;
            if(front_app.body.hasClass('register')) return;

            $('.js-show-mobile-ads').html(
                '<!-- phongtro123com_300x250 -->'+
                '<ins class="adsbygoogle"'+
                    'style="display:inline-block;width:300px;height:250px"'+
                    'data-ad-client="ca-pub-1713423796088709"'+
                    'data-ad-slot="3276511865"></ins>'+
                '<script>'+
                    '(adsbygoogle = window.adsbygoogle || []).push({});'+
                '</script>'
            );
        }

        if (action == 'check_save_post') {
            var post_likeds = response.post_likeds;
            $.each(post_likeds, function (post_id, data) {
                $('.js-btn-save[data-post-id="' + post_id + '"]').attr('title', data.text);
                $('.js-btn-save[data-post-id="' + post_id + '"]').find('span').html(data.text);
                if (data.liked == 1) {
                    $('.js-btn-save[data-post-id="' + post_id + '"]').addClass('saved');
                }else{
                    $('.js-btn-save[data-post-id="' + post_id + '"]').removeClass('saved');
                }

            });
        }
    });
});

// khởi tạo với windows
var mangso = ['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
function dochangchuc(so,daydu){
    var chuoi = '';
    chuc = Math.floor(so/10);
    donvi = so%10;
    if (chuc>1) {
        chuoi = ' ' + mangso[chuc] + ' mươi';
        if (donvi==1) {
            chuoi += ' mốt';
        }
    } else if (chuc==1) {
        chuoi = ' mười';
        if (donvi==1) {
            chuoi += ' một';
        }
    } else if (daydu && donvi>0) {
        chuoi = ' lẻ';
    }
    if (donvi==5 && chuc>=1) {
        chuoi += ' lăm';
    } else if (donvi>1||(donvi==1&&chuc==0)) {
        chuoi += ' ' + mangso[ donvi ];
    }
    return chuoi;
}

function docblock(so,daydu){
    var chuoi = '';
    tram = Math.floor(so/100);
    so = so%100;
    if (daydu || tram>0) {
        chuoi = ' ' + mangso[tram] + ' trăm';
        chuoi += dochangchuc(so,true);
    } else {
        chuoi = dochangchuc(so,false);
    }
    return chuoi;
}

function dochangtrieu(so,daydu){
    var chuoi = '';
    trieu = Math.floor(so/1000000);
    so = so%1000000;
    if (trieu>0) {
        chuoi = docblock(trieu,daydu) + ' triệu';
        daydu = true;
    }
    nghin = Math.floor(so/1000);
    so = so%1000;
    if (nghin>0) {
        chuoi += docblock(nghin,daydu) + ' nghìn';
        daydu = true;
    }
    if (so>0) {
        chuoi += docblock(so,daydu);
    }
    return chuoi;
}

function docso(so){
    if (so==0) return mangso[0];
    var chuoi = '', hauto = '';
    do {
        ty = so%1000000000;
        so = Math.floor(so/1000000000);
        if (so>0) {
            chuoi = dochangtrieu(ty,true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty,false) + hauto + chuoi;
        }
        hauto = ' tỷ';
    } while (so>0);
    return chuoi;
}

function validatePhone(phone){
    var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRe.test(phone);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = 'expires=' + d.toGMTString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

Number.prototype.formatDot = function(n, x){
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
};

/* jshint expr: true */
(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 300;
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                if($el.is(':input')){
                    $el.on('keyup keypress',function(e){
                        if (e.type=='keyup' && e.keyCode!=8) return;
    
                        if (timeoutReference) clearTimeout(timeoutReference);
                        timeoutReference = setTimeout(function(){
                            doneTyping(el);
                        }, timeout);
                    }).on('blur',function(){
                        doneTyping(el);
                    });
                }
                
            });
        }
    });
})(jQuery);

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

front_app.initWithWindow();

window.recaptchaCallback = function(response){
    $('.js-form-submit-data').find('button[type="submit"]').prop('disabled', false);
    $('.js-form-submit-data').find('button[type="submit"]').removeClass('disabled');
};

// khởi tạo khi jquery load xong
jQuery(document).ready(function($) {

	var jBody = $(document.body);
    if (jBody.hasClass('loaded')) return;
    jBody.addClass('loaded');
    jBody.addClass('ready');

    front_app.init();
    
    $('.js-button-popup-support').on('click', function (e) {
        jBody.toggleClass('show-popup-support');
    });
});
