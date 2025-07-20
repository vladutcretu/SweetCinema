from django.db import models

# Create your models here.


class City(models.Model):
    name = models.CharField(max_length=55, unique=True)
    address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Cities"
        ordering = ["name"]

    def __str__(self):
        return f"Sweet Cinema {self.name}"


class Theater(models.Model):
    name = models.CharField(max_length=55)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="theaters")
    rows = models.PositiveSmallIntegerField()
    columns = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Theaters"
        ordering = ["city__name", "name"]

    def save(self, *args, **kwargs):
        """
        Method to create Seat objects when Theater rows and columns are introduced.
        """
        super().save(*args, **kwargs)

        # Create rows * colums Seat objects
        self.seats.all().delete()
        seats = [
            Seat(theater=self, row=row, column=column)
            for row in range(1, self.rows + 1)
            for column in range(1, self.columns + 1)
        ]
        Seat.objects.bulk_create(seats)

    def __str__(self):
        return f"{self.city}, {self.name}, Rows: {self.rows} - Columns: {self.columns}"


class Seat(models.Model):
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE, related_name="seats")
    row = models.PositiveSmallIntegerField()
    column = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name_plural = "Seats"
        ordering = ["theater__city__name", "theater__name", "row", "column"]
        unique_together = ("theater", "row", "column")

    def __str__(self):
        return f"{self.theater.city}, {self.theater.name}, R{self.row}-C{self.column}"
