




function searchBooks() {
    var searchTerm = document.getElementById('searchInput').value;
    var apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(searchTerm);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayBooks(data.items);
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

function displayBooks(books) {
    var bookResults = document.getElementById('bookResults');
    bookResults.innerHTML = ''; // Очищаем предыдущие результаты поиска

    books.forEach(book => {
        var title = book.volumeInfo.title;
        var authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Неизвестный автор';
        var buyLink = book.saleInfo.buyLink ? `<button onclick="showForm('${title}', '${authors}', this)">Купить</button>` : '';
        var coverImage = book.volumeInfo.imageLinks ? `<img src="${book.volumeInfo.imageLinks.thumbnail}" alt="Обложка книги">` : '';

        var bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            ${coverImage}
            <h3>${title}</h3>
            <p>Автор(ы): ${authors}</p>
            ${buyLink}
            <div class="formContainer" style="display:none;">
                <h3>Введите ваши данные</h3>
                <form class="purchaseForm">
                    <input type="hidden" class="bookTitleInput" value="${title}">
                    <input type="hidden" class="bookAuthorsInput" value="${authors}">
                    <input type="text" class="nameInput" placeholder="Имя" required><br>
                    <input type="email" class="emailInput" placeholder="Email" required><br>
                    <input type="tel" class="phoneInput" placeholder="Телефон" required><br>
                    <input type="text" class="addressInput" placeholder="Адрес" required><br>
                    <button type="submit">Отправить</button>
                </form>
            </div>
        `;
        bookResults.appendChild(bookElement);
    });
}

function showForm(bookTitle, bookAuthors, button) {
    var formContainer = button.parentElement.querySelector('.formContainer');
    formContainer.style.display = 'block';

    // Заполняем скрытые поля в форме с информацией о книге
    formContainer.querySelector('.bookTitleInput').value = bookTitle;
    formContainer.querySelector('.bookAuthorsInput').value = bookAuthors;
}

// Добавляем обработчик события для отправки формы
document.querySelectorAll('.purchaseForm').forEach(form => {
    form.addEventListener('submit', submitForm);
});

function submitForm(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    // Получаем значения из формы
    var name = this.querySelector('.nameInput').value;
    var email = this.querySelector('.emailInput').value;
    var phone = this.querySelector('.phoneInput').value;
    var address = this.querySelector('.addressInput').value;
    var bookTitle = this.querySelector('.bookTitleInput').value;
    var bookAuthors = this.querySelector('.bookAuthorsInput').value;

    // Создаем объект с данными для отправки на Google Sheets API
    var formData = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        bookTitle: bookTitle,
        bookAuthors: bookAuthors
    };

    // Отправляем данные на Google Sheets API
    sendFormData(formData);
}

function sendFormData(formData) {
    const url = 'AIzaSyB-spGIKPXCAsODuvi6qkdVyrr65cO1C8Y'; // Замените на свой URL

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при отправке данных на сервер');
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные успешно отправлены:', data);
        // Дополнительные действия после успешной отправки данных, если необходимо
    })
    .catch(error => {
        console.error('Ошибка при отправке данных:', error);
    });
}
