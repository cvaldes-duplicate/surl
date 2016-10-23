
// Userlist data array for filling in info box
var urlListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $('#urlList table tbody').on('click', 'td a.linkshowuser', showurlInfo);
    // Delete User link click
    $('#urlList table tbody').on('click', 'td a.linkdeleteuser', deleteurl);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/lists/urllist', function( data ) {
      urlListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.url + '">' + this.token + '</a></td>';
            tableContent += '<td>' + this.url + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#urlList table tbody').html(tableContent);
    });
};

// Show User Info
function showurlInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisurl = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = urlListData.map(function(arrayItem) { return arrayItem.url; }).indexOf(thisurl);
    // Get our User Object
    var thisObject = urlListData[arrayPosition];

    //Populate Info Box
    $('#date').text(thisObject.date);
    $('#token').text(thisObject.token);
    $('#url').text(thisObject.url);
    $('#ip').text(thisObject.ip);

};


// Delete User
function deleteurl(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this url?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/lists/deleteurl/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            console.log("refresh table");
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
