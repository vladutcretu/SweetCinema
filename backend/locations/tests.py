from django.test import TestCase
from django.urls import reverse, resolve

# DRF
from rest_framework.test import APITestCase

# App
from .models import City, Theater, Seat
from .serializers import CitySerializer, TheaterSerializer, SeatSerializer
from .views import CityListView, TheaterListView, TheaterRetrieveView, SeatListView

# Create your tests here.


# Tests for serializers.py
class CitySerializerTest(TestCase):
    def test_city_serialization(self):
        self.city = City.objects.create(name="Bucharest")
        serializer = CitySerializer(self.city)
        self.assertEqual(serializer.data, {"id": self.city.id, "name": "Bucharest"})


class TheaterSerializerTest(TestCase):
    def test_theater_serialization(self):
        self.city = City.objects.create(name="Budapest")
        self.theater = Theater.objects.create(
            name="Hall #1", city=self.city, rows=2, columns=4
        )
        serializer = TheaterSerializer(self.theater)
        self.assertEqual(serializer.data["id"], self.theater.id)
        self.assertEqual(serializer.data["name"], "Hall #1")
        self.assertEqual(serializer.data["city"]["name"], "Budapest")
        self.assertEqual(serializer.data["rows"], 2)
        self.assertEqual(serializer.data["columns"], 4)


class SeatSerializerTest(TestCase):
    def test_seat_serialization(self):
        self.city = City.objects.create(name="Belgrade")
        self.theater = Theater.objects.create(
            name="Hall #2", city=self.city, rows=1, columns=5
        )
        self.seat = Seat.objects.create(theater=self.theater, row=2, column=3)
        serializer = SeatSerializer(self.seat)
        self.assertEqual(serializer.data["theater"]["name"], "Hall #2")
        self.assertEqual(serializer.data["row"], 2)
        self.assertEqual(serializer.data["column"], 3)


# Tests for views.py
class CityListViewTest(APITestCase):
    def setUp(self):
        City.objects.create(name="Bruxelles")
        City.objects.create(name="Berlin")

    def test_city_list(self):
        response = self.client.get(reverse("city-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Berlin")


class TheaterListViewTest(APITestCase):
    def setUp(self):
        self.city = City.objects.create(name="Bratislava")
        self.theater = Theater.objects.create(
            name="Hall #4", city=self.city, rows=4, columns=6
        )
        self.theater = Theater.objects.create(
            name="Hall #3", city=self.city, rows=6, columns=8
        )

    def test_theater_list(self):
        response = self.client.get(reverse("theater-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Hall #3")
        self.assertEqual(response.data[0]["city"]["name"], "Bratislava")
        self.assertEqual(response.data[1]["name"], "Hall #4")


class TheaterRetrieveViewTest(APITestCase):
    def setUp(self):
        self.city = City.objects.create(name="Baku")
        self.theater = Theater.objects.create(
            name="Hall #5", city=self.city, rows=4, columns=6
        )

    def test_theater_retrieve_200(self):
        response = self.client.get(reverse("theater-retrieve", args=[self.theater.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)
        self.assertEqual(response.data["name"], "Hall #5")
        self.assertEqual(response.data["city"]["name"], "Baku")

    def test_movie_retrieve_404(self):
        response = self.client.get(reverse("theater-retrieve", args=[999]))
        self.assertEqual(response.status_code, 404)


class SeatListViewTest(APITestCase):
    def setUp(self):
        self.city = City.objects.create(name="Baku")
        self.theater = Theater.objects.create(
            id=7, name="Hall #5", city=self.city, rows=4, columns=6
        )
        # Seat object is automatically created by Theater

    def test_seat_list(self):
        response = self.client.get(reverse("seat-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 24)
        self.assertEqual(response.data[0]["row"], 1)
        self.assertEqual(response.data[0]["column"], 1)
        self.assertEqual(response.data[0]["theater"]["name"], "Hall #5")
        self.assertEqual(response.data[0]["theater"]["city"]["name"], "Baku")


# Test for urls.py
class URLTests(TestCase):
    def test_cities_url_resolves(self):
        resolver = resolve("/api/locations/cities/")
        self.assertEqual(resolver.func.view_class, CityListView)

    def test_theaters_url_resolves(self):
        resolver = resolve("/api/locations/theaters/")
        self.assertEqual(resolver.func.view_class, TheaterListView)

    def test_theater_url_resolves(self):
        resolver = resolve("/api/locations/theaters/1/")
        self.assertEqual(resolver.func.view_class, TheaterRetrieveView)

    def test_seats_url_resolves(self):
        resolver = resolve("/api/locations/seats/")
        self.assertEqual(resolver.func.view_class, SeatListView)
