# BeerBelly

https://beerbelly-cbc10.firebaseapp.com

## Description
BeeryBelly is a website that allows users to track their favorite San Diego beers and breweries. Users can add, edit, and delete breweries and beers on the site as well as add their top picks to the favorites list associated with their accounts. It was built by a team of three student engineers out of UC San Diego during the Client-Side Web Languages course.

## How-Tos:
* Sign up: From the homepage, click the 'Get Started' button. Upload a picture (optional) and an email and password for your account.
* Login: From the homepage, click the 'Login' button. Enter your email and password.
* Add a brewery: Once logged in, from the main page, click the 'Add New' card. Enter the brewery name and location.
* Add a beer: Once logged in, click on any existing brewery. Once on the brewery page, click the 'Add New' card.
* Delete a brewery or beer: Once logged in, click on the 'X' in the upper right-hand corner of a beer or brewery card.
* Favorite a brewery or beer: Once logged in, click the heart icon on the card of any existing beer or brewery.
* View favorite beers/breweries: Once logged in, from the main page, under the favorites section, click either 'Beers' or 'Breweries'.
* Update password: Once logged in, from the main page, click your profile picture. From the profile page, enter your old and new password and submit. (NOTE: Users who login using their Google accounts cannot edit their password through BeerBelly. Instead change it directly with Google).

## Source Code Layout

### Directory Layout
Since this project was built progressively as a series of homeworks. We decided to create a dedicated directory for each homework. Thus, when finishing one homework and starting another, we could simply copy the directory contents of the past homework into a new directory for the current homework assignment.

Inside of each homework directory, we created dedicated subdirectories for our HTML, CSS, and JavaScript source files. This soloed approach made managing source files during development a breeze. We also created a dedicated directory for our image assets.

### Source File Approach
After development was complete, we minified our CSS and JavaScript source files to decrease their size for transfer on the network. This notibly improved load times through the website. The files we used are minified, and the nonminified versions are in the repository for reference.

## Developer Design Decisions
Given the relatively small size and scope of the project, our development team decided to avoid the use of frameworks almost entirely. With the exception of a little jQuery sprinked throughout, the rest of our site is implemented using vanilla CSS and JavaScript. We simply didn't see a need for the use of frameworks to achieve the UI/UX/DX we desired.

For our infrastructure, we went with Google's Firebase back-end service. For smaller projects, Firebase was a great asset and dramatically decreased development time when compared to other less-integrated services. Our development team found the learning curve to be rather mild with JavaScript async issues being our biggest issue. If development on this project continues in the future, a proper domain name would need to be purchased and registered through Firebase. In terms of future scalability, Firebase would likely serve our needs well until our regular userbase grew into the thousands.

## TODOs / What's Next
If development continues on this project, the next step would be to add to the feature set. Currently, BeerBelly is a simple site with basic CRUD functionality. Sam on our development team is a true beer lover. He regularly hosts meetups where beer lovers gather to blind taste-test craft beers from around the country and rank them. He plans to use BeerBelly to track his beer drinking exploits and encourage his friends to do the same. He plans to implement a rating system in BeerBelly to facilitate the rating process during his beer meetups.

## Forethought
  There were a few reach goals that we did not have the time to implement. 

  Problem: Using different images for mobile and desktop:
  
  We know most of web is heavy on using pictures. One of the things we wanted to do was to store different sized images for     mobile and website so that the varying resolution can be appropriately served to the user.

  Potential Solution: Using imgix or different sized images:
  
  Imgix is a useful tool for this problem. By making API calls to the service we can get different sized images dynamically     which would be loaded at run time. Because the service automatically checks the size of the window, it can decide which       image to serve to the browser. The best part is that we only have to supply the API one picture and it will auto size that     image appropriately.  Another mundane and vanilla solution would be to store different sized photos on the database so we     can manually check using, JS, which images to load.
  
  Problem: Flexibility of the user’s profile

  A good app should give a certain degree of control to the user. Doing so will improve the UX and make the user feel less        restricted. We decided to keep the information a user can edit minimal. We decided the user cannot change their email they   signed in with. 

  Potential Solution: Giving users more control

  As our app stands the user cannot edit their email or send a verification email to verify our application. We only allow the   user to change their password and their profile picture just now. 
  In the future perhaps we will allow a user to delete their account, or send them a password reset email in case they forget   their email/password combination.

## Screenshots

### Homepage
![Alt text](/screenshots/homepage.png?raw=true "Homepage")

### Homepage (Mobile)
![Alt text](/screenshots/homepage-m.png?raw=true "Homepage (Mobile)")

### Sign-up
![Alt text](/screenshots/sign-up.png?raw=true "Sign-up")

### Sign-up (Mobile)
![Alt text](/screenshots/sign-up-m.png?raw=true "Sign-up (Mobile)")

### Login
![Alt text](/screenshots/login.png?raw=true "Login")

### Login (Mobile)
![Alt text](/screenshots/login-m.png?raw=true "Login (Mobile)")

### Breweries
![Alt text](/screenshots/all-breweries.png?raw=true "Breweries")

### Sidebar (Mobile)
![Alt text](/screenshots/sidebar-m.png?raw=true "Sidebar (Mobile)")

### Add Brewery
![Alt text](/screenshots/add-brewery.png?raw=true "Add Brewery")

### Delete a Beer or Brewery
![Alt text](/screenshots/delete.png?raw=true "Delete")

### Favorites
![Alt text](/screenshots/favorites.png?raw=true "Favorites")

## Meet the Developer Team
### Samuel Adams
![Alt text](https://firebasestorage.googleapis.com/v0/b/beerbelly-cbc10.appspot.com/o/Users%2Fsam.jpg?alt=media&token=1aec1aca-c1d4-41f5-af9b-bc2fe8c5e110 "Samuel")

### Emily Yew
![Alt text](https://firebasestorage.googleapis.com/v0/b/beerbelly-cbc10.appspot.com/o/Users%2Femily.jpg?alt=media&token=f6300a07-f5c7-49e0-9f68-0fbaa46fb892 "Emily")

### Nideesh Terapalli
![Alt text](https://firebasestorage.googleapis.com/v0/b/beerbelly-cbc10.appspot.com/o/Users%2Fnid.jpg?alt=media&token=9aa7ee18-0b72-4849-92e6-cc144c58cce7 "Nideesh")
