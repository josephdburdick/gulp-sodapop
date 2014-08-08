Gulp Sodapop Front-end 
=========
### Powered by Node, Gulp, Sass, Bootstrap, and more. 

#### Setup / Installation [depending on your setup you may need to sudo some of these commands
- Install Node.js [http://nodejs.org/download/] and NPM (now comes with Node.js)
- You'll need ruby 1.9+
- Run gem install sass
- Install Gulp globally by running `npm install -g gulp`
- Clone this repo down and cd into it
- Run 'npm -g install'
- Run 'npm -g bower install'
- Run 'npm -g install gulp'
- Run 'bower install'
- Run 'gulp watch' to render site locally or simply 'gulp' to build the project


Styling How-to
=========
### Typography
- Do not use font-weight when styling custom fonts. Look in partials/_fonts.scss and find the font/weight you're looking for and use @extend %typekit-font-name-WeightName instead. This will include the necessary font-family, font-style, and font-weight TypeKit needs to prevent any mishaps with incorrect inclusions.

### REM-to-PX unit fallback mixins 

The rem font-size unit is similar to em, only instead of cascading it's always relative to the root (html) element (more information). This has pretty good modern browser support, it's just IE 8 and down we need to provide px fallbacks for.

Instead of repeating ourselves everywhere, we can use a LESS or SASS mixins to keep it clean. These mixins assumes:

```
	html {
  		font-size: 62.5%; /* Sets up the Base 10 stuff */
	}
```

- Use @include font-size(1.2) to size a font 1.2rem or 12px
- Use @include line-height(2.4) to set the line-height 2.4rem
- Use @include rem({css-propery-name}, {values})
	- For example, @include rem(margin, 2,1,1.5,1); would result in:
	```
		margin: 20px 10px 15px 10px;
		margin: 2rem 1rem 1.5rem 1rem;
	```

