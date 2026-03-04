from django.urls import path
from .views import PredictView, LastPricesView, home

urlpatterns = [
    path('', home),
    path("predict/", PredictView.as_view(), name="predict"),
    path("last-prices/", LastPricesView.as_view(), name="last_prices"),
]