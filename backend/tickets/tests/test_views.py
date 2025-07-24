# Django
from django.urls import reverse

# DRF
from rest_framework.test import APIClient
from rest_framework import status

# Pytest 
import pytest

# App
from ..models import BookingStatus, PaymentStatus, PaymentMethod

# Write your tests here.


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_booking_list_without_param_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_without_param_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert len(response.data) == 4
    assert "updated_at" not in response.data[0]
    assert "expires_at" in response.data[0]


@pytest.mark.django_db
def test_booking_list_without_param_as_manager(bookings_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 4
    assert "updated_at" in response.data[1]
    assert "expires_at" not in response.data[1]


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_200_OK
    # Expected: PartialSerializer
    assert len(response.data) == 4
    assert "updated_at" not in response.data[2]
    assert "expires_at" in response.data[2]


@pytest.mark.django_db
def test_booking_list_with_param_staff_false_as_cashier(bookings_list, cashier_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 4
    assert "updated_at" in response.data[3]
    assert "expires_at" not in response.data[3]


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_user(bookings_list, normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "false"})

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_manager(bookings_list, manager_user):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 4
    assert "updated_at" in response.data[0]
    assert "expires_at" not in response.data[0]


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_cashier(bookings_list, cashier_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "true"})

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_booking_list_with_param_staff_true_as_cashier_with_city_param(bookings_list, cashier_user, city_berlin):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("read-bookings")
    response = client.get(url, {"staff": "true", "city": city_berlin.id})

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 1
    assert "updated_at" in response.data[0]
    assert "expires_at" not in response.data[0]


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Booking - UPDATE
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


@pytest.mark.django_db
def test_booking_update_as_visitor(bookings_list):
    client = APIClient()
    url = reverse("update-bookingss")
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

    assert response.status_code == status.HTTP_400_BAD_REQUEST


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
    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.CANCELED}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_cashier_can_purchase_others_booking(cashier_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_cashier_cannot_purchase_own_booking(cashier_user, booking_cashier):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("update-bookings", args=[booking_cashier.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_staff_can_purchase_others_booking(staff_user, booking_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("update-bookings", args=[booking_user.id])
    response = client.patch(url, {"status": BookingStatus.PURCHASED}, format="json")

    assert response.status_code == status.HTTP_200_OK


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Payment - LIST
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

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
    # Expected: CompleteSerializer
    assert len(response.data) == 4
    assert "id" in response.data[1]
    assert response.data[1]["method"] == PaymentMethod.VISA
    assert response.data[1]["status"] == PaymentStatus.DECLINED
    assert "user" in response.data[1]
    assert response.data[2]["method"] == PaymentMethod.MASTERCARD
    assert response.data[2]["status"] == PaymentStatus.ACCEPTED


@pytest.mark.django_db
def test_payment_list_as_staff(payments_list, staff_user):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("read-bookings")
    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # Expected: CompleteSerializer
    assert len(response.data) == 4
    assert "id" in response.data[0]
    assert response.data[0]["method"] == PaymentMethod.VISA
    assert response.data[0]["status"] == PaymentStatus.ACCEPTED
    assert "user" in response.data[3]
    assert response.data[3]["method"] == PaymentMethod.MASTERCARD
    assert response.data[3]["status"] == PaymentStatus.DECLINED


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
# Payment - Create
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

@pytest.mark.django_db
def test_payment_create_as_visitor(booking_ids):
    client = APIClient()
    url = reverse("create-read-payments")
    response = client.post(url, data={
        "booking_ids": booking_ids, 
        "amount": 100, 
        "method": PaymentMethod.MASTERCARD
    })

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_payment_create_as_normal_user(normal_user, booking_ids):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = reverse("create-read-payments")
    response = client.post(url, data={
        "booking_ids": booking_ids, 
        "amount": 100, 
        "method": PaymentMethod.MASTERCARD
        })

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_payment_create_as_staff(staff_user, booking_ids):
    client = APIClient()
    client.force_authenticate(user=staff_user)
    url = reverse("create-read-payments")
    response = client.post(url, data={
        "booking_ids": booking_ids, 
        "amount": 55, 
        "method": PaymentMethod.VISA
        })

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_payment_create_as_manager(manager_user, booking_ids):
    client = APIClient()
    client.force_authenticate(user=manager_user)
    url = reverse("create-read-payments")
    response = client.post(url, data={
        "booking_ids": booking_ids, 
        "amount": 1, 
        "method": PaymentMethod.VISA
        })

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_payment_create_as_cashier(cashier_user, booking_ids):
    client = APIClient()
    client.force_authenticate(user=cashier_user)
    url = reverse("create-read-payments")
    response = client.post(url, data={
        "booking_ids": booking_ids, 
        "amount": 250, 
        "method": PaymentMethod.MASTERCARD
        })

    assert response.status_code == status.HTTP_200_OK
