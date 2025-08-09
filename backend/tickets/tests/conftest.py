# Django
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from ..models import Booking, BookingStatus, Payment, PaymentMethod, PaymentStatus
from locations.models import City, Theater, Seat
from movies.models import Genre, Movie
from showtimes.models import Showtime
from users.models import User

# Write your fixtures here.


@pytest.fixture(scope="session")
def django_db_setup():
    """Setup database for the entire test session."""
    pass


@pytest.fixture
def city_london():
    return City.objects.create(name="London")


@pytest.fixture
def city_berlin():
    return City.objects.create(name="Berlin")


@pytest.fixture
def theater_london(city_london):
    return Theater.objects.create(name="Room 1", city=city_london, rows=2, columns=4)


@pytest.fixture
def theater_berlin(city_berlin):
    return Theater.objects.create(name="Room 1", city=city_berlin, rows=2, columns=4)


@pytest.fixture
def seats_theater_london(theater_london):
    if not Seat.objects.filter(theater=theater_london).exists():
        seats = []
        for row in range(1, theater_london.rows + 1):
            for col in range(1, theater_london.columns + 1):
                seat = Seat.objects.create(
                    theater=theater_london,
                    row=row,
                    column=col,
                    seat_number=f"{row}{chr(64 + col)}",  # 1A, 1B
                )
                seats.append(seat)
        return seats[:4]
    else:
        seats = list(Seat.objects.filter(theater=theater_london)[:4])
        return seats


@pytest.fixture
@pytest.mark.django_db
def seats_theater_berlin(theater_berlin):
    if not Seat.objects.filter(theater=theater_berlin).exists():
        seats = []
        for row in range(1, theater_berlin.rows + 1):
            for col in range(1, theater_berlin.columns + 1):
                seat = Seat.objects.create(
                    theater=theater_berlin,
                    row=row,
                    column=col,
                    seat_number=f"{row}{chr(64 + col)}",
                )
                seats.append(seat)
        return seats[:4]
    else:
        seats = list(Seat.objects.filter(theater=theater_berlin)[:4])
        return seats


@pytest.fixture
def genre_action():
    return Genre.objects.create(name="Action")


@pytest.fixture
def movie_f1(genre_action):
    movie = Movie.objects.create(
        title="F1",
        description="F1 desc",
        poster="images.gov",
        director="Joseph Kosinski",
        cast="Brad Pitt, Damson Idris, Javier Bardem",
        release="2025-06-25",
        duration=timedelta(hours=1, minutes=30),
        parental_guide="parental guidance",
        language="italian",
    )
    movie.genres.set([genre_action])
    return movie


@pytest.fixture
def showtime_f1_london(movie_f1, theater_london):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1, hours=1),
    )


@pytest.fixture
@pytest.mark.django_db
def showtime_f1_berlin(movie_f1, theater_berlin):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_berlin,
        starts_at=timezone.now() + timedelta(days=1, hours=1),
    )


@pytest.fixture
def manager_user():
    return User.objects.create_user(
        username="manager", password="test123", is_staff=False, role="manager"
    )


@pytest.fixture
def cashier_user():
    return User.objects.create_user(
        username="cashier", password="test123", is_staff=False, role="cashier"
    )


@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)


@pytest.fixture
def normal_user():
    return User.objects.create_user(
        username="user", password="test123", email="test@mail.com"
    )


@pytest.fixture
def bookings_list(
    normal_user,
    staff_user,
    manager_user,
    cashier_user,
    showtime_f1_london,
    showtime_f1_berlin,
    seats_theater_london,
    seats_theater_berlin,
):
    return Booking.objects.bulk_create(
        [
            Booking(
                user=normal_user,
                showtime=showtime_f1_london,
                seat=seats_theater_london[0],
                status=BookingStatus.RESERVED,
            ),
            Booking(
                user=staff_user,
                showtime=showtime_f1_london,
                seat=seats_theater_london[1],
                status=BookingStatus.CANCELED,
            ),
            Booking(
                user=manager_user,
                showtime=showtime_f1_london,
                seat=seats_theater_london[2],
                status=BookingStatus.PURCHASED,
            ),
            Booking(
                user=cashier_user,
                showtime=showtime_f1_berlin,
                seat=seats_theater_berlin[0],
                status=BookingStatus.RESERVED,
            ),
        ]
    )


