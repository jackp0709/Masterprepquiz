// Function to delete a bookmark
    async function deleteBookmark(questionId) {
            try {
                const response = await fetch('http://localhost:3000/api/delete_bookmark', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ questionId })
                });
                const result = await response.json();

                if (result.success) {
                    alert('Bookmark deleted successfully!');
                    viewBookmarks(); // Refresh the bookmark list after deletion
                } else {
                    alert('Failed to delete bookmark');
                }
            } catch (error) {
                console.error('Error deleting bookmark:', error);
                alert('Error deleting bookmark');
            }
        }

        // Function to view bookmarks
        async function viewBookmarks() {
            try {
                const response = await fetch('http://localhost:3000/api/bookmarks');
                const bookmarks = await response.json();
                console.log('Bookmarks:', bookmarks);

                const bookmarkedQuestions = document.getElementById('bookmarked-questions');
                bookmarkedQuestions.innerHTML = ''; // Clear previous bookmarks

                if (bookmarks.length === 0) {
                    bookmarkedQuestions.innerHTML = '<p>No bookmarks found.</p>';
                    return;
                }

                bookmarks.forEach((bookmark, index) => {
                    
                    const questionItem = document.createElement('div');
                    questionItem.className = 'question-item';

                    // Display question number
                    const questionNumber = document.createElement('h3');
                    questionNumber.textContent = `Question ${index + 1}:`;
                    questionItem.appendChild(questionNumber);

                    // Display collection name
                    if (bookmark.collectionName) {
                        const collectionNameElement = document.createElement('h4');
                        collectionNameElement.textContent = `Topic Name: ${bookmark.collectionName}`;
                        questionItem.appendChild(collectionNameElement);
                        collectionNameElement.style.paddingTop = '3px';    

                    }


                    if (bookmark.passage) {
                const passageElement = document.createElement('div');
                passageElement.className = 'bookmark-passage'; // Class for styling
                passageElement.textContent = bookmark.passage; // Assuming passage is a string
                passageElement.style.marginLeft = '20px';
                passageElement.style.paddingTop = '15px';    
                questionItem.appendChild(passageElement);
            }
                    
                    // Display question text
                    if (bookmark.question) {
                        const questionText = document.createElement('p');
                        questionText.textContent = bookmark.question;
                        questionItem.appendChild(questionText);
                        questionText.style.marginLeft = '20px';

                    }
                    
                    // Display options
                    if (bookmark.options) {
                        const optionsList = document.createElement('ul');
                        for (let key in bookmark.options) {
                            const optionItem = document.createElement('li');
                            optionItem.textContent = `${key}: ${bookmark.options[key]}`;
                            optionsList.appendChild(optionItem);
                        }

                        questionItem.appendChild(optionsList);
                        optionsList.style.marginLeft = '20px';
                    }

                    // Delete bookmark button
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete Bookmark';
                    deleteButton.className = 'delete-bookmark-btn';
                    deleteButton.onclick = () => deleteBookmark(bookmark.questionId);
                    questionItem.appendChild(deleteButton);
                    deleteButton.style.marginLeft = '20px';


                    // Append to the bookmarks container
                    bookmarkedQuestions.appendChild(questionItem);
                });
            } catch (error) {
                console.error('Error viewing bookmarks:', error);
                alert('Failed to load bookmarks. Please try again.');
            }
        }

        // Load bookmarks when the page is loaded
        document.addEventListener('DOMContentLoaded', () => {
            viewBookmarks();
        });