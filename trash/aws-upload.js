// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');

// aws.config.update({
//   secretAccessKey: 'qBZG5Z5+BxfaXOVIcLTOdO0jRUluTn9nnU5yK+NX',
//   accessKeyId: 'AKIAJS34SC54Q73JFMCA',
//   region: 'us-east-1'
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'sanket-files',
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, 'testing-files/'+req.params.id.toString()+'.pdf')
//     }
//   })
// })

// module.exports = upload;


const AWS = require('aws-sdk');
const fs = require('fs');
const zlib = require('zlib'); // gzip compression



const AWS_ACCESS_KEY = 'AKIAJS34SC54Q73JFMCA';
const AWS_SECRET_KEY = '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';
AWS.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
AWS.config.region = 'us-east-1';

exports.multiparting = (req, res) => {
  const s3 = new AWS.S3();

  var file = req.files.file;
  var buffer = fs.readFileSync(file.path);

  var startTime = new Date();
  var partNum = 0;
  var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
  var numPartsLeft = Math.ceil(buffer.length / partSize);
  var maxUploadTries = 3;

  var multipartParams = {
    Bucket: 'sanket-files',
    Key: req.params.id.toString()+'.pdf',
    ContentType: file.type
  };

  var multipartMap = {
    Parts: []
  };

  console.log('Creating multipart upload for:', file.name);
  s3.createMultipartUpload(multipartParams, function(mpErr, multipart) {
    if (mpErr) return console.error('Error!', mpErr);
    console.log('Got upload ID', multipart.UploadId);

    for (var start = 0; start < buffer.length; start += partSize) {
      partNum++;
      var end = Math.min(start + partSize, buffer.length);
      var partParams = {
        Body: buffer.slice(start, end),
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        PartNumber: String(partNum),
        UploadId: multipart.UploadId
      };

      console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
      uploadPart(s3, multipart, partParams);
    }
  });

  function completeMultipartUpload(s3, doneParams) {
    s3.completeMultipartUpload(doneParams, function(err, data) {
      if (err) return console.error('An error occurred while completing multipart upload');
      var delta = (new Date() - startTime) / 1000;
      console.log('Completed upload in', delta, 'seconds');
      console.log('Final upload data:', data);
      return res.json(data);
    });
  }

  function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function(multiErr, mData) {
      console.log('started');
      if (multiErr) {
        console.log('Upload part error:', multiErr);

        if (tryNum < maxUploadTries) {
          console.log('Retrying upload of part: #', partParams.PartNumber);
          uploadPart(s3, multipart, partParams, tryNum + 1);
        } else {
          console.log('Failed uploading part: #', partParams.PartNumber);
        }
        // return;
      }

      multipartMap.Parts[this.request.params.PartNumber - 1] = {
        ETag: mData.ETag,
        PartNumber: Number(this.request.params.PartNumber)
      };
      console.log('Completed part', this.request.params.PartNumber);
      console.log('mData', mData);
      if (--numPartsLeft > 0) return; // complete only when all parts uploaded

      var doneParams = {
        Bucket: multipartParams.Bucket,
        Key: multipartParams.Key,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId
      };

      console.log('Completing upload...');
      completeMultipartUpload(s3, doneParams);
    }).on('httpUploadProgress', function(progress) {  console.log(Math.round(progress.loaded/progress.total*100)+ '% done') });
  }
};

{/* <script>
  $("form#step2").submit(function(e) {
    e.preventDefault();
    $('.material-details').css('display','block');
    $('.loader').css('visibility','visible');
    var formData = new FormData(this);
    $.ajax({
      url: window.location.pathname,
      type: 'POST',
      data: formData,
      success: function (data) {
          alert('Uploaded successfully!');
      },
      xhr: function(){
       var xhr = new window.XMLHttpRequest();
         // Handle progress
         //Upload progress
         console.log(xhr);
         xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        console.log(percentage.toString()+"%");
        console.log(xhr);
      }
    };
    xhr.onerror = function(e) {
      alert('An error occurred while submitting the form. Maybe your file is too big');
    };
   xhr.onload = function() {
      var file = xhr.responseText;
       $('div.progress div').css('width','0%');
       $('div.progress').hide();
      // showMsg("alert alert-success", "File uploaded successfully!"); 
      $('#myFile').val(''); 
      console.log("file uploaded successfully")   
    };
        return xhr;
      },
      cache: false,
      contentType: false,
      processData: false
    })
    .then((results) => {
      console.log(results);
      $('.loader').css('display','none');
      $('#pdfUrl').attr('value',results['Location'])
      console.log(results['Location']);
    })
    .catch((err) => console.log(err))
  });
</script> */}


{/* <div class="col-md-6 form-group">
  <div class="loader row" role="status">
    <div class="col-sm-4">
      <svg width="50px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-pacman" style="background: none;"><g ng-attr-style="display:{{config.showBean}}" style="display:block"><circle cx="57.669" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill=""><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1.4" begin="-0.938s" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1.4" begin="-0.938s" repeatCount="indefinite"></animate></circle><circle cx="78.069" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill=""><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1.4" begin="-0.46199999999999997s" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1.4" begin="-0.46199999999999997s" repeatCount="indefinite"></animate></circle><circle cx="37.869" cy="50" r="4" ng-attr-fill="{{config.c2}}" fill=""><animate attributeName="cx" calcMode="linear" values="95;35" keyTimes="0;1" dur="1.4" begin="0s" repeatCount="indefinite"></animate><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="1.4" begin="0s" repeatCount="indefinite"></animate></circle></g><g ng-attr-transform="translate({{config.showBeanOffset}} 0)" transform="translate(-15 0)"><path d="M50 50L20 50A30 30 0 0 0 80 50Z" ng-attr-fill="{{config.c1}}" fill="lightcoral" transform="rotate(4.30355 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1.4s" begin="0s" repeatCount="indefinite"></animateTransform></path><path d="M50 50L20 50A30 30 0 0 1 80 50Z" ng-attr-fill="{{config.c1}}" fill="lightcoral" transform="rotate(-4.30355 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-45 50 50;0 50 50" keyTimes="0;0.5;1" dur="1.4s" begin="0s" repeatCount="indefinite"></animateTransform></path></g></svg>
      Uploading...
    </div>
    <div class="col-sm-8">
        <h6>Please wait, your file is being uploaded.</h6>
        <h6>We will notify you, once it is done!</h6>
        <h6>Meanwhile create your syllabus below!</h6>
    </div>
  </div>
</div> 

.material-details{
  display: none;
}
.loader{
  visibility: hidden;
}


    <form action='/publisher/createMaterial' id="step2" method="POST" enctype="multipart/form-data">
      <div class="container">
        <div class="col-lg-9 general-form">
          <hr/>
            <div class="form-group">
              <button type="submit" id="next" class="btn btn-lg btn-primary">Upload</button>
            </div>
        </div>
      </div>
  </form>


*/}