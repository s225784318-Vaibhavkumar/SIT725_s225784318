const cardList = [
  {
    title: "Boxwood Topiary (Buxus)",
    image: "Images/Image 2.jpg",
    link: "About Plant 2",
    description:
      'This appears to be a manicured Boxwood, likely a preserved or artificial topiary, styled into a classic "ball" or "lollipop" shape. These are commonly used to add structured, formal greenery to desks or entryways.',
  },
  {
    title: "Bird of Paradise (Strelitzia reginae)",
    image: "Images/Image 3.jpg",
    link: "About Plant 3",
    description:
      "These are the broad, paddle-shaped leaves of a Bird of Paradise, characterized by their elegant, upright stems and tropical appearance. In a home setting, they provide a clean, architectural look that mimics a Mediterranean or tropical vibe",
  },
];

const clickMe = () => {
  alert("Thanks for clicking me. Hope you have a nice day!");
};

const addCards = (items) => {
  items.forEach((item) => {
    const itemToAppend =
      '<div class="col s4 center-align">' +
      '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' +
      item.image +
      '">' +
      '</div><div class="card-content">' +
      '<span class="card-title activator grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">more_vert</i></span><p><a href="#">' +
      item.link +
      "</a></p></div>" +
      '<div class="card-reveal">' +
      '<span class="card-title grey-text text-darken-4">' +
      item.title +
      '<i class="material-icons right">close</i></span>' +
      '<p class="card-text">' +
      item.description +
      "</p>" +
      "</div></div></div>";

    $("#card-section").append(itemToAppend);
  });
};

$(document).ready(function () {
  $(".materialboxed").materialbox();
  $(".modal").modal();

  $("#clickMeButton").click(() => {
    clickMe();
  });

  addCards(cardList);

  $(document).on("click", ".card .activator", function (event) {
    event.preventDefault();
    $(this).closest(".card").find(".card-reveal").stop(true, true).slideDown(200);
  });

  $(document).on("click", ".card .card-reveal .card-title", function () {
    $(this).closest(".card-reveal").stop(true, true).slideUp(200);
  });
});
