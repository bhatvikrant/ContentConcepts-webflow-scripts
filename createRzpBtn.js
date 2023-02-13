{
  /* <form>
	<script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_LFbOAZSDTmmL6D" async> </script> 
</form> */
}

const form = document.createElement("form");
const script = document.createElement("script");
script.src = "https://checkout.razorpay.com/v1/payment-button.js";
script.setAttribute("data-payment_button_id", "pl_LFbOAZSDTmmL6D");
script.async = true;

form.appendChild(script);
const rzpBtnContainer = document.getElementById("rzp-btn-container");
// document.body.appendChild(form);
rzpBtnContainer.appendChild(form);
