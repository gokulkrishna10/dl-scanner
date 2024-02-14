from paddleocr import PaddleOCR
import cv2
import sys
import json


def extract_text(img_path):
#     print("--------------------------->executing python script<---------------------------")
    image = cv2.imread(img_path)
    if image is None:
            print(f"Error: Unable to read image at {img_path}")
            return ""

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    preprocessed_path = '../uploads/temp_preprocessed_image.jpg'
    cv2.imwrite(preprocessed_path, resized)

    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    result = ocr.ocr(preprocessed_path, cls=True)

    res = ""  # Initialize an empty string to accumulate extracted text
    for line in result:
        for info in line:
            res += info[1][0] + "\n"  # Append the text with a newline

    return res.strip()  # Return the accumulated text, removing any trailing newlines


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No image path provided")
        sys.exit(1)
    image_path = sys.argv[1]
    try:
#         print('going inside the function')
        extracted_text = extract_text(image_path)
#         print('came outside the function')
        output = {"extractedText": extracted_text}
        print(json.dumps(output))  # Print the extracted text
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

# (temporary version for testing)
# import sys
#
# print("Hello, World!")
# print(f"Received file path: {sys.argv[1]}")

