
function updateList(items) {
    const list = document.getElementById('myList');
    list.innerHTML = ''; // Clear the list

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
}

// Example call
updateList(['Apple', 'Banana', 'Orange', 'Grape']);
