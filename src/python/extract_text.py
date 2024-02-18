from paddleocr import PaddleOCR
import cv2
import sys
import json
import os


def extract_text(img_path):
    # Log the image path received
    print(f"Received image path: {img_path}")

    # Reads the image from the specified path.
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

    # Get the absolute path of the directory of the current script
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Go up two levels from the current directory to reach the project root
    project_root = os.path.dirname(os.path.dirname(current_dir))

    # Construct the path to the uploads directory
    uploads_dir = os.path.join(project_root, 'uploads')

    # Saves the preprocessed image in the 'uploads' directory for further use or debugging.
    preprocessed_path = os.path.join(uploads_dir, 'temp_preprocessed_image.jpg')
    cv2.imwrite(preprocessed_path, resized)
    print(f"Preprocessed image saved to {preprocessed_path}")

    # Constructs the paths to the PaddleOCR model directories.
    paddle_models_dir = os.path.join(project_root, 'paddle_models')
    detPath = os.path.join(paddle_models_dir, 'det', 'en_PP-OCRv3_det_infer')
    recPath = os.path.join(paddle_models_dir, 'rec', 'en_PP-OCRv4_rec_infer')
    clsPath = os.path.join(paddle_models_dir, 'cls', 'ch_ppocr_mobile_v2.0_cls_infer')

    # Initializes PaddleOCR with the specified model paths.
    print("Initializing PaddleOCR...")
    ocr = PaddleOCR(use_angle_cls=True, lang='en',
                    det_model_dir=detPath,
                    rec_model_dir=recPath,
                    cls_model_dir=clsPath)

    # Runs OCR on the preprocessed image and logs the extracted text.
    print("Running OCR on preprocessed image...")
    print("------------->Result computing -------->")
    print("------------->Preprocessed path is :  -------->", preprocessed_path)
    print("------------->OCR is :  -------->", ocr)

    result = ocr.ocr(preprocessed_path, cls=True)

    print("------------->Result computed -------->", result)
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
    # Checks for an image path argument.
    if len(sys.argv) < 2:
        print("Error: No image path provided")
        sys.exit(1)

    image_path = sys.argv[1]

    try:
        # Extracts text from the provided image path.
        extracted_text = extract_text(image_path)

        # Construct output JSON and print
        output = {"extractedText": extracted_text}
        print(json.dumps(output))  # Print the extracted text as JSON
    except Exception as e:
        # Handles any exceptions that occur during text extraction.
        print(f"An error occurred during text extraction: {e}")
        sys.exit(1)