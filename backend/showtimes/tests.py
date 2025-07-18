# from django.test import TestCase
# from django.urls import reverse, resolve
# from django.contrib.auth import get_user_model

# # DRF
# from rest_framework.test import APITestCase

# # App
# from .models import Showtime
# from movies.models import Movie
# from locations.models import City, Theater, Seat
# from tickets.models import Booking
# from .serializers import ShowtimeSerializer
# from .views import ShowtimeListView, ShowtimeRetrieveView, ShowtimeSeatsListView

# # Create your tests here.


# # Tests for serializers.py
# class ShowtimeSerializerTest(TestCase):
#     def test_showtime_serialization(self):
#         self.movie = Movie.objects.create(title="Titanic", description="About a boat")
#         self.city = City.objects.create(name="Budapest")
#         self.theater = Theater.objects.create(
#             name="Hall #1", city=self.city, rows=2, columns=4
#         )
#         self.showtime = Showtime.objects.create(
#             movie=self.movie,
#             theater=self.theater,
#             price=35,
#             date="2026-06-14",
#             time="18:00:00",
#         )
#         serializer = ShowtimeSerializer(self.showtime)
#         self.assertEqual(serializer.data["movie"]["title"], "Titanic")
#         self.assertEqual(serializer.data["theater"]["name"], "Hall #1")
#         self.assertEqual(serializer.data["price"], 35)
#         self.assertEqual(serializer.data["date"], "2026-06-14")
#         self.assertEqual(serializer.data["time"], "18:00:00")


# # Tests for views.py
# class ShowtimeListViewTest(APITestCase):
#     def setUp(self):
#         self.movie = Movie.objects.create(
#             title="Fight Club", description="About a fight"
#         )
#         self.city = City.objects.create(name="Bucharest")
#         self.theater = Theater.objects.create(
#             name="Hall #2", city=self.city, rows=2, columns=4
#         )
#         Showtime.objects.create(
#             movie=self.movie,
#             theater=self.theater,
#             price=45,
#             date="2026-06-16",
#             time="19:00:00",
#         )
#         Showtime.objects.create(
#             movie=self.movie,
#             theater=self.theater,
#             price=40,
#             date="2026-06-15",
#             time="21:00:00",
#         )

#     def test_showtime_list(self):
#         response = self.client.get(reverse("showtime-list"))
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(len(response.data), 2)
#         self.assertEqual(response.data[0]["movie"]["title"], "Fight Club")
#         self.assertEqual(response.data[1]["movie"]["title"], "Fight Club")
#         self.assertEqual(response.data[0]["theater"]["name"], "Hall #2")
#         self.assertEqual(response.data[1]["theater"]["name"], "Hall #2")
#         self.assertEqual(response.data[0]["price"], 40)
#         self.assertEqual(response.data[0]["date"], "2026-06-15")
#         self.assertEqual(response.data[0]["time"], "21:00:00")
#         self.assertEqual(response.data[1]["price"], 45)
#         self.assertEqual(response.data[1]["date"], "2026-06-16")
#         self.assertEqual(response.data[1]["time"], "19:00:00")


# class ShowtimeRetrieveViewTest(APITestCase):
#     def setUp(self):
#         self.movie = Movie.objects.create(title="Titanic", description="About a boat")
#         self.city = City.objects.create(name="Belgrade")
#         self.theater = Theater.objects.create(
#             name="Hall #3", city=self.city, rows=2, columns=4
#         )
#         self.showtime = Showtime.objects.create(
#             movie=self.movie,
#             theater=self.theater,
#             price=45,
#             date="2026-06-17",
#             time="20:00:00",
#         )

#     def test_showtime_retrieve_200(self):
#         response = self.client.get(
#             reverse("showtime-retrieve", args=[self.showtime.id])
#         )
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(len(response.data), 6)
#         self.assertEqual(response.data["movie"]["title"], "Titanic")
#         self.assertEqual(response.data["movie"]["description"], "About a boat")
#         self.assertEqual(response.data["theater"]["name"], "Hall #3")
#         self.assertEqual(response.data["theater"]["city"]["name"], "Belgrade")

#     def test_showtime_retrieve_404(self):
#         response = self.client.get(reverse("showtime-retrieve", args=[999]))
#         self.assertEqual(response.status_code, 404)


# class ShowtimeSeatsListViewTest(APITestCase):
#     def setUp(self):
#         self.movie = Movie.objects.create(
#             title="Fight Club", description="About a fight"
#         )
#         self.city = City.objects.create(name="Bucharest")
#         self.theater = Theater.objects.create(
#             name="Hall #3", city=self.city, rows=2, columns=4
#         )
#         self.seat1 = self.seat = Seat.objects.create(
#             theater=self.theater, row=3, column=1
#         )
#         self.seat2 = self.seat = Seat.objects.create(
#             theater=self.theater, row=4, column=1
#         )
#         self.showtime = Showtime.objects.create(
#             movie=self.movie,
#             theater=self.theater,
#             price=45,
#             date="2026-06-18",
#             time="21:00:00",
#         )
#         User = get_user_model()
#         self.user = User.objects.create(username="TestUser")
#         Booking.objects.create(user=self.user, showtime=self.showtime, seat=self.seat1)
#         Booking.objects.create(
#             user=self.user, showtime=self.showtime, seat=self.seat2, status="purchased"
#         )

#     def test_showtime_seats_200(self):
#         response = self.client.get(reverse("showtime-seats", args=[self.showtime.id]))
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(
#             len(response.data), 10
#         )  # 10 = 2*4 (Seat objects from Theater create) + 2 (Seat1 + Seat2 create)
#         self.assertEqual(response.data[0]["row"], 1)
#         self.assertEqual(response.data[0]["column"], 1)
#         self.assertEqual(response.data[0]["status"], "available")
#         self.assertEqual(response.data[4]["row"], 2)
#         self.assertEqual(response.data[4]["column"], 1)
#         self.assertEqual(response.data[4]["status"], "available")
#         self.assertEqual(response.data[8]["row"], 3)
#         self.assertEqual(response.data[8]["column"], 1)
#         self.assertEqual(response.data[8]["status"], "reserved")
#         self.assertEqual(response.data[9]["row"], 4)
#         self.assertEqual(response.data[9]["column"], 1)
#         self.assertEqual(response.data[9]["status"], "purchased")

#     def test_showtime_seats_404(self):
#         response = self.client.get(reverse("showtime-seats", args=[999]))
#         self.assertEqual(response.status_code, 404)


# # Test for urls.py
# class URLTests(TestCase):
#     def test_showtimes_url_resolves(self):
#         resolver = resolve("/api/showtimes/")
#         self.assertEqual(resolver.func.view_class, ShowtimeListView)

#     def test_showtime_url_resolves(self):
#         resolver = resolve("/api/showtimes/1/")
#         self.assertEqual(resolver.func.view_class, ShowtimeRetrieveView)

#     def test_showtime_seats_url_resolves(self):
#         resolver = resolve("/api/showtimes/1/seats/")
#         self.assertEqual(resolver.func.view_class, ShowtimeSeatsListView)
