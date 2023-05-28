function submitCreateBookForm(event) {
    event.preventDefault();
    createBook();
}

document.getElementById('create-book-form').addEventListener('submit', submitCreateBookForm);

function createBook() {
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;

    fetch('http://localhost:8080/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            author: author
        })
    }).then(response => response.json())
        .then(() => {
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
            loadBooks();
        });
}

function loadBooks() {
    fetch('http://localhost:8080/books')
        .then(response => response.json())
        .then(books => {
            let booksTableBody = document.getElementById('books-table').querySelector('tbody');
            booksTableBody.innerHTML = '';
            books.forEach(book => {
                let row = document.createElement('tr');
                let titleCell = document.createElement('td');
                let authorCell = document.createElement('td');
                let actionCell = document.createElement('td');

                // Create a link to the detail page for this book
                let detailLink = document.createElement('a');
                detailLink.textContent = book.title;
                detailLink.href = `detail.html?id=${book.id}`;
                titleCell.appendChild(detailLink);

                authorCell.textContent = book.author;

                let editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-button'
                editButton.onclick = function() { loadBookIntoForm(book.id); };
                actionCell.appendChild(editButton);

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'
                deleteButton.onclick = function() {
                    if(confirm("Are you sure to delete this book?")) {
                        deleteBook(book.id);
                    }

                };
                actionCell.appendChild(deleteButton);

                row.appendChild(titleCell);
                row.appendChild(authorCell);
                row.appendChild(actionCell);
                booksTableBody.appendChild(row);
            });
        });
}

function loadBookIntoForm(id) {
    fetch(`http://localhost:8080/books/${id}`)
        .then(response => response.json())
        .then(book => {
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;

            let form = document.getElementById('create-book-form');
            form.removeEventListener('submit', submitCreateBookForm);
            form.onsubmit = function(event) {
                event.preventDefault();
                updateBook(id);
            };
        });
}

function updateBook(id) {
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;

    fetch(`http://localhost:8080/books/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            author: author
        })
    }).then(response => response.json())
        .then(book => {
            document.getElementById('title').value = '';
            document.getElementById('author').value = '';
            let form = document.getElementById('create-book-form');
            form.onsubmit = null;
            form.addEventListener('submit', submitCreateBookForm);
            loadBooks();
        });
}

function deleteBook(id) {
    fetch(`http://localhost:8080/books/${id}`, {
        method: 'DELETE',
    }).then(response => {
        if (response.ok) {
            showToast();  // Show the toast
            loadBooks();
        } else {
            console.error(`Failed to delete book with ID ${id}`);
        }
    });
}

function showToast() {
    let toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function(){ toast.className = "toast"; }, 1000);
}

loadBooks();
