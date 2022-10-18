document.getElementById("send").addEventListener("click", validateForm);
function validateForm() {
  //gets the name
  let name = document.getElementById("contact-name").value;
  //gets the email
  let email = document.getElementById("contact-email").value;
  //gets the message
  let message = document.getElementById("contact-message").value;

  //checks if all fields have been filled before sending message.
  if (name.trim() == "" || email.trim() == "" || message.trim() == "") {
    alert("all fields must be filled");
  } else {
    sendMessage(name, email, message);
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyAyxms3VVaer12Ky80igDX_I5RHEt8hDi8",
  authDomain: "reach-technologies.firebaseapp.com",
  projectId: "reach-technologies",
  storageBucket: "reach-technologies.appspot.com",
  messagingSenderId: "770422203646",
  appId: "1:770422203646:web:1cd9b692261829a0d431af"
};
firebase.initializeApp(firebaseConfig);
  
document.getElementById("send").addEventListener("click", validateForm);
      function validateForm() {
        //gets the name
        let name = document.getElementById("contact-name").value;
        //gets the email
        let email = document.getElementById("contact-email").value;
        //gets the message
        let message = document.getElementById("contact-message").value;

        //checks if all fields have been filled before sending message.
        if (name.trim() == "" || email.trim() == "" || message.trim() == "") {
          alert("all fields must be filled");
        } else {
          sendMessage(name, email, message);
        }
      }
      //sends information to firebase
      function sendMessage(name, email, message) {
        const putData = async ( ) =>{
           const response = await fetch('https://us-central1-reach-technologies.cloudfunctions.net/sendMail?name='+name+'&email='+email+'&message='+message, {
               method: 'PUT', 
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify()
           });
        };
        putData( ).then(()=>{
            $("#success_msg").show(100);
            document.getElementById('contactUs').reset();
        });
      }
