function validateForm() {
      var x=document.forms["contact_form"]["user_name"].value;
      if (x==null || x=="")
      {
        alert("Please enter a name, name must be filled out");
        return false;
      }
      var x=document.forms["contact_form"]["user_email"].value;
      var atpos=x.indexOf("@");
      var dotpos=x.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
      {
        alert("Please enter a valid e-mail address");
        return false;
      }
}