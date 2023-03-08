function deleteCartTrip(trips) {
    const deleteButtons = document.querySelectorAll(".delete")
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", () => {
            const cartTrip = trips[i]
            fetch("https://tickethack-backend-lake.vercel.app/carts", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({departure: cartTrip.departure, arrival: cartTrip.arrival, date: cartTrip.date, price: cartTrip.price}),
      })
        .then(res => res.json())
        .then(data => {
            if (data.result) {
                deleteButtons[i].parentNode.remove()
                window.location.reload()
                console.log(data.message)
            } else {
                console.log(data.error)
            }
        })
        })
    }

}

function addToBookings(trips) {
    const bookingChoices = document.querySelectorAll(".booking-choices");
    for (let i = 0; i < bookingChoices.length; i++) {
      document.querySelector("#btn-purchase").addEventListener("click", () => {
      const purchasedTrip = trips.data[i]
        fetch("https://tickethack-backend-lake.vercel.app/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({departure: purchasedTrip.departure, arrival: purchasedTrip.arrival, date: purchasedTrip.date, price: purchasedTrip.price}),
        })
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            fetch("https://tickethack-backend-lake.vercel.app/carts/all", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                  },
            })
              // Redirect to bookings page
              window.location = './bookings.html'
              return true
  
          } else {
              console.log("Already in cart")
              return false
          }
        })
      });
    }
  }


  
  window.addEventListener('load', (event) => {
    const noTicketElement = document.querySelector(".text-no-ticket")
    const textCartElement = document.querySelector(".text-cart")
    const rowCartTotalElement = document.querySelector(".row-cart-total")
    rowCartTotalElement.style.display = "none"
    textCartElement.style.display = "none"
  noTicketElement.style.display = "block"
    fetch("https://tickethack-backend-lake.vercel.app/carts")
        .then(res => res.json())
        .then(data => {
            if (data.data.length > 0) {
              noTicketElement.style.display = "none"
              textCartElement.style.display = "block"
              rowCartTotalElement.style.display = "block"
                const rowCart = document.querySelector(".row-cart")
                let totalCart = 0
                for (let trip of data.data) {
                    const date = new Date(trip.date)
                    rowCart.innerHTML += `
                <div class="booking-choices">
                    <p class="choice">${trip.departure} > ${trip.arrival}</p>
                    <p class="choice">${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}</p>
                    <p class="choice">${trip.price}€</p>
                    <span class="delete">✖</span>
                </div>
                    `
                // Add price of each trip to total 
                totalCart += Number(trip.price)
                }
                // Update total cart price value
                document.querySelector("#total-price").textContent = `Total : ${totalCart}`

                addToBookings(data)
                deleteCartTrip(data.data)
            } else {
              noTicketElement.style.display = "block"
              textCartElement.style.display = "none"
              rowCartTotalElement.style.display = "none"
            }
        })
});