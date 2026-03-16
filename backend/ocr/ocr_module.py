import easyocr

# Initialize OCR reader
reader = easyocr.Reader(['en'], gpu=False)

def extract_text(image_path):
    result = reader.readtext(image_path)

    extracted_text = " ".join([item[1] for item in result])

    return extracted_text


if __name__ == "__main__":

    image = "sample_image.png"

    text = extract_text(image)

    print("\nExtracted Text:\n")
    print(text)