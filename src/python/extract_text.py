from paddleocr import PaddleOCR
import cv2
import sys
import json

def extract_text(img_path):
    print("---------------------------> Start executing Python script <---------------------------")

    # Log the image path received
    print(f"Received image path: {img_path}")

    image = cv2.imread(img_path)

    # Check if the image is loaded successfully
    if image is None:
        print(f"Error: Unable to read image at {img_path}")
        return ""
    else:
        print("Image successfully loaded.")

    # Convert to grayscale and resize
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
    print("Image preprocessed (grayscale and resized).")

    # Save preprocessed image - this can also help in debugging by checking the saved image
    preprocessed_path = 'temp_preprocessed_image.jpg'
    cv2.imwrite(preprocessed_path, resized)
    print(f"Preprocessed image saved to {preprocessed_path}")

    # Initialize PaddleOCR and run OCR
    print("Initializing PaddleOCR...")
    ocr = PaddleOCR(use_angle_cls=True, lang='en',
                    det_model_dir='/usr/src/app/paddle_models/det/en_PP-OCRv3_det_infer',
                    rec_model_dir= '/usr/src/app/paddle_models/rec/en_PP-OCRv4_rec_infer',
                    cls_model_dir= '/usr/src/app/paddle_models/cls/ch_ppocr_mobile_v2.0_cls_infer')
    print("Running OCR on preprocessed image...")
    result = ocr.ocr(preprocessed_path, cls=True)

    res = ""  # Initialize an empty string to accumulate extracted text
    for line in result:
        for info in line:
            res += info[1][0] + "\n"  # Append the text with a newline
            print(f"Extracted line: {info[1][0]}")  # Log each extracted line of text

    # Log final accumulated text
    print("--------------------------- Extracted Text ---------------------------")
    print(res)
    print("---------------------------------------------------------------------")

    return res.strip()  # Return the accumulated text, removing any trailing newlines

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No image path provided")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        print('Starting text extraction...')
        extracted_text = extract_text(image_path)
        print('Text extraction completed.')

        # Construct output JSON and print
        output = {"extractedText": extracted_text}
        print(json.dumps(output))  # Print the extracted text as JSON
    except Exception as e:
        print(f"An error occurred during text extraction: {e}")
        sys.exit(1)




# from paddleocr import PaddleOCR
# import cv2
# import sys
# import json
#
#
# def extract_text(img_path):
#     print("--------------------------->executing python script<---------------------------")
#     image = cv2.imread(img_path)
#     if image is None:
#             print(f"Error: Unable to read image at {img_path}")
#             return ""
#
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)
#
#     preprocessed_path = '../uploads/temp_preprocessed_image.jpg'
#     cv2.imwrite(preprocessed_path, resized)
#
#     ocr = PaddleOCR(use_angle_cls=True, lang='en')
#     result = ocr.ocr(preprocessed_path, cls=True)
#
#     res = ""  # Initialize an empty string to accumulate extracted text
#     for line in result:
#         for info in line:
#             res += info[1][0] + "\n"  # Append the text with a newline
#
#     return res.strip()  # Return the accumulated text, removing any trailing newlines
#
#
# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Error: No image path provided")
#         sys.exit(1)
#     image_path = sys.argv[1]
#     try:
# #         print('going inside the function')
#         extracted_text = extract_text(image_path)
# #         print('came outside the function')
#         output = {"extractedText": extracted_text}
#         print(json.dumps(output))  # Print the extracted text
#     except Exception as e:
#         print(f"Error: {e}")
#         sys.exit(1)

# (temporary version for testing)
# import sys
#
# print("Hello, World!")
# print(f"Received file path: {sys.argv[1]}")

