MinimalList is a basic Todo List app with the following features: 
–	basic add/remove/edit/mark complete operations
–	bulk operation buttons that will dynamically disable based off List state
–	local persistence via localStorage API - coming back to the app using the same browser will reload the same List state as when you left
My background is in back-end development, so the goal of this project was to get a feel for front-end development. MinimalList was built using vanilla JS and styled with Tailwind CSS. 
 Development Timeline
–	CSS was the biggest mental hurdle for me, so in the initial version I went straight into the JS and got some basic functionality with plain JS. I used Bootstrap for the next version and refactored the JS into a more OOP-style. However, as I made more progress, I realized that Bootstrap was too high-level in terms of abstracting away CSS fundamentals and moved to Tailwind, a low-level utility based CSS framework, which allowed me more control of individual layout and styles and forced me to understand the underlying CSS properties in depth. 

If I had more time....
–	refactor the JS - I used “private” methods (via _underscore notation) to control things like List state, but because those methods are still publicly accessible I found that I would call them directly in order to get some quick workarounds. In subsequent projects I want to experiment with private methods that prevent some of this leaky abstraction (method definitions in the constructor, Symbols, etc.)
–	reduce the  CSS - this point is two-fold, both relating to the Tailwind framework operates. The first angle is to reduce the number of inline Tailwind classes in the HTML by extracting shared CSS components into shared components. For example, all of the buttons in the Bulk Actions bar are styled similary except background and hover colors, so all of the shared classes can be abstracted into a specific class. This is no different from refactoring traditional CSS, but Tailwind uses special CSS “directives” that require going through a build process to essentially pre-process and expand those CSS classes. For more info see:  https://tailwindcss.com/docs/extracting-components#extracting-css-components-with-apply
–	The second angle is to reduce the final CSS footprint by removing all the unused CSS classes. Tailwind generates thousands of CSS classes - “p-1” applies “padding: 0.25rem”, “bg-green-100” applies "background-color:  #f0fff4 ”, etc. Although this makes styling extremely accessible during development, it has the downside of generating thousands of classes that are ultimately unused. There are ways of reducing this footprint by configuring and purging (PurgeCSS) any unused classes, but that also requires running a build so I chose to ignore it and use the minified version. See: https://tailwindcss.com/docs/controlling-file-size

Thoughts and Observations
–	CSS was the biggest mental hurdle for me, 

