
fetch('page.json')
.then(response => response.json())
.then(data => {
    const pages = data['page-list'];
    pages.forEach(page => {
        const pageLink = page['Link'];
        fetch(`https://server-response-50018810936.catalystappsail.in/server-response?page-link=${pageLink}`)
        .then(response => response.json())
        .then(responseData => {
            const pageTitle = page['Title'];
            const pageStatus = responseData['status'];
            const pageContentType = responseData['content-type'];
            const pageRedirectedUrl = responseData['redirected-url'];

            const pageWrapper = document.createElement('div');
            pageWrapper.classList.add('page-wrapper');

            const pageHeading = document.createElement('h5');
            pageHeading.classList.add('page-heading');
            pageHeading.innerHTML = `<span class="page-title">${pageTitle}</span><a class="page-link" target="_blank" href="${pageLink}">${pageLink}</a><span id="page-status">${pageStatus}</span>`;
            pageWrapper.appendChild(pageHeading);

            const pageAnchors = document.createElement('div');
            pageAnchors.classList.add('page-anchors');
            pageWrapper.appendChild(pageAnchors);

            document.getElementById('content').appendChild(pageWrapper);

            fetch(`https://server-response-50018810936.catalystappsail.in/fetch-anchor?pageLink=${pageLink}`)
            .then(anchorResponse => anchorResponse.json())
            .then(anchorData => {
                const anchors = anchorData;
                const anchorTable = document.createElement('table');
                let anchorNumber = 1;
                anchorTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Anchor Title</th>
                            <th>Anchor Link</th>
                            <th>Status Code</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
                anchors.forEach(anchor => {
                    const anchorTitle = anchor['text'];
                    const anchorLink = anchor['link'];
                    fetch(`https://server-response-50018810936.catalystappsail.in/server-response?page-link=${anchorLink}`)
                    .then(response => response.json())
                    .then(anchorResponseData => {
                        const anchorStatus = anchorResponseData['status'];
                        anchorTable.innerHTML += `
                            <tr>
                                <td>${anchorNumber++}</td>
                                <td class="anchor-title">${anchorTitle}</td>
                                <td class="anchor-link"><a target="_blank" href="${anchorLink}">${anchorLink}</a></td>
                                <td class="anchor-link-status">${anchorStatus}</td>
                            </tr>
                        `;
                    });
                });
                anchorTable.innerHTML += `
                    </tbody>
                `;
                pageAnchors.appendChild(anchorTable);
            });
        });
    });
});