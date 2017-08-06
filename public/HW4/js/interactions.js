$(document).ready(function(){

  var currentPage = (window.location.pathname).split("/").pop();
  var COMMUNITY_PAGE = "community.html";
  var BREWERY_PAGE = "brewery.html";
  var INDEX_PAGE = "index.html";

  ///////STATIC CONTENT//////

  // toggles sidebar on click
  $("#sidebar-button").click(function(){
    if (parseInt($("nav#sidebar").css('left')) == -250) {
      $("nav#sidebar").css('left', '0px', 'important');
      $("button#sidebar-button").css('left', '250px', 'important');
      $("section#addnew-modal").css('left', '250px', 'important');
      $("section#addnew-modal").css('right', '-250px', 'important');
      $("main").css('left', '250px', 'important');
      $("main").css('right', '-250px', 'important');
    }
    else {
      $("nav#sidebar").css('left', '-250px', 'important');
      $("button#sidebar-button").css('left', '0px', 'important');
      $("section#addnew-modal").css('left', '0px', 'important');
      $("section#addnew-modal").css('right', '0px', 'important');
      $("main").css('left', '0px', 'important');
      $("main").css('right', '0px', 'important');
    }
  });

  //direct sidebar links to pages with search queries
  $("#fav-breweries, #fav-beers, #all-breweries, #all-beers").click(function(e) {
    e.preventDefault();
    var which = $(this).attr("id");
    if(which == "fav-breweries") {
      location.href = COMMUNITY_PAGE+"?fav=Breweries";
    }
    else if (which == "fav-beers") {
      location.href = BREWERY_PAGE+"?fav=Beers";
    }
    else if (which == "all-breweries") {
      location.href = COMMUNITY_PAGE;
    }
    else {
      location.href = BREWERY_PAGE;
    }
  });

  //log current user out if clicking on signout link
  $("a.logout").click(function(){
    const promise = firebase.auth().signOut();
    promise.catch(e => console.log(e.message));
    promise.then(function() {
      location.href = INDEX_PAGE;
    });
  });

  //show modal when clicking on add tile
  $("li#addnew").click(function(){
    $("section#addnew-modal").show();
    $("#addnew-error").hide();
    $("section#addnew-modal form")[0].reset();
  });

  //hide modal when clicking on X
  $("section.modal a.close").click(function(item){
    $("section#edit-modal form").removeClass();
    $("section.modal").hide();
  });

  //validate/change db according to edit modal submitted information
  $("#edit-modal form").submit(function(e) {
    e.preventDefault();
    var values = getFormData($(this));
    var oldName = $(this).attr('class');
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers";
    if (oldName != values["name"]) {
      itemExists(type,values["name"]).then(function(exists) {
        if (exists) displayEditError(values["name"]);
        else {
          //item is not in the db yet
          removeItem(oldName, type).then(function() {
            if (type == "Breweries") {
              addBrewery(values["name"], values["name"], values["location"]).then(function() {
                location.reload(true);
              });
            }
            else {
              addBeer(values["name"], values["brewery"], values["name"], values["type"], values["style"]).then(function() {
                location.reload(true);
              });
            }
          });
        }
      });
    }
    else {
      //name stayed the same
      if (type == "Breweries") {
        editBrewery(values["name"], values["name"], values["location"]).then(function() {
          location.reload(true);
        });
      }
      else {
        editBeer(values["name"], values["brewery"], values["name"], values["type"], values["style"]).then(function() {
          location.reload(true);
        });
      }
    }
  });

  //validate/change db according to addnew modal submitted information
  $("#addnew-modal form").submit(function(e) {
    e.preventDefault();
    var values = getFormData($(this));
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers";
    itemExists(type,values["name"]).then(function(exists) {
      if (exists) displayAddNewError(values["name"]);
      else {
        if (type == "Breweries") {
          addBrewery(values["name"], values["name"], values["location"]).then(function() {
            location.reload(true);
          });
        }
        else {
          addBeer(values["name"], values["brewery"], values["name"], values["type"], values["style"]).then(function() {
            location.reload(true);
          });
        }
      }
    });
  });

  /////////DYNAMIC CONTENT/////////////

  //direct clicks to breweries to correct brewery page
  $(document.body).on('click', '#card-content li a', function(e){
    e.preventDefault();
    if(currentPage == COMMUNITY_PAGE && $(this).attr("id") != "addnew" && $(this).parent().attr("class") != "delete-confirm") {
      var selected = $(this).find('.card-name').text();
      location.href = BREWERY_PAGE+"?brewery="+selected;
    }
  });

  //show delete confirmation modal if card's 'X' icon is clicked
  $(document.body).on('click', '#card-content img.delete', function(){
    $(this).parent().find('.delete-confirm').show();
  });

  //hide delete confirmation modal if 'no' is clicked
  $(document.body).on('click', '.delete-confirm a.cancel', function(){
    $(this).parent().hide();
  });

  //perform deletion if 'yes' is clicked in delete confirmation modal
  $(document.body).on('click', '.delete-confirm a.confirm', function(){
    var listitem = $(this).parent().parent();
    var title = listitem.find("p.card-name").text();
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers";
    removeItem(title, type).then(function() {
      listitem.hide();
    });
  });

  // Clicking on heart icon will toggle appearance and update database
  $(document.body).on('click', '#card-content .fav', function(){
    var notFav= "../../images/heart.png";
    var fav= "../../images/heart-full.png";
    var favButton = $(this).find('img');
    var userId = firebase.auth().currentUser.uid;
    var selected = null;
    if (currentPage == COMMUNITY_PAGE) {
      selected = $(this).siblings('a').find('.card-name').text();
    }
    else {
      selected = $(this).parent().find('.card-name').text();
    }

    if (favButton.attr('src') == notFav) {
      favButton.attr('src', fav);
      addFav(selected, userId);
    }
    else {
      favButton.attr('src', notFav);
      removeFav(selected, userId);
    }
  });

  //show form modal popuplate items depending on what was clicked
  //NOTE: will change the class of the form to pass on which card was clicked
  $(document.body).on('click', '#card-content .edit', function(){
    if (currentPage == COMMUNITY_PAGE)
    {
      var item = $(this).siblings('a').find('.card-name').text();
      $("section#edit-modal form").addClass(item);
      popInfo(item).then(function(poppedItem) {
        $("#brewery-name-edit").attr('value', poppedItem["name"]);
        $("#brewery-location-edit").attr('value', poppedItem["location"]);
      });
    }
    else if (currentPage == BREWERY_PAGE)
    {
      item = $(this).parent().find('.card-name').text();
      $("section#edit-modal form").addClass(item);
      popInfo(item).then(function(poppedItem) {
        $("#beer-name-edit").attr('value', poppedItem["name"]);
        $("#beer-brewery-name-edit").attr('value', poppedItem["brewery"]);
        var selectType = document.getElementById("beer-type-edit");
        for (var i = 0; i < selectType.options.length; i++) {
          if (selectType.options[i].text == poppedItem["type"]) {
            selectType.options[i].selected = true;
          }
        }
        var selectStyle = document.getElementById("beer-style-edit");
        for (var i = 0; i < selectStyle.options.length; i++) {
          if (selectStyle.options[i].text == poppedItem["style"]) {
            selectStyle.options[i].selected = true;
          }
        }
      });
    }
    $("#edit-error").hide();
    $("section#edit-modal").show();
  });

  ////////FUNCTIONS//////////

  //display error in addnew modal
  function displayAddNewError(name) {
    $("#addnew-error").text(name + " already exists!");
    $("#addnew-error").show();
  }

  //display error in edit modal
  function displayEditError(name) {
    $("#edit-error").text("Another "+ name + " already exists!");
    $("#edit-error").show();
  }

  //pull data from form and return as hashmap
  function getFormData(form) {
    var values = form.serializeArray();
    var info = {};
    for(var i = 0; i < values.length; i++) {
      info[values[i]["name"]] = values[i]["value"];
    }
    return info;
  }

  //retrieve relevant information about item from db
  function popInfo(item) {
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers"
    var typeItem = firebase.database().ref(type+'/'+item);
    var def = $.Deferred();

    typeItem.once("value", function(snapshot) {
      if (snapshot !== null) {
        def.resolve(snapshot.val());
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //remove specific item from db
  function removeItem(title, type) {
    var item = firebase.database().ref(type+'/'+title);
    var def = $.Deferred();

    item.once("value", function(snapshot) {
      if (snapshot !== null) {
        def.resolve(item.remove());
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //generate a number between min(inclusive) and max(inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getImage(name, type) {
    var img = firebase.storage().ref(type+'/'+name);
    var def = $.Deferred();

    img.getDownloadURL().then(function (url) {
      def.resolve(url);
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //add beer to db
  function addBeer(item, brewery, name, type, style) {
    var beerItem = firebase.database().ref('Beers/');
    var def = $.Deferred();
    getImage("beer"+(getRandomInt(1, 10))+".jpg", "Beers").then(function (url) {
      var data = {};
      var pic = url;
      data[item] = {
        brewery: brewery,
        name: name,
        type: type,
        style: style,
        pic: pic
      }
      def.resolve(beerItem.update(data));
    });
    return def.promise();
  }

  //add brewery to db
  function addBrewery(item, name, location) {
    var breweryItem = firebase.database().ref('Breweries/');
    var def = $.Deferred();
    getImage("brewery"+(getRandomInt(1, 5))+".jpg", "Breweries").then(function(url) {
      var data = {};
      var pic = url;
      data[item] = {
        name: name,
        location: location,
        pic: pic
      }
      def.resolve(breweryItem.update(data));
    });
    return def.promise();
  }

  //search the db for specified item and return boolean indicating existence
  function itemExists(type, item) {
    var check = firebase.database().ref(type+'/'+item);
    var def = $.Deferred();

    check.once("value", function(snapshot) {
      if (snapshot.val() !== null) {
        def.resolve(true);
      }
      else {
        def.resolve(false);
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //function handles changing fields of a particular brewery in db
  function editBrewery(item, name, location) {
    var breweryItem = firebase.database().ref('Breweries/'+item);
    var def = $.Deferred();

    breweryItem.once("value", function(snapshot) {
      if (snapshot !== null) {
        var brewery = snapshot.val();
        brewery["name"] = name;
        brewery["location"] = location;
        def.resolve(breweryItem.update(brewery));
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //function handles changing fields of a particular beer in db
  function editBeer(item, brewery, name, type, style) {
    var beerItem = firebase.database().ref('Beers/'+item);
    var def = $.Deferred();

    beerItem.once("value", function(snapshot) {
      if (snapshot !== null) {
        var beer = snapshot.val();
        beer["brewery"] = brewery;
        beer["name"] = name;
        beer["type"] = type;
        beer["style"] = style;
        def.resolve(beerItem.update(beer));
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //function handles updating firebase databse with current user's favorite
  function addFav(selected, userId) {
    var user = firebase.database().ref('Users/'+userId);
    var field = (currentPage == COMMUNITY_PAGE) ? user.child("Breweries") : user.child("Beers");
    var def = $.Deferred();

    field.once("value", function(snapshot) {
      if (snapshot.val() === null) {
        var favoriteSet = {"name": [selected]};
        var item = {};
        item[(currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers"] = favoriteSet;
        def.resolve(user.update(item));
      }
      else {
        var favoriteSet = snapshot.val().name;
        if(favoriteSet != null) {
          def.resolve(favoriteSet.push(selected));
        }
        else {
          favoriteSet = [selected];
        }
        def.resolve(field.update({"name": favoriteSet}));
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //function handles updating firebase databse with current user's unfavorite
  function removeFav(selected, userId) {
    var user = firebase.database().ref('Users/'+userId);
    var field = (currentPage == COMMUNITY_PAGE) ? user.child("Breweries") : user.child("Beers");
    var def = $.Deferred();

    field.once("value", function(snapshot) {
      if (snapshot.val() != null) {
        var favoriteSet = snapshot.val().name;
        if(favoriteSet != null) {
          var index = favoriteSet.indexOf(selected);
          if (index > -1) {
            def.resolve(favoriteSet.splice(index, 1));
          }
        }
        def.resolve(field.update({"name": favoriteSet}));
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //parse the search query
  var getSearch = function() {
    if (window.location.search != "") {
      var query = window.location.search.split("?")[1];
      var search = {};
      search[query.split("=")[0]] = query.split("=")[1];
      return search;
    }
    else return null;
  }

  //get current user's profile and update page
  function getProfilePic() {
    var userId = firebase.auth().currentUser.uid;
    var user = firebase.database().ref('Users/'+userId+'/Profile');

    user.once("value", function(snapshot) {
      if (snapshot.val() !== null) {
        var image = snapshot.val();
        var profile = userId + "." + image["format"];
        var profileImg = firebase.storage().ref('Users/'+profile);
        profileImg.getDownloadURL().then(function (img) {
          $("img#profile").attr("src", img);
        }, function (error) {
          console.log("Error: " + error.code);
        });
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  //get all beers or breweries from db
  function getAll() {
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers";
    var item = firebase.database().ref(type+'/');
    var def = $.Deferred();

    item.once("value", function(snapshot) {
      if (snapshot.val() !== null) {
        var information = [];
        for (var each in snapshot.val()) {
          var data = {};
          data["name"] = each;
          data["image"] = snapshot.val()[each].pic;
          information.push(data);
        }
        def.resolve(information);
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //get all favorites of the user
  function getFavs(type) {
    var userId = firebase.auth().currentUser.uid;
    var favs = firebase.database().ref('Users/'+userId+'/'+type+'/');
    var def = $.Deferred();

    favs.once("value", function(snapshot) {
      if (snapshot.val() !== null) {
        console.log(snapshot.val());
        var information = [];
        for (var i in snapshot.val()["name"]) {
          information.push(snapshot.val()["name"][i]);
        }
        def.resolve(information);
      }
      else def.resolve([]);
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //get all beers
  function getBeers() {
    var beers = firebase.database().ref('Beers/');
    var def = $.Deferred();

    beers.once("value", function(snapshot) {
      if (snapshot.val() !== null) {
        var information = [];
        for (var each in snapshot.val()) {
          var data = {};
          data["name"] = each;
          data["image"] = snapshot.val()[each].pic;
          data["brewery"] = snapshot.val()[each].brewery;
          information.push(data);
        }
        def.resolve(information);
      }
    }, function (error) {
      console.log("Error: " + error.code);
    });
    return def.promise();
  }

  //view all beers or breweries
  function viewAll() {
    var type = (currentPage == COMMUNITY_PAGE) ? "Breweries" : "Beers";
    getAll().then(function(info) {
      getFavs(type).then(function(favs) {
        for (var i in info) {
          if($.inArray(info[i]["name"], favs) > -1) {
            info[i]["fav"] = "heart-full";
          }
          else {
            info[i]["fav"] = "heart";
          }
        }
        addAllTemplates(info);
      });
    });
  }

  //view only beers of a specific brewery on page
  function viewBrewery(brewery) {
    getFavs("Beers").then(function (favs) {
      getBeers().then(function(beers) {
        var toRemove = [];
        for (var i in beers) {
          if(beers[i].brewery != brewery) {
            toRemove.push(parseInt(i));
          }
        }
        for (var i = toRemove.length-1; i >= 0; i--) {
          beers.splice(toRemove[i],1);
        }
        for (var i in beers) {
          if($.inArray(beers[i].name, favs) > -1) {
            beers[i]["fav"] = "heart-full";
          }
          else {
            beers[i]["fav"] = "heart";
          }
        }
        addAllTemplates(beers);
      });
    });
  }

  //view only favorites on page
  function viewFavs(type) {
    getFavs(type).then(function(favs) {
      getAll().then(function(info) {
        var toRemove = [];
        for (var i in info) {
          if($.inArray(info[i]["name"], favs) == -1) {
            toRemove.push(parseInt(i));
          }
        }
        for (var i = toRemove.length-1; i >= 0; i--) {
          info.splice(toRemove[i],1);
        }
        for (var i in info) {
          info[i]["fav"] = "heart-full";
        }
        addAllTemplates(info);
      });
    });
  }

  //add information to templates
  function addAllTemplates(array) {
    $("#card-template").tmpl(array).appendTo("#card-list");
  }

  //change header of page depending on which page the user is on
  function prepareHeaders() {
    var data = getSearch();
    if (data === null) {
      if(currentPage == BREWERY_PAGE) $("h1").text("All Beers");
    }
    else {
      for(var category in data) break;
      if (category == "brewery") {
        if(currentPage == BREWERY_PAGE) $("h1").text(data["brewery"]+" Beers");
      }
      else if (category == "fav") {
        $("#addnew").hide();
        if(currentPage == COMMUNITY_PAGE) $("h1").text("Favorite Breweries");
        else $("h1").text("Favorite Beers");
      }
    }
  }

  //autofill address for community page
  if (currentPage == COMMUNITY_PAGE) {
    google.maps.event.addDomListener(window, 'load', function () {
      var options = {
        componentRestrictions: {
          country: "us"
        }
      };
      var addPlaces = new google.maps.places.Autocomplete(document.getElementById('brewery-location'), options);
      google.maps.event.addListener(addPlaces, 'place_changed', function () {
        var place = addPlaces.getPlace();
        var address = addPlaces.formatted_address;
      });
      var editPlaces = new google.maps.places.Autocomplete(document.getElementById('brewery-location-edit'), options);
      google.maps.event.addListener(editPlaces, 'place_changed', function () {
        var place = editPlaces.getPlace();
        var address = editPlaces.formatted_address;
      });
    });
  }

  prepareHeaders();

  // Add realtime listener for user logged in.
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (!firebaseUser) {
      console.log("not logged in");
      location.href = "./login.html";
    }
    //if user is authenticated, dynamically load data
    else {
      var data = getSearch();
      if (data === null) viewAll();
      else {
        for(var category in data) break;
        if (category == "brewery") viewBrewery(data["brewery"]);
        else if (category == "fav") viewFavs(data["fav"]);
      }
      getProfilePic();
    }
  });

});