@pytest.fixture
def booking_user(normal_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=normal_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[0],
        status=BookingStatus.RESERVED,
    )


@pytest.fixture
def booking_staff(staff_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=staff_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[1],
        status=BookingStatus.RESERVED,
    )


@pytest.fixture
def booking_manager(manager_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=manager_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[2],
        status=BookingStatus.RESERVED,
    )


@pytest.fixture
def booking_cashier(cashier_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=cashier_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[3],
        status=BookingStatus.RESERVED,
    )


@pytest.fixture
def payment_user(normal_user, booking_user):
    payment = Payment.objects.create(
        user=normal_user,
        amount=35,
        method=PaymentMethod.VISA,
        status=PaymentStatus.ACCEPTED,
    )
    payment.bookings.set([booking_user])
    return payment


@pytest.fixture
def payments_list(
    normal_user,
    booking_user,
    staff_user,
    booking_staff,
    manager_user,
    booking_manager,
    cashier_user,
    booking_cashier,
):
    payments = []
    payments.append(
        Payment.objects.create(
            user=normal_user,
            amount=35,
            method=PaymentMethod.VISA,
            status=PaymentStatus.ACCEPTED,
        )
    )
    payments.append(
        Payment.objects.create(
            user=staff_user,
            amount=50,
            method=PaymentMethod.VISA,
            status=PaymentStatus.DECLINED,
        )
    )
    payments.append(
        Payment.objects.create(
            user=manager_user,
            amount=45.5,
            method=PaymentMethod.MASTERCARD,
            status=PaymentStatus.ACCEPTED,
        )
    )
    payments.append(
        Payment.objects.create(
            user=cashier_user,
            amount=15.99,
            method=PaymentMethod.MASTERCARD,
            status=PaymentStatus.DECLINED,
        )
    )

    # Set bookings many-to-many
    payments[0].bookings.set([booking_user])
    payments[1].bookings.set([booking_staff])
    payments[2].bookings.set([booking_manager])
    payments[3].bookings.set([booking_cashier])

    return payments


@pytest.fixture
def booking_ids_normal(normal_user, showtime_f1_london, seats_theater_london):
    b1 = Booking.objects.create(
        user=normal_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[0],
        status=BookingStatus.PENDING_PAYMENT,
    )
    b2 = Booking.objects.create(
        user=normal_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[1],
        status=BookingStatus.PENDING_PAYMENT,
    )
    return [b1.id, b2.id]


@pytest.fixture
def booking_ids_staff(staff_user, showtime_f1_london, seats_theater_london):
    b1 = Booking.objects.create(
        user=staff_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[2],
        status=BookingStatus.PENDING_PAYMENT,
    )
    return [b1.id]


@pytest.fixture
def booking_ids_manager(manager_user, showtime_f1_berlin, seats_theater_berlin):
    b1 = Booking.objects.create(
        user=manager_user,
        showtime=showtime_f1_berlin,
        seat=seats_theater_berlin[0],
        status=BookingStatus.PENDING_PAYMENT,
    )
    b2 = Booking.objects.create(
        user=manager_user,
        showtime=showtime_f1_berlin,
        seat=seats_theater_berlin[1],
        status=BookingStatus.PENDING_PAYMENT,
    )
    b3 = Booking.objects.create(
        user=manager_user,
        showtime=showtime_f1_berlin,
        seat=seats_theater_berlin[2],
        status=BookingStatus.PENDING_PAYMENT,
    )
    return [b1.id, b2.id, b3.id]


@pytest.fixture
def booking_ids_cashier(cashier_user, showtime_f1_berlin, seats_theater_berlin):
    b1 = Booking.objects.create(
        user=cashier_user,
        showtime=showtime_f1_berlin,
        seat=seats_theater_berlin[3],
        status=BookingStatus.PENDING_PAYMENT,
    )
    return [b1.id]


@pytest.fixture
def booking_pending_1(normal_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=normal_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[0],
        status=BookingStatus.PENDING_PAYMENT,
    )


@pytest.fixture
def booking_pending_2(normal_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=normal_user,
        showtime=showtime_f1_london,
        seat=seats_theater_london[1],
        status=BookingStatus.PENDING_PAYMENT,
    )
