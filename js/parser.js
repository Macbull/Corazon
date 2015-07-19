function validate() {
        var name = document.getElementById("first_name").value;
        var aadhar = document.getElementById("aadhar").value;
        var mobile = document.getElementById("contact").value;
        $.ajax({
       type: "POST",
        url: "http://10.0.0.158:8000/api/patients/",
            contentType: "application/json",
         dataType: 'json',
       data:JSON.stringify({
           name:name,
           aadhar_number:aadhar,
           phone_number:mobile
       }),
       success: function() {
         alert('success');
       }
    });
        console.log(name, aadhar, mobile )

    }