# LLM Wrapper Chat

## Overview

The **LLM Wrapper Chat** is a web-based application that provides an interface for users to interact with an LLM (Large Language Model) model (Phi - Microsoft Research LLM). It includes features such as a WYSIWYG editor, custom command handling, and web scraping for enhanced user interactions with LLM responses.

## Development Notes

Many of the tests and additional skeletons for the components like headers and sidebar for this project were generated with the assistance of ChatGPT(GPT-40) and Claude (Sonnet 3.5) to speed up the development process. I then customized and optimized these components by adding styling, improving code efficiency, and aligning the overall structure with the project’s requirements. I also used Gemini Code compelte for faster code compeltions efficient development.

This approach allowed me to focus more on the functionality and design while ensuring that the development process remained efficient and on track with the project deadline.

## Features

- **WYSIWYG Editor:** Users can type and format text using a rich-text editor.
- **LLM Response Handling:**
  - Renders markdown with proper formatting.
  - Syntax highlights code blocks within responses.
- **Stop LLM Generation:** Users can stop the LLM’s response generation.
- **Editable Messages:** Users can edit previous messages and resend them to the LLM for updated responses.
- **Custom Commands:**
  - `include-url` command for web scraping and replacing URL placeholders with site content.
  - A modal that allows users to add URLs and generate the command with optional advanced settings.

## Extra Features

- Advanced command options like `max_execution_time`, `filter`, and `store` are customizable.
- Default command parameters for easier user interaction.

## Setup Instructions

### Prerequisites

- Node.js
- Next.js
- Deployed LLM model with access token

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/unictestfrontendjude.git
   cd unictestfrontendjude
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables for Hugging Face API:

   - Add your Hugging Face API key to `.env`:
     ```env
     NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_api_key
     ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`.

## Web Scraping

This project includes a simple web scraper that handles the `include-url` command. When a URL is detected, the scraper fetches content in the background and replaces the command with the relevant information from the site.

## CI/CD Deployment

The app is deployed using Github Actions CI/CD on Vercel. The current live version can be found here: [text](https://unictestfrontendjude.vercel.app/dashboard)

## Usage

1. **Compose a message:** Type your message in the WYSIWYG editor.
2. **Send the message:** The message will be sent to the LLM model.
3. **Use custom commands:** Add URLs with the `include-url` command, or use the provided modal to insert the command automatically.
4. **Stop generation:** Stop the LLM’s response at any time using the stop button.
5. **Edit previous messages:** Click on the edit but under the prompt you would liek to modify, modify your message, and save to resend.

## Challenges and Solutions

### 1. **WYSIWYG Editor Integration**

**Challenge:** Integrating the editor and ensuring it works properly with the LLM's input and response was causing issues with NextJs SSR because React-quill uses teh document object which is exclusive to the client side.
**Solution:** With help from Claude, GPT-4 and Stackoveflow threads I was able to debug and resolved to import the components hosting this dynamically and this came with the upper hand of reducing initial load time too.

### 2. **Markdown and Code Highlighting**

**Challenge:** Properly rendering markdown and adding syntax highlighting for code blocks in the LLM response was complex as react amrkdown wasnt recognizing lists correctly.
**Solution:** I added custom code on top of the `react-markdown` library allowing teh proepr rendering of lists.

### 3. **Custom Command Parsing**

**Challenge:** Web Scapping CORS error. When scrapping, teh web scrapper was giving a CORS error.
**Solution:** To handle this and in the process improve perfomance, I handled the call using NEXT Server allowing me to conrol requests and responses. This way, I also implemented error handling to properly handle errors experienced during scraping.

## Known Issues

- The LLM might not return output due to token limitations. I have implemeneted a trimming function to lower token consumption but this might still be bypassed .
- Occasional delays during web scraping for large websites.
- LLM might fail to return response or return incorrect response as this LLM is still being trained by Microsoft

## Future Enhancements

- Improved error handling during web scraping.
- Additional custom commands for user prompts.
- Add retry button to try fetching if LLM fail to return response
- Properly trimming prompts and emssages to better manage tokens
