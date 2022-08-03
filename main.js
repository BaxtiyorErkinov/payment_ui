const userName = "John Doe"
const user = document.querySelector(".holder_name").textContent = userName
const avatar = document.querySelector(".username").append(userName)

let cardNumberTabs = document.querySelectorAll(".payment__steps__list__item")
cardNumberTabs[0].classList.add("active")


let cardNumber = document.querySelector(".card-number")
let expiration = document.querySelector(".expiration")
let ccNumberInput = document.querySelector('.cc-number-input'),
  ccNumberPattern = /^\d{0,16}$/g,
  ccNumberSeparator = " ",
  ccNumberInputOldValue,
  ccNumberInputOldCursor,

  ccExpiryInput = document.querySelector('.cc-expiry-input'),
  ccExpiryPattern = /^\d{0,4}$/g,
  ccExpirySeparator = "/",
  ccExpiryInputOldValue,
  ccExpiryInputOldCursor,

  ccCVCInput = document.querySelector('.cc-cvc-input'),
  ccCVCPattern = /^\d{0,3}$/g,

  mask = (value, limit, separator) => {
    var output = [];
    for (let i = 0; i < value.length; i++) {
      if (i !== 0 && i % limit === 0) {
        output.push(separator);
      }

      output.push(value[i]);
      console.log(cardNumber.textContent)
      cardNumber.textContent = ccNumberInput.value

    }

    return output.join("");
  },
  unmask = (value) => value.replace(/[^\d]/g, ''),
  checkSeparator = (position, interval) => Math.floor(position / (interval + 1)),
  ccNumberInputKeyDownHandler = (e) => {
    let el = e.target;
    ccNumberInputOldValue = el.value;
    ccNumberInputOldCursor = el.selectionEnd;
  },
  ccNumberInputInputHandler = (e) => {
    let el = e.target,
      newValue = unmask(el.value),
      newCursorPosition;

    if (newValue.match(ccNumberPattern)) {
      newValue = mask(newValue, 4, ccNumberSeparator);

      newCursorPosition =
        ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4) +
        checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) +
        (unmask(newValue).length - unmask(ccNumberInputOldValue).length);

      el.value = (newValue !== "") ? newValue : "";
    } else {
      el.value = ccNumberInputOldValue;
      newCursorPosition = ccNumberInputOldCursor;
    }

    el.setSelectionRange(newCursorPosition, newCursorPosition);

    highlightCC(el.value);
  },
  highlightCC = (ccValue) => {
    let ccCardType = '',
      ccCardTypePatterns = {
        amex: /^3/,
        visa: /^4/,
        mastercard: /^5/,
        disc: /^6/,

        genric: /(^1|^2|^7|^8|^9|^0)/,
      };

    for (const cardType in ccCardTypePatterns) {
      if (ccCardTypePatterns[cardType].test(ccValue)) {
        ccCardType = cardType;
        break;
      }
    }

    let activeCC = document.querySelector('.cc-types__img--active'),
      newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);

    if (activeCC) activeCC.classList.remove('cc-types__img--active');
    if (newActiveCC) newActiveCC.classList.add('cc-types__img--active');
  },
  ccExpiryInputKeyDownHandler = (e) => {
    let el = e.target;
    ccExpiryInputOldValue = el.value;
    ccExpiryInputOldCursor = el.selectionEnd;
  },
  ccExpiryInputInputHandler = (e) => {
    let el = e.target,
      newValue = el.value;

    newValue = unmask(newValue);
    if (newValue.match(ccExpiryPattern)) {
      newValue = mask(newValue, 2, ccExpirySeparator);
      el.value = newValue;

      expiration.innerHTML = newValue
    } else {
      el.value = ccExpiryInputOldValue;
    }
  };

ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
ccNumberInput.addEventListener('input', ccNumberInputInputHandler);

ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);


let currentTab = 0;
  var x = document.getElementsByClassName("tab");
  x[currentTab].style.display = "flex"

function showTab(n) {
  // This function will display the specified tab of the form...
  console.log(x)
  x[n].style.display = "flex";
  cardNumberTabs[n].classList.add("active")
  cardNumberTabs[n - 1].classList.remove("active")


  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}
function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  // if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  	cardNumberTabs[currentTab].classList.remove("active")
  

  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  // if (currentTab >= x.length) {
  //   // ... the form gets submitted:
  //   document.getElementById("regForm").submit();
  //   return false;
  // }
  // Otherwise, display the correct tab:

  showTab(currentTab);
}
function mySubmit(e) { 
  e.preventDefault(); 
  try {
   someBug();
  } catch (e) {
   throw new Error(e.message);
  }
  return false;
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}