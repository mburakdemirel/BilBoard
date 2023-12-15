from PIL import Image
from io import BytesIO
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import AnalyzeImageOptions, ImageData
from rest_framework import serializers
import requests

def resize_image(image, max_size=2048):
    with Image.open(image) as img:
        # Resize the image, maintaining aspect ratio
        img.thumbnail((max_size, max_size))
        buffer = BytesIO()
        img.save(buffer, format=img.format)
        buffer.seek(0)
        return buffer
    
def validate_image_safety(image, count):
    resized_image = resize_image(image)

    image_data = resized_image.read()

    client = ContentSafetyClient('https://bugbunnycontentsafety.cognitiveservices.azure.com', AzureKeyCredential('8edc66e999cf4d1093171f7e73558532'))
    request_safety = AnalyzeImageOptions(image=ImageData(content=image_data))

    response_safety = client.analyze_image(request_safety)
    hate = response_safety.get('categoriesAnalysis')[0].get('severity')
    self_harm = response_safety.get('categoriesAnalysis')[1].get('severity')
    sexual = response_safety.get('categoriesAnalysis')[2].get('severity')
    violence = response_safety.get('categoriesAnalysis')[3].get('severity')

    if hate !=0 or self_harm!=0 or sexual!=0 or violence!=0:
        err = "Uploaded image " + str(count) + " contain inappropriate content."
        raise serializers.ValidationError(err)


def validate_email(email):
    if not email.endswith("@bilkent.edu.tr") and not email.endswith("@ug.bilkent.edu.tr"):
        raise serializers.ValidationError("You must be a Bilkent member.")
    return email

def validate_profile_photo(profile_photo):
    endpoint = "https://bilboard-contentmoderator.cognitiveservices.azure.com/"
    headers = {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": "4042096c1951481d9859da0516043a96"
    }
    image_data = profile_photo.read()
    if profile_photo:
        response_face = requests.post(endpoint + "contentmoderator/moderate/v1.0/ProcessImage/FindFaces", headers=headers, data=image_data)
        if response_face.status_code == 200:
            result_face = response_face.json()
            if result_face['Count'] == 0:
                raise serializers.ValidationError("Uploaded profile photo should contain a face.")
        else:
            raise serializers.ValidationError("Error on azure connection")

        client = ContentSafetyClient('https://bugbunnycontentsafety.cognitiveservices.azure.com', AzureKeyCredential('8edc66e999cf4d1093171f7e73558532'))
        request_safety = AnalyzeImageOptions(image=ImageData(content=image_data))
        response_safety = client.analyze_image(request_safety)

        hate = response_safety.get('categoriesAnalysis')[0].get('severity')
        self_harm = response_safety.get('categoriesAnalysis')[1].get('severity')
        sexual = response_safety.get('categoriesAnalysis')[2].get('severity')
        violence = response_safety.get('categoriesAnalysis')[3].get('severity')

        if hate !=0 or self_harm!=0 or sexual!=0 or violence!=0:
            raise serializers.ValidationError("Uploaded profile photo contains inappropriate content.")         
    return profile_photo