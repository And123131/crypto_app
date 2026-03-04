import torch
import torch.nn as nn
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
import os
from binance.client import Client
from datetime import datetime
from django.http import JsonResponse
import pandas as pd

# ================= HOME =================
def home(request):
    return JsonResponse({"status": "Backend is running 🚀"})


# ================= LAST PRICES =================
class LastPricesView(APIView):
    def get(self, request):
        api_key = os.getenv("api_key")
        api_secret = os.getenv("api_secret")
        client = Client(api_key, api_secret)

        candlesticks = client.get_klines(
            symbol="BTCUSDT",
            interval=Client.KLINE_INTERVAL_1DAY,
            limit=31
        )

        closing_prices = [float(c[4]) for c in candlesticks]
        timestamps = [
            datetime.fromtimestamp(c[0] / 1000).strftime("%Y-%m-%d")
            for c in candlesticks
        ]

        return Response({"prices": closing_prices, "dates": timestamps})


# ================= LSTM MODEL =================
class BTC_LSTM(nn.Module):
    def __init__(self, input_size, hidden_size=64, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True
        )
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out


# ================= LOAD MODEL =================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model.pth")

checkpoint = torch.load(MODEL_PATH, map_location=torch.device("cpu"))

input_size = 4  # close, SMA_7, EMA_14, RSI_14
model = BTC_LSTM(input_size=input_size)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

mean_feat = checkpoint["mean_feat"]
std_feat = checkpoint["std_feat"]
mean_target = checkpoint["mean_target"]
std_target = checkpoint["std_target"]


# ================= TECH INDICATORS =================
def compute_rsi(prices, period=14):
    prices = pd.Series(prices)
    delta = prices.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(alpha=1/period, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1/period, min_periods=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


# ================= PREDICT VIEW =================
class PredictView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            prices = request.data.get("data", [])

            if len(prices) < 14:
                return Response(
                    {"error": "Need at least 14 prices for RSI"},
                    status=400
                )

            df = pd.DataFrame({"close": prices})
            df["SMA_7"] = df["close"].rolling(7).mean().bfill()
            df["EMA_14"] = df["close"].ewm(span=14).mean().bfill()
            df["RSI_14"] = compute_rsi(df["close"], 14)

            feature_cols = ["close", "SMA_7", "EMA_14", "RSI_14"]
            last_features = df[feature_cols].iloc[-1].values

            x = torch.tensor(last_features, dtype=torch.float32)

            # Normalize using saved stats
            x_norm = (x - mean_feat.squeeze()) / std_feat.squeeze()

            # LSTM shape → [batch, seq_len, features]
            x_norm = x_norm.unsqueeze(0).unsqueeze(1)

            with torch.no_grad():
                pred_norm = model(x_norm)
                pred_price = pred_norm.item() * std_target + mean_target.item()

            return Response({"prediction": pred_price})

        except Exception as e:
            """
            Debug session
            """
            # print("========== PREDICTION ERROR ==========")
            # print(e)
            # raise e
            
            return Response({"error": str(e)}, status=400)