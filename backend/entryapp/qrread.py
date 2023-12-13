import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError
from azure.ai.contentsafety.models import AnalyzeTextOptions


def analyze_text():
    # analyze text

    # Create an Azure AI Content Safety client
    client = ContentSafetyClient('https://bugbunnycontentsafety.cognitiveservices.azure.com', AzureKeyCredential('8edc66e999cf4d1093171f7e73558532'))

    # Contruct request
    request = AnalyzeTextOptions(text="sen salak")

    # Analyze text
    try:
        response = client.analyze_text(request)
    except HttpResponseError as e:
        print("Analyze text failed.")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise

    if response.hate_result:
        print(f"Hate severity: {response.hate_result.severity}")
    if response.self_harm_result:
        print(f"SelfHarm severity: {response.self_harm_result.severity}")
    if response.sexual_result:
        print(f"Sexual severity: {response.sexual_result.severity}")
    if response.violence_result:
        print(f"Violence severity: {response.violence_result.severity}")


if __name__ == "__main__":
    analyze_text()