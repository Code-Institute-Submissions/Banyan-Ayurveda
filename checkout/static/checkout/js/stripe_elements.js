/*
    Core logic/payment flow for this comes from here:
    https://stripe.com/docs/payments/accept-a-payment
    
   
*/

var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
var clientSecret = $('#id_client_secret').text().slice(1, -1);

// Create a Stripe client.
var stripe = Stripe(stripePublicKey);
// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {
  style: style
});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function (event) {
  var errorDiv = document.getElementById('card-errors');
  if (event.error) {
    var html = `
          <span class="icon" role="alert">
              <i class="fas fa-times"></i>
          </span>
          <span>${event.error.message}</span>
      `;
    $(errorDiv).html(html);
  } else {
    errorDiv.textContent = '';
  }
});
// Handle form submission.
var form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  card.update({
    'disabled': true
  });
  $('#submit-button').attr('disabled', true);
  $('#payment-form').fadeToggle(200);
  $('#loader-wrapper').fadeToggle(200);
  var saveInfo = Boolean($('#id-save-info').attr('checked'));
  // From using {% csrf_token %} in the form
  var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
  var postData = {
    'csrfmiddlewaretoken': csrfToken,
    'client_secret': clientSecret,
    'save_info': saveInfo,
  };
  var url = '/checkout/cache_checkout_data/';

  $.post(url, postData).done(function () {
    stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: $.trim(form.full_name.value),
          phone: $.trim(form.phone_number.value),
          email: $.trim(form.email.value),
          address: {
            line1: $.trim(form.address_line1.value),
            line2: $.trim(form.address_line2.value),
            city: $.trim(form.town_or_city.value),
            country: $.trim(form.country.value),
            state: $.trim(form.county.value),
          }
        }
      },
      shipping: {
        name: $.trim(form.full_name.value),
        phone: $.trim(form.phone_number.value),
        address: {
          line1: $.trim(form.address_line1.value),
          line2: $.trim(form.address_line2.value),
          city: $.trim(form.town_or_city.value),
          country: $.trim(form.country.value),
          postal_code: $.trim(form.postcode.value),
          state: $.trim(form.county.value),
        }
      },
    }).then(function (result) {
      if (result.error) {
        var errorDiv = document.getElementById('card-errors');
        var html = `
                  <span class="icon" role="alert">
                  <i class="fas fa-times"></i>
                  </span>
                  <span>${result.error.message}</span>`;
        $(errorDiv).html(html);
        $('#payment-form').fadeToggle(200);
        $('#loader-wrapper').fadeToggle(200);
        card.update({
          'disabled': false
        });
        $('#submit-button').attr('disabled', false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          form.submit();
        }
      }
    });
  }).fail(function () {
    // just reload the page, the error will be in django messages
    location.reload();
  })
});