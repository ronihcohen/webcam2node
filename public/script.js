(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    document.getElementById('capture').addEventListener("click", capture);
    var canvas = document.getElementById('canvas');

    function capture(){
        console.log('Capturing an image.');
        canvas.getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function(blob) {
            var form = new FormData();

            form.append('file', blob);
            form.append('msg', document.getElementById('msg').value);

            postAjax('/capture', form, 'POST', function(data){ console.log(data); });
        },'image/png');

        setTimeout(function(){ genGallery(); }, 500);

    }

    function genGallery(){
        var gallery = document.getElementById('gallery');
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild);
        }
        postAjax('/list', null, 'get', function(data){
            var imgList = JSON.parse(data);
            imgList.forEach(function(imgUrl){
                var img = document.createElement('img');
                img.src = 'uploads/'+imgUrl.file
                img.alt = imgUrl.msg;
                gallery.appendChild(img);
            });

        });
    };

    genGallery();


    var constraints = {
        video: true
    };

    function errorHandler(err){
        console.log(err);
    }

    var video = document.getElementById("preview");
    navigator.getUserMedia(constraints, function (stream) {
        video.src = URL.createObjectURL(stream);
    }, errorHandler);

    function postAjax(url, data, method, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open(method, url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        };
        xhr.send(data);
        return xhr;
    }
})();