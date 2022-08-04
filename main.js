const totalPrice = document.querySelector(".totalPrice__count").textContent.replace(/\$ /g, "").replace(".", "")
let token;

function setTotalPrice() {
	localStorage.setItem("soqqa", totalPrice)
}
document.addEventListener("DOMContentLoaded", setTotalPrice)
console.log(typeof localStorage.getItem("soqqa"))

const userName = "John Doe"
const user = document.querySelectorAll(".holder_name")
user[0].textContent = userName
user[1].textContent = userName

const avatar = document.querySelector(".username").append(userName)

let cardTabs = document.querySelectorAll(".payment__steps__list__item")
cardTabs[0].classList.add("active")


let cardNumber = document.querySelectorAll(".card-number")

let expiration = document.querySelectorAll(".expiration")
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
      cardNumber[0].textContent = ccNumberInput.value
      cardNumber[1].textContent = ccNumberInput.value

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

      expiration[0].innerHTML = newValue
      expiration[1].innerHTML = newValue

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
  console.log(x)
  x[n].style.display = "flex";
  cardTabs[n].classList.add("active")
  if(cardTabs[n-1] !== cardTabs[0]) {
  	cardTabs[n - 1].classList.remove("active")
  }

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

  fixStepIndicator(n)
}
function nextPrev(n) {
	

  var x = document.getElementsByClassName("tab");
  const cardNum = ccNumberInput.value.split(" ").join("")
  const exp = ccExpiryInput.value.slice(0, 2) + "" + ccExpiryInput.value.slice(3, 5)

  if(cardNum.length == 16 && exp.length == 4) {
      axios.post("http://127.0.0.1:8000/api/payme/card/create/", {
    	  		id: 123,
    	   		params: {
    		        card: { "number": cardNum, "expire": exp},
    		        amount: +localStorage.getItem("soqqa"), 
    		        save: true
    	    	}
    		}).then(res => {
            x[currentTab].style.display = "none";
            cardTabs[currentTab].classList.remove("active")
            token = res.data.token
            currentTab = currentTab + n;
            showTab(currentTab)
        })
  }
}
function goToAddress() {
  var x = document.getElementsByClassName("tab");
  const codeInputValue = document.querySelector(".send__mess-input")

  if(codeInputValue.value.length > 0) { 
    axios.post("http://127.0.0.1:8000/api/payme/card/verify/", {
      "id": 123,
      "params": {
          "token": token,
          "code": "666666"
      }
    }).then(res => {
      if(!res.data.hasOwnProperty("error")) {
        x[currentTab].style.display = "none";
        cardTabs[currentTab].classList.remove("active")
        currentTab = 2;
        showTab(currentTab);
      }
    })
  }

}

// function backToPrev(n) {
//   var x = document.getElementsByClassName("tab");
//   x[currentTab].style.display = "none";
//   currentTab = currentTab + n
//   cardTabs[currentTab].classList.remove("active")
//   if (cardTabs[currentTab] !== cardTabs[0]) {
//     cardTabs[0].onclick = nextPrev(-1)
//   } else if(cardTabs[currentTab] == cardTabs[1]){
//     cardTabs[2].onclick = () => nextPrev(-1)

//   } else if(cardTabs[currentTab] == cardTabs[2]) {
//     cardTabs[1].onclick = () => nextPrev(1)
//   } else {
//     cardTabs[0].onclick = () => false
//   }
//   showTab(currentTab)
// }



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
