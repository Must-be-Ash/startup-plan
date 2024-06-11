document.getElementById('ideaForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const idea = document.getElementById('ideaInput').value;
    const email = document.getElementById('emailInput').value;

    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = 'Generating and sending PDF...';

    try {
        const response = await fetch('/send-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idea, email })
        });

        if (response.ok) {
            responseContainer.innerHTML = 'PDF sent to your email successfully!';
        } else {
            responseContainer.innerHTML = 'An error occurred while sending the PDF.';
        }
    } catch (error) {
        responseContainer.innerHTML = 'An error occurred while sending the PDF.';
    }
});
