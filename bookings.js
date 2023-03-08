window.addEventListener("load", (event) => {
  fetch("https://tickethack-backend-lake.vercel.app/bookings", {mode: 'no-cors'})
    .then((res) => res.json())
    .then((data) => {
      if (data.result) {
        const rowBooking = document.querySelector(".row-bookings");
        for (let trip of data.data) {
          const date = new Date(trip.date);
          rowBooking.innerHTML += `
          <div class="booking-payed">
                    <p class="choice-payed">${trip.departure} > ${trip.arrival}</p>
                    <p class="choice-payed">${(date.getHours() < 10 ? "0" : "") + date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") + date.getMinutes()}</p>
                    <p class="choice-payed">${trip.price}€</p>
                    <p class="choice-payed">Departure in 5 hours</p>
                </div>
          `;
        }
      }
    });
});
