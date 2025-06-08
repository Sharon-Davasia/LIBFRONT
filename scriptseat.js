document.addEventListener('DOMContentLoaded', () => {
    const seatLayout = document.getElementById('seatLayout');
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.cancel-btn');
    const seatNumberInput = document.getElementById('seatNumber');
    const bookedSeatsContainer = document.getElementById('bookedSeatsContainer');

    // Configuration - Edit these values to change the seat layout
    const config = {
        rows: 8,        // Number of rows (A, B, C, etc.)
        cols: 8,        // Number of columns (1, 2, 3, etc.)
        gap: 5,         // Gap between seats in pixels
        fontSize: 10,   // Font size for seat numbers
        maxWidth: 600   // Maximum width of the seat layout in pixels
    };

    // Store booked seats data
    let bookedSeatsData = new Map();

    // Load booked seats from localStorage
    function loadBookedSeats() {
        const savedData = localStorage.getItem('bookedSeatsData');
        if (savedData) {
            bookedSeatsData = new Map(JSON.parse(savedData));
            updateBookedSeatsDisplay();
        }
    }

    // Save booked seats to localStorage
    function saveBookedSeats() {
        localStorage.setItem('bookedSeatsData', JSON.stringify(Array.from(bookedSeatsData.entries())));
    }

    // Update CSS based on configuration
    function updateLayoutStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .seat-layout {
                grid-template-columns: repeat(${config.cols}, 1fr);
                gap: ${config.gap}px;
                max-width: ${config.maxWidth}px;
            }
            .seat {
                font-size: ${config.fontSize}px;
            }
        `;
        document.head.appendChild(style);
    }

    // Generate seats
    function generateSeats() {
        seatLayout.innerHTML = ''; // Clear existing seats
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                const seat = document.createElement('div');
                const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
                seat.className = 'seat available';
                seat.dataset.seatNumber = seatNumber;
                seat.textContent = seatNumber;
                seat.addEventListener('click', () => handleSeatClick(seat));
                seatLayout.appendChild(seat);
            }
        }
        // Update seat status based on booked seats
        updateSeatStatus();
    }

    // Update seat status based on booked seats
    function updateSeatStatus() {
        document.querySelectorAll('.seat').forEach(seat => {
            const seatNumber = seat.dataset.seatNumber;
            if (bookedSeatsData.has(seatNumber)) {
                seat.classList.remove('available');
                seat.classList.add('booked');
            }
        });
    }

    // Update booked seats display
    function updateBookedSeatsDisplay() {
        bookedSeatsContainer.innerHTML = '';
        bookedSeatsData.forEach((data, seatNumber) => {
            const card = document.createElement('div');
            card.className = 'booked-seat-card';
            card.innerHTML = `
                <div class="seat-info">
                    <span class="seat-number">${seatNumber}</span>
                    <span class="booking-time">${new Date(data.bookingTime).toLocaleString()}</span>
                </div>
                <h3>${data.userName}</h3>
                <p>📱 ${data.phoneNumber}</p>
                <p>✉️ ${data.email}</p>
                <p>🎫 Tickets: ${data.ticketCount}</p>
                ${data.notes ? `<p>📝 ${data.notes}</p>` : ''}
            `;
            bookedSeatsContainer.appendChild(card);
        });
    }

    // Handle seat click
    function handleSeatClick(seat) {
        if (seat.classList.contains('booked')) {
            // Show booked seat details
            const seatData = bookedSeatsData.get(seat.dataset.seatNumber);
            if (seatData) {
                alert(`Seat ${seat.dataset.seatNumber} is booked by ${seatData.userName}\nPhone: ${seatData.phoneNumber}\nEmail: ${seatData.email}`);
            }
            return;
        }

        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
        } else {
            // Deselect any previously selected seats
            document.querySelectorAll('.seat.selected').forEach(s => {
                s.classList.remove('selected');
                s.classList.add('available');
            });
            
            seat.classList.remove('available');
            seat.classList.add('selected');
            openBookingModal(seat.dataset.seatNumber);
        }
    }

    // Open booking modal
    function openBookingModal(seatNumber) {
        seatNumberInput.value = seatNumber;
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close booking modal
    function closeBookingModal() {
        bookingModal.style.display = 'none';
        bookingForm.reset();
        document.body.style.overflow = '';
        
        // Reset selected seats
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('available');
        });
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const seatNumber = seatNumberInput.value;
        const bookingData = {
            userName: document.getElementById('userName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            email: document.getElementById('email').value,
            ticketCount: document.getElementById('ticketCount').value,
            notes: document.getElementById('notes').value,
            bookingTime: new Date().toISOString()
        };

        // Store booking data
        bookedSeatsData.set(seatNumber, bookingData);
        saveBookedSeats();

        // Update display
        updateSeatStatus();
        updateBookedSeatsDisplay();

        closeBookingModal();
    }

    // Event Listeners
    closeButton.addEventListener('click', closeBookingModal);
    cancelButton.addEventListener('click', closeBookingModal);
    bookingForm.addEventListener('submit', handleFormSubmit);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    // Prevent modal from closing when clicking inside
    bookingModal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Initialize
    updateLayoutStyles();
    loadBookedSeats();
    generateSeats();
}); 