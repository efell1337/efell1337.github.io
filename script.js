function redirectToLoveLetter() {
  console.log('Redirecting to love letter...');
  // Replace 'loveletter.html' with the actual filename you want to redirect to
  window.location.href = 'loveletter.html';
}
function redirectToGoogoo() {
  window.location.href = 'googoogaga.html';
}

const gifConfig = {
  'file1.txt': {
    gifUrl: 'https://media.tenor.com/RRRUc037Ih8AAAAi/mocha-and.gif',
    position: { top: 50, left: 100 }
  },
  'file2.txt': {
    gifUrl: 'https://media.tenor.com/JuUdfHjkUWgAAAAi/zzang-su.gif',
    position: { top: 200, left: 300 }
  },
  // Add more files and GIFs here
};

// Function to add a GIF to the file content
function addGif(file) {
  const gifConfigForFile = gifConfig[file];
  if (gifConfigForFile) {
    const contentText = document.getElementById('contentText');
    const gifElement = document.createElement('img');
    gifElement.src = gifConfigForFile.gifUrl;
    gifElement.alt = 'GIF Animation';
    gifElement.className = 'file-gif';
    gifElement.style.position = 'absolute';
    gifElement.style.top = gifConfigForFile.position.top + 'px';
    gifElement.style.left = gifConfigForFile.position.left + 'px';
    contentText.appendChild(gifElement);
  }
}

// Example usage:
addGif('file1.txt');
addGif('file2.txt');