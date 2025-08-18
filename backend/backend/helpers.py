# DRF
from rest_framework.pagination import PageNumberPagination


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Helper Classes & Methods
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


class StandardPagination(PageNumberPagination):
    """
    Class for pagination with standard values: page_size=5, max_page_size=10.
    """
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 10


def send_email_context(user, bookings):
    """
    Return a context dictionary for sending an email with: user_name, movie_title,
    theater_name, theater_city, showtime_starts, seats, price.
    Accepts either a single Booking instance or a list of Booking instances.
    """

    if not isinstance(bookings, list):
        bookings = [bookings]

    showtime = bookings[0].showtime

    context = {
        "user_name": user.first_name,
        "movie_title": showtime.movie.title,
        "theater_name": showtime.theater.name,
        "theater_city": showtime.theater.city.name,
        "showtime_starts": showtime.starts_at.strftime("%d.%m.%Y %H:%M"),
        "seats": ", ".join(f"R{booking.seat.row}-C{booking.seat.column}" for booking in bookings),
        "price": sum(booking.showtime.price for booking in bookings),
    }

    return context