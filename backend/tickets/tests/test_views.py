# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest
import pytest

# App
from ..models import Booking, BookingStatus, PaymentMethod

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Booking - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_booking_list_without_param_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("create-read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_without_param_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: PartialSerializer
    data = response.data["results"]
    user_bookings_count = Booking.objects.filter(user=normal_user).count()
    all_bookings_count = Booking.objects.all().count()
    assert len(data) == user_bookings_count
    assert len(data) != all_bookings_count
    assert "updated_at" not in data[0]
    assert "expires_at" in data[0]


@pytest.mark.django_db
def test_booking_list_without_param_as_manager(bookings_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: PartialSerializer
    data = response.data["results"]
    manager_bookings_count = Booking.objects.filter(user=manager_user).count()
    all_bookings_count = Booking.objects.all().count()
    assert len(data) == manager_bookings_count
    assert len(data) != all_bookings_count
    assert "expires_at" in data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: PartialSerializer
    data = response.data["results"]
    user_bookings_count = Booking.objects.filter(user=normal_user).count()
    all_bookings_count = Booking.objects.all().count()
    assert len(data) == user_bookings_count
    assert len(data) != all_bookings_count
    assert "updated_at" not in data[0]
    assert "expires_at" in data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_cashier(bookings_list, cashier_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: PartialSerializer
    data = response.data["results"]
    cashier_bookings_count = Booking.objects.filter(user=cashier_user).count()
    all_bookings_count = Booking.objects.all().count()
    assert len(data) == cashier_bookings_count
    assert len(data) != all_bookings_count
    assert "updated_at" not in data[0]
    assert "expires_at" in data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: PartialSerializer
    data = response.data["results"]
    normal_bookings_count = Booking.objects.filter(user=normal_user).count()
    all_bookings_count = Booking.objects.all().count()
    assert len(data) == normal_bookings_count
    assert len(data) != all_bookings_count
    assert "updated_at" not in data[0]
    assert "expires_at" in data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_manager(bookings_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: CompleteSerializer
    data = response.data["results"]
    assert len(data) == 4
    assert "updated_at" in data[0]
    assert "expires_at" not in data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_cashier(bookings_list, cashier_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_cashier_with_city_param(
    bookings_list, cashier_user, city_berlin
):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("create-read-bookings")
    response = client.get(url, {"staff": "true", "city": city_berlin.id})

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    # Expected: CompleteSerializer
    data = response.data["results"]
    assert len(data) == 1
    assert "updated_at" in data[0]
    assert "expires_at" not in data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Booking - Create
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_booking_create_as_visitor(showtime_f1_london, seats_theater_london):
    client = APIClient()
    url = reverse("create-read-bookings")
    data = {
        "showtime_id": showtime_f1_london.id,
        "seat_ids": [seat.id for seat in seats_theater_london[:2]],
        "status": BookingStatus.PENDING_PAYMENT,
    }
    response = client.post(url, data=data)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_create_as_normal_user(
    normal_user, showtime_f1_london, seats_theater_london
):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-bookings")
    data = {
        "showtime_id": showtime_f1_london.id,
        "seat_ids": [seat.id for seat in seats_theater_london[2:]],
        "status": BookingStatus.PENDING_PAYMENT,
    }
    response = client.post(url, data=data, format="json")

    assert response.status_code == status.HTTP_201_CREATED


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Booking - UPDATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_booking_update_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("update-bookings", args=[1])
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_can_cancel_own_booking(normal_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.CANCELED}, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["status"] == BookingStatus.CANCELED


@pytest.mark.django_db
def test_user_cannot_cancel_others_booking(normal_user, booking_staff):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-bookings", args=[booking_staff.id])
    response = client.patch(url, {"status": BookingStatus.CANCELED}, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_user_cannot_purchase_booking(normal_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_cashier_can_cancel_own_booking(cashier_user, booking_cashier):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("update-bookings", args=[booking_cashier.id])
    response = client.patch(url, {"status": BookingStatus.CANCELED}, format="json")

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cashier_cannot_cancel_others_booking(cashier_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("update-bookings", args=[booking_user.id]) + "?staff=true"
    response = client.patch(url, {"status": BookingStatus.CANCELED}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_cashier_can_purchase_others_booking_with_staff_true(
    cashier_user, booking_user
):
    client = APIClient()
    client.force_authenticate(user=cashier_user)

    url = reverse("update-bookings", args=[booking_user.id]) + "?staff=true"

    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cashier_cannot_access_booking_without_staff_true(cashier_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)

    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_cashier_cannot_purchase_own_booking(cashier_user, booking_cashier):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("update-bookings", args=[booking_cashier.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_staff_can_purchase_others_booking_with_staff_true(staff_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)

    url = reverse("update-bookings", args=[booking_user.id]) + "?staff=true"

    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_staff_cannot_access_booking_without_staff_true(staff_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)

    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_404_NOT_FOUND


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # BookingTimeout - PATCH
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
class TestBookingPaymentTimeoutView:
    @pytest.fixture
    def url(self):
        return reverse("mark-failed-bookings")

    def test_patch_success(
        self, url, normal_user, booking_pending_1, booking_pending_2
    ):
        client = APIClient()
        client.force_authenticate(user=normal_user)

        response = client.patch(
            url,
            data={"booking_ids": [booking_pending_1.id, booking_pending_2.id]},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        booking_pending_1.refresh_from_db()
        booking_pending_2.refresh_from_db()
        assert booking_pending_1.status == BookingStatus.FAILED_PAYMENT
        assert booking_pending_2.status == BookingStatus.FAILED_PAYMENT

    def test_patch_invalid_ids(self, url, normal_user):
        client = APIClient()
        client.force_authenticate(user=normal_user)

        response = client.patch(url, data={"booking_ids": [9999]}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "booking_ids" in response.data

    def test_patch_unauthenticated(self, url):
        client = APIClient()
        response = client.patch(url, data={"booking_ids": [1]}, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # BookingPayment - POST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
class TestBookingListPaymentView:
    @pytest.fixture
    def url(self):
        return reverse("read-payment-bookings")

    def test_post_success(self, url, normal_user, booking_pending_1, booking_pending_2):
        client = APIClient()
        client.force_authenticate(user=normal_user)

        response = client.post(
            url,
            data={"booking_ids": [booking_pending_1.id, booking_pending_2.id]},
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert "bookings" in response.data
        assert "total_price" in response.data
        assert float(response.data["total_price"]) == float(
            booking_pending_1.showtime.price + booking_pending_2.showtime.price
        )

    def test_post_invalid_ids(self, url, normal_user):
        client = APIClient()
        client.force_authenticate(user=normal_user)

        response = client.post(url, data={"booking_ids": [9999]}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "booking_ids" in response.data

    def test_post_unauthenticated(self, url):
        client = APIClient()
        response = client.post(url, data={"booking_ids": [45]}, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # Payment - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_payment_list_as_visitor(payments_list):
    client = APIClient()
    url = reverse("create-read-payments")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_param_list_as_user(payments_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-payments")
    response = client.get(url)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_payment_list_as_manager(payments_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-payments")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 4
    assert "id" in data[1]
    assert data[1]["method"] == "MasterCard"
    assert data[1]["status"] == "Accepted"
    assert "user" in data[1]
    assert data[2]["method"] == "VISA"
    assert data[2]["status"] == "Declined"


@pytest.mark.django_db
def test_payment_list_as_staff(payments_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-payments")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert "count" in response.data
    assert "next" in response.data
    assert "previous" in response.data
    assert "results" in response.data

    data = response.data["results"]
    assert len(data) == 4
    assert "id" in data[0]
    assert data[0]["method"] == "MasterCard"
    assert data[0]["status"] == "Declined"
    assert "user" in data[3]
    assert data[3]["method"] == "VISA"
    assert data[3]["status"] == "Accepted"


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # Payment - Create
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_payment_create_as_visitor(booking_ids_normal):
    client = APIClient()
    url = reverse("create-read-payments")
    response = client.post(
        url,
        data={
            "booking_ids": booking_ids_normal,
            "amount": 70,
            "method": PaymentMethod.MASTERCARD,
        },
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_payment_create_as_normal_user(normal_user, booking_ids_normal):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-payments")
    response = client.post(
        url,
        data={
            "booking_ids": booking_ids_normal,
            "amount": 70,
            "method": PaymentMethod.MASTERCARD,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_payment_create_as_staff(staff_user, booking_ids_staff):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-payments")
    response = client.post(
        url,
        data={
            "booking_ids": booking_ids_staff,
            "amount": 35,
            "method": PaymentMethod.VISA,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_payment_create_as_manager(manager_user, booking_ids_manager):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-payments")
    response = client.post(
        url,
        data={
            "booking_ids": booking_ids_manager,
            "amount": 105,
            "method": PaymentMethod.VISA,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_payment_create_as_cashier(cashier_user, booking_ids_cashier):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("create-read-payments")
    response = client.post(
        url,
        data={
            "booking_ids": booking_ids_cashier,
            "amount": 35,
            "method": PaymentMethod.MASTERCARD,
        },
    )

    assert response.status_code == status.HTTP_201_CREATED
