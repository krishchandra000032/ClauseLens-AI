import os

import cv2
import pytesseract
from dotenv import load_dotenv

load_dotenv()
tesseract_cmd = os.getenv("TESSERACT_CMD")

if tesseract_cmd:
    tesseract_cmd = tesseract_cmd.strip()
    tesseract_cmd = os.path.normpath(tesseract_cmd)

    pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

else:
    default_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    if os.path.exists(default_path):
        pytesseract.pytesseract.tesseract_cmd = default_path


def preprocess_image(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    gray = cv2.GaussianBlur(
        gray,
        (3, 3),
        0
    )

    processed = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    return processed


def extract_text_from_image(image_path: str) -> str:
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"Could not read image: {image_path}"
        )

    processed_image = preprocess_image(image)

    text = pytesseract.image_to_string(
        processed_image
    )

    return text.strip()