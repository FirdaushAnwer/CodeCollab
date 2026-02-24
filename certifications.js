document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('certifications.json');
        const data = await response.json();

        const container = document.getElementById('certifications-container');
        if (container) {
            container.innerHTML = '';
            data.forEach(cert => {
                let iconsHtml = '';
                cert.icons.forEach(ic => {
                    iconsHtml += `<i class="${ic.class}" style="color: ${ic.color}; ${ic.style}"></i>`;
                });

                let bulletsHtml = '';
                cert.bulletPoints.forEach(bp => {
                    bulletsHtml += `<li>${bp}</li>`;
                });

                container.innerHTML += `
                    <div class="cert-card">
                        <div class="cert-card-icon-area" style="background-color: ${cert.iconBg};">
                            ${iconsHtml}
                        </div>
                        <div class="cert-card-content">
                            <h3>${cert.title}</h3>
                            <ul>
                                ${bulletsHtml}
                            </ul>
                            <a href="${cert.link}" target="_blank" class="btn-cert">${cert.buttonText}</a>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Failed to load certifications:", error);
    }
});
