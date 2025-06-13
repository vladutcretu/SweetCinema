from django.test import TestCase
from django.urls import reverse, resolve

# DRF
from rest_framework.test import APITestCase

# App
from .models import Genre, Movie
from .serializers import GenreSerializer, MovieSerializer
from .views import GenreListView, MovieListView, MovieRetrieveView

# Create your tests here.


# Tests for serializers.py
class GenreSerializerTest(TestCase):
    def test_genre_serialization(self):
        self.genre = Genre.objects.create(name="Action")
        serializer = GenreSerializer(self.genre)
        self.assertEqual(serializer.data, {"id": self.genre.id, "name": "Action"})


class MovieSerializerTest(TestCase):
    def test_movie_serialization(self):
        self.genre = Genre.objects.create(name="Action")
        self.movie = Movie.objects.create(title="Titanic", description="About a boat")
        self.movie.genres.add(self.genre)
        serializer = MovieSerializer(self.movie)
        self.assertEqual(serializer.data["title"], "Titanic")
        self.assertEqual(serializer.data["description"], "About a boat")
        self.assertEqual(serializer.data["genres"][0]["name"], "Action")


# Tests for views.py
class GenreListViewTest(APITestCase):
    def setUp(self):
        Genre.objects.create(name="Horror")
        Genre.objects.create(name="Fantasy")

    def test_genre_list(self):
        response = self.client.get(reverse("genre-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]["name"], "Horror")


class MovieListViewTest(APITestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Romance")
        self.movie = Movie.objects.create(title="Titanic", description="About a boat")
        self.movie.genres.add(self.genre)

    def test_movie_list(self):
        response = self.client.get(reverse("movie-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Titanic")
        self.assertEqual(response.data[0]["description"], "About a boat")


class MovieRetrieveTest(APITestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Romance")
        self.movie = Movie.objects.create(title="Titanic", description="About a boat")
        self.movie.genres.add(self.genre)

    def test_movie_retrieve_200(self):
        response = self.client.get(reverse("movie-retrieve", args=[self.movie.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data["title"], "Titanic")
        self.assertEqual(response.data["description"], "About a boat")
        self.assertIn("genres", response.data)
        self.assertEqual(response.data["genres"][0]["name"], "Romance")

    def test_movie_retrieve_404(self):
        response = self.client.get(reverse("movie-retrieve", args=[999]))
        self.assertEqual(response.status_code, 404)


# Test for views.py
class URLTests(TestCase):
    def test_genres_url_resolves(self):
        resolver = resolve("/api/movies/genres/")
        self.assertEqual(resolver.func.view_class, GenreListView)

    def test_movies_url_resolves(self):
        resolver = resolve("/api/movies/")
        self.assertEqual(resolver.func.view_class, MovieListView)

    def test_movie_url_resolves(self):
        resolver = resolve("/api/movies/1/")
        self.assertEqual(resolver.func.view_class, MovieRetrieveView)
