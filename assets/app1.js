$ ( document ).ready(function() {

    const FPS = 30;

    $(".se-pre-con").fadeOut("slow");

    //to load haarcascade file
    let request = new XMLHttpRequest();
    let cascadeFile = "/assets/haarcascade_frontalface_default.xml";
    request.open('GET', cascadeFile, true);
    request.responseType = 'arraybuffer';
    request.send();
    request.onload = function(ev) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let data = new Uint8Array(request.response);
                //console.log(data);
                cv.FS_createDataFile('/', "haarcascade_frontalface_default.xml", data, true, false, false);
            }
        }
    };

    cv['onRuntimeInitialized']=()=>{

        let mat = new cv.Mat();
        //console.log(mat.size());
        mat.delete();

        let video = document.getElementById("videoInput"); // video is the id of video tag
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred! " + err);
            });

        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
        let gray = new cv.Mat();
        let faces = new cv.RectVector();
        let classifier = new cv.CascadeClassifier();
        
        // load pre-trained classifiers
        classifier.load('haarcascade_frontalface_default.xml');
        
        function processVideo() {
            let begin = Date.now();
            // start processing.
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            // detect faces.
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
            // draw faces.
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                if (face.width > 100 && face.height > 100) {
                    cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
                    cv.imshow('faceOutput', dst);
                    let faceOutput = document.getElementById("faceOutput");
                    var dataURL = faceOutput.toDataURL();
                    //console.log(dataURL);
                    src.delete();
                    dst.delete();
                    gray.delete();
                    faces.delete();
                    classifier.delete();

                    sessionStorage.setItem("faceToDetect", dataURL);
                    window.location.replace("hello.html");
                    return;
                }
            }
            cv.imshow('canvasOutput', dst);
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
        // schedule first one.
        setTimeout(processVideo, 0);

    };
});