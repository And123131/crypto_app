export async function getPrediction(inputArray) {
  const response = await fetch("http://127.0.0.1:8000/api/predict/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: inputArray }),
  });
  const result = await response.json();
  return result.prediction;
}