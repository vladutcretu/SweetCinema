# Django
from django.contrib.auth.models import Group, User
from django.utils import timezone
from datetime import timedelta

# Pytest
import pytest

# App
from ..models import Booking, BookingStatus, Payment, PaymentMethod, PaymentStatus
from users.models import UserProfile
from showtimes.models import Showtime
from movies.models import Genre, Movie
from locations.models import City, Theater, Seat

# Write your fixtures here.


@pytest.fixture
def city_london():
    return City.objects.create(name="London")

@pytest.fixture
def city_berlin():
    return City.objects.create(name="Berlin")

@pytest.fixture
def theater_london(city_london):
    return Theater.objects.create(
        name="Room 1",
        city=city_london,
        rows=2,
        columns=4
    )

@pytest.fixture
def theater_berlin(city_berlin):
    return Theater.objects.create(
        name="Room 1\2",
        city=city_berlin,
        rows=2,
        columns=4
    )

@pytest.fixture
def seats_theater_london(theater_london):
    seat1 = Seat.objects.create(
        theater=theater_london,
        row=1,
        columns=1
    )
    seat2 = Seat.objects.create(
        theater=theater_london,
        row=1,
        columns=2
    )
    seat3 = Seat.objects.create(
        theater=theater_london,
        row=1,
        columns=3
    )
    seat4 = Seat.objects.create(
        theater=theater_london,
        row=1,
        columns=4
    )
    return [seat1, seat2, seat3, seat4]


@pytest.fixture
def seats_theater_berlin(theater_berlin):
    seat1 = Seat.objects.create(
        theater=theater_berlin,
        row=1,
        columns=1
    )
    seat2 = Seat.objects.create(
        theater=theater_berlin,
        row=1,
        columns=2
    )
    seat3 = Seat.objects.create(
        theater=theater_berlin,
        row=1,
        columns=3
    )
    seat4 = Seat.objects.create(
        theater=theater_berlin,
        row=1,
        columns=4
    )
    return [seat1, seat2, seat3, seat4]

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
        language="italian"
    )
    movie.genres.set([genre_action])
    return movie

@pytest.fixture
def showtime_f1_london(movie_f1, theater_london):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_london,
        starts_at=timezone.now() + timedelta(days=1, hours=1)
    )

@pytest.fixture
def showtime_f1_berlin(movie_f1, theater_berlin):
    return Showtime.objects.create(
        movie=movie_f1,
        theater=theater_berlin,
        starts_at=timezone.now() + timedelta(days=1, hours=1)
    )

@pytest.fixture
def manager_group():
    return Group.objects.create(name="Manager")

@pytest.fixture
def cashier_group():
    return Group.objects.create(name="Cashier")

@pytest.fixture
def manager_user(manager_group):
    user = User.objects.create_user(username="manager", password="test123", is_staff=False)
    user.groups.add(manager_group)
    return user

@pytest.fixture
def cashier_user(cashier_group):
    user = User.objects.create_user(username="cashier", password="test123", is_staff=False)
    user.groups.add(cashier_group)
    return user

@pytest.fixture
def cashier_profile(cashier_user, city_berlin):
    return UserProfile.objects.create(user=cashier_user, city=city_berlin)

@pytest.fixture
def staff_user():
    return User.objects.create_user(username="staff", password="test123", is_staff=True)

@pytest.fixture
def normal_user():
    return User.objects.create_user(username="user", password="test123")

@pytest.fixture
def bookings_list(
    normal_user,
    staff_user,
    manager_user,
    cashier_user,
    showtime_f1_london,
    showtime_f1_berlin, 
    seats_theater_london,
    seats_theater_berlin
):
    return Booking.objects.bulk_create([
        Booking.objects.create(
            user=normal_user,
            showtime=showtime_f1_london,
            seat=seats_theater_london[0],
            status=BookingStatus.RESERVED,
        ),
        Booking.objects.create(
            user=staff_user,
            showtime=showtime_f1_london,
            seat=seats_theater_london[1],
            status=BookingStatus.CANCELED,
        ),
        Booking.objects.create(
            user=manager_user,
            showtime=showtime_f1_london,
            seat=seats_theater_london[2],
            status=BookingStatus.PURCHASED,
        ),
        Booking.objects.create(
            user=cashier_user,
            showtime=showtime_f1_berlin,
            seat=seats_theater_berlin[0],
            status=BookingStatus.FAILED_PAYMENT,
        )
    ])

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
        seat=seats_theater_london[0],
        status=BookingStatus.RESERVED,
    )


@pytest.fixture
def payment_user(normal_user, booking_user):
    return Payment.objects.create(
        user=normal_user,
        bookings=booking_user,
        amount=35,
        method=PaymentMethod.VISA,
        status=PaymentStatus.ACCEPTED
    )


@pytest.fixture
def payments_list(
    normal_user, 
    booking_user,
    staff_user,
    booking_staff,
    manager_user,
    booking_manager,
    cashier_user,
    booking_cashier
):
    return Booking.objects.bulk_create([
        Payment.objects.create(
            user=normal_user,
            bookings=booking_user,
            amount=35,
            method=PaymentMethod.VISA,
            status=PaymentStatus.ACCEPTED
        ),
        Payment.objects.create(
            user=staff_user,
            bookings=booking_staff,
            amount=50,
            method=PaymentMethod.VISA,
            status=PaymentStatus.DECLINED
        ),
        Payment.objects.create(
            user=manager_user,
            bookings=booking_manager,
            amount=45.5,
            method=PaymentMethod.MASTERCARD,
            status=PaymentStatus.ACCEPTED
        ),
        Payment.objects.create(
            user=cashier_user,
            bookings=booking_cashier,
            amount=15.99,
            method=PaymentMethod.MASTERCARD,
            status=PaymentStatus.DECLINED
        )
    ])

@pytest.fixture
def booking_ids(booking_user, booking_staff, booking_manager, booking_cashier):
    return [booking_user.id, booking_staff.id, booking_manager.id, booking_cashier.id]

@pytest.fixture
def booking_pending_1(normal_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=normal_user, 
        showtime=showtime_f1_london, 
        seat=seats_theater_london[0], 
        status=BookingStatus.PENDING_PAYMENT
    )

@pytest.fixture
def booking_pending_2(normal_user, showtime_f1_london, seats_theater_london):
    return Booking.objects.create(
        user=normal_user, 
        showtime=showtime_f1_london, 
        seat=seats_theater_london[1], 
        status=BookingStatus.PENDING_PAYMENT
    )
