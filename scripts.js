document.getElementById('ideaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const idea = document.getElementById('ideaInput').value;

    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = 'Generating response...';

    try {
        const response = await fetch('/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idea })
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MomTestResponse.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        responseContainer.innerHTML = 'PDF generated successfully!';
    } catch (error) {
        responseContainer.innerHTML = 'An error occurred while generating the PDF.';
    }
});
