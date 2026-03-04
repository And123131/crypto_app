import torch
import torch.nn as nn
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
import os
from binance.client import Client
from datetime import datetime
from django.http import JsonResponse


def home(request):
    return JsonResponse({"status": "Backend is running 🚀"})


class LastPricesView(APIView):
    def get(self, request):
        api_key = os.getenv("api_key")
        api_secret = os.getenv("api_secret")
        client = Client(api_key, api_secret)

        # Get last 31 daily BTCUSDT prices
        candlesticks = client.get_klines(symbol="BTCUSDT", interval=Client.KLINE_INTERVAL_1DAY, limit=31)
        closing_prices = [float(c[4]) for c in candlesticks]

        # Optionally, return timestamps too
        timestamps = [datetime.fromtimestamp(c[0] / 1000).strftime("%Y-%m-%d") for c in candlesticks]

        return Response({"prices": closing_prices, "dates": timestamps})


# ================= MODEL DEFINITION =================
class NeuralNetwork(nn.Module):
    def __init__(self, window_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(window_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        return self.net(x)


# ================= LOAD MODEL =================
window_size = 31  # Must match training
model = NeuralNetwork(window_size)
state_dict = torch.load("api/model.pth", map_location=torch.device('cpu'))
model.load_state_dict(state_dict)
model.eval()


# ================= API VIEW =================
class PredictView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            # Get input array
            input_data = request.data.get("data", [])

            # Validate input length
            if len(input_data) != window_size:
                return Response(
                    {"error": f"Input length must be {window_size}"},
                    status=400
                )

            # Convert to tensor and predict
            x = torch.tensor([input_data], dtype=torch.float32)

            # Compute mean and std for normalization
            prices_tensor = torch.tensor(input_data, dtype=torch.float32)
            mean_price = prices_tensor.mean()
            std_price = prices_tensor.std() if prices_tensor.std() > 1e-6 else torch.tensor(1.0)

            # Normilize (rescale the data to [-1.0, 0.0, 1.0])
            x_norm = (x - mean_price) / std_price

            # Predict
            with torch.no_grad():
                pred_norm = model(x_norm)
                # un-normalize
                pred_price = pred_norm.item() * std_price + mean_price.item()

            return Response({"prediction": pred_price})

        except Exception as e:
            return Response({"error": str(e)}, status=400)