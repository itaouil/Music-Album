$(document).ready(function() {

  // Event Listener (genre deletion)
  $('.delete-genre').on('click', function() {

    // Get ID (from data-id attribute)
    var id = $(this).data('id');

    // URL for our route delete handling
    var url = '/genres/delete/' + id;

    // Confirm action
    if (confirm('Delete Genre ?')) {

      // AJAX call
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result) {
          console.log('Deleting genre ...');
          window.location.href = '/genres';
        },
        error: function(err) {
          console.log(err);
        }
      });

    }

  });

  // Event Listener (album deletion)
  $('.delete-album').on('click', function() {

    // Get ID (from data-id attribute)
    var id = $(this).data('id');

    // URL for our route delete handling
    var url = '/albums/delete/' + id;

    // Confirm action
    if (confirm('Delete Album ?')) {

      // AJAX call
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result) {
          console.log('Deleting albums ...');
          window.location.href = '/albums';
        },
        error: function(err) {
          console.log(err);
        }
      });

    }

  });

});
