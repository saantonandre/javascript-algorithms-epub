## EPUB generator for JavaScript Algorithms and Data Structures

Generates an e-book(.epub) from [@trekhleb](https://github.com/trekhleb)'s [`javascript-algorithms`](https://github.com/trekhleb/javascript-algorithms) repository.

Running the  code does the following:
- Downloads the repo's content
- Filters out unnecessary files (no script files and such)
- Replaces the relative image paths to absolute (required for the epub generation)
- Creates a chapter for each markdown file, converting its content to HTML
- Generates the .epub file from the chapters

Markdown to HTML:
[showdown](https://github.com/showdownjs/showdown)
HTML to EPUB:
[showdown](https://github.com/cyrilis/epub-gen)

### Instructions
Run the command `yarn` or `npm install` to install the required packages
Run the command `yarn start` or `npm start` to start the EPUB generation

The .epub file will be generated under the `dist` directory

### License
The script is available as open source under the terms of the [MIT License](https://opensource.org/license/mit/).
