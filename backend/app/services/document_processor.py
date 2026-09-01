import os
import fitz 

from docx import Document
from app.services.ocr_service import extract_text_from_image


def clean_text(text: str) -> str:
    
    if not text:
        return ""

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    lines = []

    for line in text.split("\n"):
        line = " ".join(line.split())

        if line:
            lines.append(line)

    return "\n".join(lines)


def extract_text_from_pdf(file_path: str):

    document = fitz.open(file_path)

    pages = []
    full_text = []

    for page_index in range(len(document)):

        page = document[page_index]

        page_number = page_index + 1

        text = page.get_text("text")

        if isinstance(text, str):
            text = text.strip()
        else:
            text = ""

        if len(text) < 20:

            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(2, 2)
            )

            image_bytes = pixmap.tobytes("png")

            temp_image_path = (
                f"{file_path}_page_{page_number}.png"
            )

            with open(
                temp_image_path,
                "wb"
            ) as image_file:

                image_file.write(image_bytes)

            try:
                text = extract_text_from_image(
                    temp_image_path
                )

            finally:
                if os.path.exists(temp_image_path):
                    os.remove(temp_image_path)

        text = clean_text(text)

        page_data = {
            "page_number": page_number,
            "text": text
        }

        pages.append(page_data)

        if text:
            full_text.append(text)

    document.close()

    return {
        "text": "\n".join(full_text),
        "pages": pages
    }
  

def extract_text_from_docx(file_path: str):

    document = Document(file_path)

    paragraphs = []

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        if text:
            paragraphs.append(text)

    text = clean_text("\n".join(paragraphs))

    return {
        "text": text,
        "pages": [
            {
                "page_number": None,
                "text": text
            }
        ]
    }


def extract_text_from_file(file_path: str):
    
    extension = os.path.splitext(
        file_path
    )[1].lower()

    if extension == ".pdf":
        return extract_text_from_pdf(file_path)

    elif extension == ".docx":
        return extract_text_from_docx(file_path)

    elif extension in {
        ".png",
        ".jpg",
        ".jpeg"
    }:

        text = extract_text_from_image(
            file_path
        )

        return {
            "text": text,
            "pages": [
                {
                    "page_number": 1,
                    "text": text
                }
            ]
        }

    else:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )