// Remove old searched trips
function removeOldSearchedTrips() {
  const searchedTrips = document.querySelectorAll(".searched-trips");
  if (searchedTrips) {
    for (let trip of searchedTrips) {
      trip.remove();
    }
  }
}

// Add to cart
function addToCart(trips) {
  const bookBtn = document.querySelectorAll(".book-btn");
  for (let i = 0; i < bookBtn.length; i++) {
    bookBtn[i].addEventListener("click", () => {
    const bookedTrip = trips.data[i]
      fetch("http://localhost:3000/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({departure: bookedTrip.departure, arrival: bookedTrip.arrival, date: bookedTrip.date, price: bookedTrip.price}),
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
            // Delete the trip once booked
            bookBtn[i].parentNode.parentNode.remove()
            // Redirect to cart page
            window.location = './cart.html'
            return true

        } else {
            console.log("Already in cart")
            return false
        }
      })
    });
  }
}

const imageBook = document.querySelector("#image-and-text")
const noTripFound = document.querySelector("#no-trip-found")
const searchedTrip = document.querySelector(".searched-trips")

function showImage() {
    imageBook.style.display = "flex"
    noTripFound.style.display = "none"
    if (searchedTrip) {
      searchedTrip.style.display = "none"
    }

}

function hideImage() {
    imageBook.style.display = "none"
    noTripFound.style.display = "none"
    if (searchedTrip) {
      searchedTrip.style.display = "block"
    }
    
}

function noTripFoundText(text) {
    imageBook.style.display = "none"
    if (searchedTrip) {
      searchedTrip.style.display = "none"
    }
    noTripFound.style.display = "flex"
    noTripFound.textContent = text
}

// Show train image on load
window.addEventListener('load', (event) => {
  showImage()
})

// Search
document.querySelector("#btn-block").addEventListener("click", () => {
  removeOldSearchedTrips();

//   Get users value
  const departure = document.querySelector("#departure").value;
  const arrival = document.querySelector("#arrival").value;
  const date = document.querySelector("#date").value;


  if (departure && arrival && date) {
    const body = {
      departure: departure,
      arrival: arrival,
      date: date,
    };
    fetch("http://localhost:3000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((trips) => {
        if (trips.result) {
            // Hide image when searched trips appear
            hideImage()

            const bookBox = document.querySelector("#book-box");
            // Add matching trips tp te html
            for (let trip of trips.data) {
              const date = new Date(trip.date);
              bookBox.innerHTML += `
            <div class="searched-trips">
                    <div class="s-trip-infos"><span class="s-trip-departure">${trip.departure}</span>  >  <span class="s-trip-arrival">${trip.arrival}</span>  <span class="s-trip-time">${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}</span>  <span class="s-trip-price">${trip.price}</span>€<input type="button" class="book-btn" value="Book"></div>        
            </div>
                    `;
            }
            // Add to cart
            addToCart(trips)

        } else {
            noTripFoundText("No trip found")
        }
      });
  } else {
    noTripFoundText("No trip found")
  }
});
