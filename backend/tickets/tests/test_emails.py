# Pytest & Unittest
import pytest
from unittest.mock import patch

# App
from ..tasks import (
    send_email_confirm_reservation,
    send_email_confirm_purchase,
    send_email_cancel_reservation,
    send_email_expire_reservation,
    send_email_complete_reservation,
)
from backend.helpers import send_email_context

# Write your tests here.


@pytest.mark.django_db
def test_send_email_confirm_reservation_list(normal_user, bookings_list):
    context = send_email_context(normal_user, bookings_list)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_confirm_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "confirm" in kwargs["subject"]
        assert "reservation" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_confirm_reservation_single(normal_user, booking_user):
    context = send_email_context(normal_user, booking_user)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_confirm_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "confirm" in kwargs["subject"]
        assert "reservation" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_confirm_purchase_list(normal_user, bookings_list):
    context = send_email_context(normal_user, bookings_list)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_confirm_purchase(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "confirm" in kwargs["subject"]
        assert "purchase" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_confirm_purchase_single_list(normal_user, booking_user):
    context = send_email_context(normal_user, booking_user)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_confirm_purchase(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "confirm" in kwargs["subject"]
        assert "purchase" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_cancel_reservation_list(normal_user, bookings_list):
    context = send_email_context(normal_user, bookings_list)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_cancel_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "canceled" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_cancel_reservation_single(normal_user, booking_user):
    context = send_email_context(normal_user, booking_user)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_cancel_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "canceled" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_expire_reservation_list(normal_user, bookings_list):
    context = send_email_context(normal_user, bookings_list)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_expire_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "expired" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_expire_reservation_single(normal_user, booking_user):
    context = send_email_context(normal_user, booking_user)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_expire_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "expired" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_complet_reservation_list(normal_user, bookings_list):
    context = send_email_context(normal_user, bookings_list)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_complete_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "complete" in kwargs["subject"]


@pytest.mark.django_db
def test_send_email_complet_reservation_single(normal_user, booking_user):
    context = send_email_context(normal_user, booking_user)

    with patch("tickets.tasks.send_mail") as mock_send_mail:
        send_email_complete_reservation(normal_user.email, context)
        mock_send_mail.assert_called_once()
        args, kwargs = mock_send_mail.call_args
        assert kwargs["recipient_list"] == [normal_user.email]
        assert "complete" in kwargs["subject"]
